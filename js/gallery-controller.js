

function renderGallery() {
    let strImgs = ''
    let imgsArray = getImages()
    for (let i = 0; i < imgsArray.length; i++) {
        strImgs += `<img onClick="onImgSelect(${i+1})" src="${imgsArray[i].url}"></img>`
    }
    // console.log(strImgs);
    document.querySelector('section.images').innerHTML = strImgs
}

function toggleGallery() {
    let gallery = document.querySelector('div.modal')
    gallery.classList.toggle('hidden')

    let aboutMe = document.querySelector('div.aboutMe')
    aboutMe.classList.add('hidden')
}