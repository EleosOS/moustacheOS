import express from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import mongoose from 'mongoose';
import { UpvotePath, ErrorPath, ErrorCache } from './paths/index';

const app = express();
const port: number = 3000;
const moustacheInfo: string = `<img src="https://cdn.discordapp.com/avatars/417105627253309450/f470851f6fbff7cd1739b3a327ff9f46.png?size=256" alt="moustache logo"><br /><p>moustacheOS ver 1.0.1</p>`;

app.use(bodyParser.json());

app.use('/upvote', UpvotePath);
app.use('/errors', ErrorPath);

app.get('/', (req, res) => {
    res.send(moustacheInfo);
});

app.listen(port, () => {
    signale.start(`Listening at port ${port}`);
});

try {
    mongoose.connect('mongodb://localhost/moustacheDB', { useNewUrlParser: true });
    signale.start('Connected to MongoDB.');
} catch (e) {
    ErrorCache.add(e);
    signale.fatal(e);
}
