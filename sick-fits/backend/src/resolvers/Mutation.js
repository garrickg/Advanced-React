const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { hasPermission } = require('../utils');

const { transport, makeANiceEmail } = require('../mail');

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
    const where = { id };
    // find the item
    const item = await context.db.query.item({ where }, '{ id, title, user { id } }');
    // TODO: check if they are the owner or admin
    const ownsItem = item.user.id === context.request.userId;
    const hasPermissions = context.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));
    if (!ownsItem && !hasPermissions) {
      throw new Error('Insufficient permissions!');
    }
    // delete it
    return context.db.mutation.deleteItem({ where }, info);
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
    const res = await context.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    // email reset token
    const { FRONTEND_URL } = process.env;
    const mailRes = await transport.sendMail({
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
        resetToken,
        resetTokenExpiry_gte: Date.now(),
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
  async updatePermissions(parent, { permissions, userId: id }, context, info) {
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
};


module.exports = Mutations;
