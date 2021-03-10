import { Message, Client, MessageEmbed, TextChannel } from "discord.js";
const client = new Client();

import dotenv from "dotenv";
dotenv.config();

import * as simple_node_logger from "simple-node-logger";
const logger = simple_node_logger.createSimpleLogger({
    logFilePath: "project.log",
    timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
});
import config from '../config.json';

let botCommands: string[] = [
    "random",
    "ping",
    "stop",
    "help",
    "poll",
    "cancel",
    "debug",
    "logs",
    "sub",
];

const adminUsers: string[] = config.adminUsers;
const prefix: string = ">>";
const messageLog = config.messageLogsChannelName;

client.on("ready", () => {
    logger.info(`Logged in as ${client.user.tag}`);
});

client.on("messageDelete", (message) => {
    if (message.author.bot) return;
    let channel = <TextChannel>client.channels.cache.find((chn) => {
        if (chn.type === "text") {
            let textChannel = <TextChannel>chn;
            if (textChannel.name === messageLog) return true;
        }
    });
    let user = message.author.tag;
    let userId = message.author.id;
    let dateObj = new Date(Date.now());
    let date = `\`[${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}]\``;
    let messageChannelId = message.channel.id;
    let msg = `${date} **${user}** (ID: ${userId}) deleted a message in <#${messageChannelId}>:`;
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setDescription(message);
    channel.send(msg, embed);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    let channel = <TextChannel>client.channels.cache.find((chn) => {
        if (chn.type === "text") {
            let textChannel = <TextChannel>chn;
            if (textChannel.name === messageLog) return true;
        }
    });
    let user = oldMessage.author.tag;
    let userId = oldMessage.author.id;
    let dateObj = new Date(Date.now());
    let date = `\`[${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}]\``;
    let messageChannelId = oldMessage.channel.id;
    let msg = `${date} **${user}** (ID: ${userId}) edited a message in <#${messageChannelId}>:`;
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setDescription(`**From:**${oldMessage}\n**To:**${newMessage}`);
    channel.send(msg, embed);
});

client.on("message", async (message: Message) => {
    if (message.author.bot) return;
    if (message.mentions.users.has(client.user.id))
        return message.reply(
            "My Prefix is `>>`, try `>>help` for more information"
        );

    if (message.content.indexOf(prefix) == -1) return;
    const args: string[] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const cmd: string = args.shift().toLowerCase();

    for (let command of botCommands) {
        if (command === cmd) {
            const cmdClass = await import(`./commands/${command}`);
            const c = new cmdClass.default(client, cmd, args, message);
            if (c._admin) {
                let userRoles = Array.from(message.member.roles.cache.keys());
                if (
                    !userRoles.find((e) => {
                        return adminUsers.includes(e);
                    })
                ) {
                    return message.reply(
                        "Sorry, you don't have permissions to use this!"
                    );
                }
            }
            c.run();
        }
    }
});

client.login(process.env.BOT_TOKEN);
