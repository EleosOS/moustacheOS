import express from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import { UpvotePath } from './paths/index';

const app = express();
const port: number | string = process.env.PORT || 3000;
const shitArt: string = `(   )\n(   ) (\n) _   )\n( \\_\n_(_\\ \\)__\n(____\\___))`;

app.use(bodyParser.json());

app.use('/upvote', UpvotePath);

app.get('/', (req, res) => {
    res.send(shitArt);
});

const listener = app.listen(port, () => {
    signale.start(`Listening at port ${port}`);
});
