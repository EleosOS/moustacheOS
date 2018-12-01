import { TransactionsModel } from '../other/index';
import { Points } from './index';

interface MoustacheTransaction {
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
     * @returns Saved Transactions Document or null if something went wrong
     * @memberof Transactions
     */
    public async add(userID: string, amount: number, reason: string) {
        const userTransactions: any = await this.find(userID);
        let saved;

        const transaction: MoustacheTransaction = {
            origin: 'moustache',
            recipient: userID,
            amount: amount,
            reason: reason
        };

        // Since only positive amounts will be passed here, Points.handle() should never return null.
        Points.handle(userID, +amount);

        userTransactions.transactions.unshift(transaction);

        if (userTransactions.transactions.length > 10) {
            userTransactions.transactions.pop();
        }

        try {
            saved = await userTransactions.save();
        } catch (err) {
            console.log(err);
            saved = null;
        }

        return saved;
    }

    /**
     * Substract points to the given userID, creates a new transaction
     *
     * @param {string} userID
     * @param {number} amount Amount of points to remove
     * @returns Saved Transactions Document if successful, false if substraction would result in negative points or null if an error occurred
     * @memberof Points
     */
    public async substract(userID: string, amount: number, reason: string) {
        const userTransactions: any = await this.find(userID);
        const userPoints = await Points.handle(userID, -amount);
        let saved;

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
            saved = await userTransactions.save();
        } catch (err) {
            console.log(err);
            saved = null;
        }

        return saved;
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
        // This looks pretty bad, sorry.
        const originTransactions: any = await this.find(originID);
        const recipientTransactions: any = await this.find(recipientID);

        const originPoints = await Points.handle(originID, -amount);
        await Points.handle(originID, +amount);

        if (!originPoints) {
            return false;
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
        } else if (recipientTransactions.transactions.length > 10) {
            recipientTransactions.transactions.pop();
        }

        try {
            await originTransactions.save();
            await recipientTransactions.save();
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

        return await userTransactions.save();
    }
}

export const Transactions = new TransactionsClass();
