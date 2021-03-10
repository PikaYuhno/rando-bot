import { Message, Client } from 'discord.js';
import cronJobs from '../utils/cronJobs';
import * as simple_node_logger from 'simple-node-logger';
const logger = simple_node_logger.createSimpleLogger({ logFilePath: 'project.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' });

export default class Cancel {
  private _cmd: string;
  private _message: Message;
  private _args: string[];
  private _client: Client;

  public _admin = true;


  constructor(client: Client, cmd: string, args: string[], message: Message) {
    this._client = client;
    this._cmd = cmd;
    this._args = args;
    this._message = message;
  }

  public async run() {
    logger.info(`Running Command: ${this._cmd} with Arguments: ${this._args.join(" ")}`);

    if (this._args.length <= 0) {
      return this._message.reply('Please provide an Survey-ID!');
    }
    if (!cronJobs.get(this._args[0])) {
      return this._message.reply('The Survey-ID is not valid!');
    }

    let obj = cronJobs.get(this._args[0]);
    obj['cronJob'].destroy();
    obj['func'](obj['msgId']);
    cronJobs.delete(this._args[0]);

  }
}
