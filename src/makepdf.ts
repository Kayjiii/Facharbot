import { Canvas, createCanvas, loadImage, CanvasRenderingContext2D, Image, PDFStream } from "canvas";
import { Message, TextChannel } from "discord.js";
import fs from "fs"
import { genImagePage, genTitlePage } from "./genPages";
import { Content } from "./custom";

function getContent(msg: Message){
    const config = JSON.parse(fs.readFileSync("config.json").toString())
    let outC: Content = {
        title: "",
        subtitle: [],
        imageUrls: [],
        tags: []
    }
    const args = msg.content.substring(config.prefix.length).split(/ +/);

    let mode = 0
    let numSub = 0
    for (let i = 1; i < args.length; i++) {
        let ignore = false
        if(args[i].split(":").length == 2){
            ignore = true
            let components = args[i].split(":")
            outC.tags.push({
                title: components[0],
                content: components[1]
            })
        }
        if(args[i] == config.subPrefix + "title") {mode = 1; ignore = true}
        if(args[i] == config.subPrefix + "subtitle") {mode = 2; numSub += 1; ignore = true}
        if(!ignore) {
            if(mode == 1) outC.title += args[i] + " "
            if(mode == 2) {
                if(outC.subtitle[numSub - 1] == undefined) outC.subtitle[numSub - 1] = ""
                outC.subtitle[numSub - 1] += args[i] + " " 
            }
        }
    }

    let pictures = msg.attachments.toJSON()
    for (let i = 0; i < pictures.length; i++) outC.imageUrls.push(pictures[i].url)

    return outC
}

export async function makepdf(args: string[], message: Message){
    let content = getContent(message)
    if (!(message.channel instanceof TextChannel)) return
    let insertText = ''
    for (let index = 1; index < args.length; index++) {
        insertText += args[index] + ' ';
    } // am ende landet da ein space, plz fix
    
    const canvas = createCanvas(841, 1189, 'pdf')
    const ctx = canvas.getContext('2d')
    
    await genTitlePage(ctx, canvas, content.imageUrls[0], content)
    if (content.imageUrls.length > 1) {
        content.imageUrls.shift()
        ctx.addPage()
        await genImagePage(ctx, canvas, content.imageUrls)
    }
    

    message.channel.send({
    files: [{
        attachment: canvas.createPDFStream(),
        name: "out.pdf"
    }]})
}
