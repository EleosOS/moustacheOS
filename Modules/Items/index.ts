import { Message } from 'eris';
import { FunctionFoo } from './functionFoo';
import { FunctionRobberyBook } from './functionRobberyBook';
import { RoleBalancedGreen } from './roleBalancedGreen';
import { RoleBravePurple } from './roleBravePurple';
import { RoleBrilliantRed } from './roleBrilliantRed';
import { RoleHairyBlonde } from './roleHairyBlonde';
import { RoleUpvoterPlus } from './roleUpvoterPlus';

export interface MoustacheItem {
    id: string;
    name: string;
    type: 'role' | 'function';
    price: number;
    roleID?: string;
    execute?: (msg: Message, args?: string[]) => Promise<void>;
}

export const FunctionItems = new Map();
const FunctionItemsArr = [
    FunctionFoo,
    FunctionRobberyBook
];

FunctionItemsArr.forEach((item) => {
    FunctionItems.set(item.name, item);
});

export const RoleItems = new Map();
const RoleItemsArr = [
    RoleBalancedGreen,
    RoleBravePurple,
    RoleBrilliantRed,
    RoleHairyBlonde,
    RoleUpvoterPlus
];

RoleItemsArr.forEach((item) => {
    RoleItems.set(item.name, item);
});
