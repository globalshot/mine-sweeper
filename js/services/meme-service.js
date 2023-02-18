
var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2} 
 
var gImgs = [
    {id: 1, url: 'img/1.jpg', keywords: ['trump']},
    {id: 2, url: 'img/2.jpg', keywords: ['love', 'dog']},
    {id: 3, url: 'img/3.jpg', keywords: ['funny', 'cat']},
    {id: 4, url: 'img/4.jpg', keywords: ['funny', 'cat']},
    {id: 5, url: 'img/5.jpg', keywords: ['funny', 'cat']},
    {id: 6, url: 'img/6.jpg', keywords: ['funny', 'cat']},
    {id: 7, url: 'img/7.jpg', keywords: ['funny', 'cat']},
    {id: 8, url: 'img/8.jpg', keywords: ['funny', 'cat']},
    {id: 9, url: 'img/9.jpg', keywords: ['funny', 'cat']},
    {id: 10, url: 'img/10.jpg', keywords: ['funny', 'cat']},
    {id: 11, url: 'img/11.jpg', keywords: ['funny', 'cat']},
    {id: 12, url: 'img/12.jpg', keywords: ['funny', 'cat']},
    {id: 13, url: 'img/13.jpg', keywords: ['funny', 'cat']},
    {id: 14, url: 'img/14.jpg', keywords: ['funny', 'cat']},
    {id: 15, url: 'img/15.jpg', keywords: ['funny', 'cat']},
    {id: 16, url: 'img/16.jpg', keywords: ['funny', 'cat']},
    {id: 17, url: 'img/17.jpg', keywords: ['funny', 'cat']},
    {id: 18, url: 'img/18.jpg', keywords: ['funny', 'cat']},
]; 
var gMeme = { 
    selectedImgId: 1, //can be updated without the
    selectedLineIdx: 0, 
    lines: [ 
            { 
                txt: '', 
                size: 20, 
                align: 'left', 
                color: '#000000',
                lineY: 35,
                lineX: 30,
                rotate: 0,
            },
            { 
                txt: '', 
                size: 20, 
                align: 'left', 
                color: '#000000',
                lineY: 350,
                lineX: 30,
                rotate: 0,
            },
    ] 
}

function getImages() {
    return gImgs.slice()
}


function getCurrImg() {
    //i guess i gotta add there if, if the image uploaded, then something else do
    return  `img/${gMeme.selectedImgId}.jpg`
    // return gMeme.selectedImgId
}

function setLineTxt(text) {
    // gMeme[gMeme.selectedLineIdx].txt = text
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}


function getLineTxt(num = gMeme.selectedLineIdx) {
    return gMeme.lines[num].txt
}

function getTxtColor(num = gMeme.selectedLineIdx) {
    return gMeme.lines[num].color
}

//meme controller line 260
// function getAngle(idx = gMeme.selectedLineIdx) {//?
//     return gMeme.lines[idx].rotate
// }

// function setAngle(value) {
//     gMeme.lines[gMeme.selectedLineIdx].rotate = value//?
// }

function setLineColor(value) {
    gMeme.lines[gMeme.selectedLineIdx].color = value
    onChangeSetting()
}

function getLineSize(num = gMeme.selectedLineIdx) {
    return gMeme.lines[num].size
}

function getLineY(idx = gMeme.selectedLineIdx){
    return gMeme.lines[idx].lineY
}

function getLineX(idx = gMeme.selectedLineIdx){
    return gMeme.lines[idx].lineX
}

function onImgSelect(id) {
    gMeme.selectedImgId = id
    gMeme.selectedLineIdx = 0
    renderMeme()
    toggleGallery()
}

function changeSize(num) {
    num === 1? gMeme.lines[gMeme.selectedLineIdx].size++ : gMeme.lines[gMeme.selectedLineIdx].size--
    onChangeSetting()
    return
}

function changeAlignment(side) {
    gMeme.lines[gMeme.selectedLineIdx].align = side
    onChangeSetting()
}

// function changeAlignment(side) {
//     const line = gMeme.lines[gMeme.selectedLineIdx]
//     line.align = side;
  
//     const lineSize = gCtxText.measureText(line.txt).width
//     const canvasWidth = gElCanvasText.width
//     switch (line.align) {
//         case 'left':
//             line.x = line.lineX;
//             break;
//         case 'center':
//             line.x = (canvasWidth / 2) - (lineSize / 2);
//             break;
//         case 'right':
//             line.x = canvasWidth - lineSize - 10;
//             break;
//         default:
//             break;
//     }

//     onChangeSetting();
// }

function getTextAlignment(idx = gMeme.selectedLineIdx) {
    return gMeme.lines[idx].align
}

function nextLine(){
    gMeme.selectedLineIdx+1 >= gMeme.lines.length? gMeme.selectedLineIdx=0 : gMeme.selectedLineIdx++
    document.getElementById('text-line').value = gMeme.lines[gMeme.selectedLineIdx].txt
    showOtherLines(gMeme.selectedLineIdx)
    onChangeSetting()
}//i gotta make it render all the lines. and in the x y they were at

function gMemeLength() {
    return gMeme.lines.length
}

function changeY(num) {
    num === 1? gMeme.lines[gMeme.selectedLineIdx].lineY += 5 : gMeme.lines[gMeme.selectedLineIdx].lineY -= 5
    onChangeSetting()
}

function changeX(num) {
    num === 1? gMeme.lines[gMeme.selectedLineIdx].lineX += 5 : gMeme.lines[gMeme.selectedLineIdx].lineX -= 5
    onChangeSetting()
}

function makeNewLine() {
    let newLine = { 
        txt: 'new line', 
        size: 20, 
        align: 'left', 
        color: '#000000',
        lineY: 150,
        lineX: 30
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    showOtherLines(gMeme.selectedLineIdx)
    
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
}