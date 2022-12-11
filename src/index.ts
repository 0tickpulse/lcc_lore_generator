import * as yaml from "yaml";
import * as fs from "fs/promises";
import * as path from "path";
import { LCCItem, LCCItemOutput } from "./generator";

export interface LCCAbility {
    /**
     * The name of the ability.
     */
    name: string;
    /**
     * When it should be triggered.
     */
    trigger: string;
    /**
     * The cooldown of the ability, in seconds.
     */
    cooldown?: number;
    /**
     * Any conditions that must be met for the ability to be triggered.
     */
    conditions?: string[];
    /**
     * The amount of energy the ability costs.
     */
    energy?: number;
    /**
     * The amount of health the ability costs.
     */
    health?: number;
    /**
     * The amount of durability the ability costs.
     */
    durability?: number;
    /**
     * The description of the ability.
     */
    description: string;
}

export interface LCCItemData {
    /**
     * Any abilities this item has.
     */
    abilities?: LCCAbility[];
    /**
     * Any effects this item has. These are attributes for the items.
     */
    effects?: {
        /**
         * The amount of health this item provides.
         */
        health?: number;
        /**
         * The amount of movement speed this item provides. Multiplicative.
         */
        speed?: number;
        /**
         * The amount of energy this item provides.
         */
        energy?: number;
        /**
         * The amount of attack this item provides.
         */
        attack?: number;
        /**
         * The amount of armor this item provides. Multiplicative.
         */
        armor?: number;
        /**
         * The amount of luck this item provides.
         */
        luck?: number;
    };
    /**
     * Any additional text that should be displayed on the item.
     */
    flavortext?: string;
    /**
     * The tier of the item.
     */
    tier: "admin" | "utility" | "cursed" | "event" | "decoration" | "cosmetic" | "mythical" | "legendary" | "uncommon" | "basic" | "consumable";
}



export type Config = {
    [key: string]: LCCItemData;
};

async function main() {
    let data: Config;
    try {
        data = yaml.parse(await fs.readFile(path.join(__dirname, "..", "data", "data.yml"), "utf-8"), { schema: "yaml-1.1"}) as Config ?? undefined;
    } catch (e) {
        console.log(`Error while scanning: ${e}`);
        return;
    }
    if (!data) {
        console.log("No data found.");
        return;
    }
    console.log("Cleaning output...");
    await fs.rm(path.join(__dirname, "..", "output"), { recursive: true, force: true });
    console.log("Output cleaned.");
    console.log("Generating items...");

    const output: { [key: string]: LCCItemOutput } = {};
    for (const [key, value] of Object.entries(data)) {
        console.log(`Writing item ${key}...`);
        const item = new LCCItem(value);
        output[key] = item.generate();
    }
    // create output/items.yml
    console.log("Items generated.");
    console.log("Writing items to file...");
    await fs.mkdir(path.join(__dirname, "..", "output"));
    await fs.writeFile(path.join(__dirname, "..", "output", "items.yml"), yaml.stringify(output, { lineWidth: 1000 }));
    console.log("Items written to file.");
    console.log(`Process complete. Total time elapsed: ${Math.round(process.uptime() * 1000)}ms`);
}

main();
