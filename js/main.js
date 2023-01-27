

const FLAG = '🚩'
const BOMB = '💣'
const UNCLICKED = '?'
const HAPPY = '😄'
const SAD = '💀'
const WINNER = '🤗'

var gBoard
var gLevel = {
    SIZE: 4,
    Mines: 2,
    Flags: 2,
    SafeCells: 14//size*size-mines
}
var gGame = {
    isOn: false,
    shownCount: 0,
    marketCount: 0,
    secPassed: 0,
    lives: 3,
    correct: 0,
    done: false,
    hints: 3,
    safeClicks: 3
}
var gManual = {
    placing: false,//like 97, 29, 234
    bombs: 0
}

var gHint = false
var gUndo = []//need save the board, the gGame, the lives and flags
var gTimer
var gTime = 0

function onInit() {
    gBoard = buildBoard()
    showLives()
    showFlags()
    showSafe()
    showHints()
    renderBoard(gBoard, '.board')
}

function buildBoard() {//first we check i made a board
    var board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false //for now false
            }
        }
    }
    return board
}
function renderBoard(mat, selector) {// the selector is where do i place this matrix
    //render the board as table
    var strHTML = ''
    for (let i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < gLevel.SIZE; j++) {

            var cell = UNCLICKED
            // var className = `cell cell-${i}-${j}`
            var strDataAttrib = `data-i="${i}" data-j="${j}"`
            strHTML += `<td ${strDataAttrib} onmousedown="clicked(event, this)">${cell}</td>`// isng just data for i and j
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector(selector)
    elBoard.innerHTML = strHTML
}


function setMinesNegsCount(mat, rowIdx, colIdx) {
    //counts mines around each cell and sets the cell minesAroundCount
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gLevel.SIZE) continue
            if (mat[i][j].isMine === true) {
                count++
            }
        }
    }
    return count
}
function clicked(ev, elCell) {//change the name of the function
    // right click is which = 3
    // left click is which = 1
    if (gGame.done === true) {
        return
    }
    if (gManual.placing === true) {//make true/false about manual placing, so it wont start opening them
        clickBombPlace(elCell)
        return
    }
    if (gHint === true && gGame.isOn === true) {
        var elBtn = document.querySelector(".hints")
        elBtn.classList.remove("using")
        gGame.hints--
        showAround(elCell)
        return
    }
    switch (ev.which) {
        case 3:
            OnCellMarked(elCell)
            break
        case 1:
            onCellClicked(elCell)
            break
        default:
            break
    }
}
function clickBombPlace(elCell) {
    var iIdx = +elCell.dataset.i
    var jIdx = +elCell.dataset.j
    var cell = gBoard[iIdx][jIdx]
    if (cell.isMine === true) {
        return
    }
    cell.isMine = true
    gManual.bombs++
    if (gManual.bombs === gLevel.Mines) {
        gManual.placing = false
        var elBtn = document.querySelector(".manual")
        elBtn.classList.remove("using")
        alert('you have placed all the bombs')
        setCellNumber()
        gManual.bombs = 0
        gGame.isOn = true
    }
}


function onCellClicked(elCell) {
    var iIdx = +elCell.dataset.i
    var jIdx = +elCell.dataset.j
    if (gGame.isOn === false) {

        for (var i = 0; i < gLevel.Mines; i) {//generate bombs at random places
            var iBomb = getRandomInt(0, gLevel.SIZE - 1)
            var jBomb = getRandomInt(0, gLevel.SIZE - 1)
            var cell = gBoard[iBomb][jBomb]
            if (!cell.isMine && /*cell.isShown === false &&*/ cell !== gBoard[iIdx][jIdx]) {
                cell.isMine = true
                i++
            }
        }
        setCellNumber()
        gGame.isOn = true
        gBoard[iIdx][jIdx].isShown = true
        elCell.innerHTML = gBoard[iIdx][jIdx].minesAroundCount
        elCell.classList.add('opened')
        gGame.correct++
        if (gBoard[iIdx][jIdx].minesAroundCount === 0) openAroundCells(iIdx, jIdx)
        gTimer = setInterval(() => { setTime() }, 1000)
        //gUndo.push(addToUndo())
        return
    }
    if (gBoard[iIdx][jIdx].isShown || gBoard[iIdx][jIdx].isMarked) {
        return
    }
    if (gBoard[iIdx][jIdx].isMine === false) {
        elCell.innerHTML = gBoard[iIdx][jIdx].minesAroundCount
        gGame.correct++
        var emoji = document.querySelector('div.alive_or_dead h2')
        emoji.innerHTML = HAPPY
        gBoard[iIdx][jIdx].isShown = true
        elCell.classList.add('opened')
        if (gBoard[iIdx][jIdx].minesAroundCount === 0) {
            openAroundCells(iIdx, jIdx)
        }
    }
    else {
        elCell.innerHTML = `${BOMB}`
        gGame.lives--
        gLevel.Flags--
        gBoard[iIdx][jIdx].isShown = true
        showLives()
        showFlags()
        var emoji = document.querySelector('div.alive_or_dead h2')
        emoji.innerHTML = SAD
        //check if game over
    }
    //gUndo.push(addToUndo())
    checkGameOver()
}
function showAround(elCell) {//show cells after clicking hint
    showHints()
    gHint = false
    var iIdx = +elCell.dataset.i
    var jIdx = +elCell.dataset.j
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue//left/right side not out of bounds
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue//top/bot side not out of bounds
            if (gBoard[i][j].isShown === true) continue
            var selectorStr = `[data-i="${i}"][data-j="${j}"]`
            var elPos = document.querySelector(selectorStr)
            if (gBoard[i][j].isMine === true) {
                elPos.innerHTML = BOMB
            }
            else {
                elPos.innerHTML = gBoard[i][j].minesAroundCount
            }
        }
    }
    setTimeout(() => { closeAround(elCell) }, 1000)
}
function closeAround(elCell) {//closes cells after the hint
    var iIdx = +elCell.dataset.i
    var jIdx = +elCell.dataset.j
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue//left/right side not out of bounds
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (j < 0 || j >= gLevel.SIZE) continue//top/bot side not out of bounds
            if (gBoard[i][j].isShown === true) continue
            var selectorStr = `[data-i="${i}"][data-j="${j}"]`
            var elPos = document.querySelector(selectorStr)
            elPos.innerHTML = UNCLICKED
        }
    }
}
function openAroundCells(iIdx, jIdx) {//the original open around, for the 3x3
    iIdx = +iIdx
    jIdx = +jIdx
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue//left/right side not out of bounds
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i === iIdx && j === jIdx) continue//doesnt check himself
            if (j < 0 || j >= gLevel.SIZE) continue//top/bot side not out of bounds
            // if (gBoard[i][j].isMine === true || gBoard[i][j].isShown === true) continue
            if (gBoard[i][j].isMine === true) continue
            if (gBoard[i][j].isShown === true) continue
            if (gBoard[i][j].isMarked === true) continue
            var selectorStr = `[data-i="${i}"][data-j="${j}"]`
            var elCell = document.querySelector(selectorStr)
            elCell.innerHTML = gBoard[i][j].minesAroundCount
            gBoard[i][j].isShown = true
            elCell.classList.add('opened')
            // debugger
            gGame.correct++
            if (gBoard[i][j].minesAroundCount === 0) {
                openAroundCells(i, j)
            }
        }
    }
    return
    //i will need to find the problem, cause i have no idea why, like
    //i do, first cell counted too, but thats pain
}
function setCellNumber() {
    for (var i = 0; i < gLevel.SIZE; i++) {//sets cell number
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!gBoard[i][j].isMine) {
                var bombsCount = setMinesNegsCount(gBoard, i, j)
                gBoard[i][j].minesAroundCount = bombsCount
            }
        }
    }
}


function showLives() {
    var elSpan = document.querySelector('div h2 span.lives_left')
    elSpan.innerHTML = `${gGame.lives} lives left`
}
function showFlags() {
    var elSpan = document.querySelector('div h2 span.flags_left')
    elSpan.innerHTML = `flags left: ${gLevel.Flags}`
}
function showHints() {
    var elBtn = document.querySelector('button.hints')
    elBtn.innerText = `hints: ${gGame.hints}`
}
function showSafe() {
    var elBtn = document.querySelector('button.safe')
    elBtn.innerText = `safe clicks: ${gGame.safeClicks}`
}
function setTime() {
    if (gGame.isOn === true) gTime++
    var elH2 = document.querySelector('div.timer h2')
    elH2.innerHTML = `${gTime} seconds`

}


function manualPlace(elBtn) {
    if (gManual.placing === true) {
        elBtn.classList.remove("using")
        gManual.placing = false
    }
    else {
        elBtn.classList.add("using")
        gManual.placing = true
    }
    newGame()

}
function OnCellMarked(elCell) {
    var jIdx = elCell.dataset.j
    var iIdx = elCell.dataset.i
    var cellPos = gBoard[iIdx][jIdx]
    if (cellPos.isShown === true) {//if its opened
        return
    }
    if (cellPos.isMarked) {//if already flaged
        cellPos.isMarked = false
        gLevel.Flags++
        elCell.innerHTML = UNCLICKED
        showFlags()
        return
    }
    if (gLevel.Flags === 0) {//left flags
        return
    }
    gLevel.Flags--
    cellPos.isMarked = true
    elCell.innerHTML = `${FLAG}`
    showFlags()
    checkGameOver()
}
function checkGameOver() {
    if (gGame.correct === gLevel.SafeCells && gLevel.Flags === 0) {//found all correct cells
        gGame.done = true
        win()
    }
    if (gGame.lives === 0) {//no lives left
        gGame.done = true
        lose()
    }
}



function win() {//TODO you still need stop the time interval
    //have to make it
    var emoji = document.querySelector('div.alive_or_dead h2')
    emoji.innerHTML = WINNER
    clearInterval(gTimer)
    alert('win')
}
function lose() {
    //gotta make it
    clearInterval(gTimer)
    alert('lose')
}


function hint(elBtn) {
    if (gGame.hints > 0&&gGame.isOn) {
        elBtn.classList.add("using")
        gHint = true
    }
}
function safeClick() {//while loop, random i and j, check if cell bomb or opened, timer of 1 sec to show
    if (gGame.isOn === false) return
    if (gGame.safeClicks <= 0) {
        return
    }
    if (gGame.correct === gLevel.SafeCells) {
        alert('cant show, because only bombs left')
        return
    }
    gGame.safeClicks--
    showSafe()
    while (true) {
        var i = getRandomInt(0, gLevel.SIZE - 1)
        var j = getRandomInt(0, gLevel.SIZE - 1)
        var cell = gBoard[i][j]
        if (cell.isMine === false && cell.isShown === false && cell.isMarked === false) {
            var selectorStr = `[data-i="${i}"][data-j="${j}"]`
            var elCell = document.querySelector(selectorStr)
            elCell.innerHTML = gBoard[i][j].minesAroundCount
            elCell.classList.add("safe_hint")
            //TODO if the player clciks it, cancel the timeout, and just mark as opened
            setTimeout(() => { hideAgain(elCell, i, j) }, 2000)
            return
        }
    }
}
function hideAgain(elCell, i, j) {
    if (gBoard[i][j].isShown === false) {
        elCell.innerHTML = UNCLICKED
    }
    elCell.classList.remove("safe_hint")
}
function newGame() {
    //restarting gGame
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.marketCount = 0
    gGame.secPassed = 0
    gGame.lives = 3
    gGame.correct = 0
    gGame.done = false
    gBoard = []
    gGame.hints = 3
    gGame.safeClicks = 3

    gManual.bombs=0
    gHint = false
    gLevel.Flags = gLevel.Mines
    clearInterval(gTimer)
    gTimer = 0
    gTime = 0
    setTime()
    var emoji = document.querySelector('div.alive_or_dead h2')
    emoji.innerHTML = HAPPY
    onInit()
}
function changeDiff(num) {
    switch (num) {
        case 1:
            //easy diff 4*4 ,2 mines
            gLevel.SIZE = 4,
            gLevel.Mines = 2,//2
            gLevel.Flags = 2,
            gLevel.SafeCells = 14
            newGame()
            break
        case 2:
            //medium diff 8*8, 14 mines
            gLevel.SIZE = 8,
            gLevel.Mines = 14,
            gLevel.Flags = 14,
            gLevel.SafeCells = 8 * 8 - 14
            newGame()
            break
        case 3:
            //hard diff 12*12, 32 mines
            gLevel.SIZE = 12,
            gLevel.Mines = 32,
            gLevel.Flags = 32,
            gLevel.SafeCells = 12 * 12 - 32
            newGame()
            break
        default:
            break
    }
}





//cant finish UNDO
//
function UNDO() {
    if (gUndo.length === 0) {
        alert('there no step back')
        return
    }
    var stageBack = gUndo.pop()
    gGame = stageBack.gGame
    gBoard = stageBack.gBoard
    gLevel = stageBack.gLevel
    renderBoard(gBoard, '.board')
}
//undo need
function addToUndo() {
    var infoSave = {
        gGame: gGame,
        gBoard: gBoard,
        gLevel: gLevel
    }
    return infoSave
}