import express from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import mongoose from 'mongoose';
import { UpvotePath } from './paths/index';

const app = express();
const port: number = 3000;
const shitArt: string = `<img src="https://ih0.redbubble.net/image.366213776.3101/flat,800x800,075,f.jpg" alt="shit">`;

app.use(bodyParser.json());

app.use('/upvote', UpvotePath);

app.get('/', (res: any) => {
    res.send(shitArt);
});

app.listen(port, () => {
    signale.start(`Listening at port ${port}`);
});

try {
    mongoose.connect('mongodb://localhost/moustacheDB', { useNewUrlParser: true });
    signale.start('Connected to MongoDB.');
} catch (e) {
    signale.fatal(e);
}
