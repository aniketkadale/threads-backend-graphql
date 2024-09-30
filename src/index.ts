import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

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

        type Mutation {
          createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
        }
            
    `,
    resolvers: {
      Query: {
        hello: () => "Hey there! I am a graphql server!",
        say: (_, { name }: { name: String }) =>
          `Hey ${name}, How are you doing?`,
      },

      Mutation: {
        createUser: async (
          _: any,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          try {
            await prismaClient.user.create({
              data: {
                firstName,
                lastName,
                email,
                password,
                salt: "random_salt", // Consider generating a real salt in production
              },
            });
            return true; // Return true upon successful creation
          } catch (error) {
            console.error("Error creating user:", error);
            return false; // Return false if there's an error
          }
        },
      },
    },
  });

  await gqlServer.start();

  app.get("/", (req, res) => {
    res.json({ message: "Hello there!" });
  });

  app.use("/graphql", expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

init();
