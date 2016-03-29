// ==UserScript==
// @name        Tab in Synology NAS web interface
// @namespace   https://github.com/andlrc/synology-enhanced
// @version     0.0.8
// @description Enable <CapsLock>+<Tab> and <Alt>+<Tab> to toggle windows
// @match       *://*.quickconnect.to*
// @match       *://*.*.quickconnect.to*
// @match       *://192.168.1.70*
// @match       *://192.168.1.71*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/synology-enhanced/raw/master/synology.user.js
// ==/UserScript==
(function() {
	"use strict";

	var sortedSnapShot = null;
	var index = 0;
	var isDown = false;

	var keyTriggers = {
		// Alt
		18: true,

		// CapsLock
		20: true
	};

	document.addEventListener('keydown', e => {
		if (keyTriggers[e.keyCode]) {
			sortedSnapShot = getOpenWindowsSorted();
			index = 0;
			isDown = true;
		}
		if (e.keyCode == 9 && isDown) {
			
			index += + (e.shiftKey ? -1 : 1);
			index = index % sortedSnapShot.length;
			if (index < 0) {
				index += sortedSnapShot.length;
			}

			focusWindow(sortedSnapShot[index]);
			
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		}
	});
	document.addEventListener('keyup', e=> {
		if (keyTriggers[e.keyCode]) {
			isDown = false;
		}
	});

	function focusWindow(me) {
		var event = new MouseEvent('mousedown', {
			'view': window,
			'bubbles': true,
			'cancelable': true
		});
		me.getEl().dom.dispatchEvent(event);
	}
	function getOpenWindowsSorted() {
		return getOpenWindows().sort((a, b) => b._lastAccess - a._lastAccess);
	}
	function getOpenWindows() {
		var windows = [].slice.call(document.querySelectorAll('#sds-desktop > .x-window'));
		return windows.filter(x => x.style.visibility != 'hidden' && x.style.display != 'none').map(x => Ext.getCmp(x.id));
	}
})();
