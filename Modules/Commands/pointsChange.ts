import { Transactions } from '../index';
import { MoustacheCommand } from './index';

export const pointsChange: MoustacheCommand = {
    execute: async (msg, args) => {
        const [ userID, amount ] = args;
        let userPoints;

        if (!userID || !amount) {
            return 'Not enough arguments.';
        } else if (!+amount) {
            return 'Amount is not a number.';
        }

        if (+amount < 0) {
            userPoints = await Transactions.substract(userID, +amount, 'Changed by a ruler');
        } else {
            userPoints = await Transactions.add(userID, +amount, 'Changed by a ruler');
        }

        if (!userPoints) {
            return 'This action would result in negative points and has been aborted.'
        }

        return `<@${userID}>'s points are now at ${userPoints}.`;
    },
    label: 'pointsChange',
    options: {
        description: '*Ruler only* Changes points by given amount.',
        fullDescription: '*Ruler only*\nIncrements or decrements the points of the given user by given amount.',
        usage: '`userID` `amount`',
        requirements: {
            roleIDs: ['378293035852890124'],
        }
    }
}