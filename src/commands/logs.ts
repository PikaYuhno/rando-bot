import { Client, Message } from 'discord.js';
import fs from 'fs';
import * as simple_node_logger from 'simple-node-logger';
const logger = simple_node_logger.createSimpleLogger({ logFilePath: 'project.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' });
import fetch from 'node-fetch';
export default class Logs {
    private _message: Message;
    private _cmd: string;
    private _args: string[];
    private _client: Client;

    public _admin: boolean = true;

    constructor(client: Client, cmd: string, args: string[], message: Message) {
        this._client = client;
        this._cmd = cmd;
        this._args = args;
        this._message = message;
    }

    public async run() {
        logger.info(`Running Command: ${this._cmd} with Arguments: ${this._args.join(" ")}`);
        fs.readFile('../project.log', async (err, data) => {
            if (err) {
                return this._message.reply(`There was an error: ${err}`);
            };
            const promise = await fetch('https://hasteb.in/documents', {
                method: 'POST',
                body: data,
                headers: {
                    "Content-Type": "text/plain"
                }
            });
            const json = await promise.json();
            this._message.reply(`https://hasteb.in/${json.key}`);
        })
    }
}