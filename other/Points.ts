import { PointsModel } from './index';
import { Document } from 'mongoose';

class PointsHandler {

    /**
     * Simpler way to increment points, basicly just calls all methods for you
     *
     * @param {string} userID
     * @param {number} amount Amount of points to add
     * @returns {number} Given user's points
     * @memberof Points
     */
    public async handle(userID: string, amount: number): Promise<number> {
        const userPoints = await this.find(userID);
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
        const userPoints = await PointsModel.findOne({ userID: userID });

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
    public async increment(userPoints: any, amount: number): Promise<Document> {
        // I know userPoints is a Document but TypeScript wont let me access its properties, because it doesn't know they exist.
        // tslint:disable-next-line:no-unused-expression goddamit tslint
        userPoints.points += amount;

        const saved = await userPoints.save()
            .then((s: Document) => {return; });

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
