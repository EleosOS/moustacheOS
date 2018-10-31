import { Client } from 'eris';
import { config } from '../config';

export const bot = new Client(config.token);

bot.connect();

bot.on('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('error', (e: Error) => {
    console.log(e);
});
