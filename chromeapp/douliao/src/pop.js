chrome.extension.sendRequest({cmd: 'getPop'}, function(response) {console.log(response.name)
    document.getElementsByTagName('title')[0].innerHTML = response.name;
    var dchat = new DChat({people: response.people, name: response.name, ui: 'simple'});
    dchat.start();
    dchat.chatWindow.querySelector('section>div').innerHTML = response.history;
});
