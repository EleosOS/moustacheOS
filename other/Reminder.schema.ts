import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    id: Number,
    cache: Map,
    ignored: Map
});

export const ReminderModel = mongoose.model('Reminder', reminderSchema);
