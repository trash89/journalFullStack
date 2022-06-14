const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const morgan = require("morgan");
const helmet = require("helmet");
const xss = require("xss-clean");

const { createServer } = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");

const { makeExecutableSchema } = require("@graphql-tools/schema");
const { getIdProfile } = require("./utils");

const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");

//const prisma = new PrismaClient({ log: ["query", "info"] });
const prisma = new PrismaClient();

const PORT = 4000;
const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);
const resolvers = {
  Query,
  Mutation,
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

async function startApolloServer() {
  const app = express();
  app.use(cors());
  if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
  }
  app.use(express.json());

  //app.use(express.static(path.resolve(__dirname, "./client/build")));
  //app.use(helmet());
  app.use(xss());
  //app.use(mongoSanitize());
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
  // });

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema: schema,
    csrfPrevention: true,
    introspection: true,
    context: ({ req }) => {
      return {
        ...req,
        prisma,
        idProfile: req && req.headers.authorization ? getIdProfile(req) : null,
      };
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer();
