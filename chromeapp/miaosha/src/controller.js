var controller = createUI();

function createUI() {
    var aside = document.createElement('aside'), html;
    aside.id = 'miaosha-controller';

    html = '<h1>秒杀控制</h1>'
    +'<button>停止秒杀</button>';
    aside.innerHTML = html;
    document.body.appendChild(aside);
    aside.querySelector('button').addEventListener('click', function () {
        this.disabled = true;
        chrome.extension.sendRequest({abort: true});
    }, false);
    return aside;
}
