


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