import express from "express";
import cors from "cors";
import { PORT } from "./config/environment-consts";
import { routes } from "./routes";
import { messageBrokerConsumer } from "./factories/infra-factories";

const app = express();
app.use(cors());
app.use(routes);

const server = app.listen(PORT, async () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await messageBrokerConsumer();
  console.log(`listening on port ${PORT} 🚀`);
});

export { server };
