import express from "express";
import cors from "cors";
import { PORT, SWAGGER_DOCS } from "./config/environment-consts";
import { routes } from "./routes";
import swaggerUi from "swagger-ui-express";
import { messageBrokerConsumer } from "./factories/infra-factories";

const app = express();
app.use(cors());
app.use(routes);

const server = app.listen(PORT, async () => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(SWAGGER_DOCS));
  await messageBrokerConsumer();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log(`listening on port ${PORT} 🚀`);
});

export { server };
