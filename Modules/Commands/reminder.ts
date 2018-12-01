import { Upvote, Reminder, bot } from '../index';
import { MoustacheCommand } from './index';

const subUpvote: MoustacheCommand = {
    execute: async (msg, args) => {
        if (!msg.member) {
            return 'This command can only be executed on the server.';
        }

        if (msg.member.roles.includes('378293035852890124') && args.length > 0) {
            const ease = bot.guilds.get('365236789855649814');
            const member = ease!.members.find((u: any) => u.id === args[0]);
            const set = await Upvote.setReminder(member, true);

            if (set) {
                return 'Reminder set for that user.';
            } else {
                return 'This user already has a reminder set.';
            }
        } else {
            const set = await Upvote.setReminder(msg.member, true);

            if (set) {
                return 'I will remind you to upvote in 12 hours.';
            } else {
                return 'You already have an upvote reminder set.';
            }
        }

    },
    label: 'upvote',
    options: {
        description: 'Set an upvote reminder.',
        fullDescription: 'Set a reminder to upvote for yourself (or for a specified user if a Ruler is using the command).',
        usage: '(userID)'
    }
}

const subRemoveAll: MoustacheCommand = {
    execute: async (msg) => {
        await Reminder.removeAll(msg.author.id);

        return 'All for you set reminders have been removed.';
    },
    label: 'removeAll',
    options: {
        description: 'Removes all for you set reminders. **This can\'t be undone.**',
        fullDescription: 'Removes all for you set reminders. **This cannot be undone.**',
        usage: ''
    }
}

export const reminder: MoustacheCommand = {
    execute: async () => {
        return 'See m!help reminder for all commands.';
    },
    label: 'reminder',
    options: {
        description: 'Everything related to reminders.',
        fullDescription:'',
        usage: '',
    },
    subcommands: [subRemoveAll, subUpvote]
};

