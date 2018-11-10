import { MoustacheCommand } from './Command_Interface';
import { selfReminder } from './selfReminder';
import { newReminder } from './RulerOnly/newReminder';
import { pointsChange } from './RulerOnly/pointsChange';

export const commands: MoustacheCommand[] = [
    selfReminder,
    newReminder,
    pointsChange
];