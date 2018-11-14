import { Message } from "eris";
import { ReminderModel } from "../other";

export interface MoustacheReminder {
    id: string;
    userID?: string;
    triggerTime: number;
    timeout: any; // Actually Timeout, but that type doesn't seem to exist...
    execute: (msg?: Message, args?: string[]) => void;
}

class ReminderClass {
    reminderCache: Map<string, MoustacheReminder>;

    constructor() {
        this.reminderCache = new Map();

        this.init();
    }

    /**
     * Initialises the reminder cache by looking for an already saved cache and setting all stored timeouts again.
     *
     * @private
     * @returns {void}
     * @memberof ReminderClass
     */
    private async init() {
        const savedCache = await ReminderModel.findOne({ id: 1 });
        const currentTime = new Date().getMilliseconds();
        this.reminderCache = (savedCache as any).cache;

        if (!savedCache) {
            return console.log('[reminder] No saved reminder cache found!');
        }

        this.reminderCache.forEach((value) => {
            const delay = value.triggerTime - currentTime;
            const timeout = setTimeout(async () => {
                value.execute();

                await this.removeAfterTimeout(value.id);
            }, delay);

            value.timeout = timeout;

            console.log(`[reminder] Set cached reminder ${value.id}`);
        });

        return console.log('[reminder] All cached reminders are set again.');
    }

    /**
     * Adds a reminder. Doesn't work if there is already a reminder with the given ID.
     *
     * @param {string} id ID of the reminder
     * @param {number} delay The amount of time to wait until execute gets triggered (in ms)
     * @param {() => void} execute Function to execute after the delay
     * @param {string} [userID] Associate a userID to the reminder
     * @returns {boolean} True if successfully added, false if there already is a reminder with the same ID.
     * @memberof ReminderClass
     */
    public async add(id: string, delay: number, execute: () => void, userID?: string) {
        // Don't set multiple reminders with the same ID
        if (this.reminderCache.has(id)) {
            return false;
        }

        const currentTime: number = new Date().getMilliseconds();

        // setTimeout using execute and delay
        const timeout = setTimeout(async () => {
            execute();

            await this.removeAfterTimeout(id);
        }, delay);

        // construct the reminder object
        const reminder: MoustacheReminder = {
            id: id,
            userID: userID,
            triggerTime: currentTime + delay,
            timeout: timeout,
            execute: execute
        };

        // add reminder to this.reminderCache
        await this.reminderCache.set(id, reminder);

        // update DB
        await this.save();

        console.log(`[reminder] Set reminder ${id}`);
        return true;
    }

    /**
     * Manually remove a reminder.
     *
     * @param {string} id ID of the reminder
     * @returns {boolean | null} True if successfully removed, null if the reminder wasn't found 
     * @memberof ReminderClass
     */
    public async remove(id: string) {
        const reminder = this.reminderCache.get(id);

        if (!reminder) {
            return null;
        }

        clearTimeout(reminder.timeout);

        await this.reminderCache.delete(id);

        await this.save();
        
        return true;
    }

    /**
     * Called by a reminder to remove itself from the cache.
     *
     * @private
     * @param {string} id ID of the reminder
     * @memberof ReminderClass
     */
    private async removeAfterTimeout(id: string) {
        // Interval was already cleared at this point
        // delete from cache
        await this.reminderCache.delete(id);

        // update DB
        await this.save();
    }

    /**
     * Remove all reminders that are associated with the given userID.
     *
     * @param {string} userID
     * @memberof ReminderClass
     */
    public async removeAll(userID: string) {
        this.reminderCache.forEach((value) => {
            if (value.userID === userID) {
                this.remove(value.id);
            }
        })
    }

    /**
     * Saves the cache to the DB.
     *
     * @private
     * @memberof ReminderClass
     */
    private async save() {
        await ReminderModel.update({ id: 1 }, { cache: this.reminderCache }, (err) => {
            console.log(err);
        });
    }
}

/* Commands TBA:
    - reminder optout (also deletes all set reminders)
    - reminder optin
    - Updated reminder add
    - Updated reminder upvote
    - reminder remove
*/