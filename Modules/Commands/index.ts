import { Message, CommandOptions } from 'eris';
import { reminder } from './reminder';
import { pointsChange } from './pointsChange';

export const commands: MoustacheCommand[] = [
    reminder,
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