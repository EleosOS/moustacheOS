import signale from 'signale';
import { Request, Response, Router } from 'express';
import { Member } from 'eris';
import { bot, getSuperb, Points } from '../other/index';
import { config } from '../config';

class UpvotePathClass {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.post('/', this.upvote.bind(this));
    }

    /**
     * Handles upvotes (no shit)
     *
     * @private
     * @param {Request} req
     * @param {Response} res
     * @returns {void}
     * @memberof UpvotePathClass
     */
    private upvote(req: Request, res: Response): void {
        // Abort if wrong authorization header
        if (config.authorization.length > 0 && req.headers.authorization !== config.authorization) {
            return signale.fatal('A request to /upvote arrived with the wrong authorization header...\n' + req.headers.authorization);
        }

        signale.start({prefix: '[upvote]', message: `Upvote recieved! Searching for ${req.body.user}...`});

        const ease = bot.guilds.get('365236789855649814');
        const upvoter: Member | undefined = ease!.members.find((u) => u.id === req.body.user);

        if (!upvoter) {
            // The upvoter is not on the server
            signale.pause({prefix: '[upvote]', message: `${req.body.user} doesn't seem to be on the server...`});
            signale.complete({prefix: '[upvote]', message: 'Sending message to #upvote-army.'});
            bot.createMessage(config.upvoterChannel, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
        } else {
            // The upvoter is on the server
            signale.pending({prefix: '[upvote]', message: `${upvoter.username} is on the server...`});
            signale.pending({prefix: '[upvote]', message: `Adding role to ${upvoter.username}...`});
            upvoter.addRole(config.upvoterRole, 'Upvote on DBL');
            let msg: string;

            if (req.body.isWeekend) {
                const points = Points.handle(req.body.user, 2);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL during an active voting multiplier! Upvotes: ${points}`;
            } else {
                const points = Points.handle(req.body.user, 1);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL! Upvotes: ${points}`;
            }

            this.setReminder(upvoter);

            signale.complete({prefix: '[upvote]', message: 'Sending message to #upvote-army.'});
            bot.createMessage(config.upvoterChannel, msg);
        }
    }

    /**
     * Sends a direct message to a user after 12 hours
     *
     * @private
     * @param {Member} upvoter
     * @memberof UpvotePathClass
     */
    private setReminder(upvoter: Member): void {
        signale.await({prefix: '[upvote]', message: `Setting a reminder for ${upvoter.username}... See you in 12 hours!`});

        setTimeout(async () => {
            try {
                const channel = await upvoter.user.getDMChannel();

                channel.createMessage('Hello! You can upvote Ease again.');
                return signale.success({prefix: '[upvote]', message: `Sent a DM to ${upvoter.username}.`});
            } catch (e) {
                signale.error({prefix: '[upvote]', message: `${upvoter.username} probably has their DMs disabled.`});
                signale.error(e);
            }
        }, 43200000);
    }
}

export const UpvotePath = new UpvotePathClass().router;
