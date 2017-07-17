// ==UserScript==
// @name        Better IceBreak dump
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.1
// @description Better IceBreak dump
// @match       *://*.admin.workmule.dk/*
// @match       *://dksrv206:*/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/icebreak-dump.user.js
// ==/UserScript==
(function() {
	"use strict";

    [].forEach.call(document.querySelectorAll('span.error'), (errEl) => {
        var [_, severity, lineNo] = errEl.innerText.split(/\s+/);
        if (severity < 20)
            errEl.className = 'warning';

        var lineEl = [].find.call(document.querySelectorAll('a > span.normal'), (el) => {
            return el.innerText.trim().split(/\s+/)[0] == lineNo;
        });
        if (lineEl)
            lineEl.className = errEl.className;

        errEl.parentNode.addEventListener('click', function(evt) {
            evt.preventDefault();

            if (lineEl)
                window.scrollTo(0, document.body.scrollTop + lineEl.getBoundingClientRect().top);
        });
    });

    var btn = document.createElement('button');
    btn.innerText = 'GOTO Error';
    btn.addEventListener('click', gotoError);
    btn.style.position = 'fixed';
    btn.style.right = '20px';
    btn.style.bottom = '20px';
    document.body.appendChild(btn);

    gotoError();
})();
