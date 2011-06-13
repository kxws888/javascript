(function () {

    var configsBox = createUI(), queryStr, reg = /\d+(,\d+)?(\.\d+)?/;

    function createUI() {
        var aside = document.createElement('aside'), html;
        aside.id = 'miaosha-viclm';

        html = '<h1>秒杀配置</h1>'
        +'<section>'
        +'<div>秒杀条件: 价格小于<input type="number" min="0.01" step="1"></div>'
        +'<div>秒杀间隔: <input type="number" min="0" step="1" value="3">秒</div>'
        +'<div>秒杀提醒:<label for=""><input type="checkbox" value="sound" />播放声音</label></div>'
        +'</section>'
        +'<footer>'
        +'<button id="miaosha-start">开始秒杀</button>'
        +'<button id="miaosha-cancel">取消</button>'
        +'</footer>';
        aside.innerHTML = html;
        document.body.appendChild(aside);
        aside.style.cssText = 'display: none; left: ' + (document.body.clientWidth - aside.offsetWidth) / 2 + 'px; top: ' + (document.body.clientHeight - aside.offsetHeight) / 2 + 'px;';
        aside.addEventListener('mousedown', eventClear, false);
        aside.addEventListener('mouseup', eventClear, false);
        aside.addEventListener('click', eventClear, false);
        aside.querySelector('button').addEventListener('click', saveConfigs, false);
        return aside;

        function eventClear(e) {
            e.stopPropagation();
        }
    }

    function saveConfigs() {
        var data = {}, tips, i, len;
        data.queryStr = queryStr;
        data.reg = reg.toString();
        data.price = parseFloat(configsBox.querySelector('input[type=number]').value, 10);
        data.gap = parseFloat(configsBox.querySelector('div:nth-of-type(2) input[type=number]').value, 10);
        data.sound = configsBox.querySelector('input[type=checkbox]').checked;
        chrome.extension.sendRequest(data);
        configsBox.style.display = 'none';
    }

    document.body.addEventListener('click', function (e) {
        var elem = e.target, txt = elem.innerHTML, price;
        queryStr = elem.nodeName + (elem.id ? '#' + elem.id : '') + (elem.className ? '.' + elem.className : '');
        price = parseFloat(reg.exec(txt)[0].replace(',', ''), 10);
        configsBox.querySelector('input[type=number]').value = price;
        configsBox.style.display = '';
    }, false);

})();

