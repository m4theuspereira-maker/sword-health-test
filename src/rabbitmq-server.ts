import { Connection, Channel, connect, Message } from "amqplib";

export class RabbitmqServer {
  private conn!: Connection;
  private channel!: Channel;

  constructor(private uri: string) {}

  async start(): Promise<void> {
    
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
    await this.channel.assertQueue("notification");
  }

  async publishInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message: any) => {
      callback(message);
      this.channel.ack(message);
    });
  }
}
