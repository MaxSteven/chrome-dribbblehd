/*global chrome */
'use strict';

// Listen for requests
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	switch (request.get) {
		case 'options':
			sendResponse(localStorage.options ? JSON.parse(localStorage.options) : {});
			break;

		default:
			sendResponse({});
	}
});