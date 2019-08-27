chrome.runtime.onInstalled.addListener(function() {

	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: 'twitch.tv'}
			})],
					actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.type === 'notification') {
		const notificationConfig = {
			type: 'basic',
			title: request.data.author,
			message: request.data.text,
			iconUrl: 'images/twitchmentions_48.png'
		};
		const uniqueString = "" + new Date().getUTCMilliseconds();
		chrome.notifications.create(uniqueString, notificationConfig);
	}
	sendResponse();
});

setInterval(function() {
	chrome.tabs.query({currentWindow: true, active: true}, function(tab) {
		const currentId = tab[0] ? tab[0].id : -1;
		console.log(currentId);
		chrome.tabs.query({}, function(tabs) {
			for(tab of tabs) {
				if(tab.url.includes('www.twitch.tv')){
					if(currentId == tab.id) {
						chrome.tabs.sendMessage(tab.id, {type: 'quote_listener', isEnabled: false});
					}
					else {
						chrome.tabs.sendMessage(tab.id, {type: 'quote_listener', isEnabled: true});
					}
				}
			}
		});
	});
}, 2000);
