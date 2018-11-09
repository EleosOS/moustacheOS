import { Member } from 'eris';
import { Request } from 'express';
import { bot, getSuperb, Points } from './index';
import { config } from '../config';

class UpvoteClass {
    private reminderCache: string[];

    constructor() {
        this.reminderCache = [];
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
    public handle(req: Request): void {
        console.log(`[upvote] Upvote recieved! Searching for ${req.body.user}...`);

        const ease = bot.guilds.get('365236789855649814');
        const upvoter: Member | undefined = ease!.members.find((u: any) => u.id === req.body.user);

        if (!upvoter) {
            // The upvoter is not on the server
            console.log(`[upvote] ${req.body.user} not found.`);
            bot.createMessage(config.upvoterChannel, `Someone upvoted on DBL! But they aren't on the server to recieve their perks...`);
        } else {
            // The upvoter is on the server
            upvoter.addRole(config.upvoterRole, 'Upvote on DBL');

            this.setReminder(upvoter);
            this.sendUpvoteMessage(upvoter, req.body.isWeekend);
        }
    }

    /**
     * Sends a direct message to a user after 12 hours
     *
     * @public
     * @param {Member} upvoter
     * @memberof UpvotePathClass
     */
    public setReminder(upvoter: Member): false | void {

        if (this.reminderCache.includes(upvoter.id)) {
            console.log(`[upvote] Tried to set multiple reminders of same id for ${upvoter.username} (${upvoter.id}).`);
            return false;
        }

        console.log(`[upvote] Setting a reminder for ${upvoter.username}.`);
        this.reminderCache.push(upvoter.id);

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

                this.reminderCache.shift();
                return channel.createMessage(embed);
            } catch (e) {
                console.log(e);
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

        if (isWeekend) {
                const points = await Points.handle(upvoter.id, 2);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL during an active voting multiplier! Points: ${points}`;
            } else {
                const points = await Points.handle(upvoter.id, 1);
                msg = `${getSuperb()}, <@${upvoter.id}> has upvoted on DBL! Points: ${points}`;
            }

        console.log('[upvote] Sending message to #upvote-army.');
        bot.createMessage(config.upvoterChannel, msg);
    }
}

export const Upvote = new UpvoteClass();
