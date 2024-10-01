import express from "express";
import createApolloGraphqlServer from "./graphql";
import { expressMiddleware } from "@apollo/server/express4";
import UserService from "./services/user";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: `Server up and running on port: ${PORT}` });
  });
  // Create graphql server
  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        // ts-ignore
        const token = req.headers["token"];
        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (err) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

init();
