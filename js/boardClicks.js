

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