import { Canvas, loadImage, CanvasRenderingContext2D } from "canvas"
import { Content } from "./custom"

export async function genTitlePage(ctx: CanvasRenderingContext2D, canvas: Canvas, imgUrl: string, content: Content) {
    
    const textMargin = 10
    const imgMargin = 10
    let titleFontSize = 80
    let tagFontSize = 50

    ctx.font = titleFontSize + 'px Arial'
    let textWidth = ctx.measureText(content.title).width;

    // If the text is wider than the canvas, reduce the font size
    if (textWidth > (canvas.width - textMargin)) {
        titleFontSize = titleFontSize * (canvas.width - textMargin) / textWidth;
        ctx.font = titleFontSize + "px Arial";
    }
        

    if(imgUrl != undefined){

        const testusrImg = imgUrl
        const testimg = await loadImage(testusrImg)
        const scalefactor = (canvas.width - imgMargin * 2) / testimg.naturalWidth 
        ctx.drawImage(testimg, imgMargin, imgMargin, testimg.naturalWidth * scalefactor, testimg.naturalHeight * scalefactor)
        let textOffset = testimg.naturalHeight * scalefactor + imgMargin * 2 + titleFontSize
        ctx.fillText(content.title, textMargin, textOffset)

        let boxWidth = ((canvas.width - textMargin) / content.tags.length)
        for (let i = 0; i < content.tags.length; i++) {
            let tagText = content.tags[i].title + "\n" + content.tags[i].content
            let tempFontSize = tagFontSize
            ctx.font = tempFontSize + "px Arial";
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
            
        }
        
    }
    else{
        ctx.fillText(content.title, textMargin, textMargin)
    }
}



