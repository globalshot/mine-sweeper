function onUploadImg() {
    var gElCanvasDownload = document.querySelector('.canvas-download')
    var gCtxDownload = gElCanvasDownload.getContext('2d')
    
    gCtxDownload.clearRect(0, 0, gElCanvasDownload.width, gElCanvasDownload.height)
    
    let img = new Image();
    img.addEventListener('load', function() {
      gCtxDownload.drawImage(img, 0, 0, gElCanvasDownload.width, gElCanvasDownload.height)
      
      for (let i = 0; i < gMemeLength(); i++) {
        gCtxDownload.beginPath()
        setLineTxt(getLineTxt(i))
        var stringTitle = getLineTxt(i)
        gCtxDownload.fillStyle = getTxtColor(i)
        gCtxDownload.font = `${getLineSize(i)}px ${font}`
        gCtxDownload.fillText(stringTitle, getLineX(i), getLineY(i))
        gCtxDownload.closePath()
      }
      console.log('4');
      // Get the data URL of the canvas image


    const imgDataUrl = gElCanvasDownload.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log(encodedUploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
    console.log('3');
})}

function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR
        // Same as
        // const url = XHR.responseText

        // If the response is ok, call the onSuccess callback function, 
        // that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
        console.log('2');
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
    console.log('1');
}



