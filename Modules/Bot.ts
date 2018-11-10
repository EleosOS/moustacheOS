import { CommandClient } from 'eris';
import { commands } from './Commands';
import { config } from '../config';

const commandOptions = {
    description: 'Community Bot for the Ease server',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'm!'],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.connect();

bot.once('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('error', (e: Error) => {
    console.log(e);
});

commands.forEach((element) => {
    bot.registerCommand(element.label, element.execute, element.options)
});