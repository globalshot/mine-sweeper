//idk how much rlly i need this, maximum imma delete

function toggleAboutMe() {
    let aboutMe = document.querySelector('div.aboutMe')
    aboutMe.classList.toggle('hidden')

    let gallery = document.querySelector('div.modal')
    gallery.classList.add('hidden')
}