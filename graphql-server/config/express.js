const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../app/graphql/schemas/index.schema");
const resolvers = require("../app/graphql/resolvers");

module.exports = async function () {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(helmet());
  app.use(morgan("dev"));

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      req,
      // Add more context if needed
    }),
  });

 

  await server.start();
server.applyMiddleware({ app, path: "/graphql" });

  return app;
};
