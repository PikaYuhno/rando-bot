import { Message, Client } from 'discord.js';
import generate from '../utils/idGenerator';
import * as cron from 'node-cron';

import cronJobs from '../utils/cronJobs';
import * as simple_node_logger from 'simple-node-logger';
const logger = simple_node_logger.createSimpleLogger({ logFilePath: 'project.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' });


export default class Poll {
  private _cmd: string;
  private _message: Message;
  private _args: string[];
  private _client: Client;

  public _admin = true;

  private _agree: string = '👍';
  private _decline: string = '👎';

  constructor(client: Client, cmd: string, args: string[], message: Message) {
    this._client = client;
    this._cmd = cmd;
    this._args = args;
    this._message = message;
  }


  // TODO: + use message.reactions.cache instead of awaitReactions
  //       + filter...etc

  //>>poll [Wollt ihr minecraft spielen?] --duration=2:00
  public async run() {
    logger.info(`Running Command: ${this._cmd} with Arguments: ${this._args.join(" ")}`);
    if (this._args.length <= 0) {
      return this._message.reply('Use-case: >>poll [<title>] --duration=<hour>:<minute>');
    }
    try {
      let joinedArgs: string = this._args.join(" ");
      let unfinTitle: string[] = joinedArgs.match(/\[[\w\s!?]+\]/g);
      if (unfinTitle === null) {
        return this._message.reply('Please provide a title! Use-case: >>poll [<title>] --duration=<hour>:<minute> ');
      }
      let title: string = unfinTitle[0].trim().substring(1, unfinTitle[0].trim().length - 1);

      let duration: string[] = joinedArgs.match(/--duration=(\d+):(\d+)/g);
      if (duration === null) {
        return this._message.reply('Please provide a duration! Use-case: >>poll [<title>] --duration=<hour>:<minute> ');
      }
      let splitetDur: string[] = duration[0].replace("--duration=", "").split(":");

      let hours: number = parseInt(splitetDur[0]);
      let minutes: number = parseInt(splitetDur[1]);

      console.log(hours + ":" + minutes);
      let time: number = (hours * 60) + (minutes);
      console.log("time: ", time);

      const id = generate();
      const pollMessage = await this._message.channel.send(`**New Survey**, Survey-ID: \`${id}\`, Duration: \`${hours}:${minutes}\` \n\n**${title}**`);

      Promise.all([
        pollMessage.react(this._agree),
        pollMessage.react(this._decline)
      ]).catch(console.error);

      let curDate = new Date(Date.now());
      curDate.setMinutes(curDate.getMinutes() + time);

      const job = async (msgId) => {
        let m = await this._message.channel.messages.fetch(msgId);

        let reactions = m.reactions.cache;
        let agreesCount = reactions.get(this._agree).count - 1;
        let declinesCount = reactions.get(this._decline).count - 1;

        if (agreesCount === 0 && declinesCount === 0) {
          return this._message.channel.send('**Survey ended**\nNoone has voted for the survey.');
        }

        let aggrees = { [this._agree]: agreesCount };
        let declines = { [this._decline]: declinesCount };
        let winner: object = null;

        if (aggrees[this._agree] > declines[this._decline]) {
          winner = aggrees;
        } else if (aggrees[this._agree] < declines[this._decline]) {
          winner = declines;
        } else {
          winner = { 'Draw': aggrees[this._agree] };
        }
        this._message.channel.send(winner['Draw'] ? `It was a draw!` : `**Survey ended** \nMost voted emoji was ${Object.keys(winner)[0]} \`Votes:${winner[Object.keys(winner)[0]]}\``);

      }
      logger.info(`${curDate.getMinutes()} ${curDate.getHours()} ${curDate.getDate()} ${curDate.getMonth() + 1} * `);
      let cJob = cron.schedule(`${curDate.getMinutes()} ${curDate.getHours()} ${curDate.getDate()} ${curDate.getMonth() + 1} * `, () => {
        job(pollMessage.id);
        let obj = cronJobs.get(id);
        obj['cronJob'].destroy();
        cronJobs.delete(id);
      });

      cronJobs.set(id, { cronJob: cJob, func: job, msgId: pollMessage.id });

    } catch (error) {
      logger.error(error);
      this._message.reply(`There was an Error: ${error}`);
    }
  }
}
