import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Upvote } from './index';
import { config } from '../config';

export const app = express();
const moustacheInfo: string = `<img src="https://cdn.discordapp.com/avatars/417105627253309450/f470851f6fbff7cd1739b3a327ff9f46.png?size=128" alt="moustache logo"><br /><p>moustacheOS ver 2.0 (blonde)</p>`;

app.use(bodyParser.json());

app.post('/upvote', (req: Request, res: Response) => {
    // Abort if wrong authorization header
    if (config.authorization.length > 0 && req.headers.authorization !== config.authorization) {
        return console.log('[express] A request to /upvote arrived with the wrong authorization header...\n' + req.headers.authorization);
    }

    Upvote.handle(req);
});

app.get('/', (req: Request, res: Response) => {
    res.send(moustacheInfo);
});
