import express from 'express';
import bodyParser from 'body-parser';
import signale from 'signale';
import { UpvotePath } from './paths/index';

const app = express();
const port: number | string = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/', UpvotePath);

app.listen(port, () => {
    signale.start(`Listening at ${port}`);
});