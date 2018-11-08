import { CommandClient, Message } from 'eris';
import { Points } from './index';
import { config } from '../config';

const commandOptions = {
    description: 'Community Bot for the Ease server',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'm!'],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.connect();

bot.on('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('error', (e: Error) => {
    console.log(e);
});

// Commands

bot.registerCommand('pointsChange', async (msg, args) => {
    const [ userID, amount ] = args;

    if (!userID || !amount) {
        return 'Not enough arguments.';
    } else if (!+amount) {
        return 'Amount is not a number.';
    }

    const userPoints = await Points.handle(userID, +amount);

    return `<@${userID}>'s points are now at ${userPoints}`;
}, {
    requirements: {
        roleIDs: ['378293035852890124'],
    },
});
