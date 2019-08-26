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
			message: request.data.message,
			iconUrl: 'images/twitchmentions_48.png'
		};
		chrome.notifications.create('Quote', notificationConfig);
		chrome.notifications.clear('Quote');
	}
	sendResponse();
});
