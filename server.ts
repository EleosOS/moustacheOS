import express from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import { UpvotePath } from './paths/index';

const app = express();
const port: number | string = process.env.PORT || 3000;
const shitArt: string = `<img src="https://ih0.redbubble.net/image.366213776.3101/flat,800x800,075,f.jpg" alt="shit">`;

app.use(bodyParser.json());

app.use('/upvote', UpvotePath);

app.get('/upvote', (req, res) => {
    res.send('hi');
});

app.get('/', (req, res) => {
    res.send(shitArt);
});

const listener = app.listen(port, () => {
    signale.start(`Listening at port ${port}`);
});
