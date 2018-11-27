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
};

module.exports = Query;
