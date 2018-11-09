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

bot.once('ready', () => {
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
    description: '(Ruler only) Changes points by given amount.',
    fullDescription: '(Ruler only)\nIncrements or decrements the points of the given user by given amount.',
    usage: 'pointsChange `userID` `amount`',
});

bot.registerCommand('newReminder', (msg: Message, args: string[]): string => {
    const ease = bot.guilds.get('365236789855649814');
    const user: Member | undefined = ease!.members.find((u: any) => u.id === args[0]);

    if (!user) {
        return 'Couldn\'t find that user.';
    } else if (!args || args.length > 2) {
        return 'Not enough or too many arguments.';
    }

    const reminder = Upvote.setReminder(user);

    if (reminder) {
        return 'Reminder set.';
    } else {
        return 'This user already has a reminder set.';
    }

}, {
    requirements: {
        roleIDs: ['378293035852890124'],
    },
    description: '(Ruler only) Sets a upvote reminder for a user.',
    fullDescription: '(Ruler only)\nSets a new upvote reminder for the given user. Doesn\'t work if there is already a reminder set.',
    usage: 'newReminder `userID`',
});

bot.registerCommand('selfReminder', (msg: Message): string => {
    const reminder = Upvote.setReminder(msg.member!);

    if (reminder) {
        return 'Reminder set. I will remind you to upvote in 12 hours from now.';
    } else {
        return 'You already have a reminder set.';
    }
}, {
    description: 'Sets a upvote reminder for yourself.',
    fullDescription: 'Sets a new upvote reminder for yourself. Doesn\'t work if there is already a reminder set for you.',
    usage: 'setReminder',
});
