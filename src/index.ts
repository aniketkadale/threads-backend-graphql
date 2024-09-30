import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  // Create graphql server
  const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
    `
    ,
    resolvers: {
        Query: {
            hello: () => "Hey there! I am a graphql server!",
            say: (_, {name}: {name: String}) => `Hey ${name}, How are you doing?`
        }   
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Hello there!" });
  });

  app.use('/graphql', expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

init();
