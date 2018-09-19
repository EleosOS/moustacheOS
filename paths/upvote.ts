import signale from 'signale';
import { Request, Response, Router } from 'express';
import { Member } from 'eris';
import { bot, getSuperb, Points } from '../other/index';
import { ErrorCache } from './index';
import { config } from '../config';

class UpvotePathClass {
    public router: Router;
    private remindersCache: string[];

    constructor() {
        this.router = Router();
        this.remindersCache = [];

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
        const upvoter: Member | undefined = ease!.members.find((u: any) => u.id === req.body.user);

        if (!upvoter) {
            // The upvoter is not on the server
            ErrorCache.add(new Error(`${req.body.user} not found.`));
            signale.pause({prefix: '[upvote]', message: `${req.body.user} doesn't seem to be on the server...`});
            bot.createMessage(config.upvoterChannel, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
        } else {
            // The upvoter is on the server
            signale.pending({prefix: '[upvote]', message: `Adding role to ${upvoter.username}...`});
            upvoter.addRole(config.upvoterRole, 'Upvote on DBL');

            this.setReminder(upvoter);
            this.sendUpvoteMessage(upvoter, req.body.isWeekend);
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
        const cached = this.remindersCache.find((element) => {
            return element === upvoter.id;
        });

        if (cached) {
            ErrorCache.add(new Error(`Tried to set multiple reminders for ${upvoter.username}.`));
            return signale.note({prefix: '[upvote]', message: `${upvoter.username} already has a reminder set.`});
        }

        signale.await({prefix: '[upvote]', message: `Setting a reminder for ${upvoter.username}... See you in 12 hours!`});
        this.remindersCache.push(upvoter.id);

        setTimeout(async () => {
            try {
                const channel = await upvoter.user.getDMChannel();
                const embed: object = {
                    embed: {
                        author: {
                            name: 'Hello!',
                            icon_url: 'https://i.imgur.com/NoMc9tt.png',
                        },
                        description: '[You can upvote Ease again.](https://discordbots.org/bot/365879035496235008/vote)',
                        color: 0x1ABC9C,
                    },
                };

                this.remindersCache.shift();
                return channel.createMessage(embed);
            } catch (e) {
                ErrorCache.add(e);
                signale.error({prefix: '[upvote]', message: `${upvoter.username} probably has their DMs disabled.`});
                signale.error(e);
            }
        }, 43200000);
    }

    /**
     * Sends the upvote message
     *
     * @private
     * @param {Member} upvoter
     * @param {boolean} isWeekend
     * @memberof UpvotePathClass
     */
    private async sendUpvoteMessage(upvoter: Member, isWeekend: boolean) {
        let msg: string = '';

        try {
            if (isWeekend) {
                const points = await Points.handle(upvoter.id, 2);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL during an active voting multiplier! Points: ${points}`;
            } else {
                const points = await Points.handle(upvoter.id, 1);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL! Points: ${points}`;
            }
        } catch (e) {
            ErrorCache.add(e);
            signale.error(e);
        }

        signale.complete({prefix: '[upvote]', message: 'Sending message to #upvote-army.'});
        bot.createMessage(config.upvoterChannel, msg);
    }
}

export const UpvotePath = new UpvotePathClass().router;
