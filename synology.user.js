// ==UserScript==
// @name        Synology Enhanced Behaviour
// @namespace   https://github.com/andlrc/synology-enhanced
// @version     0.0.7
// @description Enhanced behaviours for Sonology NAS
// @match       *://*.quickconnect.to*
// @match       *://*.*.quickconnect.to*
// @match       *://192.168.1.70*
// @match       *://192.168.1.71*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/synology-enhanced/raw/master/synology.user.js
// ==/UserScript==
(function() {
	enableCtrlTab();

	function enableCtrlTab() { 
		var sortedSnapShot = null;
		var index = 0;
		document.addEventListener('keydown', e => {
			if (e.keyCode == 17 || e.keyCode == 18) {
				sortedSnapShot = getOpenWindowsSorted();
				index = 0;
			}
			if (e.keyCode == 9 && (e.ctrlKey || e.altKey)) {
				
				index += + (e.shiftKey ? -1 : 1);
				index = index % sortedSnapShot.length;
				if (index < 0) {
					index += sortedSnapShot.length;
				}

				var event = new MouseEvent('mousedown', {
					'view': window,
					'bubbles': true,
					'cancelable': true
				});
				sortedSnapShot[index].getEl().dom.dispatchEvent(event);
				
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
			}
		});
	}
	function getOpenWindowsSorted() {
		return getOpenWindows().sort((a, b) => b._lastAccess - a._lastAccess);
	}
	function getOpenWindows() {
		var windows = [].slice.call(document.querySelectorAll('#sds-desktop > .x-window'));
		return windows.filter(x => x.style.visibility != 'hidden' && x.style.display != 'none').map(x => Ext.getCmp(x.id));
	}
})();
