

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
function blackMode() {
    var body = document.querySelector("body")
    body.classList.toggle("black_mode")
    body.classList.toggle("img")
}