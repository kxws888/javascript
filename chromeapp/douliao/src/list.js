function openPanel(e) {
    if (e.detail > 1) {
        var response = {cmd: 'showUnread'};
        response.people = this.id;
        response.name = this.querySelector('h2').innerHTML;
        response.sign = this.querySelector('p').innerHTML;
        response.icon = this.querySelector('img').src;
        response.history = [];
        chrome.extension.sendRequest(response);
        e.preventDefault();
        return false;
    }
}

chrome.extension.sendRequest({cmd: 'getList'}, function(response) {
    var header = document.querySelector('header'), entryList = document.querySelector('section'), me = response.me, friends = response.friends, key, div;
    header.querySelector('h1').appendChild(document.createTextNode(me.name));
    header.querySelector('p').appendChild(document.createTextNode(me.sign));
    header.querySelector('img').src = me.icon;

    for (key in friends) {
        div = document.createElement('div');
        div.className = 'entry';
        div.id = key;
        div.innerHTML = '<div><h2>' + friends[key].name + '</h2><p> ' + friends[key].sign + ' </p></div><img src="' + friends[key].icon + '" />';
        div.addEventListener('click', openPanel, false);
        entryList.appendChild(div);
    }
});
