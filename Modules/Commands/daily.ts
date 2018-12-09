import { Reminder, Transactions, config } from '../index';
import { MoustacheCommand } from './index';

export const daily: MoustacheCommand = {
    execute: async (msg) => {
        const dailyReminder = async () => {
            try {
                const channel = await msg.author.getDMChannel();
                const embed = {
                    embed: {
                        author: {
                            name: 'Hello!',
                            icon_url: 'https://i.imgur.com/ta5wKEp.png',
                        },
                        description: 'You can get your daily point again.',
                        color: config.embedColor
                    },
                };
        
                return channel.createMessage(embed);
            }
            catch (e) {
                console.log(e);
            }
        };

        const reminderSet = Reminder.add(`daily:${msg.author.id}`, 86400000, dailyReminder, msg.author.id);
        let userPoints;

        if (reminderSet) {
            userPoints = await Transactions.add(msg.author.id, +1, 'Daily point');
        } else {
            return 'You still need to wait before you can get your daily point again. You will be reminded if you can.'
        }

        return `You got your daily point! Points: ${userPoints}`;
    },
    label: 'daily',
    options: {
        description: 'Gives you a point every 24 hours.',
        fullDescription: 'Gives you a point every 24 hours. You will be reminded when 24 hours have passed.',
        usage: ''
    }
}