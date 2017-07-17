// ==UserScript==
// @name        Better IceBreak dump
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.3
// @description Better IceBreak dump
// @match       *://*.admin.workmule.dk/*
// @match       *://dksrv206:*/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/icebreak-dump.user.js
// ==/UserScript==
(function() {
	"use strict";

    if (typeof gotoError === 'undefined')
        return;

    var lineEls = [];
    [].forEach.call(document.querySelectorAll('span.error'), (errEl) => {
        var columns = errEl.innerText.match(/\*RNF\d+\s+(\d+)\s+(\d+)\s+([^]*)/);
        if (!columns)
            return;

        var [_, severity, lineNo, errMsg] = columns;
        if (severity < 20)
            errEl.className = 'warning';

        var lineEl = [].find.call(document.querySelectorAll('a > span.normal'), (el) => {
            return el.innerText.trim().split(/\s+/)[0] == lineNo;
        });
        if (lineEl) {
            lineEl.className = errEl.className;
            lineEl.style.cursor = 'pointer';
            lineEl.addEventListener('click', cnext.bind(null, lineEl));
            lineEl.setAttribute('title', errMsg.trim().replace(/\s+/g, ' '));

            errEl.parentNode.addEventListener('click', function(evt) {
                evt.preventDefault();

                zt(lineEl);
            });


            lineEls.push(lineEl);
        }
    });

    function cnext(el) {
        var nextIx = lineEls.indexOf(el) + 1;
        if (nextIx == lineEls.length)
            gotoError();
        else
            zt(lineEls[nextIx]);
    }

    function zt(el) {
        window.scrollTo(0, el.offsetTop);
    }

    var btn = document.createElement('button');
    btn.innerText = 'GOTO Error';
    btn.addEventListener('click', gotoError);
    btn.style.position = 'fixed';
    btn.style.right = '20px';
    btn.style.bottom = '20px';
    document.body.appendChild(btn);

    gotoError();
})();
