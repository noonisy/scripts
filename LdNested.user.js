// ==UserScript==
// @name         Linux.do Nested Redirect
// @namespace    https://linux.do/
// @version      0.1
// @description  Redirect linux.do/t/topic/{id} to linux.do/n/topic/{id}?sort=old
// @match        https://linux.do/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/noonisy/scirpts/main/LdNested.user.js
// @updateURL    https://raw.githubusercontent.com/noonisy/scirpts/main/LdNested.user.js
// ==/UserScript==

(function () {
    'use strict';

    function redirect() {
        const match = location.pathname.match(/^\/t\/topic\/(\d+)/);
        if (match) {
            location.replace('https://linux.do/n/topic/' + match[1] + '?sort=old');
        }
    }

    // Initial check
    redirect();

    // Watch for SPA navigation via History API
    const _pushState = history.pushState;
    history.pushState = function () {
        _pushState.apply(this, arguments);
        redirect();
    };

    const _replaceState = history.replaceState;
    history.replaceState = function () {
        _replaceState.apply(this, arguments);
        redirect();
    };

    window.addEventListener('popstate', redirect);

    // Watch for Discourse's Ember router transitions
    window.addEventListener('transitionend', function () {
        setTimeout(redirect, 100);
    });
})();
