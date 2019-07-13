import { Message } from 'eris';
import { functionFoo } from './functionFoo';
import { functionRobberyBook } from './functionRobberyBook';
import { roleBalancedGreen } from './roleBalancedGreen';
import { roleBravePurple } from './roleBravePurple';
import { roleBrilliantRed } from './roleBrilliantRed';
import { roleHairyBlonde } from './roleHairyBlonde';
import { roleUpvoterPlus } from './roleUpvoterPlus';

export interface MoustacheItem {
    id: string;
    name: string;
    price: number;
    roleID?: string;
    execute?: (msg: Message, args?: string[]) => Promise<void>;
}

const itemsArr = [
    functionFoo,
    functionRobberyBook,
    roleBalancedGreen,
    roleBravePurple,
    roleBrilliantRed,
    roleHairyBlonde,
    roleUpvoterPlus
];

export const items = new Map();

itemsArr.forEach((item) => {
    items.set(item.id, item);
});
