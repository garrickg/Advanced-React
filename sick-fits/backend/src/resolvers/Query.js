const { forwardTo } = require('prisma-binding');

const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, context, info) {
    // check if there is a current userId
    if (!context.request.userId) return null;
    return context.db.query.user(
      {
        where: { id: context.request.userId },
      },
      info,
    );
  },
  async users(parent, args, context, info) {
    const { user, userId } = context.request;
    // check if they are logged in
    if (!userId) {
      throw new Error('Please login!');
    }
    // check if user has permission to query users
    hasPermission(user, ['ADMIN', 'PERMISSIONUPDATE']);
    // query all users
    return context.db.query.users({}, info);
  },
  async order(parent, { id }, context, info) {
    const { userId, user: { permissions } } = context.request;
    // check if they are logged in
    if (!userId) {
      throw new Error('Please login!');
    }
    // query order
    const order = await context.db.query.order({
      where: { id },
    }, info);
    // check if they have permissions to view order
    const ownsOrder = order.user.id === userId;
    const hasPermissionToViewOrder = permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermissionToViewOrder) {
      throw new Error('Access Denied!');
    }
    // return the order
    return order;
  },
  async orders(parent, args, context, info) {
    const { userId } = context.request;
    if (!userId) {
      throw new Error('Please log in!');
    }
    return context.db.query.orders({
      where: {
        user: { id: userId },
      },
    }, info);
  },
};

module.exports = Query;
