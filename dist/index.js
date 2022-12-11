"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = __importStar(require("yaml"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const generator_1 = require("./generator");
async function main() {
    let data;
    try {
        data =
            yaml.parse(await fs.readFile(path.join(__dirname, "..", "data", "data.yml"), "utf-8"), { schema: "yaml-1.1" }) ?? undefined;
    }
    catch (e) {
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
    const output = {};
    for (const [key, value] of Object.entries(data)) {
        console.log(`Writing item ${key}...`);
        const item = new generator_1.LCCGenerator(value);
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
