import { MoustacheItem } from './';

export const functionFoo: MoustacheItem = {
    id: 'foo',
    name: 'Foo',
    price: 50,
    execute: async (msg) => {
        msg.channel.createMessage(`hi this is a message from the past\nsince i know that you need 50 points to open this message, you just wasted 50 points\nrip <@${msg.author.id}>`);
    }
};
