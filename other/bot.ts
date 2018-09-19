import { Client } from 'eris';
import { config } from '../config';
import { ErrorCache } from '../paths/index';
import signale from 'signale';

export const bot = new Client(config.token);

bot.connect();

bot.on('ready', () => {
    signale.start('Bot ready.');
});

bot.on('error', (e: Error) => {
    ErrorCache.add(e);
    signale.error(e);
});
