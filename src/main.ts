import { Canvas, createCanvas, Image, loadImage } from "canvas"
import Discord, {Client, Collection, Events, Guild, ApplicationCommandDataResolvable, SlashCommandBuilder, ApplicationCommand, TextChannel} from "discord.js"
import fs from "fs"
import path from 'node:path'
import { makepdf } from "./makepdf"

const config = JSON.parse(fs.readFileSync("config.json").toString())
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", 'MessageContent', Discord.GatewayIntentBits.Guilds]});

client.on("messageCreate", async (message) => {
    if (!(message.channel instanceof TextChannel)) return

    if (!message.content.startsWith(config.prefix)) {
        return;
    }
    const args = message.content.substring(config.prefix.length).split(/ +/);
    switch (args[0]) {
        case "test":
            message.channel.send("lost alter")
            break;
        
        case "makepdf":
            makepdf(args, message)
            break;
    
        default:
            break;
    }
});


client.on('rateLimit', ratelimit => {
    console.warn(`WARNING! Rate Limit reached ${(ratelimit.timeout / 1000 / 60 / 60)} h`)
})



client.login(config.token);
