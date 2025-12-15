// ==UserScript==
// @name         Apilo: Ukryj Statusy i filtry
// @namespace    http://apilo.local/
// @version      1.0
// @description  Ukrywa panel statusów i panel filtrów poprzez display:none
// @author       Pa-Jong
// @match        https://elektrone.apilo.com/*
// @require      https://pa-jong.github.io/ApiloStatusHider/ApiloStatusHider.user.js
// @updateURL    https://pa-jong.github.io/ApiloStatusHider/update.json
// @downloadURL  https://pa-jong.github.io/ApiloStatusHider/ApiloStatusHider.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const STATUS64 = /\/order\/order\/status\/(64|70)\/?$/; // Numery statusów

  let hidden = true;
  let btn = null;

  function getStatusBlock() {
    return document.querySelector('.mr-3.d-none.d-lg-block.order-status-list-sticky > .kt-portlet');
  }

  function getFiltersBlock() {
    const el = document.querySelector('.kt-portlet__body--filters');
    return el ? el.closest('.kt-portlet') : null;
  }

  function toggle() {
    hidden = !hidden;
    apply();
  }

  function createBtn() {
    if (btn) return;
    btn = document.createElement('button');
    btn.textContent = '🔽';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999999,
      background: '#683ffe',
      color: '#fff',
      border: 'none',
      padding: '10px 12px',
      fontSize: '20px',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
    });
    btn.onclick = toggle;
    document.body.appendChild(btn);
  }

  function apply() {
    const status = getStatusBlock();
    const filtr = getFiltersBlock();

    if (status) status.style.display = hidden ? 'none' : '';
    if (filtr) filtr.style.display = hidden ? 'none' : '';

    if (btn) btn.textContent = hidden ? '🔽' : '🔼';
  }

  function run() {
    if (!STATUS64.test(location.pathname)) {
      hidden = false;
      apply();
      if (btn) btn.style.display = 'none';
      return;
    }

    createBtn();
    btn.style.display = 'block';

    hidden = true;
    apply();
  }

  // start
  setTimeout(run, 200);

  // SPA navigation fix
  const _push = history.pushState;
  history.pushState = function () {
    _push.apply(this, arguments);
    setTimeout(run, 100);
  };
  window.addEventListener('popstate', () => setTimeout(run, 100));
})();
