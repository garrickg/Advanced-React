const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/mutation.js');
const Query = require('./resolvers/query.js');
const db = require('./db.js');

// Create the GraphQL Yoga Server

function createServer() {
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: req => ({ ...req, db }),
  });
}

module.exports = createServer;
