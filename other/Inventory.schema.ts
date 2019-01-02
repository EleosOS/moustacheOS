import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    userID: String,
    items: Array
});

export const InventoryModel = mongoose.model('Inventory', inventorySchema);
