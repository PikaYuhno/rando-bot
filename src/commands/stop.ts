import { Message, Client } from 'discord.js';
import * as fs from 'fs';
export default class Stop {
  private _cmd: string;
  private _args: string[];
  private _message: Message;
  private _client: Client;

  public _admin = true;

  constructor(client: Client, cmd: string, args: string[], message: Message) {
    this._cmd = cmd;
    this._args = args;
    this._message = message;
    this._client = client;
  }

  public async run() {
    const data = fs.readFileSync('rsc/stop.txt');
    const user = this._args[0];

    this._message.channel.send(`<@${user}> ${data}`);
  }
}
