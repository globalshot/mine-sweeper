function shuffle(array) {
    var shuffled = []

    for (let i = array.length; i > 0; i--) {
        var idxNumber = getRandomInt(0, array.length -1)
        // console.log(idxNumber);
        var num = array[idxNumber]
        array.splice(idxNumber, 1)
        shuffled.push(num)
    }
    return shuffled
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}