// ==UserScript==
// @name        Relative Time in DR.DK live tv
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.9
// @description Show relative time instead of absolute time on dr.dk/tv/live
// @match       *://dr.dk/tv/live*
// @match       *://www.dr.dk/tv/live*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/dr-dk-relativetime.user.js
// ==/UserScript==
(function() {
	var UPD_TIME = 30 * 1000;
	"use strict";

	var timeObjects = {};

	var m = document.createElement('script');
	m.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/da.js";
	document.head.appendChild(m);
	var timer_afterLoad = setInterval(function() {
		if (typeof moment != 'undefined' &&
		    document.querySelector('.modal-description') != null) {
			clearTimeout(timer_afterLoad);
			setInterval(updateLoop, UPD_TIME);
			updateLoop();
		}
	}, 100);

	function updateLoop(el) {
		var times = [].slice.call(document.querySelectorAll('time'));
		times.forEach(function(el) {
			if (!el.dataset.stored) {
				el.setAttribute('title', el.innerHTML);
				el.dataset.stored = true;
			}
			var time = el.getAttribute('title');
			var date = timeObjects[time] || (timeObjects[time] = moment(time, 'HH:mm'));

			/* The date can be above 24 and and on the next day, moment *
			 * interpretent this as -x hours instead of +x, assume no program
			 * is * send after 5am next day */
			if (date.hours() < 5) {
				date.add(24, 'hours');
			}
			el.innerHTML = date.fromNow();
		});

		/* Show full description */
		var descs = [].slice.call(document.querySelectorAll('.modal-description'));
		descs.forEach(el => el.setAttribute('title', el.innerText));
	}
})();

