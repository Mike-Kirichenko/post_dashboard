const fs = require('fs');
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require('apollo-server-core');
const { ApolloServer, gql } = require('apollo-server-express');
const resolvers = require('./resolvers');
const verifyToken = require('./verifyToken');

exports.startApollo = async (app) => {
  const typeDefs = gql(
    fs.readFileSync('./graphQL/schema.graphql', { encoding: 'utf-8' })
  );
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => verifyToken(req),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/api/graphql' });
};
