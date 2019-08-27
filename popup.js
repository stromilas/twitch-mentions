var button = document.getElementById('submit-username');
var user = document.getElementById('user');

chrome.storage.sync.get(['username'], function(data) {
	user.innerText = data.username;
})


button.addEventListener('click', function() {
	var username = document.getElementById('username').value;
	chrome.storage.sync.set({username: username}, function() {
		chrome.tabs.query({}, function(tabs) {
			for(tab of tabs) {
				if(tab.url.includes('www.twitch.tv')) {
					chrome.tabs.sendMessage(tab.id,
						{type: 'username_change', username: username});
				}
			}
		});
		user.innerText = username;
	});
});
