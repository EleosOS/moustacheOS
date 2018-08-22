import signale from 'signale';
import { Request, Response, Router } from 'express';
import { Member } from 'eris';
import { bot, getSuperb } from '../other/index';
import { config } from '../config';

class UpvotePathClass {
    public router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/', this.upvote.bind(this));
    }

    private upvote(req: Request, res: Response) {
        if (req.headers.authorization !== config.authorization) {
            signale.fatal('A request to /upvote arrived with the wrong authorization header...')
        }

        signale.start({prefix: '[upvote]', message: `Upvote recieved! Searching for ${req.body.user}...`, suffix: req.body.user});

        const ease = bot.guilds.get('365236789855649814');
        const upvoter: Member | undefined = ease!.members.find((u) => u.id === req.body.user);

        if (typeof upvoter === undefined) {
            signale.pause({prefix: '[upvote]', message: `${upvoter.username} doesn't seem to be on the server...`, suffix: req.body.user});
            signale.complete({prefix: '[upvote]', message: 'Sending message to #upvote-army.', suffix: req.body.user});
            return bot.createMessage(config.upvoterChannel, `${upvoter.username} upvoted on DBL! But they aren't on the server to recieve their perks...`);
        } else {
            signale.pending({prefix: '[upvote]', message: `${upvoter.username} is on the server...`, suffix: req.body.user});
            signale.pending({prefix: '[upvote]', message: `Adding role to ${upvoter.username}...`, suffix: req.body.user});
            upvoter.addRole(config.upvoterRole, 'Upvote on DBL');
            let msg: string;

            if (req.body.isWeekend) {
                msg = `${getSuperb()}, <@${req.body.user}> has upvoted on DBL during an active voting multiplier!`;
            } else {
                msg = `${getSuperb()}, <@${req.body.user}> has upvoted on DBL!`;
            }

            this.setReminder(upvoter);

            signale.complete({prefix: '[upvote]', message: 'Sending message to #upvote-army.', suffix: req.body.user});
            bot.createMessage(config.upvoterChannel, msg);
        }
    }

    private setReminder(upvoter: Member): void {
        signale.await({prefix: '[upvote]', message: `Setting a reminder for ${upvoter.username}... See you in 12 hours!`, suffix: upvoter.id});

        setTimeout(async () => {
            try {
                const channel = await upvoter.user.getDMChannel();

                channel.createMessage('Hello! You can upvote Ease again.');
                signale.success({prefix: '[upvote]', message: `Sent a DM to ${upvoter.username}.`, suffix: upvoter.id});
            } catch (e) {
                signale.error({prefix: '[upvote]', message: `${upvoter.username} probably has their DMs disabled.`, suffix: upvoter.id});
                signale.error(e);
            }
        }, 43200000);
    }
}

export const UpvotePath = new UpvotePathClass().router;
