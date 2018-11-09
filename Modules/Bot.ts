import { CommandClient, Message, Member } from 'eris';
import { Points, Upvote } from './index';
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

bot.registerCommand('pointsChange', async (msg: Message, args: string[]) => {
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

bot.registerCommand('newReminder', (msg: Message, args: string[]): string => {
    const ease = bot.guilds.get('365236789855649814');
    const user: Member | undefined = ease!.members.find((u: any) => u.id === args[0]);

    if (!user) {
        return 'Couldn\'t find that user.';
    } else if (!args || args.length > 2) {
        return 'Not enough or too many arguments.';
    } else {
        Upvote.setReminder(user);
        return 'Reminder set.';
    }
}, {
    requirements: {
        roleIDs: ['378293035852890124'],
    },
});

bot.registerCommand('selfReminder', (msg: Message): string => {
    Upvote.setReminder(msg.member!);
    return 'Reminder set. I will remind you to upvote in 12 hours from now.'
})