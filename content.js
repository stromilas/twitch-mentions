const selector = 'div[role="log"]';

const CHAT_CHECK_INTERVAL = 1000;
const CHAT_PROCESS_INTERVAL = 2000;
const URL_CHECK_INTERVAL = 1000;

let url = '';

setInterval(function() {
	if(document.URL != url) {
		url = document.URL;
		console.log('url changed - loading chat');
		loadChat(selector, processChat);
	}
}, URL_CHECK_INTERVAL);


function processChat(chat) {
	const username = "Cactulus".toLowerCase();
	let lastMessage = document.createElement('div');
	setInterval(function() {
		try {
			const messageArray = Array.from(chat.childNodes);
			const length = messageArray.length - 2;
			let   lastMessageIndex = messageArray.indexOf(lastMessage);

			if(length > lastMessageIndex) {
				if(lastMessageIndex == -1) lastMessageIndex = 0;

				try {
					for(let i = lastMessageIndex + 1; i <= length; i++) {
						const message = processMessage(messageArray[i]);
						console.log(message.text);
						if(message) {
							if(message.text.includes(username)) {
								chrome.runtime.sendMessage({type: 'notification', data: message});
							}
						}
					}
				}
				catch(err) {
					// continue
				}
			}
			lastMessage = messageArray[length];
		}
		catch(err) {
			console.log(err);
		}
	}, CHAT_PROCESS_INTERVAL);
}

function processMessage(element) {
	const message = element.children;
	const textSelector = 'chat-message-text';
	const mentionSelector = 'chat-message-mention';
	const emoteSelector = 'span[data-a-target="emote-name"]';
	const authorSelector = 'span[data-a-target="chat-message-username"]';
	let 	processedText = '';
	let   messageAuthor = '';

	try {
		for(let i = 0; i < message.length; i++) {

			if(message[i].getAttribute('data-a-target') === textSelector ||
				 message[i].getAttribute('data-a-target') === mentionSelector) {
				const text = message[i].innerText;
				processedText += text;
			}
			else if(message[i].querySelector(emoteSelector)) {
				const emoteWrapper = message[i].querySelector(emoteSelector);
				if(emoteWrapper.querySelector('img')) {
					const emote = emoteWrapper.querySelector('img').getAttribute('alt');
					processedText += emote;
				}
			}
			else if(message[i].querySelector(authorSelector)) {
				messageAuthor = message[i].querySelector(authorSelector).innerText;
			}
		}
	}
	catch(err) {
		console.log(err);
	}

	if(processedText && messageAuthor) {
		return {
			author: messageAuthor,
			text: processedText
		}
	}
	else {
		return null;
	}
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
