

const FLAG = '🚩'//
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
    correct: 0
}

function onInit() {
    gBoard = buildBoard()
    showLives()
    renderBoard(gBoard, '.board')
    console.log(gBoard)
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
            strHTML += `<td ${strDataAttrib} onmousedown="nameItSomehow(event, this)">${cell}</td>`// isng just data for i and j
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
function nameItSomehow(ev, elCell) {
    // console.log(ev.which);
    // right click is which = 3
    // left click is which = 1
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
function showLives() {
    var elDiv = document.querySelector('div.lives_left h2 span')
    elDiv.innerHTML = `${gGame.lives} lives left`
}
//used to be function onCellClicked(elCell, iIdx, jIdx)
function onCellClicked(elCell) {
    // console.log(elCell);
    // console.log(i, j);
    var iIdx = +elCell.dataset.i
    var jIdx = +elCell.dataset.j
    if (gGame.isOn === false) {

        for (var i = 0; i < gLevel.Mines; i) {//generate bombs at random places
            var iBomb = getRandomInt(0, gLevel.SIZE - 1)
            var jBomb = getRandomInt(0, gLevel.SIZE - 1)
            var cell = gBoard[iBomb][jBomb]
            if (!cell.isMine && /*cell.isShown === false &&*/ cell !== gBoard[iIdx][jIdx]) {
                cell.isMine = true
                // console.log(iBomb, jBomb)
                i++
            }
        }
        for (var i = 0; i < gLevel.SIZE; i++) {
            for (var j = 0; j < gLevel.SIZE; j++) {
                if (!gBoard[i][j].isMine) {
                    var bombsCount = setMinesNegsCount(gBoard, i, j)
                    gBoard[i][j].minesAroundCount = bombsCount
                    // console.log(bombsCount);
                }
            }
            gGame.isOn = true
        }
        gBoard[iIdx][jIdx].isShown = true
        elCell.innerHTML = gBoard[iIdx][jIdx].minesAroundCount
        // console.log(gBoard[iIdx][jIdx]);
        gGame.correct++
        if (gBoard[iIdx][jIdx].minesAroundCount===0) openAroundCells(iIdx, jIdx)
        console.log('first click');
        console.log("count", gGame.correct);
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
        if (gBoard[iIdx][jIdx].minesAroundCount===0) {
            openAroundCells(iIdx, jIdx)
            console.log('opened few');
           
        }
    }
    else {
        elCell.innerHTML = `${BOMB}`
        gGame.lives--
        showLives()
        var emoji = document.querySelector('div.alive_or_dead h2')
        emoji.innerHTML = SAD
        //check if game over
    }
    console.log("count", gGame.correct);
    gBoard[iIdx][jIdx].isShown = true
    checkGameOver()

}
function openAroundCells(iIdx, jIdx) {//trolling me, adding count for nothing :(
    iIdx = +iIdx
    jIdx = +jIdx
    for (var i = iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gLevel.SIZE) continue//left/right side not out of bounds
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
            if (i === iIdx && j === jIdx) continue//doesnt check himself
            if (j < 0 || j >= gLevel.SIZE) continue//top/bot side not out of bounds
            if (gBoard[i][j].isMine===true||gBoard[i][j].isShown===true) continue
            var selectorStr = `[data-i="${i}"][data-j="${j}"]`
            var elCell = document.querySelector(selectorStr)
            elCell.innerHTML = gBoard[i][j].minesAroundCount
            gGame.correct++
            gBoard[i][j].isShown = true
        }
    }
}

function OnCellMarked(elCell) {
    var jIdx = elCell.dataset.j
    var iIdx = elCell.dataset.i
    var cellPos = gBoard[iIdx][jIdx]
    if (cellPos.isShown===true) {//if its opened
        return
    }
    if (cellPos.isMarked) {//if already flaged
        cellPos.isMarked = false
        gLevel.Flags++
        elCell.innerHTML = UNCLICKED
        return
    }
    if (gLevel.Flags === 0) {//left flags
        return
    }
    gLevel.Flags--
    cellPos.isMarked = true
    elCell.innerHTML = `${FLAG}`
    checkGameOver()
}
function checkGameOver() {
    if (gGame.correct === gLevel.SafeCells) {//found all correct cells
        win()
    }
    if (gGame.lives === 0) {//no lives left
        lose()
    }
}
function win() {//TODO you still need stop the time interval
    //have to make it
    var emoji = document.querySelector('div.alive_or_dead h2')
    emoji.innerHTML = WINNER
    alert('win')
}
function lose() {
    //gotta make it
    console.log('lose')
    alert('lose')
}
function newGame() {
    //restarting gGame
    gGame.isOn = false
    gGame.shownCount = 0
    gGame.marketCount = 0
    gGame.secPassed = 0
    gGame.lives = 3
    gGame.correct = 0
    gBoard = []

    var emoji = document.querySelector('div.alive_or_dead h2')
    emoji.innerHTML = HAPPY
    onInit()
}

function changeDiff(num) {
    switch (num) {
        case 1:
            //easy diff 4*4 ,2 mines
            gLevel.SIZE = 4,
            gLevel.Mines = 2,
            gLevel.Flags = 2,
            gLevel.SafeCells = 14
            newGame()
            break
        case 2:
            //medium diff 8*8, 14 mines
            gLevel.SIZE = 8,
            gLevel.Mines = 14,
            gLevel.Flags = 14,
            gLevel.SafeCells = 8*8-14
            newGame()
            break
        case 3:
            //hard diff 12*12, 32 mines
            gLevel.SIZE = 12,
            gLevel.Mines = 32,
            gLevel.Flags = 32,
            gLevel.SafeCells = 12*12-32
            newGame()
            break
        default:
            break
    }
}


function expandShown(board, elCell, i, j) {
    //TODO first step is just around the clicked cell

    //bonus, open all the cells with 0 mines around
}


//have clear mat, and first click saves i and j and general all other
//without regenerating this 1

//have already made martix with everythihg, and only after first click
//generate bombs