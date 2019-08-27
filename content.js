const selector = 'div[role="log"]';

const CHAT_CHECK_INTERVAL = 1000;
const CHAT_PROCESS_INTERVAL = 2000;
const URL_CHECK_INTERVAL = 1000;

let url = '';

setInterval(function() {
	if(document.URL != url) {
		url = document.URL;
		console.log('url changed - loading chat');
		loadChat(selector, processMessages);
	}
}, URL_CHECK_INTERVAL);


function processMessages(chat) {
	const username = "Cactulus".toLowerCase();
	let lastMessage = document.createElement('div');
	setInterval(function() {
		try {
			const messageArray = Array.from(chat.childNodes);
			const length = messageArray.length - 2;
			let   lastMessageIndex = messageArray.indexOf(lastMessage);

			if(length > lastMessageIndex) {
				if(lastMessageIndex == -1) lastMessageIndex = 0;

				for(let i = lastMessageIndex + 1; i <= length; i++) {
					if(messageArray[i].innerText.includes(':')) {
						const message = messageArray[i].innerText.split(':');
						const author = message[0];
						const text = message[1].toLowerCase();
						if(text.includes(username)) {
							console.log(messageArray[i].innerHTML);
							const data = {
								author: author,
								message: text
							};
							chrome.runtime.sendMessage({type: 'notification', data: data});
						}
					}
				}
			}
			lastMessage = messageArray[length];
		}
		catch(err) {
			console.log(err);
			lastMessage = document.createElement('div');
		}
	}, CHAT_PROCESS_INTERVAL);
}

function loadChat(selector, callback) {
	window.setTimeout(function() {
		let chat = document.querySelector(selector);
		if(chat) {
			callback(chat);
		}
		else {
			loadChat(selector, callback);
		}
	}, CHAT_CHECK_INTERVAL);
}
