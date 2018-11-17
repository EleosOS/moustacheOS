import { Message, CommandOptions } from 'eris';
import { reminder } from './reminder';
import { evalCmd } from './eval';
import { pointsChange } from './pointsChange';

export const commands: MoustacheCommand[] = [
    reminder,
    evalCmd,
    pointsChange
];

export interface MoustacheCommand {
    execute: (msg: Message, args: string[]) => Promise<string>;
    label: string;
    options: MoustacheOptions;
    subcommands?: MoustacheCommand[];
}

interface MoustacheOptions extends CommandOptions {
    description: string,
    fullDescription: string,
    usage: string,
}