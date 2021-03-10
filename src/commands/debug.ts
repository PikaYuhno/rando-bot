import { Client, Message } from 'discord.js';
import cronJobs from '../utils/cronJobs';
import fetch from 'node-fetch';
import { inspect } from 'util' // or directly

export default class Debug {

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
        let body: string = "";
        for (var [key, value] of cronJobs) {
            console.log(key + " = " + inspect(value));
            body += key + " = " + inspect(value);
        }
        const promise = await fetch('https://hasteb.in/documents', {
            method: 'POST',
            body: body,
            headers: {
                "Content-Type": "text/plain"
            }
        });
        const json = await promise.json();
        this._message.reply(`https://hasteb.in/${json.key}`);
    }

}