import * as yaml from "yaml";
import * as fs from "fs/promises";
import * as path from "path";
import { LCCItem, LCCItemData, LCCItemOutput } from "./generator";

export type Config = {
    [key: string]: LCCItemData;
};

async function main() {
    let data: Config;
    try {
        data =
            (yaml.parse(await fs.readFile(path.join(__dirname, "..", "data", "data.yml"), "utf-8"), { schema: "yaml-1.1" }) as Config) ?? undefined;
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
