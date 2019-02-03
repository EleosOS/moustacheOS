import { Message } from 'eris';
import { FunctionFoo } from './functionFoo';
import { FunctionRobberyBook } from './functionRobberyBook';
import { RoleBalancedGreen } from './roleBalancedGreen';
import { RoleBravePurple } from './roleBravePurple';
import { RoleBrilliantRed } from './roleBrilliantRed';
import { RoleHairyBlonde } from './roleHairyBlonde';
import { RoleUpvoterPlus } from './roleUpvoterPlus';

export interface MoustacheItem {
    id: String;
    name: String;
    type: 'role' | 'function';
    price: Number;
    roleID?: String;
    execute?: (msg: Message, args?: string[]) => Promise<void>;
}

export const FunctionItems = new Map();
const FunctionItemsArr = [
    FunctionFoo,
    FunctionRobberyBook
];

FunctionItemsArr.forEach((item, i) => {
    FunctionItems.set(item.name, item);
})


export const RoleItems = new Map();
const RoleItemsArr = [
    RoleBalancedGreen,
    RoleBravePurple,
    RoleBrilliantRed,
    RoleHairyBlonde,
    RoleUpvoterPlus
];

RoleItemsArr.forEach((item, i) => {
    RoleItems.set(item.name, item);
})