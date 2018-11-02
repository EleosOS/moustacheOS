import { CommandClient } from 'eris';
import { Points } from './index';
import { config } from '../config';

const commandOptions = {
    description: 'Community Bot for the Ease server',
    owner: 'Eleos#0010',
    prefix: ['@mention', 'm!', 'i cast'],
};

export const bot = new CommandClient(config.token, {}, commandOptions);

bot.connect();

bot.on('ready', () => {
    console.log('[startup] Bot ready.');
});

bot.on('error', (e: Error) => {
    console.log(e);
});

bot.registerCommand('pointsChange', async (msg, args) => {
    const [ userID, amount ] = args;

    if (!userID || !amount) {
        return 'Not enough arguments.';
    }

    const userPoints = await Points.handle(userID, +amount);

    return `<@${userID}>'s points are now at ${userPoints}`;
}, {
    requirements: {
        roleIDs: ['378293035852890124'],
    },
});
