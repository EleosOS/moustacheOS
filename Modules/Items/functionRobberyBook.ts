import { MoustacheItem } from './';
import { Transactions } from '../';
import { PointsModel } from '../../other';

const transactionMessages = [
    'Won in a lottery?',
    'Special upvoter reward?',
    'Borrowed from a friend?',
    'Found in a trashcan?',
    'Donation?',
    'Collected in springs?',
    'Won in a tournament?',
    'Very special contribution to Moustache?'
]

async function rollVictim() {
    const count = await PointsModel.where('points').gt(10).estimatedDocumentCount();
    const rand = Math.floor(Math.random() * count);
    const victimPoints = await PointsModel.findOne().skip(rand);

    return victimPoints;
}

export const functionRobberyBook: MoustacheItem = {
    id: 'robberybook',
    name: 'Le Soele\'s "How to rob your friend\'s internet points"',
    price: 35,
    execute: async (msg) => {
        const victimPoints = await rollVictim();
        const robbedPoints = Math.floor(Math.random() * ((victimPoints as any).points * 0.7)) + 1;
        const hidden = Math.random() >= 0.5;

        if (hidden) {
            Transactions.substract((victimPoints as any).id, robbedPoints, 'Stolen by ???');
            Transactions.add(msg.author.id, robbedPoints, TransactionMessages[Math.floor(Math.random() * TransactionMessages.length)]);

        } else {
            Transactions.transfer((victimPoints as any).id, msg.author.id, robbedPoints, `<@${msg.author.id}> stole from <@${(victimPoints as any).id}>`);
        }

        const hiddenMsg = hidden ? 'You were not detected.' : 'You were detected.';
        const successMsg = await msg.channel.createMessage(robbedPoints + ' points have been added to your points. ' + hiddenMsg);
        return successMsg.delete();
    }
}
