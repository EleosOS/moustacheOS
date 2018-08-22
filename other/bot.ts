import { Client } from 'eris';
import { config } from '../config';
import signale from 'signale';

export const bot = new Client(config.token);

bot.connect();

bot.on('ready', () => {
    signale.start('Bot ready.');
});
