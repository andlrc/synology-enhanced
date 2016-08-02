// ==UserScript==
// @name        Monospace font in textareas
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.1
// @description Add monospace font in all textareas around Reddit
// @match       *://reddit.com
// @match       *://reddit.com/*
// @match       *://www.reddit.com
// @match       *://www.reddit.com/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/reddit.com-monospace.js
// ==/UserScript==
(function() {
  "use strict";

  var style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule(`textarea { font-family: monospace !important;
                                     font-size: 14px !important;
                                     tab-size: 4; }`);
})();
