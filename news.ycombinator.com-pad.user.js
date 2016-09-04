// ==UserScript==
// @name        Add small padding between upvote button and title/subtext
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.2
// @description Add small padding to allow better navigation with cvim 'fxx'
// @match       *://news.ycombinator.com/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/news.ycombinator.com-pad.user.js
// ==/UserScript==
(function() {
  "use strict";

  var style = document.createElement('style');
  document.head.appendChild(style);
  style.sheet.insertRule(`td.votelinks { padding-right: 7px; }`);
})();
