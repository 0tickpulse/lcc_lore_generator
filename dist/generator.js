"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LCCItem = exports.WIDTH_MAP = void 0;
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
    for (const char of text) {
        const charWidth = getWidth(char);
        if (lineLength + charWidth > width) {
            lines.push(line);
            line = "";
            lineLength = 0;
        }
        line += char;
        lineLength += charWidth;
    }
    lines.push(line);
    return lines;
}
class LCCItem {
    data;
    constructor(data) {
        this.data = data;
    }
    generate() {
        return {
            Lore: this.generateLoreLines(),
            Attributes: this.generateAttributes()
        };
    }
    generateAttributes() {
        const effects = this.data.effects;
        if (!effects) {
            return {};
        }
        const attributes = {};
        if (effects.health) {
            attributes.Health = effects.health;
        }
        if (effects.attack) {
            attributes.Damage = effects.attack;
        }
        if (effects.armor) {
            attributes.Armor = effects.armor;
        }
        if (effects.speed) {
            attributes.MovementSpeed = effects.speed - 1;
        }
        return attributes;
    }
    generateLoreLines() {
        const lines = [];
        lines.push("<gray><st><bold>                                           </bold></st>");
        if (this.data.abilities) {
            lines.push("");
            for (const ability of this.data.abilities) {
                let topLine = `${ability.trigger}`;
                if (ability.cooldown || ability.energy || ability.durability || ability.health) {
                    topLine += " <dark_gray>|";
                    if (ability.cooldown) {
                        topLine += ` <#f28313>${ability.cooldown}s Cooldown`;
                    }
                    if (ability.energy) {
                        topLine += ` <dark_gray>| <red>-${ability.energy}<light_blue>⚡`;
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
                        lines.push(` <bold><dark_gray>| <#b31e14>[!]</bold> ${condition}`);
                    }
                }
                lines.push(`<dark_gray>└ <bold><gold>${ability.name}</bold> <dark_gray>➤ <gray>${ability.description}`);
            }
        }
        if (this.data.effects) {
            lines.push("");
            lines.push("<dark_gray><st><bold>                </bold></st>[ &9&7Effects<dark_gray> ]<dark_gray><st><bold>                </bold></st>");
            let line = "";
            for (const [key, value] of Object.entries(this.data.effects)) {
                const color = value > 0 ? "<green>" : "<red>";
                const plus = value > 0 ? "+" : "";
                switch (key) {
                    case "health":
                        line += `  ${color}${plus}${value}<red>❤`;
                        break;
                    case "speed":
                        line += `  ${color}x${value}<white>👟`;
                        break;
                    case "energy":
                        line += `  ${color}${plus}${value}<aqua>⚡`;
                        break;
                    case "attack":
                        line += `  ${color}x${value}<white>⚔`;
                        break;
                    case "luck":
                        line += `  ${color}${plus}${value}<white>🍀`;
                        break;
                    case "armor":
                        line += `  ${color}x${value}<white>🛡`;
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
exports.LCCItem = LCCItem;
