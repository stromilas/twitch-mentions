const selector = 'div[role="log"]';
loadChat(selector, processMessages);


function processMessages(chat) {
	let lastMessage = document.createElement('div');
	setInterval(function() {
		try {
			const messageArray = Array.from(chat.childNodes);
			const length = messageArray.length - 2;
			let   lastMessageIndex = messageArray.indexOf(lastMessage);

			if(length > lastMessageIndex) {
				if(lastMessageIndex == -1) lastMessageIndex = 0;
				for(let i = lastMessageIndex + 1; i <= length; i++) {
					console.log(messageArray[i].innerText);
				}
			}
			lastMessage = messageArray[length];
		}
		catch(err) {
			// ignore
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
