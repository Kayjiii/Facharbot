import { Canvas, createCanvas, Image, loadImage } from "canvas"
import Discord, {Client, Collection, Events, Guild, ApplicationCommandDataResolvable, SlashCommandBuilder, ApplicationCommand} from "discord.js"
import fs from "fs"
import path from 'node:path'
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

    if (!message.content.startsWith(config.prefix)) {
        return;
    }
    const args = message.content.substring(config.prefix.length).split(/ +/);
    switch (args[0]) {
        case "test":
            message.channel.send("lost alter")
            break;
        
        case "makepdf":
            const textMargin = 10
            const imgMargin = 10
            let insertText = ''
            for (let index = 1; index < args.length; index++) {
                insertText += args[index] + ' ';
            } // am ende landet da ein space, plz fix
            
            const canvas = createCanvas(500, 900)
            const ctx = canvas.getContext('2d')
            
            let fontSize = 30
            //ctx.fillStyle = "white";
            //ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = '30px Impact'
            let textWidth = ctx.measureText(insertText).width;

            // If the text is wider than the canvas, reduce the font size
            if (textWidth > canvas.width) {
                fontSize = fontSize * (canvas.width - textMargin) / textWidth;
                ctx.font = fontSize + "px Arial";
            }

            if(message.attachments.toJSON()[0] != undefined){

                const testusrImg = message.attachments.toJSON()[0].url
                const testimg = await loadImage(testusrImg)
                const scalefactor = (canvas.width - imgMargin * 2) / testimg.naturalWidth 
                //testimg.width = testimg.naturalWidth * scalefactor
                //testimg.height = testimg.naturalHeight * scalefactor
                ctx.drawImage(testimg, imgMargin, imgMargin, testimg.naturalWidth * scalefactor, testimg.naturalHeight * scalefactor)
                ctx.fillText(insertText, textMargin,testimg.naturalHeight * scalefactor + imgMargin * 2 + fontSize)
            }
            else{
                ctx.fillText(insertText, textMargin, textMargin)
            }

            

            // Draw line under text
            let text = ctx.measureText(insertText)
            ctx.strokeStyle = 'rgba(0,0,0,0.5)'
            ctx.beginPath()
            ctx.lineTo(50, 102)
            ctx.lineTo(50 + text.width, 102)
            ctx.stroke()
            

            message.channel.send({content: "lol", 
            files: [{
                attachment: canvas.createPNGStream(),
                name: "sus.png"
            }]})
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