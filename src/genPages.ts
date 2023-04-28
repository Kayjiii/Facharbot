import { Canvas, loadImage, CanvasRenderingContext2D } from "canvas"
import { Content } from "./custom"

const textMargin = 10
const imgMargin = 10
const subtitleFontSize = 25
let titleFontSize = 80
let tagFontSize = 50


export async function genTitlePage(ctx: CanvasRenderingContext2D, canvas: Canvas, imgUrl: string, content: Content) {
    
    

    ctx.font = titleFontSize + 'px Arial'
    let textWidth = ctx.measureText(content.title).width;
    let totaloffset = 50

    // If the text is wider than the canvas, reduce the font size
    if (textWidth > (canvas.width - textMargin)) {
        titleFontSize = titleFontSize * (canvas.width - textMargin) / textWidth;
        ctx.font = titleFontSize + "px Arial";
    }
        
    let textOffset = 0
    if (imgUrl != undefined) {
        const testusrImg = imgUrl
        const testimg = await loadImage(testusrImg)
        const scalefactor = (canvas.width - imgMargin * 2) / testimg.naturalWidth 
        ctx.drawImage(testimg, imgMargin, imgMargin, testimg.naturalWidth * scalefactor, testimg.naturalHeight * scalefactor)
        textOffset = testimg.naturalHeight * scalefactor + imgMargin * 2 + titleFontSize
    }
    
    totaloffset += textOffset
    ctx.fillText(content.title, textMargin, textOffset)

    let boxWidth = ((canvas.width - textMargin) / content.tags.length)
    let height = 0 
    for (let i = 0; i < content.tags.length; i++) {
        let tagText = content.tags[i].title + "\n" + content.tags[i].content
        let tempFontSize = tagFontSize
        ctx.font = tempFontSize + "px Arial"

        let textWidth = ctx.measureText(tagText).width;
        if (textWidth > boxWidth) {
            tempFontSize = tempFontSize * boxWidth / textWidth;
            ctx.font = tempFontSize + "px Arial";
            ctx.fillText(tagText, textMargin + boxWidth * i, textOffset + 100)
        }
        else {
            let delta = boxWidth - textWidth
            ctx.fillText(tagText, textMargin + boxWidth * i + delta / 2, textOffset + 100)
        }
        if (tempFontSize > height) height = tempFontSize
    }
    totaloffset += height * 3

    if(content.subtitle[0] != undefined){
        ctx.font = subtitleFontSize + "px Arial";

        let outText = ""
        let splitSubt = content.subtitle[0].split(/ +/);
        for (let i = 0; i < splitSubt.length; i++) {
            let tempText = outText + splitSubt[i] + " "
            if (ctx.measureText(tempText).width < canvas.width - textMargin * 2)
                outText = tempText
            else{
                outText += "\n"
                i--
            } 
        }
        ctx.fillText(outText, textMargin, totaloffset)
    }
    
}

export async function genImagePage(ctx:CanvasRenderingContext2D, canvas: Canvas, images: string[]) {

    let usedSpace = 0
    const imgMargin = 10
    while (images.length > 0) {2
        const testimg = await loadImage(images[0])
        const scalefactor = (canvas.width - imgMargin * 2) / testimg.naturalWidth 
        if(testimg.naturalHeight * scalefactor + usedSpace < canvas.height){
            ctx.drawImage(testimg, imgMargin, imgMargin + usedSpace, testimg.naturalWidth * scalefactor, testimg.naturalHeight * scalefactor)
            usedSpace += testimg.naturalHeight * scalefactor + imgMargin
            images.shift()
        }
        else{
            ctx.addPage()
            await genImagePage(ctx, canvas, images)
        }
    } 
}


