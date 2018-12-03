const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils');

const { transport, makeANiceEmail } = require('../mail');
const stripe = require('../stripe');

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const createToken = user => jwt.sign({ userId: user.id }, process.env.APP_SECRET);
const hashPassword = async password => bcrypt.hash(password, 10);

const Mutations = {
  async createItem(_parent, args, context, info) {
    const { userId } = context.request;
    // TODO: Check if user is authed
    if (!userId) {
      throw new Error('You must be logged in to add items!');
    }
    const item = await context.db.mutation.createItem(
      {
        data: {
          ...args,
          // this is how we create realtionships between the item and the user
          user: {
            connect: {
              id: userId,
            },
          },
        },
      },
      info,
    );
    return item;
  },
  updateItem(_parent, args, context, info) {
    // first take a copy of the udpates
    const updates = { ...args };
    // remove the ID from the udpates
    delete updates.id;
    // run the update method
    return context.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
  },
  async deleteItem(_parent, { id }, context, info) {
    const { user } = context.request;
    // find the item
    const item = await context.db.query.item({ where: { id } }, '{ id, title, user { id } }');
    // TODO: check if they are the owner or admin
    const ownsItem = item.user.id === context.request.userId;
    const hasPermissions = hasPermission(user, ['ADMIN', 'ITEMDELETE']);
    if (!ownsItem && !hasPermissions) {
      throw new Error('Insufficient permissions!');
    }
    // delete it
    return context.db.mutation.deleteItem({ where: { id } }, info);
  },
  async signup(_parent, args, context, info) {
    // lowercase the email
    const email = args.email.toLowerCase();
    // hash the password
    const password = await hashPassword(args.password);
    // create the user in the database
    const user = await context.db.mutation.createUser(
      {
        data: {
          ...args,
          email,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info,
    );
    // create the JWT
    const token = createToken(user);
    // set JWT as cookie on the response
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: ONE_YEAR, // 1 year cookie
    });
    return user;
  },
  async signin(_parent, { email, password }, context, _info) {
    const user = await context.db.query.user({ where: { email } });
    if (!user) {
      throw new Error('Incorrect email or password');
    }
    // check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Incorrect email or password');
    }
    // generate jwt token
    const token = createToken(user);
    // set cookie with token
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: ONE_YEAR,
    });
    return user;
    // return the user
  },
  signout(_parent, _args, context, _info) {
    context.response.clearCookie('token');
    return {
      message: 'Signed Out!',
    };
  },
  async requestReset(_parent, { email }, context, _info) {
    // check if user exists
    const user = await context.db.query.user({ where: { email } });
    // set a reset token and expiry for user
    if (!user) {
      throw new Error('Incorrect email');
    }
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await context.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    // email reset token
    const { FRONTEND_URL } = process.env;
    await transport.sendMail({
      from: 'garrickgunn@gmail.com',
      to: user.email,
      subject: 'Password Reset Link',
      html: makeANiceEmail(`Your Password Reset Token is here: \n\n <a href="${FRONTEND_URL}/reset?resetToken=${resetToken}">Click Here to Reset!</a>`),
    });
    // return the message
    return { message: 'reset requested' };
  },
  async resetPassword(_parent, { resetToken, password, confirmPassword }, context, _info) {
    // check if the passwords match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    // check if resetToken OK
    // check if token expired
    const [user] = await context.db.query.users({
      where: {
        AND: [
          { resetToken },
          { resetTokenExpiry_gte: Date.now() },
        ],
      },
    });
    if (!user) {
      throw new Error('Invalid token');
    }
    // hash new password
    const hashedPassword = await hashPassword(password);
    // save new password and remove token and expiry
    const updatedUser = await context.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // generate JWT
    const token = createToken(updatedUser);
    // set the JWT cookie
    context.response.cookie('token', token, {
      httpOnly: true,
      maxAge: ONE_YEAR,
    });
    // return the user
    return updatedUser;
  },
  async updatePermissions(_parent, { permissions, userId: id }, context, info) {
    const { userId } = context.request;
    // check if logged in
    if (!userId) {
      throw new Error('Please login first!');
    }
    // query current user
    const currentUser = await context.db.query.user({
      where: {
        id: userId,
      },
    }, info);
    // check their permissions
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // update the permissions
    return context.db.mutation.updateUser({
      data: {
        permissions: {
          set: permissions,
        },
      },
      where: { id },
    }, info);
  },
  async addToCart(_parent, { id }, context, info) {
    // check user is signed in
    const { userId } = context.request;
    if (!userId) {
      throw new Error('Please login first!');
    }
    // query the user's current cart
    const [existingCartItem] = await context.db.query.cartItems({
      where: {
        AND: [
          { user: { id: userId } },
          { item: { id } },
        ],
      },
    });
    // check if item is in cart, and increment if it is
    if (existingCartItem) {
      return context.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info);
    }
    // else create new cartItem for user
    return context.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id },
        },
      },
    }, info);
  },
  async removeFromCart(_parent, { id }, context, info) {
    const { userId } = context.request;
    // find the cart item
    const cartItem = await context.db.query.cartItem({
      where: { id },
    }, '{ id, user { id } }');
    if (!cartItem) {
      throw new Error('Item not found');
    }
    // make sure it's their cart
    if (cartItem.user.id !== userId) {
      throw new Error('You do not have permission');
    }
    // delete the cart item
    return context.db.mutation.deleteCartItem({ where: { id } }, info);
  },
  async createOrder(_parent, { token }, context, _info) {
    // query current user and make sure they're signed in
    const { userId } = context.request;
    if (!userId) throw new Error('Please sign in to checkout');
    const user = await context.db.query.user({
      where: { id: userId },
    }, '{ id name email cart { id quantity item { title price id description image largeImage } } }');
    // recalculate the total for the price
    const amount = user.cart.reduce(
      (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity, 0,
    );
    // create the stripe charge from token
    const charge = await stripe.charges.create({
      amount,
      currency: 'CAD',
      source: token,
    });
    // convert the cartItems to orderItems
    const orderItems = user.cart.map((cartItem) => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      };
      delete orderItem.id;
      return orderItem;
    });
    // create the order
    const order = await context.db.mutation.createOrder({
      data: {
        items: { create: orderItems },
        total: charge.amount,
        user: { connect: { id: userId } },
        charge: charge.id,
      },
    });
    // clear the user's cart, delete cartItems
    const cartItemIds = user.cart.map(({ id }) => id);
    await context.db.mutation.deleteManyCartItems({
      where: {
        id_in: cartItemIds,
      },
    });
    // return the order to the client
    return order;
  },
};


module.exports = Mutations;
