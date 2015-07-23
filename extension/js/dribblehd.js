(function (undefined) {
	'use strict';

	var pathname = window.location.pathname;
	var sidebars = [
		'/search',
		'/colors/*',
		'/tags/*',
		'/*/lists/*',
		'/*/buckets/*'
	];
	var runIn = [
		'/', // homepage
		'/shots',
		'/suggestions'
	].concat(sidebars);
	var isSidebar = h.matches(pathname, sidebars);
	var shots = h.toArray(document.querySelectorAll('#main ol.dribbbles > li'));
	var totalShots = shots.length;
	var defaults = {
		hide_overlay: false
	};

	// When profile page, add current pathname to runIn array
	if (~['profile', 'user-profile'].indexOf(document.body.id)) {
		runIn.push(pathname);
	}

	// Terminate if we are not in one of the allowed locations, or there are no shots
	if (!h.matches(pathname, runIn) || !shots.length) {
		return;
	}

	// Include custom CSS
	document.head.appendChild(h.createElement('link', {
		href: chrome.extension.getURL('css/dribbblehd.css'),
		type: 'text/css',
		rel: 'stylesheet',
		media: 'screen'
	}));

	var isObserving = false;

	// Get extension options and proceed
	chrome.extension.sendRequest({ get: 'options' }, function (options) {
		// Options
		var o = h.merge(defaults, options);

		// Set additional body classes
		document.body.classList.add(isSidebar ? 'dribhd-sidebar' : 'dribhd');

		// Modify shots
		processShots(shots, o);

		// observer target node
		var target = document.querySelector("#main ol.dribbbles");

		// create an observer instance
		var observer = new MutationObserver(function(mutations) {
		  	mutations.forEach(function(mutation) {
		    	if(mutation.type == 'childList' && mutation.addedNodes.length > 0){
		    		var newShots = document.querySelectorAll('#main ol.dribbbles > li');
		    		if(newShots.length > totalShots){
		    			shots = h.toArray(newShots);
		    			totalShots = shots.length;
		    			processShots(shots, o);
					}
				}
		  	});
		});
		// configuration of the observer:
		var config = { childList: true, subtree: true};

		if(isObserving == false){
			// pass in the target node, as well as the observer options
			observer.observe(target, config);
			isObserving = true;
		}

		// later, you can stop observing
		// observer.disconnect();

	});
}());


function processShots(shots, o){
	shots.forEach(function (shot) {
		var link     = shot.querySelector('.dribbble-link');
		if(link.querySelector('[data-picture]') != null){
			var hdPath   = link.querySelector('img').src.replace('_teaser','');
			var newImage = h.createElement('img');
			var loader   = h.createElement('span', {
				className: 'dribhd-loading'
			});

			// Append loader
			link.appendChild(loader);

			// Image loaded handler
			function imgLoaded() {
				loader.remove();
				if(link.querySelector('[data-picture]') != null){
					link.querySelector('[data-picture]').remove();
				}
				h.unbind(newImage, 'load error', imgLoaded);
				link.appendChild(newImage);
			}

			// Bind imgLoaded handler
			h.bind(newImage, 'load error', imgLoaded);

			// Set the HD path to the new image
			newImage.src = hdPath;

			// Move shot name below image if overlay is being hidden
			if (o.hide_overlay) {
				shot.querySelector('.extras').appendChild(h.createElement('span', {
					className: 'dribhd-shotname',
					innerText: shot.querySelector('.dribbble-over strong').innerText
				}));
			}
		}
	});
}