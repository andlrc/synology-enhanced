// ==UserScript==
// @name        Relative Time in DR.DK live tv
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.6
// @description Show relative time instead of absolute time on dr.dk/tv/live
// @match       *://dr.dk/tv/live*
// @match       *://www.dr.dk/tv/live*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/dr-dk-relativetime.user.js
// ==/UserScript==
(function() {
	"use strict";

	var timeObjects = {};

	// Load moment.js unless dr.dk decides to load it them self
	if (typeof moment == 'undefined') {
		var m = document.createElement('script');
		m.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/locale/da.js";
		document.head.appendChild(m);
		var timer_afterLoad = setTimeout(afterLoad, 100);
	}
	else {
		afterLoad();
	}

	function afterLoad() {
		if (typeof moment != 'undefined') {
			clearTimeout(timer_afterLoad);

			setInterval(updateTime, 30000);
			updateTime();
		}
	}
	function updateTime(el) {
		var times = [].slice.call(document.querySelectorAll('time'));
		times.forEach(function(el) {
			if (!el.dataset._time) {
				el.dataset._time = el.innerHTML;
			}
			var time = el.dataset._time;
			var date = timeObjects[time] || (timeObjects[time] = moment(time, 'HH:mm'));

			// The date can be above 24 and and on the next day, moment interpretent
			// this as -x hours instead of +x, assume no program is send after 5am
			// next day
			if (date.hours() < 5) {
				date.add(24, 'hours');
			}
			el.innerHTML = date.fromNow();
		});
	}
})();
