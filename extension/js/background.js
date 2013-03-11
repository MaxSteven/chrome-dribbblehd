// Listen for requests
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	'use strict';

	switch (request.get) {
		case 'options':
			sendResponse(localStorage.options ? JSON.parse(localStorage.options) : {});
			break;

		default:
			sendResponse(undefined);
	}
});