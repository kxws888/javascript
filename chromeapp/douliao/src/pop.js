chrome.extension.sendRequest({cmd: 'getPop'}, function(response) {
    document.title = response.name;
    var dchat = new DChat({people: response.people, name: response.name, ui: 'simple'});
    dchat.start();
    dchat.chatWindow.querySelector('section>div').innerHTML = response.history;
});
