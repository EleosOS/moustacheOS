'use strict';

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pointsSchema = new Schema({
    points: Number,
    userID: String,
});

export const PointsModel = mongoose.model('Points', pointsSchema);
