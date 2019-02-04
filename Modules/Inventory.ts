import { FunctionItems, RoleItems } from './Items';
import { InventoryModel } from '../other/index';

class InventoryClass {

    /**
     * Searches DB for the inventory of the userID, creates one if none was found
     *
     * @param {string} userID
     * @returns User Inventory Document
     * @memberof InventoryClass
     */
    public async find(userID: string) {
        const userInv = await InventoryModel.findOne({ userID });

        if (userInv) {
            return userInv;
        } else {
            return await this.create(userID);
        }
    }

    /**
     * Adds itemID to userID's inventory
     *
     * @param {string} userID
     * @param {number} itemID
     * @memberof InventoryClass
     */
    public async addItem(userID: string, itemID: string) {
        const userInv = await this.find(userID);

        if ((userInv as any).items.has(itemID)) {
            return false;
        } else {
            (userInv as any).items.set(itemID, undefined);
        }

        return await userInv.save();
    }

    public async removeItem(userID: string, itemID: string) {
        const userInv = await this.find(userID);

        if (!(userInv as any).items.has(itemID)) {
            return false;
        } else {
            (userInv as any).items.delete(itemID);
        }

        return await userInv.save();
    }

    public async useItem(userID: string, itemID: string) {
        const userInv = await this.find(userID).then((i: any) => i.inventory);
    }

    /**
     * Creates a user inventory without any items
     *
     * @private
     * @param {string} userID
     * @returns User Inventory Document
     * @memberof InventoryClass
     */
    private async create(userID: string) {
        const userInv = new InventoryModel({
            userID,
            items: new Map()
        });

        return await userInv.save();
    }
}

export const Inventory = new InventoryClass();

/*
Stuff:
get inventory of a user
create inventory
add an item to a user
remove an item
use an item
*/