import express from "express";
import cors from "cors";
import { PORT } from "./config/environment-consts";
import { RabbitmqServer } from "./infra/message-broker/rabbitmq-server";

const app = express();
app.use(cors());

const consumer = async () => {
  const server = new RabbitmqServer("amqp://admin:admin@localhost:15672/");
  await server.start();
  console.log("disgraça");

  await server.consume("notifications", (message) =>
    console.log(message.content.toString())
  );
};


const server = app.listen(PORT, () => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  console.log(`listening on port ${PORT} 🚀`);
});

export { server };
