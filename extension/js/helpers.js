(function (undefined) {
	'use strict';

	window.h = {
		/**
		 * Return type of the value.
		 *
		 * @param  {Mixed} value
		 *
		 * @return {String}
		 */
		type: function (value) {
			return Object.prototype.toString.call(value).match(/^\[object ([a-z]+)\]$/i)[1].toLowerCase();
		},

		/**
		 * Convert array-like objects into an array.
		 *
		 * @param  {Mixed} collection
		 *
		 * @return {Array}
		 */
		toArray: function (collection) {
			switch (h.type(collection)) {
				case 'array':
					return collection;
				case 'undefined':
					return [];
				case 'nodelist':
				case 'htmlcollection':
				case 'arguments':
					var arr = [];
					for (var i = 0, l = collection.length; i < l; i++) {
						if (collection.hasOwnProperty(i) || i in collection) {
							arr.push(collection[i]);
						}
					}
					return arr;
				default:
					return [collection];
			}
		},

		/**
		 * Add event listeners to element.
		 *
		 * @param  {Node}     element
		 * @param  {Event}    eventName
		 * @param  {Function} handler
		 *
		 * @return {Void}
		 */
		bind: function (element, eventName, handler) {
			h.listener(element, eventName, handler);
		},

		/**
		 * Remove event listeners from element.
		 *
		 * @param  {Node}     element
		 * @param  {Event}    eventName
		 * @param  {Function} handler
		 *
		 * @return {Void}
		 */
		unbind: function (element, eventName, handler) {
			h.listener(element, eventName, handler, 1);
		},

		/**
		 * Manage element event listeners.
		 *
		 * @param  {Node}     element
		 * @param  {Event}    eventName
		 * @param  {Function} handler
		 * @param  {Bool}     remove
		 *
		 * @return {Void}
		 */
		listener: function (element, eventName, handler, remove) {
			var events = eventName.split(' ');
			for (var i = 0, l = events.length; i < l; i++) {
				if (element.addEventListener) {
					element[remove ? 'removeEventListener' : 'addEventListener'](events[i], handler, false);
				} else if (element.attachEvent) {
					element[remove ? 'detachEvent' : 'attachEvent']('on' + events[i], handler);
				}
			}
		},

		/**
		 * Match URL against an array of wildcard patterns.
		 *
		 * @param  {String} needle
		 * @param  {Mixed}  haystack Pattern, or array of patterns.
		 *
		 * @return {Boolean}
		 */
		matches: function (needle, haystack) {
			haystack = h.toArray(haystack);

			for (var i = 0, l = haystack.length; i < l; i++) {
				var pattern = new RegExp('^' + haystack[i].replace(/\*/g, '[a-zA-Z0-9\\._\\-]+') + '$');
				if (needle.match(pattern)) {
					return true;
				}
			}
			return false;
		},

		/**
		 * Create an element and assign it some properties.
		 *
		 * @param  {String} name
		 * @param  {Object} props
		 *
		 * @return {Node}
		 */
		createElement: function (name, props) {
			var element = document.createElement(name);
			if (h.type(props) === 'object') {
				Object.keys(props).forEach(function (prop) {
					element[prop] = props[prop];
				});
			}
			return element;
		},

		/**
		 * Merge 2 objects into a new one, and return it.
		 *
		 * @param  {Object} obj1
		 * @param  {Object} obj2
		 *
		 * @return {Object}
		 */
		merge: function (obj1, obj2) {
			var obj = {};
			Object.keys(obj1).concat(Object.keys(obj2)).forEach(function (key) {
				obj[key] = obj2.hasOwnProperty(key) ? obj2[key] : obj1[key];
			});
			return obj;
		}
	};
}());