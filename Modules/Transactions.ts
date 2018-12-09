import { TransactionsModel } from '../other/index';
import { Points, bot } from './index';

export interface MoustacheTransaction {
    origin: string; // userID
    recipient: string; // also userID or "moustache"
    amount: number; // Amount of Points that were transfered
    reason: string; // Why did this transaction happen?
}

class TransactionsClass {
    /**
     * Searches DB for points assigned by the userID
     *
     * @param {string} userID
     * @returns Transactions Document, or creates a new one
     * @memberof Points
     */
    public async find(userID: string) {
        const userTransactions = await TransactionsModel.findOne({ userID: userID });

        if (userTransactions) {
            return userTransactions;
        } else {
            return this.create(userID);
        }
    }

    /**
     * Add points to the given userID, creates a new transaction
     *
     * @param {string} userID
     * @param {number} amount Amount of points to add
     * @returns Current points or false if something went wrong
     * @memberof Transactions
     */
    public async add(userID: string, amount: number, reason: string) {
        const userTransactions: any = await this.find(userID);
        // Since only positive amounts will be passed here, Points.handle() should never return null.
        let userPoints = await Points.handle(userID, +amount);

        const transaction: MoustacheTransaction = {
            origin: 'moustache',
            recipient: userID,
            amount: amount,
            reason: reason
        };

        userTransactions.transactions.unshift(transaction);

        if (userTransactions.transactions.length > 10) {
            userTransactions.transactions.pop();
        }

        try {
            await userTransactions.save();
        } catch (err) {
            console.log(err);
            userPoints = false;
        }

        return userPoints;
    }

    /**
     * Substract points to the given userID, creates a new transaction
     *
     * @param {string} userID
     * @param {number} amount Amount of points to remove
     * @returns Current points if successful, false if substraction would result in negative points or if an error occurred
     * @memberof Points
     */
    public async substract(userID: string, amount: number, reason: string) {
        const userTransactions: any = await this.find(userID);
        let userPoints = await Points.handle(userID, -amount);

        if (!userPoints) {
            return false;
        }

        const transaction: MoustacheTransaction = {
            origin: userID,
            recipient: 'moustache',
            amount: amount,
            reason: reason
        };
        
        userTransactions.transactions.unshift(transaction);

        if (userTransactions.transactions.length > 10) {
            userTransactions.transactions.pop();
        }

        try {
            await userTransactions.save();
        } catch (err) {
            console.log(err);
            userPoints = false;
        }

        return userPoints;
    }

    /**
     * Transferes points from originID to recipientID
     *
     * @param {string} originID
     * @param {string} recipientID
     * @param {number} amount Amount of points to transfer
     * @returns True if successful, false if substraction would result in negative points or null if an error occurred
     * @memberof Points
     */
    public async transfer(originID: string, recipientID: string, amount: number, reason: string) {
        if (!this.exists(recipientID)) {
            return null;
        }

        const [originTransactions, recipientTransactions, originPoints]: any = await Promise.all([
            this.find(originID),
            this.find(recipientID),
            Points.handle(originID, -amount)
        ]);
        
        if (!originPoints) {
            return false;
        } else {
            await Points.handle(recipientID, +amount);
        }

        const transaction: MoustacheTransaction = {
            origin: originID,
            recipient: recipientID,
            amount: amount,
            reason: reason
        };
        
        originTransactions.transactions.unshift(transaction);
        recipientTransactions.transactions.unshift(transaction);

        if (originTransactions.transactions.length > 10) {
            originTransactions.transactions.pop();
        }

        if (recipientTransactions.transactions.length > 10) {
            recipientTransactions.transactions.pop();
        }

        try {
            Promise.all([
                originTransactions.save(),
                recipientTransactions.save()
            ]);

            return true;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * Creates a new Transactions Document for given userID
     *
     * @private
     * @param {string} userID
     * @returns {Document} Points Document
     * @memberof Transactions
     */
    private async create(userID: string) {
        const userTransactions = new TransactionsModel({
            transactions: [],
            userID: userID,
        });

        return userTransactions.save();
    }

    /**
     *  Checks if a user is on the server
     *
     * @private
     * @param {string} userID
     * @returns {boolean}
     * @memberof TransactionsClass
     */
    private exists(userID: string) {
        const ease = bot.guilds.get('365236789855649814');
        const user = ease!.members.get(userID);

        if (user) {
            return true;
        } else {
            return false;
        }
    }
}

export const Transactions = new TransactionsClass();
