import { Message } from 'eris';

export interface MoustacheItem {
    name: String;
    type: 'role' | 'function';
    price: Number;
    roleID?: String;
    execute?: (msg: Message) => Promise<void>;
}
