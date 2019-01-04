import { MoustacheItem } from './';

export const FunctionRobberyBook: MoustacheItem = {
    name: 'Le Soele\'s "How to rob your friend\'s internet points"',
    type: 'function',
    price: 50,
    execute: async (msg, args) => {
        msg.channel.createMessage(`TBI`)
    }
}