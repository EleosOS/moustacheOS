import { bot } from './';
import { PointsModel } from '../other/';

class PointsClass {

    /**
     * Simpler way to increment points, basicly just calls all methods for you. Doesn't force change, creates new documents.
     *
     * @param {string} userID
     * @param {number} amount Amount of points to add
     * @returns {number | null} Given user's points if successfull, false if points were not changed, null if something went wrong
     * @memberof Points
     */
    public async handle(userID: string, amount: number): Promise<number | false> {
        const userPoints = await this.find(userID, false);
        const newUserPoints = await this.change(userPoints, amount, false);
        return newUserPoints.points;
    }

    /**
     * Searches DB for points assigned by the userID
     *
     * @param {string} userID
     * @param {boolean} noCreate True if no new document should be created
     * @returns Points Document, creates a new one if not noCreate, null if there is nothing.
     * @memberof Points
     */
    public async find(userID: string, noCreate: boolean) {
        const userPoints = await PointsModel.findOne({ userID: userID });

        if (userPoints) {
            return userPoints;
        } else if (!noCreate) {
            return this.create(userID);
        } else {
            return null;
        }
    }

    /**
     * Changes the documents points by given amount
     *
     * @param {Document} userPoints
     * @param {number} amount Amount of points to add/remove
     * @param {boolean} force Force Points to change even if they will turn negative, changes to 0 then
     * @returns Saved Points Document if successful/forced, false if change would result in negative points, null if something went wrong
     * @memberof Points
     */
    public async change(userPoints: any, amount: number, force: boolean) {
        let saved;

        if ((userPoints.points + amount) < 0) {
            if (force) {
                userPoints.points += amount;
            } else {
                return false;
            }
        } else {
            userPoints.points += amount;
        }

        try {
            const finish = await Promise.all([
                userPoints.save(),
                this.rankcheck(userPoints)
            ]);

            saved = finish[0]
        } catch (err) {
            console.log(err);
            saved = null;
        }

        return saved;
    }

    /**
     * Creates a new Points Document for given userID
     *
     * @private
     * @param {string} userID
     * @returns {Document} Points Document
     * @memberof Points
     */
    private async create(userID: string) {
        const userPoints = new PointsModel({
            points: 0,
            userID: userID,
        });

        return await userPoints.save();
    }

    private async rankcheck(userPoints: any) {
        const ease = bot.guilds.get('365236789855649814');
        const ranks = {
            coal: {
                id: '515502089812705291',
                points: 1
            },
            bronze: {
                id: '515502168569282562',
                points: 50
            },
            silver: {
                id: '515502216493269012',
                points: 100
            },
            gold: {
                id: '515502257043800066',
                points: 150
            }
        };
        let member;
        const giveRole = async (rank: 'coal' | 'bronze' | 'silver' | 'gold') => {
            member = ease!.members.get(userPoints.userID);

            if (!member) {
                return;
            }

            await member.addRole(ranks.coal.id, `Earned ${ranks[rank].points} points`);
        }

        if (userPoints.points > ranks.coal.points) {
            giveRole('coal');
        } else if (userPoints.points > ranks.bronze.points) {
            giveRole('bronze');
        } else if (userPoints.points > ranks.silver.points) {
            giveRole('silver');
        } else if (userPoints.points > ranks.gold.points) {
            giveRole('gold');
        }

    }
}

export const Points = new PointsClass();
