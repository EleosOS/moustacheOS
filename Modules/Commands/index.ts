import { Message, CommandOptions } from 'eris';
import { reminder } from './reminder';
import { evalCmd } from './eval';
import { leaderboard } from './leaderboard';
import { pointsChange } from './pointsChange';
import { ping } from './ping';

export const commands: MoustacheCommand[] = [
    reminder,
    evalCmd,
    pointsChange,
    leaderboard,
    ping
];

export interface MoustacheCommand {
    execute: (msg: Message, args: string[]) => Promise<string | Message>;
    label: string;
    options: MoustacheOptions;
    subcommands?: MoustacheCommand[];
}

interface MoustacheOptions extends CommandOptions {
    description: string,
    fullDescription: string,
    usage: string,
}