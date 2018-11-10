import { Message, CommandOptions } from 'eris';

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