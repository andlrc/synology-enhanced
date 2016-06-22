// ==UserScript==
// @name        Set defaults for axosoft when creating new tasks, features, ...
// @namespace   https://github.com/andlrc/userscripts
// @version     0.0.1
// @description Will set defaults like release id, workflow steps, ...
// @match       *://*.axosoft.com
// @match       *://*.axosoft.com/*
// @author      Andreas Louv
// @grant       none
// @updateURL   https://github.com/andlrc/userscripts/raw/master/axosoft.user.js
// ==/UserScript==
(function() {
  'use strict';

  const ElementHandler = (function() {
    const ElementHandler = function(id, handler) {
      this.id = id;
      this.handler = handler;
    };

    ElementHandler.prototype.emit = function() {
      this.emitting = true;
      this.handler.apply(this, arguments);
    };

    return ElementHandler;
  })();

  const util = {
    pad: function(val, len, pad) {
      val = val == null ? '' : String(val);
      while (val.length < len) {
        val = pad + val;
      }

      return val;
    }
  };
  const dom = {
    index: function(child) {
      for (var index = 0; child.previousSibling; index++) {
        ;
      }

      return index;
    }
  };

  const handlers = [];

  handlers.push(new ElementHandler('#release\\.id', (release_el) => {
    const date = new Date();
    const r_date = new RegExp(date.getFullYear() + '-'
      + util.pad(date.getWeekNumber(), 2, 0));

    const matched_option = [].find.call(release_el.querySelectorAll('option'),
      el => r_date.test(el.innerText));

    if (matched_option) {
      release_el.selectedIndex = dom.index(matched_option);
    }
  }));

  document.addEventListener('DOMNodeInserted', function(event) {
    handlers.forEach(handler => {
      if (!event.target.matches) {
        return;
      }
      var el = event.target.matches(handler.id) ? event.target
        : event.target.querySelector(handler.id);
      if (el) {
        handler.emit(el);
      }
    });
  });
})();
