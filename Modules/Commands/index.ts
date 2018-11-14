import { Message, CommandOptions } from 'eris';
import { selfReminder } from './selfReminder';
import { newReminder } from './RulerOnly/newReminder';
import { pointsChange } from './RulerOnly/pointsChange';

export const commands: MoustacheCommand[] = [
    selfReminder,
    newReminder,
    pointsChange
];

export interface MoustacheCommand {
    execute: (msg: Message, args: string[]) => Promise<string>;
    label: string;
    options: MoustacheOptions;
}

interface MoustacheOptions extends CommandOptions {
    description: string,
    fullDescription: string,
    usage: string,
}