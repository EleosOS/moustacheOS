import { MoustacheCommand } from './index';
import { PointsModel } from '../../other/Points.schema';

export const leaderboard: MoustacheCommand = {
    execute: async (msg) => {
        const data = PointsModel.find({ points: -1 });
        return 'look a string';
    },
    label: 'leaderboard',
    options: {
        description: 'Shows the point leaderboard.',
        fullDescription: 'Shows the top 10 users with the most points.',
        usage: ''
    }
}