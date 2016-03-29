// ==UserScript==
// @name        Relative Time in DR.DK live tv
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.1
// @description Show relative time instead of absolute time on dr.dk/tv/live
// @match       *://dr.dk/tv/live*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/dr-dk-relativetime.user.js
// ==/UserScript==
(function() {
	"use strict";

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

			setInterval(updateTime, 1000);
			updateTime();
		}
	}
	function updateTime(el) {
		var times = [].slice.call(document.querySelectorAll('time'));
		times.forEach(function(el) {
			if (!el.dataset._date) {
				el.dataset._date = el.innerHTML;
			}
			el.innerHTML = moment(el.dataset._date, 'HH:mm').fromNow();
		});
	}
})();
