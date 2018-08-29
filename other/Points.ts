import { PointsModel } from './index';
import { Document } from 'mongoose';
import signale from 'signale';

class PointsHandler {

    /**
     * Simpler way to increment points, basicly just calls all methods for you
     *
     * @param {string} userID
     * @param {number} amount Amount of points to add
     * @returns {number} Given user's points
     * @memberof Points
     */
    public handle(userID: string, amount: number): number {
        const userPoints = this.find(userID);
        const newUserPoints = this.increment(userPoints, amount);
        return newUserPoints.points;
    }

    /**
     * Searches DB for points assigned by the userID
     *
     * @param {string} userID
     * @returns Points Document, or creates a new one
     * @memberof Points
     */
    public async find(userID: string) {
        let userPoints: Document | null;
        try {
            userPoints = await PointsModel.findOne({ userID: userID });
        } catch (e) {
            return signale.fatal(e);
        }

        if (userPoints) {
            return userPoints;
        } else {
            return this.create(userID);
        }
    }

    /**
     * Increments the documents points by given amount
     *
     * @param {Document} userPoints
     * @param {number} amount Amount of points to add
     * @returns New Points Document
     * @memberof Points
     */
    public increment(userPoints: any, amount: number) {
        // I know userPoints is a Document but TypeScript wont let me access its properties, because it doesn't know they exist.
        // tslint:disable-next-line:no-unused-expression goddamit tslint
        userPoints.points + amount;
        userPoints.save();
        return userPoints;
    }

    /**
     * Creates a new Points Document for given userID
     *
     * @private
     * @param {string} userID
     * @returns {Document} Points Document
     * @memberof Points
     */
    private create(userID: string): Document {
        const userPoints = new PointsModel({
            points: 0,
            userID: userID,
        });

        userPoints.save();
        return userPoints;
    }
}

export const Points = new PointsHandler();
