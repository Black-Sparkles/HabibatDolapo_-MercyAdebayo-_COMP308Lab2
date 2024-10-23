const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const typeDefs = require("./app/graphql/schemas/index.schema"); 
const resolvers = require("./app/graphql/resolvers/index.server.resolver");
const auth = require("./app/graphql/middleware/auth"); 

// Load environment variables
dotenv.config();

// MongoDB connection configuration
const mongoDB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/student-db";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

// Set Content Security Policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        "https://apollo-server-landing-page.cdn.apollographql.com",
      ],
      scriptSrc: [
        "'self'",
        "https://apollo-server-landing-page.cdn.apollographql.com",
      ],
      // Add other directives as needed
    },
  })
);

// Connect to MongoDB
mongoose
  .connect(mongoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
    // You can add additional context if needed
  }),
});

// Start Apollo Server
server.start().then(() => {
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(
      `Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});
