import { Upvote } from '../index';
import { MoustacheCommand } from './Command_Interface';

export const selfReminder: MoustacheCommand = {
    execute: async (msg) => {
        const reminder = Upvote.setReminder(msg.member!);

        if (reminder) {
            return 'Reminder set. I will remind you to upvote in 12 hours from now.';
        } else {
            return 'You already have a reminder set.';
        }
    },
    label: 'selfReminder',
    options: {
        description: 'Sets an upvote reminder for yourself.',
        fullDescription:'Sets a new upvote reminder for yourself. Doesn\'t work if there is already a reminder set for you.',
        usage: '',
    }
};
