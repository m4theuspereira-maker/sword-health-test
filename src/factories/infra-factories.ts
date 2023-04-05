import { MESSAGE_BROKER_ADDRESS } from "../config/environment-consts";
import {
  MESSAGE_BROKER_QUEUES,
  MessageBrokerServer
} from "../infra/message-broker/message-broker-server";

export const messageBrokerConsumer = async () => {
  const server = new MessageBrokerServer(String(MESSAGE_BROKER_ADDRESS));
  await server.start();
  console.log("message broker connected 🔗");

  await server.consume(
    MESSAGE_BROKER_QUEUES.NOTIFICATIONS,
    (message, context) => {
      console.log(message);
      context.success();
    }
  );
};
