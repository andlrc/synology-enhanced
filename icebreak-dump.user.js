// ==UserScript==
// @name        Better IceBreak dump
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.10
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

	document.body.style.paddingBottom = '30px';

	var lineEls = [].reduce.call(document.querySelectorAll('a > span.normal'), (ret, el) => {
		ret[el.innerText.trim().split(/\s+/)[0]] = el;
		return ret;
	}, {});

	var errIx = -1;
	var errors = [];
	[].forEach.call(document.querySelectorAll('span.error'), (errEl) => {
		var columns = errEl.innerText.match(/\*RNF\d+\s+(\d+)\s+(\d+)\s+([^]*)/);
		if (!columns)
			return;

		var [_, severity, lineNo, errMsg] = columns;
		if (severity < 20)
			errEl.className = 'warning';

		var lineEl = lineEls[lineNo];
		if (lineEl) {
			lineEl.className = errEl.className;
			lineEl.style.cursor = 'pointer';
			lineEl.addEventListener('click', cnext);

			errEl.parentNode.addEventListener('click', evt => {
				evt.preventDefault();
				errIx = errors.findIndex(err => err.lineEl == lineEl);
				cc();
			});

			errors.push({
				errEl: errEl,
				lineEl: lineEl,
				severity: Number(severity),
				lineNo: Number(lineNo),
				errMsg: errMsg.trim().replace(/\s+/g, ' ')
			});
		}
	});

	function cprev(s) {
		--errIx;
		if (typeof s == 'number') {
			/* Where is Array.prototype.findLastIndex(fn) ?? */
			var i, foundIx;
			for (i = errors.length - 1, foundIx = -1; i >= 0; i--) {
				if (i <= errIx && errors[i].severity >= s) {
					foundIx = i;
					break;
				}
			}
			errIx = foundIx;
		}
		cc();
	}

	function cnext(s) {
		errIx++;
		if (typeof s == 'number') {
			errIx = errors.findIndex((v, k) => k >= errIx && v.severity >= s);
		}
		cc();
	}

	function cc() {
		var err = errors[errIx];
		if (!err) {	/* Show list of all errors */
			errIx = -1;
			return clist();
		}

		window.scrollTo(0, err.lineEl.offsetTop);

		var textDom = document.createTextNode(err.errMsg);
		while (errDom.firstChild)
			errDom.removeChild(errDom.firstChild);
		errDom.appendChild(textDom);
	}

	function clist() {
		var textDom = document.createTextNode(
			'Press 0, 1, 2, 3 <CR>, g, or G');
		while (errDom.firstChild)
			errDom.removeChild(errDom.firstChild);
		errDom.appendChild(textDom);

		gotoError();
	}

	function norm_G() {
		window.scrollTo(0, document.body.offsetHeight);
	}

	document.addEventListener('keydown', evt => {
		var s = -1;
		switch (evt.which) {
		case 48:	/* 0: go to error */
			s = 0;
			break;
		case 49:	/* 1: go to severity >= 10 error */
			s = 10;
			break;
		case 50:	/* 2: go to severity >= 20 error */
			s = 20;
			break;
		case 51:	/* 3: go to severity >= 30 error */
			s = 30;
			break;
		case 69:	/* e and E */
			if (evt.shiftKey)	/* E: go to list of errors */
				clist();
			else /* e: go to error */
				s = 0;
			break;
		case 71:	/* g and G */
			if (evt.shiftKey)	/* G: go to bottom of page */
				norm_G();
			break;
		}

		if (s > -1) {
			if (evt.shiftKey)
				cprev(s);
			else
				cnext(s);
		}
	});

	var panelDom = document.createElement('div');
	panelDom.style.position = 'fixed';
	panelDom.style.backgroundColor = 'black';
	panelDom.style.color = 'white';
	panelDom.style.fontFamily = 'monospace';
	panelDom.style.fontSize = '14px';
	panelDom.style.padding = '20px';
	panelDom.style.lineHeight = '10px';
	panelDom.style.left = 0;
	panelDom.style.right = 0;
	panelDom.style.bottom = 0;

	var errDom = document.createElement('div');
	panelDom.appendChild(errDom);

	document.body.appendChild(panelDom);

	clist();
})();
