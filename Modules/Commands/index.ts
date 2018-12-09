import { daily } from './daily';
import { evalCmd } from './eval';
import { leaderboard } from './leaderboard';
import { points } from './points';
import { pointsChange } from './pointsChange';
import { reminder } from './reminder';

import { Message, CommandOptions } from 'eris';

export const commands: MoustacheCommand[] = [
    daily,
    evalCmd,
    reminder,
    leaderboard,
    points,
    pointsChange
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