import { TextChannel, Client, MessageEmbed } from 'discord.js';
import socket_client from 'socket.io-client';
const socket = socket_client('https://get-loc.herokuapp.com/');

import * as simple_node_logger from 'simple-node-logger';
const logger = simple_node_logger.createSimpleLogger({ logFilePath: 'project.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS' });

export default (client: Client) => {
    socket.on('got-geolocation', (data) => {
        logger.info('Got Data: ', data);
        let c = <TextChannel>client.channels.cache.find(chn => {
            if (chn.type === 'text') {
                let textChannel = <TextChannel>chn;
                if (textChannel.name === 'realtalk')
                    return true;
            }
        });
        let embed = new MessageEmbed()
            .setTitle('Geolocation')
            .setColor('#0099ff')
            .addFields(
                { name: "Name", value: data.username + " (Could be Fake!)" },
                { name: "Latitude", value: data.lat },
                { name: "Longitude", value: data.long },
                { name: "Google Maps", value: `https://www.google.com/maps/search/?api=1&query=${data.lat},${data.long}` });
        c.send(embed).catch(console.error);
    });
}
