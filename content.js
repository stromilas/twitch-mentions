
const selector = 'div[role="log"]';

loadChat(selector, function(chat) {
	console.log(chat);
})





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
