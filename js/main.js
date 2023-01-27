

const FLAG = '🚩'
const BOMB = '💣'
// const UNCLICKED = '?'
const UNCLICKED = ''
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