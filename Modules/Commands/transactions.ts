import { MoustacheCommand } from './';
import { bot, config, MoustacheTransaction } from '../';
import { TransactionsModel } from '../../other/';

export const leaderboard: MoustacheCommand = {
    execute: async (msg) => {
        const data = await TransactionsModel.find({userID: msg.author.id});
        const dataTransactions = (data as any).transactions;
        const fields: object[] = [];

        dataTransactions.forEach((element: MoustacheTransaction, index: number) => {
            fields.push({
                name: index + 1,
                value: `From: <@${element.origin}>\nTo:<@${element.recipient}>\nAmount: {element.amount} Points\nReason: ${element.reason}`
            });
        });

        const embed = {
            embed: {
                color: config.embedColor,
                fields
            }
        };

        return bot.createMessage(msg.channel.id, embed);
    },
    label: 'transactions',
    options: {
        description: 'Shows your last 10 transactions.',
        fullDescription: 'Shows your last 10 transactions.',
        usage: ''
    }
};
