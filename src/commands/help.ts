import { Message, Client, MessageEmbed } from "discord.js";
import * as simple_node_logger from "simple-node-logger";
const logger = simple_node_logger.createSimpleLogger({
    logFilePath: "project.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});

export default class Help {
    private _cmd: string;
    private _message: Message;
    private _client: Client;
    private _args: string[];

    public _admin = false;

    constructor(client: Client, cmd: string, args: string[], message: Message) {
        this._client = client;
        this._cmd = cmd;
        this._args = args;
        this._message = message;
    }

    public async run() {
        logger.info(
            `Running Command: ${this._cmd} with Arguments: ${this._args.join(
                " "
            )}`
        );
        let embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("All Commands:")
            .addFields(
                { name: "Wikipedia Search", value: ">>wiki <query>" },
                { name: "Translate Word", value: ">>translate <wort/wörter>" },
                { name: "Latency check", value: ">>ping" },
                {
                    name: "Start Survey",
                    value: ">>poll [<title>] --duration=<hours>:<minutes>",
                },
                { name: "Cancel Survey", value: ">>cancel <survey-id>" }
            );
        //{name: "Standort", value: ">>standort"}
        this._message.channel.send(embed);
    }
}
