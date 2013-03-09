/*global h */
(function (undefined) {
	'use strict';

	var options = localStorage.options ? JSON.parse(localStorage.options) : {};
	var container = document.querySelector('#options');

	// Populate settings with stored options
	h.toArray(container.querySelectorAll('[name]')).forEach(function (el) {
		var name  = el.name;
		var value = options[name];

		if (!options.hasOwnProperty(name)) {
			return;
		}

		if (el.type === 'checkbox') {
			el.checked = value;
		} else {
			el.value = value;
		}
	});

	// save options on input change
	h.bind(container, 'change', function (event) { console.log(event);
		var element = event.target;
		var name = element.name;

		// Ignore if the target elment has no name
		if (!name) {
			return;
		}

		// Update the value
		options[name] = element.type === 'checkbox' ? element.checked : element.value;

		// Save options
		localStorage.options = JSON.stringify(options);
	});
}());