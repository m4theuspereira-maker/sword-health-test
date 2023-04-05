import express from "express";
import cors from "cors";
import { PORT } from "./config/environment-consts";
import { RabbitmqServer } from "./infra/message-broker/rabbitmq-server";
import { routes } from "./routes";

const app = express();
app.use(cors());
app.use(routes);

const consumer = async () => {
  const server = new RabbitmqServer("amqp://admin:admin@localhost:5672");
  await server.start();
  console.log("disgraça");

  await server.consume("notifications", (message, context) => {
    console.log(message);
    context.success();
  });
};

consumer();

const server = app.listen(PORT, () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log(`listening on port ${PORT} 🚀`);
});

export { server };
