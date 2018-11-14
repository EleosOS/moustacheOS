import { bot, Upvote } from '../../index';
import { MoustacheCommand } from '../index';

export const newReminder: MoustacheCommand = {
    execute: async (msg, args) => {
        const ease = bot.guilds.get('365236789855649814');
        const user = ease!.members.find((u: any) => u.id === args[0]);

        if (!user) {
            return 'Couldn\'t find that user.';
        } else if (!args || args.length > 2) {
            return 'Not enough or too many arguments.';
        } else if (bot.user.id === args[0]) {
            return 'I don\'t need to remind myself to upvote, thanks.';
        }

        const reminder = Upvote.setReminder(user);

        if (reminder) {
            return 'Reminder set.';
        } else {
            return 'This user already has a reminder set.';
        }
    },
    label: 'newReminder',
    options: {
        description: '`**(Ruler only)**` Sets an upvote reminder for a user.',
        fullDescription: '`**(Ruler only)**`\nSets a new upvote reminder for the given user. Doesn\'t work if there is already a reminder set.',
        usage: '`userID`',
        requirements: {
            roleIDs: ['378293035852890124'],
        }
    }
}