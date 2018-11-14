import { Member } from 'eris';
import { Request } from 'express';
import { bot, getSuperb, Points, Reminder } from './index';
import { config } from '../config';

class UpvoteClass {

    /**
     * Handle upvotes (no shit)
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
     * Send a direct message to a user after 12 hours.
     *
     * @public
     * @param {Member} upvoter
     * @memberof UpvotePathClass
     */
    public async setReminder(upvoter: Member) {
        const upvoteReminder = async () => {
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
                return channel.createMessage(embed);
            }
            catch (e) {
                console.log(e);
            }
        };

        await Reminder.add(`upvote:${upvoter.id}`, 43200000, upvoteReminder, upvoter.id);
    }

    /**
     * Send the upvote message
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
