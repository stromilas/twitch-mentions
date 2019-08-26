const selector = 'div[role="log"]';
console.log('Loading chat');
loadChat(selector, processMessages);


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
							console.log('Someone quoted you!');
							console.log(author);
							console.log(text);
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
	}, 2000);
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
	}, 1000);
}
