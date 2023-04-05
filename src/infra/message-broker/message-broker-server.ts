import { Channel, Connection, ConsumeMessage, Message, connect } from "amqplib";

export const MESSAGE_BROKER_QUEUES = {
  NOTIFICATIONS: "notifications"
};

class Context {
  constructor(
    private readonly channel: Channel,
    private readonly message: Message | null
  ) {}
  public success(): void {
    this.channel.ack(this.message!, false);
  }

  public fail(): void {
    this.channel.nack(this.message!, false, true);
  }

  public reject(): void {
    this.channel.reject(this.message!, false);
  }
}

export class MessageBrokerServer {
  private conn!: Connection;
  private channel!: Channel;

  constructor(private uri: string) {}

  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }

  async publish(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: string,
    routingKey: string,
    message: string
  ): Promise<boolean> {
    return this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(
    queue: string,
    callback: (message: string, context: Context) => void
  ) {
    await this.channel.assertQueue(queue);

    return this.channel.consume(queue, (message: ConsumeMessage | null) => {
      const context = new Context(this.channel, message);

      callback(message!.content.toString(), context);
    });
  }
}
