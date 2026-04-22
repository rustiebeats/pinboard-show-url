// ==UserScript==
// @name         Pinboard — Show URL Under Title
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Display the destination URL as a visible, clickable link beneath each bookmark title on Pinboard
// @match        https://pinboard.in/recent/
// @match        https://pinboard.in/popular/
// @match        https://pinboard.in/t:*
// @match        https://pinboard.in/u:*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .pb-url-display {
        display: block;
        width: 100%;
        clear: both;
        font-size: 11px;
        color: #999;
        margin: 2px 0 4px 0;
        max-width: 100%;
        word-break: break-all;
      }
      .pb-url-display a {
        color: #aaa;
        text-decoration: none;
      }
      .pb-url-display a:hover {
        color: #555;
        text-decoration: underline;
      }
      body.popular .pb-url-display {
        margin-bottom: 1px;
      }
    `;
    document.head.appendChild(style);
  }

  const isPopular = location.pathname === '/popular/';

  function insertUrlDisplay(container, titleAnchor, url) {
    // Avoid duplicates if script runs more than once
    if (container.querySelector('.pb-url-display')) return;

    const div = document.createElement('div');
    div.className = 'pb-url-display';
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = url;
    div.appendChild(a);

    if (isPopular) {
      // Append last so bookmark_count stays in its original position
      container.appendChild(div);
    } else {
      titleAnchor.insertAdjacentElement('afterend', div);
      const next = div.nextSibling;
      if (next && next.nodeName === 'BR') next.remove();
    }
  }

  function addUrls() {
    // Primary strategy: use the bmarks JS object embedded on the page
    if (typeof bmarks !== 'undefined' && bmarks) {
      for (const id of Object.keys(bmarks)) {
        const url = bmarks[id].url || bmarks[id].bookmark_url;
        if (!url) continue;
        const container = document.getElementById(id);
        if (!container) continue;
        const titleAnchor = container.querySelector('a.bookmark_title');
        if (!titleAnchor) continue;
        insertUrlDisplay(container, titleAnchor, url);
      }
      return;
    }

    // Fallback: read href directly from the title anchor elements
    const titleAnchors = document.querySelectorAll('a.bookmark_title');
    for (const anchor of titleAnchors) {
      const url = anchor.href;
      if (!url) continue;
      const container = anchor.closest('.bookmark') || anchor.parentElement;
      insertUrlDisplay(container, anchor, url);
    }
  }

  injectStyles();
  if (isPopular) document.body.classList.add('popular');

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addUrls);
  } else {
    addUrls();
  }
})();
