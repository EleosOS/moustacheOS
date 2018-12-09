import { MoustacheCommand } from './';
import { bot } from '../';
import { PointsModel } from '../../other/';

export const points: MoustacheCommand = {
    execute: async (msg, args) => {
        const data = await PointsModel.find({ userID: args[0]});
        const ease = bot.guilds.get('365236789855649814');
        const member = ease!.members.find((u: any) => u.id === args[0]);
        let string = `${member.user.username}#${member.discriminator} currently has ${(data as any).points} points.`
        
        if (!data) {
            return 'That user could not be found.';
        } else if (!member) {
            string = `???: ${args[0]} currently has ${(data as any).points} points.`
        }

        return bot.createMessage(msg.channel.id, string);
    },
    label: 'points',
    options: {
        description: 'Shows how many points a user currently has.',
        fullDescription: 'Shows how many points a user currently has.',
        usage: '`userID`'
    }
}