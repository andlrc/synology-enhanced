// ==UserScript==
// @name        SO No flair
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.1
// @description Remove the flair from StackOverflow
// @match       *://stackoverflow.com/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/stackoverflow.com-noflair.user.js
// ==/UserScript==
(function() {
	"use strict";

	var style = document.createElement('style');
	document.head.appendChild(style);
	style.sheet.insertRule(`.-flair { display: none !important; }`);

})();
