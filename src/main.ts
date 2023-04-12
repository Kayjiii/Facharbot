import { Canvas, createCanvas, Image, loadImage } from "canvas"
import Discord, {Client, Collection, Events, Guild, ApplicationCommandDataResolvable, SlashCommandBuilder, ApplicationCommand, TextChannel} from "discord.js"
import fs from "fs"
import path from 'node:path'
import { makepdf } from "./makepdf"

const config = JSON.parse(fs.readFileSync("config.json").toString())
const client = new Discord.Client({ intents: ["Guilds", "GuildMessages", 'MessageContent', Discord.GatewayIntentBits.Guilds]});

let currGuild: Guild
/*
interface cmdWithFunc {
    cmd: ApplicationCommand,
    func: Function   
}


const allCmds = [
    
        new SlashCommandBuilder()
            .setName("top")
            .setDescription("don't go bottom"),       
]
*/

client.once(Discord.Events.ClientReady, () => {


    currGuild = Array.from(client.guilds.cache)[0][1];
    
    //currGuild.commands.set(allCmds);
    
	console.log('bot on diggibreh');
});



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

/*
client.on(Events.InteractionCreate, async interaction => {
    
    if (!interaction.isChatInputCommand()) return;
    
    const command = currGuild.commands.cache.find(function (el) {
        return el.name == interaction.commandName
    });
    
    
    if (!command) return;

    try {
        //await interaction.command. (interaction);
        console.log("tur");
        
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
*/

client.on('rateLimit', ratelimit => {
    console.warn(`WARNING! Rate Limit reached ${(ratelimit.timeout / 1000 / 60 / 60)} h`)
})



client.login(config.token);
