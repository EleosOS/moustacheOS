import { Message } from 'eris';

import { FunctionFoo } from './functionFoo';

import { RoleHairyBlonde } from './roleHairyBlonde';

export interface MoustacheItem {
    name: String;
    type: 'role' | 'function';
    price: Number;
    roleID?: String;
    execute?: (msg: Message, args?: string[]) => Promise<void>;
}

export const FunctionItems = [
    FunctionFoo
]

export const RoleItems = [
    RoleHairyBlonde
]