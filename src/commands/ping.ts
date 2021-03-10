import { Message, Client } from 'discord.js';
import * as simple_node_logger from 'simple-node-logger';
const logger = simple_node_logger.createSimpleLogger({ logFilePath: 'project.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' });

export default class Ping {
  private _cmd: string;
  private _args: string[];
  private _message: Message;
  private _client: Client;

  public _admin = false;

  constructor(client: Client, cmd: string, args: string[], message: Message) {
    this._client = client;
    this._cmd = cmd;
    this._args = args;
    this._message = message;
  }

  public async run() {
    logger.info(`Running Command: ${this._cmd} with Arguments: ${this._args.join(" ")}`);
    const msg = await this._message.channel.send("Ping?");
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - this._message.createdTimestamp}ms.`);
  }
}
