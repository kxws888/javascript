function showMessage(e) {
    chrome.extension.sendRequest({cmd: 'showUnread', people: e.target.id});
}

function draw(image, num) {
    var canvas = document.createElement('canvas'), ctx, img;
    canvas.width = 48;
    canvas.height = 48;
    canvas.style['-webkit-box-shadow']= '0 0 5px 5px #0C7823';
    ctx = canvas.getContext('2d');
    img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#0C7823';
        ctx.arc(48, 0, 15, 0, 2*Math.PI, false);
        ctx.fill();
        //ctx.fillRect(34, 0, 48, 14);
        ctx.font = "bold 12px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(num, 39, 10);

    }
    img.src = image;
    return canvas;

}

    chrome.extension.sendRequest({cmd: 'getPop'}, function(response) {
        var chatWindow = chatStart({preventDefault: function () {}});
		chatWindow.querySelector('h1').innerHTML = response.name;
		chatWindow.querySelector('section>div').innerHTML = response.history;
    });
