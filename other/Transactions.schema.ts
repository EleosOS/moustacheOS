import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const transactionsSchema = new Schema({
    transactions: Array,
    userID: String,
});

export const TransactionsModel = mongoose.model('Transactions', transactionsSchema);
