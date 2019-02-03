import { MoustacheItem } from './';

export const FunctionFoo: MoustacheItem = {
    name: 'Foo',
    type: 'function',
    price: 50,
    execute: async (msg) => {
        msg.channel.createMessage(`hi this is a message from the past\nsince i know that you need 50 points to open this message, you just wasted 50 points\nrip <@${msg.author.id}>`)
    }
}