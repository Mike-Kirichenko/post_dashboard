require("dotenv").config();
const fs = require("fs");
const express = require("express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");
const { conn } = require("./db/config");
const verifyToken = require("./verifyToken");
const { login } = require("./auth");
const resolvers = require("./graphQL/resolvers");
const app = express();

const start = async () => {
  try {
    await conn.authenticate();
    app.listen(process.env.PORT);
    console.log(`Server started on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
};

start();

const startApollo = async () => {
  const typeDefs = gql(
    fs.readFileSync("./graphQL/schema.graphql", { encoding: "utf-8" })
  );
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => verifyToken(req),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/api/graphql" });
};

startApollo();

app.use(cors());
app.use(express.json());
app.post("/api/login", login);
