import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    userID: String,
    items: Map
});

export const InventoryModel = mongoose.model('Inventory', inventorySchema);
