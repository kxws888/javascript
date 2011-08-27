function showMessage(e) {
    chrome.extension.sendRequest({cmd: 'showUnread', people: e.target.id});
}

function draw(image, num) {
    var canvas = document.createElement('canvas'), ctx, img;
    canvas.width = 48;
    canvas.height = 48;
    ctx = canvas.getContext('2d');
    img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#ddd';
        ctx.fillRect(34, 0, 48, 34);
        ctx.font = "12px serif";
        ctx.fillStyle = '#fff';
        ctx.fillText(num, 36, 2);

    }
    img.src = image;
    return canvas;

}
document.addEventListener('DOMContentLoaded', function () {
    chrome.extension.sendRequest({cmd: 'getUnread'}, function(response) {
        var unread = response.unread, unreadClear = {}, i, len, tmp;
        for (i = 0, len = unread.length ; i < len ; i += 1) {
            tmp = unread[i];
            if (tmp.people in unreadClear) {
                unreadClear[tmp.people].counter += 1;
            }
            else {
                unreadClear[tmp.people] = {icon: tmp.icon, counter: 1};
            }
        }
        for (i in unreadClear) {
            tmp = draw(unreadClear[i].icon, unreadClear[i].counter);
            tmp.id = i;
            tmp.addEventListener('click', showMessage, false);
            document.body.appendChild(tmp);
        }
    });
}, false);
