"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCCGenerator = exports.WIDTH_MAP = void 0;
exports.WIDTH_MAP = new Map();
["!", ",", ".", ":", ";", "|", "i", "'"].forEach((i) => exports.WIDTH_MAP.set(i, 2));
["l", "`"].forEach((i) => exports.WIDTH_MAP.set(i, 3));
[" ", "(", ")", "{", "}", "[", "]", "t", "I", '"', "*"].forEach((i) => exports.WIDTH_MAP.set(i, 4));
["<", ">", "f", "k", "ª", "º", "▌", "⌡", "°", "ⁿ", "²"].forEach((i) => exports.WIDTH_MAP.set(i, 5));
["@", "~", "«", "»", "≡", "≈", "√"].forEach((i) => exports.WIDTH_MAP.set(i, 6));
["░", "╢", "╖", "╣", "║", "╗", "╝", "╜", "∅", "⌠"].forEach((i) => exports.WIDTH_MAP.set(i, 7));
[
    "▒",
    "▓",
    "└",
    "┴",
    "┬",
    "├",
    "─",
    "┼",
    "╞",
    "╟",
    "╚",
    "╔",
    "╩",
    "╦",
    "╠",
    "═",
    "╬",
    "╧",
    "╨",
    "╤",
    "╥",
    "╙",
    "╘",
    "╒",
    "╓",
    "╫",
    "╪",
    "┌",
    "█",
    "▄",
    "▐",
    "▀"
].forEach((i) => exports.WIDTH_MAP.set(i, 8));
function getWidth(char) {
    return exports.WIDTH_MAP.get(char) || 6;
}
function splitLinesByWidth(text, width) {
    const lines = [];
    let line = "";
    let lineLength = 0;
    for (const word of text.split(" ")) {
        const wordLength = word.split("").reduce((a, b) => a + getWidth(b), 0);
        if (lineLength + wordLength > width) {
            lines.push(line);
            line = word;
            lineLength = wordLength;
        }
        else {
            line += " " + word;
            lineLength += wordLength + 1;
        }
    }
    lines.push(line);
    return lines;
}
class LCCGenerator {
    data;
    constructor(data) {
        this.data = data;
    }
    generate() {
        return {
            Lore: this.generateLoreLines(),
        };
    }
    generateLoreLines() {
        const lines = [];
        lines.push("<dark_gray><st><bold>                                           </bold></st>");
        if (this.data.abilities) {
            for (const ability of this.data.abilities) {
                lines.push("");
                let topLine = `<#1378f2>${ability.trigger}`;
                if (ability.cooldown || ability.energy || ability.durability || ability.health) {
                    topLine += " <dark_gray>|";
                    if (ability.cooldown) {
                        topLine += ` <#f28313>${ability.cooldown}s Cooldown`;
                    }
                    if (ability.energy) {
                        topLine += ` <dark_gray>| <red>-${ability.energy}<aqua>⚡`;
                    }
                    if (ability.durability) {
                        topLine += ` <dark_gray>| <red>-${ability.durability} Dur`;
                    }
                    if (ability.health) {
                        topLine += `${ability.health} HP`;
                    }
                }
                lines.push(topLine);
                if (ability.conditions) {
                    for (const condition of ability.conditions) {
                        lines.push(` <bold><dark_gray>| <#b31e14>[!]</bold> <gray>${condition}`);
                    }
                }
                const uncolored = `└ ${ability.name} ➤ ${ability.description}`;
                const descriptionLines = splitLinesByWidth(uncolored, 176);
                lines.push(descriptionLines[0].replace(`└ ${ability.name} ➤ `, `<dark_gray>└ <bold><gold>${ability.name}</bold> <dark_gray>➤ <gray>`));
                for (const line of descriptionLines.slice(1)) {
                    lines.push("<gray>   " + line);
                }
            }
        }
        if (this.data.effects) {
            lines.push("");
            lines.push("<dark_gray><st><bold>                </bold></st>[ &9&7Effects<dark_gray> ]<dark_gray><st><bold>                </bold></st>");
            let line = "";
            for (const [key, attr] of Object.entries(this.data.effects)) {
                const color = attr.value > 0 ? "<green>" : "<red>";
                const prefix = attr.value > 0 ? "+" : "";
                let suffix;
                switch (attr.type) {
                    case "add_flat":
                        suffix = "";
                        break;
                    case "add_percent":
                        suffix = "%";
                        break;
                    case "mul":
                        suffix = "x";
                        break;
                }
                const number = color + prefix + attr.value + suffix;
                switch (key) {
                    case "health":
                        line += `  ${color}${number}<red>❤`;
                        break;
                    case "speed":
                        line += `  ${color}${number}<white>👟`;
                        break;
                    case "energy":
                        line += `  ${color}${number}<aqua>⚡`;
                        break;
                    case "attack":
                        line += `  ${color}${number}<white>⚔`;
                        break;
                    case "luck":
                        line += `  ${color}${number}<white>🍀`;
                        break;
                    case "armor":
                        line += `  ${color}${number}<white>🛡`;
                        break;
                    default:
                        console.log(`Unknown effect: ${key}`);
                }
            }
            lines.push(line);
        }
        if (this.data.flavortext) {
            lines.push("");
            lines.push("<dark_gray><st><bold>                                           </bold></st>");
            lines.push(`${splitLinesByWidth(this.data.flavortext, 176)
                .map((i) => "<dark_gray>" + i)
                .join("\n")}`);
        }
        if (this.data.tier) {
            lines.push("");
            switch (this.data.tier) {
                case "admin":
                    lines.push("<dark_gray><st><bold>                </bold></st>[ <bold><gradient:#3876fc:#38a4fc:#3876fc>ADMIN</gradient></bold><dark_gray> ]<dark_gray><st><bold>                </bold></st>");
                    break;
                case "utility":
                    lines.push("<dark_gray><st><bold>               </bold></st>[ &9<bold>&7UTILITY</bold><dark_gray> ]<dark_gray><st><bold>               </bold></st>");
                    break;
                case "cursed":
                    lines.push("<dark_gray><st><bold>               </bold></st>[ &9<bold><gradient:#d1040e:#990007:#d1040e>CURSED</gradient></bold><dark_gray> ]<dark_gray><st><bold>               </bold></st>");
                    break;
                case "event":
                    lines.push("<dark_gray><st><bold>                </bold></st>[ &9<bold><gradient:#c302d1:#632fbd:#c302d1>EVENT</gradient></bold><dark_gray> ]<dark_gray><st><bold>                </bold></st>");
                    break;
                case "decoration":
                    lines.push("<dark_gray><st><bold>             </bold></st>[ <#fccb38><bold>DECORATION</bold> <dark_gray>]<dark_gray><st><bold>             </bold></st>");
                    break;
                case "cosmetic":
                    lines.push("<dark_gray><st><bold>              </bold></st>[ <#fccb38><bold>COSMETIC</bold> <dark_gray>]<dark_gray><st><bold>              </bold></st>");
                    break;
                case "mythical":
                    lines.push("<dark_gray><st><bold>              </bold></st>[ &9<bold><gradient:#3876fc:#6a08fc>MYTHICAL</gradient></bold><dark_gray> ]<dark_gray><st><bold>              </bold></st>");
                    break;
                case "legendary":
                    lines.push("<dark_gray><st><bold>             </bold></st>[ &9<bold><gradient:#4ccf19:#04b553:#4ccf19>LEGENDARY</gradient></bold><dark_gray> ]<dark_gray><st><bold>             </bold></st>");
                    break;
                case "uncommon":
                    lines.push("<dark_gray><st><bold>              </bold></st>[ &9<bold><gradient:#a900d4:#a60365:#a900d4>UNCOMMON</gradient></bold><dark_gray> ]<dark_gray><st><bold>              </bold></st>");
                    break;
                case "basic":
                    lines.push("<dark_gray><st><bold>                </bold></st>[ &9<bold>&fBASIC</bold><dark_gray> ]<dark_gray><st><bold>                </bold></st>");
                    break;
                case "consumable":
                    lines.push("<dark_gray><st><bold>             </bold></st>[ &9<bold>&6CONSUMABLE</bold><dark_gray> ]<dark_gray><st><bold>             </bold></st>");
                    break;
                default:
                    lines.push(`Unknown tier ${this.data.tier}!`);
            }
        }
        return lines.join("\n").split("\n");
    }
}
exports.LCCGenerator = LCCGenerator;
