import express from "express";
import createApolloGraphqlServer from "./graphql";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: `Server up and running on port: ${PORT}` });
  });
  // Create graphql server
  app.use("/graphql", expressMiddleware(await createApolloGraphqlServer()));

  app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
}

init();
