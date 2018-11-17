import { MoustacheCommand } from './index';
import { bot } from '../index';

import { PointsModel } from '../../other/Points.schema';

export const leaderboard: MoustacheCommand = {
    execute: async (msg) => {
        const data = await PointsModel.find({}).sort('-points').limit(10);
        const fields: Object[] = [];
        const ease = bot.guilds.get('365236789855649814');
        

        data.forEach((element: any) => {
            const member = ease!.members.find((u: any) => u.id === element.userID);

            fields.push({
                name: `${member.username}#${member.discriminator} | Points: ${element.points}`,
                value: element.userID
            });
        })

        const embed = {
            embed: {
                color: 0x1ABC9C,
                fields: fields
            }
        }

        return bot.createMessage(msg.channel.id, embed);
    },
    label: 'leaderboard',
    options: {
        description: 'Shows the point leaderboard.',
        fullDescription: 'Shows the top 10 users with the most points.',
        usage: ''
    }
}