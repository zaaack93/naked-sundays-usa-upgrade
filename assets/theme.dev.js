
/*
* @license
* Broadcast Theme (c) Invisible Themes
*
* This file is included for advanced development by
* Shopify Agencies.  Modified versions of the theme
* code are not supported by Shopify or Invisible Themes.
*
* In order to use this file you will need to change
* theme.js to theme.dev.js in /layout/theme.liquid
*
*/

(function (scrollLock, themeAddresses, themeCurrency, Rellax, Flickity, FlickityFade, themeImages) {
  'use strict';

  window.theme = window.theme || {};

  window.theme.subscribers = {};

  window.theme.sizes = {
    mobile: 480,
    small: 750,
    large: 990,
    widescreen: 1400,
  };

  window.theme.keyboardKeys = {
    TAB: 'Tab',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: 'Space',
    LEFTARROW: 'ArrowLeft',
    RIGHTARROW: 'ArrowRight',
  };

  window.theme.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function floatLabels(container) {
    const floats = container.querySelectorAll('.form-field');
    floats.forEach((element) => {
      const label = element.querySelector('label');
      const input = element.querySelector('input, textarea');
      if (label && input) {
        input.addEventListener('keyup', (event) => {
          if (event.target.value !== '') {
            label.classList.add('label--float');
          } else {
            label.classList.remove('label--float');
          }
        });
        if (input.value && input.value.length) {
          label.classList.add('label--float');
        }
      }
    });
  }

  let screenOrientation = getScreenOrientation();
  window.initialWindowHeight = Math.min(window.screen.height, window.innerHeight);

  function readHeights() {
    const h = {};
    h.windowHeight = Math.min(window.screen.height, window.innerHeight);
    h.announcementHeight = getHeight('[data-section-type*="announcement"] [data-bar-top]');
    h.footerHeight = getHeight('[data-section-type*="footer"]');
    h.menuHeight = getHeight('[data-header-height]');
    h.headerHeight = h.menuHeight + h.announcementHeight;
    h.collectionNavHeight = getHeight('[data-collection-nav]');
    h.logoHeight = getFooterLogoWithPadding();

    return h;
  }

  function setVarsOnResize() {
    document.addEventListener('theme:resize', resizeVars);
    setVars();
  }

  function setVars() {
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight, collectionNavHeight} = readHeights();

    document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
    document.documentElement.style.setProperty('--three-quarters', `${windowHeight * (3 / 4)}px`);
    document.documentElement.style.setProperty('--two-thirds', `${windowHeight * (2 / 3)}px`);
    document.documentElement.style.setProperty('--one-half', `${windowHeight / 2}px`);
    document.documentElement.style.setProperty('--one-third', `${windowHeight / 3}px`);

    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--collection-nav-height', `${collectionNavHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);

    if (document.querySelector('[data-tracking-consent].popup-cookies--bottom')) {
      document.documentElement.style.setProperty('--cookie-bar-height', `${document.querySelector('[data-tracking-consent].popup-cookies--bottom').offsetHeight}px`);
    }

    document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
  }

  function resizeVars() {
    // restrict the heights that are changed on resize to avoid iOS jump when URL bar is shown and hidden
    const {windowHeight, announcementHeight, headerHeight, logoHeight, menuHeight, footerHeight, collectionNavHeight} = readHeights();
    const currentScreenOrientation = getScreenOrientation();

    if (currentScreenOrientation !== screenOrientation) {
      // Only update the heights on screen orientation change
      document.documentElement.style.setProperty('--full-screen', `${windowHeight}px`);
      document.documentElement.style.setProperty('--three-quarters', `${windowHeight * (3 / 4)}px`);
      document.documentElement.style.setProperty('--two-thirds', `${windowHeight * (2 / 3)}px`);
      document.documentElement.style.setProperty('--one-half', `${windowHeight / 2}px`);
      document.documentElement.style.setProperty('--one-third', `${windowHeight / 3}px`);

      // Update the screen orientation state
      screenOrientation = currentScreenOrientation;
    }

    document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
    document.documentElement.style.setProperty('--announcement-height', `${announcementHeight}px`);
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    document.documentElement.style.setProperty('--collection-nav-height', `${collectionNavHeight}px`);

    document.documentElement.style.setProperty('--footer-height', `${footerHeight}px`);
    document.documentElement.style.setProperty('--content-full', `${windowHeight - headerHeight - logoHeight / 2}px`);
    document.documentElement.style.setProperty('--content-min', `${windowHeight - headerHeight - footerHeight}px`);

    if (document.querySelector('[data-tracking-consent].popup-cookies--bottom')) {
      document.documentElement.style.setProperty('--cookie-bar-height', `${document.querySelector('[data-tracking-consent].popup-cookies--bottom').offsetHeight}px`);
    }
  }

  function getScreenOrientation() {
    if (window.matchMedia('(orientation: portrait)').matches) {
      return 'portrait';
    }

    if (window.matchMedia('(orientation: landscape)').matches) {
      return 'landscape';
    }
  }

  function getHeight(selector) {
    const el = document.querySelector(selector);
    if (el) {
      return el.offsetHeight;
    } else {
      return 0;
    }
  }

  function getFooterLogoWithPadding() {
    const height = getHeight('[data-footer-logo]');
    if (height > 0) {
      return height + 20;
    } else {
      return 0;
    }
  }

  function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
  }

  let isCompleted = false;
  let docComplete = false;

  function preloadImages() {
    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        docComplete = true;
        initImagesPreloader();
      }
    };

    requestIdleCallback(initImagesPreloader);
  }

  function initImagesPreloader() {
    setTimeout(() => {
      if (isCompleted) return;

      if (!docComplete) {
        initImagesPreloader();
        return;
      }

      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      if (lazyImages.length) {
        lazyImages.forEach((image) => {
          image.setAttribute('loading', 'eager');
        });
      }

      isCompleted = true;
    }, 3000);
  }

  function debounce(fn, time) {
    let timeout;
    return function () {
      // eslint-disable-next-line prefer-rest-params
      if (fn) {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
      }
    };
  }

  function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }

  function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }

  function isDesktop() {
    return getWindowWidth() >= window.theme.sizes.small;
  }

  function isMobile() {
    return getWindowWidth() < window.theme.sizes.small;
  }

  let lastWindowWidth = getWindowWidth();
  let lastWindowHeight = getWindowHeight();

  function dispatch$1() {
    document.dispatchEvent(
      new CustomEvent('theme:resize', {
        bubbles: true,
      })
    );

    if (lastWindowWidth !== getWindowWidth()) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:width', {
          bubbles: true,
        })
      );

      lastWindowWidth = getWindowWidth();
    }

    if (lastWindowHeight !== getWindowHeight()) {
      document.dispatchEvent(
        new CustomEvent('theme:resize:height', {
          bubbles: true,
        })
      );

      lastWindowHeight = getWindowHeight();
    }
  }

  function resizeListener() {
    window.addEventListener(
      'resize',
      debounce(function () {
        dispatch$1();
      }, 50)
    );
  }

  let prev = window.pageYOffset;
  let up = null;
  let down = null;
  let wasUp = null;
  let wasDown = null;
  let scrollLockTimer = 0;

  function dispatch() {
    const position = window.pageYOffset;
    if (position > prev) {
      down = true;
      up = false;
    } else if (position < prev) {
      down = false;
      up = true;
    } else {
      up = null;
      down = null;
    }
    prev = position;
    document.dispatchEvent(
      new CustomEvent('theme:scroll', {
        detail: {
          up,
          down,
          position,
        },
        bubbles: false,
      })
    );
    if (up && !wasUp) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:up', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    if (down && !wasDown) {
      document.dispatchEvent(
        new CustomEvent('theme:scroll:down', {
          detail: {position},
          bubbles: false,
        })
      );
    }
    wasDown = down;
    wasUp = up;
  }

  function lock(e) {
    // Prevent body scroll lock race conditions
    setTimeout(() => {
      if (scrollLockTimer) {
        clearTimeout(scrollLockTimer);
      }

      scrollLock.disablePageScroll(e.detail, {
        allowTouchMove: (el) => el.tagName === 'TEXTAREA',
      });

      document.documentElement.setAttribute('data-scroll-locked', '');
    });
  }

  function unlock(e) {
    const timeout = e.detail;

    if (timeout) {
      scrollLockTimer = setTimeout(removeScrollLock, timeout);
    } else {
      removeScrollLock();
    }
  }

  function removeScrollLock() {
    scrollLock.clearQueueScrollLocks();
    scrollLock.enablePageScroll();
    document.documentElement.removeAttribute('data-scroll-locked');
  }

  function scrollListener() {
    let timeout;
    window.addEventListener(
      'scroll',
      function () {
        if (timeout) {
          window.cancelAnimationFrame(timeout);
        }
        timeout = window.requestAnimationFrame(function () {
          dispatch();
        });
      },
      {passive: true}
    );

    window.addEventListener('theme:scroll:lock', lock);
    window.addEventListener('theme:scroll:unlock', unlock);
  }

  const wrap = (toWrap, wrapperClass = '', wrapperOption) => {
    const wrapper = wrapperOption || document.createElement('div');
    wrapper.classList.add(wrapperClass);
    toWrap.parentNode.insertBefore(wrapper, toWrap);
    return wrapper.appendChild(toWrap);
  };

  function wrapElements(container) {
    // Target tables to make them scrollable
    const tableSelectors = '.rte table';
    const tables = container.querySelectorAll(tableSelectors);
    tables.forEach((table) => {
      wrap(table, 'rte__table-wrapper');
    });

    // Target iframes to make them responsive
    const iframeSelectors = '.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"], .rte iframe#admin_bar_iframe';
    const frames = container.querySelectorAll(iframeSelectors);
    frames.forEach((frame) => {
      wrap(frame, 'rte__video-wrapper');
    });
  }

  function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  function isTouch() {
    if (isTouchDevice()) {
      document.documentElement.className = document.documentElement.className.replace('no-touch', 'supports-touch');
      window.theme.touch = true;
    } else {
      window.theme.touch = false;
    }
  }

  function ariaToggle(container) {
    const toggleButtons = container.querySelectorAll('[data-aria-toggle]');
    if (toggleButtons.length) {
      toggleButtons.forEach((element) => {
        element.addEventListener('click', function (event) {
          event.preventDefault();
          const currentTarget = event.currentTarget;
          currentTarget.setAttribute('aria-expanded', currentTarget.getAttribute('aria-expanded') == 'false' ? 'true' : 'false');
          const toggleID = currentTarget.getAttribute('aria-controls');
          const toggleElement = document.querySelector(`#${toggleID}`);
          const removeExpandingClass = () => {
            toggleElement.classList.remove('expanding');
            toggleElement.removeEventListener('transitionend', removeExpandingClass);
          };
          const addExpandingClass = () => {
            toggleElement.classList.add('expanding');
            toggleElement.removeEventListener('transitionstart', addExpandingClass);
          };

          toggleElement.addEventListener('transitionstart', addExpandingClass);
          toggleElement.addEventListener('transitionend', removeExpandingClass);

          toggleElement.classList.toggle('expanded');
        });
      });
    }
  }

  function loading() {
    document.body.classList.add('is-loaded');
  }

  const classes$K = {
    loading: 'is-loading',
  };

  const selectors$_ = {
    img: 'img.is-loading',
  };

  /*
    Catch images loaded events and add class "is-loaded" to them and their containers
  */
  function loadedImagesEventHook() {
    document.addEventListener(
      'load',
      (e) => {
        if (e.target.tagName == 'IMG' && e.target.classList.contains(classes$K.loading)) {
          e.target.classList.remove(classes$K.loading);
          e.target.parentNode.classList.remove(classes$K.loading);
        }
      },
      true
    );
  }

  /*
    Remove "is-loading" class to the loaded images and their containers
  */
  function removeLoadingClassFromLoadedImages(container) {
    container.querySelectorAll(selectors$_.img).forEach((img) => {
      if (img.complete) {
        img.classList.remove(classes$K.loading);
        img.parentNode.classList.remove(classes$K.loading);
      }
    });
  }

  function isVisible(el) {
    var style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  /**
   * A11y Helpers
   * -----------------------------------------------------------------------------
   * A collection of useful functions that help make your theme more accessible
   */

  /**
   * Moves focus to an HTML element
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects. Used in bindInPageLinks()
   * eg move focus to a modal that is opened. Used in trapFocus()
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */
  function forceFocus(element, options) {
    options = options || {};

    var savedTabIndex = element.tabIndex;

    element.tabIndex = -1;
    element.dataset.tabIndex = savedTabIndex;
    element.focus();
    if (typeof options.className !== 'undefined') {
      element.classList.add(options.className);
    }
    element.addEventListener('blur', callback);

    function callback(event) {
      event.target.removeEventListener(event.type, callback);

      element.tabIndex = savedTabIndex;
      delete element.dataset.tabIndex;
      if (typeof options.className !== 'undefined') {
        element.classList.remove(options.className);
      }
    }
  }

  /**
   * If there's a hash in the url, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - Selector for elements to not include.
   */

  function focusHash(options) {
    options = options || {};
    var hash = window.location.hash;
    var element = document.getElementById(hash.slice(1));

    // if we are to ignore this element, early return
    if (element && options.ignore && element.matches(options.ignore)) {
      return false;
    }

    if (hash && element) {
      forceFocus(element, options);
    }
  }

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   * This compensates for older browsers that do not move keyboard focus to anchor links.
   * Recommendation: To be called once the page in loaded.
   *
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   * @param {string} options.ignore - CSS selector for elements to not include.
   */

  function bindInPageLinks(options) {
    options = options || {};
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));

    function queryCheck(selector) {
      return document.getElementById(selector) !== null;
    }

    return links.filter(function (link) {
      if (link.hash === '#' || link.hash === '') {
        return false;
      }

      if (options.ignore && link.matches(options.ignore)) {
        return false;
      }

      if (!queryCheck(link.hash.substr(1))) {
        return false;
      }

      var element = document.querySelector(link.hash);

      if (!element) {
        return false;
      }

      link.addEventListener('click', function () {
        forceFocus(element, options);
      });

      return true;
    });
  }

  function focusable(container) {
    var elements = Array.prototype.slice.call(
      container.querySelectorAll('[tabindex],' + '[draggable],' + 'a[href],' + 'area,' + 'button:enabled,' + 'input:not([type=hidden]):enabled,' + 'object,' + 'select:enabled,' + 'textarea:enabled')
    );

    // Filter out elements that are not visible.
    // Copied from jQuery https://github.com/jquery/jquery/blob/2d4f53416e5f74fa98e0c1d66b6f3c285a12f0ce/src/css/hiddenVisibleSelectors.js
    return elements.filter(function (element) {
      return !!((element.offsetWidth || element.offsetHeight || element.getClientRects().length) && isVisible(element));
    });
  }

  /**
   * Traps the focus in a particular container
   *
   * @param {Element} container - Container DOM element to trap focus inside of
   * @param {Element} elementToFocus - Element to be focused on first
   * @param {Object} options - Settings unique to your theme
   * @param {string} options.className - Class name to apply to element on focus.
   */

  var trapFocusHandlers = {};

  function trapFocus(container, options) {
    options = options || {};
    var elements = focusable(container);
    var elementToFocus = options.elementToFocus || container;
    var first = elements[0];
    var last = elements[elements.length - 1];

    removeTrapFocus();

    trapFocusHandlers.focusin = function (event) {
      if (container !== event.target && !container.contains(event.target) && first && first === event.target) {
        first.focus();
      }

      if (event.target !== container && event.target !== last && event.target !== first) return;
      document.addEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.focusout = function () {
      document.removeEventListener('keydown', trapFocusHandlers.keydown);
    };

    trapFocusHandlers.keydown = function (event) {
      if (event.code !== window.theme.keyboardKeys.TAB) return; // If not TAB key

      // On the last focusable element and tab forward, focus the first element.
      if (event.target === last && !event.shiftKey) {
        event.preventDefault();
        first.focus();
      }

      //  On the first focusable element and tab backward, focus the last element.
      if ((event.target === container || event.target === first) && event.shiftKey) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('focusout', trapFocusHandlers.focusout);
    document.addEventListener('focusin', trapFocusHandlers.focusin);

    forceFocus(elementToFocus, options);
  }

  /**
   * Removes the trap of focus from the page
   */
  function removeTrapFocus() {
    document.removeEventListener('focusin', trapFocusHandlers.focusin);
    document.removeEventListener('focusout', trapFocusHandlers.focusout);
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  }

  /**
   * Add a preventive message to external links and links that open to a new window.
   * @param {string} elements - Specific elements to be targeted
   * @param {object} options.messages - Custom messages to overwrite with keys: newWindow, external, newWindowExternal
   * @param {string} options.messages.newWindow - When the link opens in a new window (e.g. target="_blank")
   * @param {string} options.messages.external - When the link is to a different host domain.
   * @param {string} options.messages.newWindowExternal - When the link is to a different host domain and opens in a new window.
   * @param {object} options.prefix - Prefix to namespace "id" of the messages
   */
  function accessibleLinks(elements, options) {
    if (typeof elements !== 'string') {
      throw new TypeError(elements + ' is not a String.');
    }

    elements = document.querySelectorAll(elements);

    if (elements.length === 0) {
      return;
    }

    options = options || {};
    options.messages = options.messages || {};

    var messages = {
      newWindow: options.messages.newWindow || 'Opens in a new window.',
      external: options.messages.external || 'Opens external website.',
      newWindowExternal: options.messages.newWindowExternal || 'Opens external website in a new window.',
    };

    var prefix = options.prefix || 'a11y';

    var messageSelectors = {
      newWindow: prefix + '-new-window-message',
      external: prefix + '-external-message',
      newWindowExternal: prefix + '-new-window-external-message',
    };

    function generateHTML(messages) {
      var container = document.createElement('ul');
      var htmlMessages = Object.keys(messages).reduce(function (html, key) {
        return (html += '<li id=' + messageSelectors[key] + '>' + messages[key] + '</li>');
      }, '');

      container.setAttribute('hidden', true);
      container.innerHTML = htmlMessages;

      document.body.appendChild(container);
    }

    function externalSite(link) {
      return link.hostname !== window.location.hostname;
    }

    elements.forEach(function (link) {
      var target = link.getAttribute('target');
      var rel = link.getAttribute('rel');
      var isExternal = externalSite(link);
      var isTargetBlank = target === '_blank';
      var missingRelNoopener = rel === null || rel.indexOf('noopener') === -1;

      if (isTargetBlank && missingRelNoopener) {
        var relValue = rel === null ? 'noopener' : rel + ' noopener';
        link.setAttribute('rel', relValue);
      }

      if (isExternal && isTargetBlank) {
        link.setAttribute('aria-describedby', messageSelectors.newWindowExternal);
      } else if (isExternal) {
        link.setAttribute('aria-describedby', messageSelectors.external);
      } else if (isTargetBlank) {
        link.setAttribute('aria-describedby', messageSelectors.newWindow);
      }
    });

    generateHTML(messages);
  }

  var a11y = /*#__PURE__*/Object.freeze({
    __proto__: null,
    forceFocus: forceFocus,
    focusHash: focusHash,
    bindInPageLinks: bindInPageLinks,
    focusable: focusable,
    trapFocus: trapFocus,
    removeTrapFocus: removeTrapFocus,
    accessibleLinks: accessibleLinks
  });

  const selectors$Z = {
    inputSearch: 'input[type="search"]',
    focusedElements: '[aria-selected="true"] a',
    resetButton: 'button[type="reset"]',
  };

  const classes$J = {
    hidden: 'hidden',
  };

  class HeaderSearchForm extends HTMLElement {
    constructor() {
      super();

      this.input = this.querySelector(selectors$Z.inputSearch);
      this.resetButton = this.querySelector(selectors$Z.resetButton);

      if (this.input) {
        this.input.form.addEventListener('reset', this.onFormReset.bind(this));
        this.input.addEventListener(
          'input',
          debounce((event) => {
            this.onChange(event);
          }, 300).bind(this)
        );
      }
    }

    toggleResetButton() {
      const resetIsHidden = this.resetButton.classList.contains(classes$J.hidden);
      if (this.input.value.length > 0 && resetIsHidden) {
        this.resetButton.classList.remove(classes$J.hidden);
      } else if (this.input.value.length === 0 && !resetIsHidden) {
        this.resetButton.classList.add(classes$J.hidden);
      }
    }

    onChange() {
      this.toggleResetButton();
    }

    shouldResetForm() {
      return !document.querySelector(selectors$Z.focusedElements);
    }

    onFormReset(event) {
      // Prevent default so the form reset doesn't set the value gotten from the url on page load
      event.preventDefault();
      // Don't reset if the user has selected an element on the predictive search dropdown
      if (this.shouldResetForm()) {
        this.input.value = '';
        this.toggleResetButton();
        event.target.querySelector(selectors$Z.inputSearch).focus();
      }
    }
  }

  customElements.define('header-search-form', HeaderSearchForm);

  const selectors$Y = {
    allVisibleElements: '[role="option"]',
    ariaSelected: '[aria-selected="true"]',
    header: '[data-header-height]',
    popularSearches: '[data-popular-searches]',
    predictiveSearch: 'predictive-search',
    predictiveSearchResults: '[data-predictive-search-results]',
    predictiveSearchStatus: '[data-predictive-search-status]',
    searchInput: 'input[type="search"]',
    searchPopdown: '[data-popdown]',
    searchResultsLiveRegion: '[data-predictive-search-live-region-count-value]',
    searchResultsGroupsWrapper: '[data-search-results-groups-wrapper]',
    searchForText: '[data-predictive-search-search-for-text]',
    sectionPredictiveSearch: '#shopify-section-predictive-search',
    selectedLink: '[aria-selected="true"] a',
    selectedOption: '[aria-selected="true"] a, button[aria-selected="true"]',
  };

  class PredictiveSearch extends HeaderSearchForm {
    constructor() {
      super();
      this.a11y = a11y;
      this.abortController = new AbortController();
      this.allPredictiveSearchInstances = document.querySelectorAll(selectors$Y.predictiveSearch);
      this.cachedResults = {};
      this.input = this.querySelector(selectors$Y.searchInput);
      this.isOpen = false;
      this.predictiveSearchResults = this.querySelector(selectors$Y.predictiveSearchResults);
      this.searchPopdown = this.closest(selectors$Y.searchPopdown);
      this.popularSearches = this.searchPopdown?.querySelector(selectors$Y.popularSearches);
      this.searchTerm = '';
    }

    connectedCallback() {
      this.input.addEventListener('focus', this.onFocus.bind(this));
      this.input.form.addEventListener('submit', this.onFormSubmit.bind(this));

      this.addEventListener('focusout', this.onFocusOut.bind(this));
      this.addEventListener('keyup', this.onKeyup.bind(this));
      this.addEventListener('keydown', this.onKeydown.bind(this));
    }

    getQuery() {
      return this.input.value.trim();
    }

    onChange() {
      super.onChange();
      const newSearchTerm = this.getQuery();

      if (!this.searchTerm || !newSearchTerm.startsWith(this.searchTerm)) {
        // Remove the results when they are no longer relevant for the new search term
        // so they don't show up when the dropdown opens again
        this.querySelector(selectors$Y.searchResultsGroupsWrapper)?.remove();
      }

      // Update the term asap, don't wait for the predictive search query to finish loading
      this.updateSearchForTerm(this.searchTerm, newSearchTerm);

      this.searchTerm = newSearchTerm;

      if (!this.searchTerm.length) {
        this.reset();
        return;
      }

      this.getSearchResults(this.searchTerm);
    }

    onFormSubmit(event) {
      if (!this.getQuery().length || this.querySelector(selectors$Y.selectedLink)) event.preventDefault();
    }

    onFormReset(event) {
      super.onFormReset(event);
      if (super.shouldResetForm()) {
        this.searchTerm = '';
        this.abortController.abort();
        this.abortController = new AbortController();
        this.closeResults(true);
      }
    }

    shouldResetForm() {
      return !document.querySelector(selectors$Y.selectedLink);
    }

    onFocus() {
      const currentSearchTerm = this.getQuery();

      if (!currentSearchTerm.length) return;

      if (this.searchTerm !== currentSearchTerm) {
        // Search term was changed from other search input, treat it as a user change
        this.onChange();
      } else if (this.getAttribute('results') === 'true') {
        this.open();
      } else {
        this.getSearchResults(this.searchTerm);
      }
    }

    onFocusOut() {
      setTimeout(() => {
        if (!this.contains(document.activeElement)) this.close();
      });
    }

    onKeyup(event) {
      if (!this.getQuery().length) this.close(true);
      event.preventDefault();

      switch (event.code) {
        case 'ArrowUp':
          this.switchOption('up');
          break;
        case 'ArrowDown':
          this.switchOption('down');
          break;
        case 'Enter':
          this.selectOption();
          break;
      }
    }

    onKeydown(event) {
      // Prevent the cursor from moving in the input when using the up and down arrow keys
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    }

    updateSearchForTerm(previousTerm, newTerm) {
      const searchForTextElement = this.querySelector(selectors$Y.searchForText);
      const currentButtonText = searchForTextElement?.innerText;

      if (currentButtonText) {
        if (currentButtonText.match(new RegExp(previousTerm, 'g'))?.length > 1) {
          // The new term matches part of the button text and not just the search term, do not replace to avoid mistakes
          return;
        }
        const newButtonText = currentButtonText.replace(previousTerm, newTerm);
        searchForTextElement.innerText = newButtonText;
      }
    }

    switchOption(direction) {
      if (!this.getAttribute('open')) return;

      const moveUp = direction === 'up';
      const selectedElement = this.querySelector(selectors$Y.ariaSelected);

      // Filter out hidden elements (duplicated page and article resources) thanks
      // to this https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
      const allVisibleElements = Array.from(this.querySelectorAll(selectors$Y.allVisibleElements)).filter((element) => element.offsetParent !== null);

      let activeElementIndex = 0;

      if (moveUp && !selectedElement) return;

      let selectedElementIndex = -1;
      let i = 0;

      while (selectedElementIndex === -1 && i <= allVisibleElements.length) {
        if (allVisibleElements[i] === selectedElement) {
          selectedElementIndex = i;
        }
        i++;
      }

      this.statusElement.textContent = '';

      if (!moveUp && selectedElement) {
        activeElementIndex = selectedElementIndex === allVisibleElements.length - 1 ? 0 : selectedElementIndex + 1;
      } else if (moveUp) {
        activeElementIndex = selectedElementIndex === 0 ? allVisibleElements.length - 1 : selectedElementIndex - 1;
      }

      if (activeElementIndex === selectedElementIndex) return;

      const activeElement = allVisibleElements[activeElementIndex];

      activeElement.setAttribute('aria-selected', true);
      if (selectedElement) selectedElement.setAttribute('aria-selected', false);

      this.input.setAttribute('aria-activedescendant', activeElement.id);
    }

    selectOption() {
      const selectedOption = this.querySelector(selectors$Y.selectedOption);

      if (selectedOption) selectedOption.click();
    }

    getSearchResults(searchTerm) {
      const queryKey = searchTerm.replace(' ', '-').toLowerCase();
      this.setLiveRegionLoadingState();

      if (this.cachedResults[queryKey]) {
        this.renderSearchResults(this.cachedResults[queryKey]);
        return;
      }

      fetch(`${theme.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&section_id=predictive-search`, {signal: this.abortController.signal})
        .then((response) => {
          if (!response.ok) {
            var error = new Error(response.status);
            this.close();
            throw error;
          }

          return response.text();
        })
        .then((text) => {
          const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector(selectors$Y.sectionPredictiveSearch).innerHTML;
          // Save bandwidth keeping the cache in all instances synced
          this.allPredictiveSearchInstances.forEach((predictiveSearchInstance) => {
            predictiveSearchInstance.cachedResults[queryKey] = resultsMarkup;
          });
          this.renderSearchResults(resultsMarkup);
        })
        .catch((error) => {
          if (error?.code === 20) {
            // Code 20 means the call was aborted
            return;
          }
          this.close();
          throw error;
        });
    }

    setLiveRegionLoadingState() {
      this.statusElement = this.statusElement || this.querySelector(selectors$Y.predictiveSearchStatus);
      this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

      this.setLiveRegionText(this.loadingText);
      this.setAttribute('loading', true);
    }

    setLiveRegionText(statusText) {
      this.statusElement.setAttribute('aria-hidden', 'false');
      this.statusElement.textContent = statusText;

      setTimeout(() => {
        this.statusElement.setAttribute('aria-hidden', 'true');
      }, 1000);
    }

    renderSearchResults(resultsMarkup) {
      this.predictiveSearchResults.innerHTML = resultsMarkup;

      this.setAttribute('results', true);

      this.setLiveRegionResults();
      this.open();
    }

    setLiveRegionResults() {
      this.removeAttribute('loading');
      this.setLiveRegionText(this.querySelector(selectors$Y.searchResultsLiveRegion).textContent);
    }

    open() {
      this.setAttribute('open', true);
      this.input.setAttribute('aria-expanded', true);
      this.isOpen = true;
    }

    close(clearSearchTerm = false) {
      this.closeResults(clearSearchTerm);
      this.isOpen = false;
    }

    closeResults(clearSearchTerm = false) {
      if (clearSearchTerm) {
        this.input.value = '';
        this.removeAttribute('results');
      }
      const selected = this.querySelector(selectors$Y.ariaSelected);

      if (selected) selected.setAttribute('aria-selected', false);

      this.input.setAttribute('aria-activedescendant', '');
      this.removeAttribute('loading');
      this.removeAttribute('open');
      this.input.setAttribute('aria-expanded', false);
      this.resultsMaxHeight = false;
      this.predictiveSearchResults?.removeAttribute('style');
    }

    reset() {
      this.predictiveSearchResults.innerHTML = '';

      this.input.val = '';
      this.a11y.removeTrapFocus();

      if (this.popularSearches) {
        this.input.dispatchEvent(new Event('blur', {bubbles: false}));
        this.a11y.trapFocus(this.searchPopdown, {
          elementToFocus: this.input,
        });
      }
    }
  }

  customElements.define('predictive-search', PredictiveSearch);

  const selectors$X = {
    aos: '[data-aos]:not(.aos-animate)',
    aosAnchor: '[data-aos-anchor]',
  };

  const classes$I = {
    aosAnimate: 'aos-animate',
  };

  const observerConfig = {
    attributes: false,
    childList: true,
    subtree: true,
  };

  const mutationCallback = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const element = mutation.target;
        const elementsToAnimate = element.querySelectorAll(selectors$X.aos);
        const anchors = element.querySelectorAll(selectors$X.aosAnchor);

        if (elementsToAnimate.length) {
          elementsToAnimate.forEach((element) => {
            aosItemObserver.observe(element);
          });
        }

        if (anchors.length) {
          // Get all anchors and attach observers
          initAnchorObservers(anchors);
        }
      }
    }
  };

  /*
    Observe each element that needs to be animated
  */
  const aosItemObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(classes$I.aosAnimate);

          // Stop observing element after it was animated
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  /*
    Observe anchor elements
  */
  const aosAnchorObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.1) {
          const elementsToAnimate = entry.target.querySelectorAll(selectors$X.aos);

          if (elementsToAnimate.length) {
            elementsToAnimate.forEach((item) => {
              item.classList.add(classes$I.aosAnimate);
            });
          }

          // Stop observing anchor element after inner elements were animated
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: [0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  /*
    Watch for mutations in the body and start observing the newly added animated elements and anchors
  */
  function bodyMutationObserver() {
    const bodyObserver = new MutationObserver(mutationCallback);
    bodyObserver.observe(document.body, observerConfig);
  }

  /*
    Observe animated elements that have attribute [data-aos]
  */
  function elementsIntersectionObserver() {
    const elementsToAnimate = document.querySelectorAll(selectors$X.aos);

    if (elementsToAnimate.length) {
      elementsToAnimate.forEach((element) => {
        aosItemObserver.observe(element);
      });
    }
  }

  /*
    Observe animated elements that have attribute [data-aos]
  */
  function anchorsIntersectionObserver() {
    const anchors = document.querySelectorAll(selectors$X.aosAnchor);

    if (anchors.length) {
      // Get all anchors and attach observers
      initAnchorObservers(anchors);
    }
  }

  function initAnchorObservers(anchors) {
    let anchorContainers = [];

    if (!anchors.length) return;

    anchors.forEach((anchor) => {
      const containerId = anchor.dataset.aosAnchor;

      // Avoid adding multiple observers to the same element
      if (containerId && anchorContainers.indexOf(containerId) === -1) {
        const container = document.querySelector(containerId);

        if (container) {
          aosAnchorObserver.observe(container);
          anchorContainers.push(containerId);
        }
      }
    });
  }

  function initAnimations() {
    elementsIntersectionObserver();
    anchorsIntersectionObserver();
    bodyMutationObserver();
  }

  // Safari requestIdleCallback polyfill
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      var start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };
  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id) {
      clearTimeout(id);
    };

  if (window.theme.settings.enableAnimations) {
    initAnimations();
  }

  resizeListener();
  scrollListener();
  isTouch();
  setVars();
  loadedImagesEventHook();

  window.addEventListener('DOMContentLoaded', () => {
    setVarsOnResize();
    ariaToggle(document);
    floatLabels(document);
    wrapElements(document);
    removeLoadingClassFromLoadedImages(document);
    loading();

    if (window.fastNetworkAndCPU) {
      preloadImages();
    }
  });

  document.addEventListener('shopify:section:load', (e) => {
    const container = e.target;
    floatLabels(container);
    wrapElements(container);
    ariaToggle(document);
    setVarsOnResize();
  });

  const showElement = (elem, removeProp = false, prop = 'block') => {
    if (elem) {
      if (removeProp) {
        elem.style.removeProperty('display');
      } else {
        elem.style.display = prop;
      }
    }
  };

  /**
   * Module to show Recently Viewed Products
   *
   * Copyright (c) 2014 Caroline Schnapp (11heavens.com)
   * Dual licensed under the MIT and GPL licenses:
   * http://www.opensource.org/licenses/mit-license.php
   * http://www.gnu.org/licenses/gpl.html
   *
   */

  Shopify.Products = (function () {
    const config = {
      howManyToShow: 4,
      howManyToStoreInMemory: 10,
      wrapperId: 'recently-viewed-products',
      section: null,
      onComplete: null,
    };

    let productHandleQueue = [];
    let wrapper = null;
    let howManyToShowItems = null;

    const today = new Date();
    const expiresDate = new Date();
    const daysToExpire = 90;
    expiresDate.setTime(today.getTime() + 3600000 * 24 * daysToExpire);

    const cookie = {
      configuration: {
        expires: expiresDate.toGMTString(),
        path: '/',
        domain: window.location.hostname,
        sameSite: 'none',
        secure: true,
      },
      name: 'shopify_recently_viewed',
      write: function (recentlyViewed) {
        const recentlyViewedString = recentlyViewed.join(' ');
        document.cookie = `${this.name}=${recentlyViewedString}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}; sameSite=${this.configuration.sameSite}; secure=${this.configuration.secure}`;
      },
      read: function () {
        let recentlyViewed = [];
        let cookieValue = null;

        if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
          cookieValue = document.cookie
            .split('; ')
            .find((row) => row.startsWith(this.name))
            .split('=')[1];
        }

        if (cookieValue !== null) {
          recentlyViewed = cookieValue.split(' ');
        }

        return recentlyViewed;
      },
      destroy: function () {
        const cookieVal = null;
        document.cookie = `${this.name}=${cookieVal}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      },
      remove: function (productHandle) {
        const recentlyViewed = this.read();
        const position = recentlyViewed.indexOf(productHandle);
        if (position !== -1) {
          recentlyViewed.splice(position, 1);
          this.write(recentlyViewed);
        }
      },
    };

    const finalize = (wrapper, section) => {
      showElement(wrapper, true);
      const cookieItemsLength = cookie.read().length;

      if (Shopify.recentlyViewed && howManyToShowItems && cookieItemsLength && cookieItemsLength < howManyToShowItems && wrapper.children.length) {
        let allClassesArr = [];
        let addClassesArr = [];
        let objCounter = 0;
        for (const property in Shopify.recentlyViewed) {
          objCounter += 1;
          const objString = Shopify.recentlyViewed[property];
          const objArr = objString.split(' ');
          const propertyIdx = parseInt(property.split('_')[1]);
          allClassesArr = [...allClassesArr, ...objArr];

          if (cookie.read().length === propertyIdx || (objCounter === Object.keys(Shopify.recentlyViewed).length && !addClassesArr.length)) {
            addClassesArr = [...addClassesArr, ...objArr];
          }
        }

        for (let i = 0; i < wrapper.children.length; i++) {
          const element = wrapper.children[i];
          if (allClassesArr.length) {
            element.classList.remove(...allClassesArr);
          }

          if (addClassesArr.length) {
            element.classList.add(...addClassesArr);
          }
        }
      }

      // If we have a callback.
      if (config.onComplete) {
        try {
          config.onComplete(wrapper, section);
        } catch (error) {
          console.log(error);
        }
      }
    };

    const moveAlong = (shown, productHandleQueue, wrapper, section) => {
      if (productHandleQueue.length && shown < config.howManyToShow) {
        fetch(`${window.theme.routes.root}products/${productHandleQueue[0]}?section_id=api-product-grid-item`)
          .then((response) => response.text())
          .then((product) => {
            const aosDelay = shown * 150;
            const aosImageDuration = shown * 100 + 800;
            const aosTextDuration = shown * 50 + 800;
            const anchorAnimation = wrapper.id ? `#${wrapper.id}` : '';
            const fresh = document.createElement('div');
            let productReplaced = product.includes('||itemIndex||') ? product.replaceAll('||itemIndex||', shown) : product;
            productReplaced = productReplaced.includes('||itemAosDelay||') ? productReplaced.replaceAll('||itemAosDelay||', aosDelay) : productReplaced;
            productReplaced = productReplaced.includes('||itemAosImageDuration||') ? productReplaced.replaceAll('||itemAosImageDuration||', aosImageDuration) : productReplaced;
            productReplaced = productReplaced.includes('||itemAosTextDuration||') ? productReplaced.replaceAll('||itemAosTextDuration||', aosTextDuration) : productReplaced;
            productReplaced = productReplaced.includes('||itemAnimationAnchor||') ? productReplaced.replaceAll('||itemAnimationAnchor||', anchorAnimation) : productReplaced;
            fresh.innerHTML = productReplaced;

            wrapper.innerHTML += fresh.querySelector('[data-api-content]').innerHTML;

            productHandleQueue.shift();
            shown++;
            moveAlong(shown, productHandleQueue, wrapper, section);
          })
          .catch(() => {
            cookie.remove(productHandleQueue[0]);
            productHandleQueue.shift();
            moveAlong(shown, productHandleQueue, wrapper, section);
          });
      } else {
        finalize(wrapper, section);
      }
    };

    return {
      showRecentlyViewed: function (params) {
        const paramsNew = params || {};
        const shown = 0;

        // Update defaults.
        Object.assign(config, paramsNew);

        // Read cookie.
        productHandleQueue = cookie.read();

        // Element where to insert.
        wrapper = document.querySelector(`#${config.wrapperId}`);

        // How many products to show.
        howManyToShowItems = config.howManyToShow;
        config.howManyToShow = Math.min(productHandleQueue.length, config.howManyToShow);

        // If we have any to show.
        if (config.howManyToShow && wrapper) {
          // Getting each product with an Ajax call and rendering it on the page.
          moveAlong(shown, productHandleQueue, wrapper, config.section);
        }
      },

      getConfig: function () {
        return config;
      },

      clearList: function () {
        cookie.destroy();
      },

      recordRecentlyViewed: function (params) {
        const paramsNew = params || {};

        // Update defaults.
        Object.assign(config, paramsNew);

        // Read cookie.
        let recentlyViewed = cookie.read();

        // If we are on a product page.
        if (window.location.pathname.indexOf('/products/') !== -1) {
          // What is the product handle on this page.
          let productHandle = decodeURIComponent(window.location.pathname)
            .match(
              /\/products\/([a-z0-9\-]|[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|[\u203B]|[\w\u0430-\u044f]|[\u0400-\u04FF]|[\u0900-\u097F]|[\u0590-\u05FF\u200f\u200e]|[\u0621-\u064A\u0660-\u0669 ])+/
            )[0]
            .split('/products/')[1];

          if (config.handle) {
            productHandle = config.handle;
          }

          // In what position is that product in memory.
          const position = recentlyViewed.indexOf(productHandle);

          // If not in memory.
          if (position === -1) {
            // Add product at the start of the list.
            recentlyViewed.unshift(productHandle);
            // Only keep what we need.
            recentlyViewed = recentlyViewed.splice(0, config.howManyToStoreInMemory);
          } else {
            // Remove the product and place it at start of list.
            recentlyViewed.splice(position, 1);
            recentlyViewed.unshift(productHandle);
          }

          // Update cookie.
          cookie.write(recentlyViewed);
        }
      },

      hasProducts: cookie.read().length > 0,
    };
  })();

  const getUrlString = (params, keys = [], isArray = false) => {
    const p = Object.keys(params)
      .map((key) => {
        let val = params[key];

        if ('[object Object]' === Object.prototype.toString.call(val) || Array.isArray(val)) {
          if (Array.isArray(params)) {
            keys.push('');
          } else {
            keys.push(key);
          }
          return getUrlString(val, keys, Array.isArray(val));
        } else {
          let tKey = key;

          if (keys.length > 0) {
            const tKeys = isArray ? keys : [...keys, key];
            tKey = tKeys.reduce((str, k) => {
              return '' === str ? k : `${str}[${k}]`;
            }, '');
          }
          if (isArray) {
            return `${tKey}[]=${val}`;
          } else {
            return `${tKey}=${val}`;
          }
        }
      })
      .join('&');

    keys.pop();
    return p;
  };

  const hideElement = (elem) => {
    if (elem) {
      elem.style.display = 'none';
    }
  };

  const fadeIn = (el, display, callback = null) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    let flag = true;

    (function fade() {
      let val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }

      if (parseInt(val) === 1 && flag && typeof callback === 'function') {
        flag = false;
        callback();
      }
    })();
  };

  /**
   * Module to add a shipping rates calculator to cart page.
   *
   * Copyright (c) 2011-2012 Caroline Schnapp (11heavens.com)
   * Dual licensed under the MIT and GPL licenses:
   * http://www.opensource.org/licenses/mit-license.php
   * http://www.gnu.org/licenses/gpl.html
   *
   * Modified version -- coupled with Broadcast theme markup
   *
   */

  if (typeof Shopify.Cart === 'undefined') {
    Shopify.Cart = {};
  }

  Shopify.Cart.ShippingCalculator = (function () {
    const _config = {
      submitButton: theme.strings.shippingCalcSubmitButton,
      submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
      templateId: 'shipping-calculator-response-template',
      wrapperId: 'wrapper-response',
      customerIsLoggedIn: false,
    };
    const _render = function (response) {
      const template = document.querySelector(`#${_config.templateId}`);
      const wrapper = document.querySelector(`#${_config.wrapperId}`);

      if (template && wrapper) {
        wrapper.innerHTML = '';
        let ratesList = '';
        let ratesText = '';
        let successClass = 'error center';
        let markup = template.innerHTML;
        const rateRegex = /[^[\]]+(?=])/g;

        if (response.rates && response.rates.length) {
          let rateTemplate = rateRegex.exec(markup)[0];
          response.rates.forEach((rate) => {
            let rateHtml = rateTemplate;
            rateHtml = rateHtml.replace(/\|\|rateName\|\|/, rate.name);
            rateHtml = rateHtml.replace(/\|\|ratePrice\|\|/, Shopify.Cart.ShippingCalculator.formatRate(rate.price));
            ratesList += rateHtml;
          });
        }

        if (response.success) {
          successClass = 'success center';
          const createdNewElem = document.createElement('div');
          createdNewElem.innerHTML = template.innerHTML;
          const noShippingElem = createdNewElem.querySelector('[data-template-no-shipping]');

          if (response.rates.length < 1 && noShippingElem) {
            ratesText = noShippingElem.getAttribute('data-template-no-shipping');
          }
        } else {
          ratesText = response.errorFeedback;
        }

        markup = markup.replace(rateRegex, '').replace('[]', '');
        markup = markup.replace(/\|\|ratesList\|\|/g, ratesList);
        markup = markup.replace(/\|\|successClass\|\|/g, successClass);
        markup = markup.replace(/\|\|ratesText\|\|/g, ratesText);

        wrapper.innerHTML += markup;
      }
    };
    const _enableButtons = function () {
      const getRatesButton = document.querySelector('.get-rates');
      getRatesButton.removeAttribute('disabled');
      getRatesButton.classList.remove('disabled');
      getRatesButton.value = _config.submitButton;
    };
    const _disableButtons = function () {
      const getRatesButton = document.querySelector('.get-rates');
      getRatesButton.setAttribute('disabled', 'disabled');
      getRatesButton.classList.add('disabled');
      getRatesButton.value = _config.submitButtonDisabled;
    };
    const _getCartShippingRatesForDestination = function (shipping_address) {
      const encodedShippingAddressData = encodeURI(
        getUrlString({
          shipping_address: shipping_address,
        })
      );
      const url = `${theme.routes.cart_url}/shipping_rates.json?${encodedShippingAddressData}`;
      const request = new XMLHttpRequest();
      request.open('GET', url, true);

      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          const response = JSON.parse(this.response);
          const rates = response.shipping_rates;
          _onCartShippingRatesUpdate(rates, shipping_address);
        } else {
          _onError(this);
        }
      };

      request.onerror = function () {
        _onError(this);
      };

      request.send();
    };
    const _fullMessagesFromErrors = function (errors) {
      const fullMessages = [];

      for (const error in errors) {
        for (const message of errors[error]) {
          fullMessages.push(error + ' ' + message);
        }
      }

      return fullMessages;
    };
    const _onError = function (XMLHttpRequest) {
      hideElement(document.querySelector('#estimated-shipping'));

      const shippingChild = document.querySelector('#estimated-shipping em');
      if (shippingChild) {
        while (shippingChild.firstChild) shippingChild.removeChild(shippingChild.firstChild);
      }
      _enableButtons();
      let feedback = '';
      const data = eval('(' + XMLHttpRequest.responseText + ')');
      if (data.message) {
        feedback = data.message + '(' + data.status + '): ' + data.description;
      } else {
        feedback = 'Error : ' + _fullMessagesFromErrors(data).join('; ');
      }
      if (feedback === 'Error : country is not supported.') {
        feedback = 'We do not ship to this destination.';
      }
      _render({
        rates: [],
        errorFeedback: feedback,
        success: false,
      });

      showElement(document.querySelector(`#${_config.wrapperId}`));
    };
    const _onCartShippingRatesUpdate = function (rates, shipping_address) {
      _enableButtons();
      let readable_address = '';
      if (shipping_address.zip) {
        readable_address += shipping_address.zip + ', ';
      }
      if (shipping_address.province) {
        readable_address += shipping_address.province + ', ';
      }
      readable_address += shipping_address.country;
      const shippingChild = document.querySelector('#estimated-shipping em');
      if (rates.length && shippingChild) {
        shippingChild.textContent = rates[0].price == '0.00' ? window.theme.strings.free : themeCurrency.formatMoney(rates[0].price, theme.moneyFormat);
      }
      _render({
        rates: rates,
        address: readable_address,
        success: true,
      });

      const fadeElements = document.querySelectorAll(`#${_config.wrapperId}, #estimated-shipping`);

      if (fadeElements.length) {
        fadeElements.forEach((element) => {
          fadeIn(element);
        });
      }
    };

    const _init = function () {
      const getRatesButton = document.querySelector('.get-rates');
      const fieldsContainer = document.querySelector('#address_container');
      const selectCountry = document.querySelector('#address_country');
      const selectProvince = document.querySelector('#address_province');
      const htmlEl = document.querySelector('html');
      let locale = 'en';
      if (htmlEl.hasAttribute('lang') && htmlEl.getAttribute('lang') !== '') {
        locale = htmlEl.getAttribute('lang');
      }

      if (fieldsContainer) {
        themeAddresses.AddressForm(fieldsContainer, locale, {
          shippingCountriesOnly: true,
        });
      }

      if (selectCountry && selectCountry.hasAttribute('data-default') && selectProvince && selectProvince.hasAttribute('data-default')) {
        selectCountry.addEventListener('change', function () {
          selectCountry.removeAttribute('data-default');
          selectProvince.removeAttribute('data-default');
        });
      }

      if (getRatesButton) {
        getRatesButton.addEventListener('click', function (e) {
          _disableButtons();
          const wrapper = document.querySelector(`#${_config.wrapperId}`);
          while (wrapper.firstChild) wrapper.removeChild(wrapper.firstChild);
          hideElement(wrapper);
          const shippingAddress = {};
          let elemCountryVal = selectCountry.value;
          let elemProvinceVal = selectProvince.value;
          const elemCountryData = selectCountry.getAttribute('data-default-fullname');
          if (elemCountryVal === '' && elemCountryData && elemCountryData !== '') {
            elemCountryVal = elemCountryData;
          }
          const elemProvinceData = selectProvince.getAttribute('data-default-fullname');
          if (elemProvinceVal === '' && elemProvinceData && elemProvinceData !== '') {
            elemProvinceVal = elemProvinceData;
          }
          shippingAddress.zip = document.querySelector('#address_zip').value || '';
          shippingAddress.country = elemCountryVal || '';
          shippingAddress.province = elemProvinceVal || '';
          _getCartShippingRatesForDestination(shippingAddress);
        });

        if (_config.customerIsLoggedIn && getRatesButton.classList.contains('get-rates--trigger')) {
          const zipElem = document.querySelector('#address_zip');
          if (zipElem && zipElem.value) {
            getRatesButton.dispatchEvent(new Event('click'));
          }
        }
      }
    };
    return {
      show: function (params) {
        params = params || {};
        Object.assign(_config, params);
        document.addEventListener('DOMContentLoaded', function () {
          _init();
        });
      },
      getConfig: function () {
        return _config;
      },
      formatRate: function (cents) {
        const price = cents === '0.00' ? window.theme.strings.free : themeCurrency.formatMoney(cents, theme.moneyFormat);
        return price;
      },
    };
  })();

  function FetchError(object) {
    this.status = object.status || null;
    this.headers = object.headers || null;
    this.json = object.json || null;
    this.body = object.body || null;
  }
  FetchError.prototype = Error.prototype;

  function subscribe(eventName, callback) {
    if (window.theme.subscribers[eventName] === undefined) {
      window.theme.subscribers[eventName] = [];
    }

    window.theme.subscribers[eventName] = [...window.theme.subscribers[eventName], callback];

    return function unsubscribe() {
      window.theme.subscribers[eventName] = window.theme.subscribers[eventName].filter((cb) => {
        return cb !== callback;
      });
    };
  }

  function publish(eventName, data) {
    if (window.theme.subscribers[eventName]) {
      window.theme.subscribers[eventName].forEach((callback) => {
        callback(data);
      });
    }
  }

  const selectors$W = {
    quantityHolder: '[data-quantity-holder]',
    quantityField: '[data-quantity-field]',
    quantityButton: '[data-quantity-button]',
    quantityMinusButton: '[data-quantity-minus]',
    quantityPlusButton: '[data-quantity-plus]',
    quantityReadOnly: 'read-only',
    isDisabled: 'is-disabled',
  };

  class QuantityCounter {
    constructor(holder, inCart = false) {
      this.holder = holder;
      this.quantityUpdateCart = inCart;
    }

    init() {
      // Settings
      this.settings = selectors$W;

      // DOM Elements
      this.quantity = this.holder.querySelector(this.settings.quantityHolder);

      if (!this.quantity) {
        return;
      }

      this.field = this.quantity.querySelector(this.settings.quantityField);
      this.buttons = this.quantity.querySelectorAll(this.settings.quantityButton);
      this.increaseButton = this.quantity.querySelector(this.settings.quantityPlusButton);

      // Set value or classes
      this.quantityValue = Number(this.field.value || 0);
      this.cartItemID = this.field.getAttribute('data-id');
      this.maxValue = Number(this.field.getAttribute('max')) > 0 ? Number(this.field.getAttribute('max')) : null;
      this.minValue = Number(this.field.getAttribute('min')) > 0 ? Number(this.field.getAttribute('min')) : 0;
      this.disableIncrease = this.disableIncrease.bind(this);

      // Methods
      this.updateQuantity = this.updateQuantity.bind(this);
      this.decrease = this.decrease.bind(this);
      this.increase = this.increase.bind(this);

      this.disableIncrease();

      // Events
      if (!this.quantity.classList.contains(this.settings.quantityReadOnly)) {
        this.changeValueOnClick();
        this.changeValueOnInput();
      }
    }

    /**
     * Change field value when click on quantity buttons
     *
     * @return  {Void}
     */

    changeValueOnClick() {
      const that = this;

      this.buttons.forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();

          this.quantityValue = Number(this.field.value || 0);

          const clickedElement = event.target;
          const isDescrease = clickedElement.matches(that.settings.quantityMinusButton) || clickedElement.closest(that.settings.quantityMinusButton);
          const isIncrease = clickedElement.matches(that.settings.quantityPlusButton) || clickedElement.closest(that.settings.quantityPlusButton);

          if (isDescrease) {
            that.decrease();
          }

          if (isIncrease) {
            that.increase();
          }

          that.updateQuantity();
        });
      });
    }

    /**
     * Change field value when input new value in a field
     *
     * @return  {Void}
     */

    changeValueOnInput() {
      this.field.addEventListener('change', () => {
        this.quantityValue = this.field.value;
        this.updateQuantity();
      });
    }

    /**
     * Update field value
     *
     * @return  {Void}
     */

    updateQuantity() {
      if (this.maxValue < this.quantityValue && this.maxValue !== null) {
        this.quantityValue = this.maxValue;
      }

      if (this.minValue > this.quantityValue) {
        this.quantityValue = this.minValue;
      }

      this.field.value = this.quantityValue;

      this.disableIncrease();

      if (this.quantityUpdateCart) {
        this.updateCart();
      }
    }

    /**
     * Decrease value
     *
     * @return  {Void}
     */

    decrease() {
      if (this.quantityValue > this.minValue) {
        this.quantityValue--;

        return;
      }

      this.quantityValue = 0;
    }

    /**
     * Increase value
     *
     * @return  {Void}
     */

    increase() {
      this.quantityValue++;
    }

    /**
     * Disable increase
     *
     * @return  {[type]}  [return description]
     */

    disableIncrease() {
      this.increaseButton.classList.toggle(this.settings.isDisabled, this.quantityValue >= this.maxValue && this.maxValue !== null);
    }

    /**
     * Update cart
     *
     * @return  {Void}
     */

    updateCart() {
      if (this.quantityValue === '') return;

      const event = new CustomEvent('theme:cart:update', {
        bubbles: true,
        detail: {
          id: this.cartItemID,
          quantity: this.quantityValue,
        },
      });

      this.holder.dispatchEvent(event);
    }
  }

  const events$2 = {
    cartUpdate: 'cart-update',
    cartError: 'cart-error',
  };

  const classes$H = {
    animated: 'is-animated',
    active: 'is-active',
    added: 'is-added',
    disabled: 'is-disabled',
    error: 'has-error',
    headerStuck: 'js__header__stuck',
    hidden: 'is-hidden',
    hiding: 'is-hiding',
    loading: 'is-loading',
    open: 'is-open',
    removed: 'is-removed',
    success: 'is-success',
    visible: 'is-visible',
    focused: 'is-focused',
    expanded: 'is-expanded',
    updated: 'is-updated',
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailable',
  };

  const selectors$V = {
    apiContent: '[data-api-content]',
    apiLineItems: '[data-api-line-items]',
    apiUpsellItems: '[data-api-upsell-items]',
    apiCartPrice: '[data-api-cart-price]',
    animation: '[data-animation]',
    additionalCheckoutButtons: '.additional-checkout-buttons',
    buttonHolder: '[data-foot-holder]',
    buttonSkipUpsellProduct: '[data-skip-upsell-product]',
    cartBarAdd: '[data-add-to-cart-bar]',
    cartCloseError: '[data-cart-error-close]',
    cartDrawer: '[data-cart-drawer]',
    cartDrawerClose: '[data-cart-drawer-close]',
    cartEmpty: '[data-cart-empty]',
    cartErrors: '[data-cart-errors]',
    cartItemRemove: '[data-item-remove]',
    cartPage: '[data-cart-page]',
    cartToggle: '[data-cart-toggle]',
    cartTotal: '[data-cart-total]',
    errorMessage: '[data-error-message]',
    formCloseError: '[data-close-error]',
    formErrorsContainer: '[data-cart-errors-container]',
    formWrapper: '[data-form-wrapper]',
    freeShipping: '[data-free-shipping]',
    freeShippingGraph: '[data-progress-graph]',
    freeShippingProgress: '[data-progress-bar]',
    headerWrapper: '[data-header-wrapper]',
    item: '[data-item]',
    itemsHolder: '[data-items-holder]',
    leftToSpend: '[data-left-to-spend]',
    navDrawer: '[data-drawer]',
    outerSection: '[data-section-id]',
    priceHolder: '[data-cart-price-holder]',
    quickAddHolder: '[data-quick-add-holder]',
    quickAddModal: '[data-quick-add-modal]',
    qtyInput: '[data-quantity-field]',
    upsellProductsHolder: '[data-upsell-products]',
    upsellWidget: '[data-upsell-widget]',
  };

  const attributes$m = {
    cartToggle: 'data-cart-toggle',
    cartTotal: 'data-cart-total',
    disabled: 'disabled',
    drawerUnderlay: 'data-drawer-underlay',
    freeShipping: 'data-free-shipping',
    freeShippingLimit: 'data-free-shipping-limit',
    hideErrors: 'data-hide-errors',
    item: 'data-item',
    itemIndex: 'data-item-index',
    itemTitle: 'data-item-title',
    quickAddHolder: 'data-quick-add-holder',
    quickAddVariant: 'data-quick-add-variant',
  };

  class CartDrawer {
    constructor() {
      if (window.location.pathname.endsWith('/password')) {
        return;
      }

      this.init();
    }

    init() {
      // DOM Elements
      this.cartPage = document.querySelector(selectors$V.cartPage);
      this.cartDrawer = document.querySelector(selectors$V.cartDrawer);
      this.cartDrawerClose = document.querySelector(selectors$V.cartDrawerClose);
      this.cartEmpty = document.querySelector(selectors$V.cartEmpty);
      this.buttonHolder = document.querySelector(selectors$V.buttonHolder);
      this.itemsHolder = document.querySelector(selectors$V.itemsHolder);
      this.priceHolder = document.querySelector(selectors$V.priceHolder);
      this.items = document.querySelectorAll(selectors$V.item);
      this.cartTotal = document.querySelector(selectors$V.cartTotal);
      this.freeShipping = document.querySelectorAll(selectors$V.freeShipping);
      this.cartErrorHolder = document.querySelector(selectors$V.cartErrors);
      this.cartCloseErrorMessage = document.querySelector(selectors$V.cartCloseError);
      this.headerWrapper = document.querySelector(selectors$V.headerWrapper);
      this.accessibility = a11y;
      this.navDrawer = document.querySelector(selectors$V.navDrawer);
      this.upsellProductsHolder = document.querySelector(selectors$V.upsellProductsHolder);
      this.hideErrors = false;
      this.subtotal = window.theme.subtotal;

      // Define Cart object depending on if we have cart drawer or cart page
      this.cart = this.cartDrawer || this.cartPage;

      // Cart events
      this.cartAddEvent = this.cartAddEvent.bind(this);
      this.addToCart = this.addToCart.bind(this);
      this.updateProgress = this.updateProgress.bind(this);

      // Set global event listeners for "Add to cart" and Announcement bar wheel progress
      document.addEventListener('theme:cart:add', this.cartAddEvent);
      document.addEventListener('theme:announcement:init', this.updateProgress);

      // Upsell products
      this.skipUpsellProductsArray = [];
      this.skipUpsellProductEvent();
      this.checkSkippedUpsellProductsFromStorage();
      this.toggleCartUpsellWidgetVisibility();

      // Init estimate shipping calculator
      this.estimateShippingCalculator();

      // Free Shipping values
      this.circumference = 28 * Math.PI; // radius - stroke * 4 * PI
      this.cartFreeShippingLimit = 0;

      this.freeShippingMessageHandle(this.subtotal);
      this.updateProgress();

      // Don't run any cart JS if Cart drawer is disabled and you are not on the Cart page
      if (!this.cart) return;

      this.build = this.build.bind(this);
      this.updateCart = this.updateCart.bind(this);
      this.productAddCallback = this.productAddCallback.bind(this);
      this.openCartDrawer = this.openCartDrawer.bind(this);
      this.closeCartDrawer = this.closeCartDrawer.bind(this);
      this.toggleCartDrawer = this.toggleCartDrawer.bind(this);
      this.openCartDrawerOnProductAdded = this.openCartDrawerOnProductAdded.bind(this);
      this.animateItems = this.animateItems.bind(this);
      this.showAnimatedItems = this.showAnimatedItems.bind(this);

      if (this.cartPage) {
        this.showAnimatedItems();
      }

      // Checking
      this.hasItemsInCart = this.hasItemsInCart.bind(this);
      this.cartCount = this.getCartItemCount();

      // Set classes
      this.toggleClassesOnContainers = this.toggleClassesOnContainers.bind(this);

      // Flags
      this.totalItems = this.items.length;
      this.cartDrawerIsOpen = false;
      this.cartDrawerEnabled = theme.settings.cartDrawerEnabled;
      this.cartUpdateFailed = false;

      // Cart Events
      this.cartToggleEvents();
      this.cartEvents();

      // Init quantity for fields
      this.initQuantity();

      document.addEventListener('theme:cart:toggle', this.toggleCartDrawer);
      document.addEventListener('theme:quick-add:open', this.closeCartDrawer);
      document.addEventListener('theme:product:add', this.productAddCallback);
      document.addEventListener('theme:product:add-error', this.productAddCallback);
      document.addEventListener('theme:product:added', this.openCartDrawerOnProductAdded);
    }

    /**
     * Init quantity field functionality
     *
     * @return  {Void}
     */

    initQuantity() {
      this.items = document.querySelectorAll(selectors$V.item);

      this.items.forEach((item) => {
        const initQuantity = new QuantityCounter(item, true);

        initQuantity.init();
        this.cartUpdateEvent(item);
      });
    }

    /**
     * Cart update event hook
     *
     * @return  {Void}
     */

    cartUpdateEvent(item) {
      item.addEventListener('theme:cart:update', (event) => {
        this.updateCart(
          {
            id: event.detail.id,
            quantity: event.detail.quantity,
          },
          item
        );
      });
    }

    /**
     * Cart events
     *
     * @return  {Void}
     */

    cartEvents() {
      const cartItemRemove = document.querySelectorAll(selectors$V.cartItemRemove);

      cartItemRemove.forEach((button) => {
        const item = button.closest(selectors$V.item);
        button.addEventListener('click', (event) => {
          event.preventDefault();

          if (button.classList.contains(classes$H.disabled)) return;

          this.updateCart(
            {
              id: button.dataset.id,
              quantity: 0,
            },
            item
          );
        });
      });

      if (this.cartCloseErrorMessage) {
        this.cartCloseErrorMessage.addEventListener('click', (event) => {
          event.preventDefault();

          this.cartErrorHolder.classList.remove(classes$H.expanded);
        });
      }
    }

    /**
     * Cart event add product to cart
     *
     * @return  {Void}
     */

    cartAddEvent(event) {
      let formData = '';
      let button = event.detail.button;
      if (button.hasAttribute('disabled')) return;
      const form = button.closest('form');
      this.hideErrors = form?.getAttribute(attributes$m.hideErrors) === 'true';
      // Validate form
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      formData = new FormData(form);
      if (form !== null && form.querySelector('[type="file"]')) {
        return;
      }
      event.preventDefault();
      this.addToCart(formData, button);
    }

    /**
     * Cart event remove out of stock error
     *
     * @return  {Void}
     */

    formErrorsEvents(errorContainer) {
      const buttonErrorClose = errorContainer.querySelector(selectors$V.formCloseError);
      buttonErrorClose?.addEventListener('click', (e) => {
        e.preventDefault();

        if (errorContainer) {
          errorContainer.classList.remove(classes$H.visible);
        }
      });
    }

    /**
     * Estimate shippint calculator
     *
     * @return  {Void}
     */

    estimateShippingCalculator() {
      Shopify.Cart.ShippingCalculator.show({
        submitButton: theme.strings.shippingCalcSubmitButton,
        submitButtonDisabled: theme.strings.shippingCalcSubmitButtonDisabled,
        customerIsLoggedIn: theme.settings.customerLoggedIn,
        moneyFormat: theme.moneyWithCurrencyFormat,
      });
    }

    /**
     * Get response from the cart
     *
     * @return  {Void}
     */

    getCart() {
      fetch(theme.routes.cart_url + '?section_id=api-cart-items')
        .then(this.cartErrorsHandler)
        .then((response) => response.text())
        .then((response) => {
          const element = document.createElement('div');
          element.innerHTML = response;

          const cleanResponse = element.querySelector(selectors$V.apiContent);
          this.build(cleanResponse);
        })
        .catch((error) => console.log(error));
    }

    /**
     * Add item(s) to the cart and show the added item(s)
     *
     * @param   {String}  formData
     * @param   {DOM Element}  button
     *
     * @return  {Void}
     */

    addToCart(formData, button) {
      if (this.cart) {
        this.cart.classList.add(classes$H.loading);
      }

      const variantId = formData.get('id');
      const quickAddHolder = button?.closest(selectors$V.quickAddHolder);

      if (this.cartDrawerEnabled) {
        if (button) {
          button.classList.add(classes$H.loading);
          button.disabled = true;
        }

        if (quickAddHolder) {
          quickAddHolder.classList.add(classes$H.visible);
        }
      }

      fetch(theme.routes.cart_add_url, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Accept: 'application/javascript',
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          let error = false;
          if (response.status) {
            publish(events$2.cartError, {source: 'product-form', productVariantId: variantId, errors: response.description, message: response.message});

            this.addToCartError(response, button);

            error = true;
            this.hideErrors = false;

            if (button) {
              button.classList.remove(classes$H.loading);
              button.disabled = false;
            }

            return;
          }

          if (!error) {
            publish(events$2.cartUpdate, {source: 'product-form', productVariantId: variantId});
          }

          if (this.cartDrawerEnabled) {
            if (button) {
              button.classList.remove(classes$H.loading);
              button.classList.add(classes$H.added);

              button.dispatchEvent(
                new CustomEvent('theme:product:add', {
                  detail: {
                    response: response,
                    button: button,
                  },
                  bubbles: true,
                })
              );
            }

            this.getCart();
          } else {
            // Redirect to cart page if "Add to cart" is successful
            window.location = theme.routes.cart_url;
          }
        })
        .catch((error) => {
          this.addToCartError(error, button);
          this.enableCartButtons();
        });
    }

    /**
     * Update cart
     *
     * @param   {Object}  updateData
     *
     * @return  {Void}
     */

    updateCart(updateData = {}, currentItem = null) {
      this.cart.classList.add(classes$H.loading);

      let updatedQuantity = updateData.quantity;
      if (currentItem !== null) {
        if (updatedQuantity) {
          currentItem.classList.add(classes$H.loading);
        } else {
          currentItem.classList.add(classes$H.removed);
        }
      }
      this.disableCartButtons();

      const newItem = this.cart.querySelector(`[${attributes$m.item}="${updateData.id}"]`) || currentItem;
      const lineIndex = newItem?.hasAttribute(attributes$m.itemIndex) ? parseInt(newItem.getAttribute(attributes$m.itemIndex)) : 0;
      const itemTitle = newItem?.hasAttribute(attributes$m.itemTitle) ? newItem.getAttribute(attributes$m.itemTitle) : null;

      if (lineIndex === 0) return;

      const data = {
        line: lineIndex,
        quantity: updatedQuantity,
      };

      fetch(theme.routes.cart_change_url, {
        method: 'post',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.text();
        })
        .then((state) => {
          const parsedState = JSON.parse(state);

          if (parsedState.errors) {
            this.cartUpdateFailed = true;
            this.updateErrorText(itemTitle);
            this.toggleErrorMessage();
            this.resetLineItem(currentItem);
            this.enableCartButtons();

            return;
          }

          this.getCart();
        })
        .catch((error) => {
          console.log(error);
          this.enableCartButtons();
        });
    }

    /**
     * Reset line item initial state
     *
     * @return  {Void}
     */
    resetLineItem(item) {
      const qtyInput = item.querySelector(selectors$V.qtyInput);
      const qty = qtyInput.getAttribute('value');
      qtyInput.value = qty;
      item.classList.remove(classes$H.loading);
    }

    /**
     * Disable cart buttons and inputs
     *
     * @return  {Void}
     */
    disableCartButtons() {
      const inputs = this.cart.querySelectorAll('input');
      const buttons = this.cart.querySelectorAll(`button, ${selectors$V.cartItemRemove}`);

      if (inputs.length) {
        inputs.forEach((item) => {
          item.classList.add(classes$H.disabled);
          item.blur();
          item.disabled = true;
        });
      }

      if (buttons.length) {
        buttons.forEach((item) => {
          item.setAttribute(attributes$m.disabled, true);
        });
      }
    }

    /**
     * Enable cart buttons and inputs
     *
     * @return  {Void}
     */
    enableCartButtons() {
      const inputs = this.cart.querySelectorAll('input');
      const buttons = this.cart.querySelectorAll(`button, ${selectors$V.cartItemRemove}`);

      if (inputs.length) {
        inputs.forEach((item) => {
          item.classList.remove(classes$H.disabled);
          item.disabled = false;
        });
      }

      if (buttons.length) {
        buttons.forEach((item) => {
          item.removeAttribute(attributes$m.disabled);
        });
      }

      this.cart.classList.remove(classes$H.loading);
    }

    /**
     * Update error text
     *
     * @param   {String}  itemTitle
     *
     * @return  {Void}
     */

    updateErrorText(itemTitle) {
      this.cartErrorHolder.querySelector(selectors$V.errorMessage).innerText = itemTitle;
    }

    /**
     * Toggle error message
     *
     * @return  {Void}
     */

    toggleErrorMessage() {
      if (!this.cartErrorHolder) return;

      this.cartErrorHolder.classList.toggle(classes$H.expanded, this.cartUpdateFailed);

      // Reset cart error events flag
      this.cartUpdateFailed = false;
    }

    /**
     * Handle errors
     *
     * @param   {Object}  response
     *
     * @return  {Object}
     */

    cartErrorsHandler(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }

    /**
     * Add to cart error handle
     *
     * @param   {Object}  data
     * @param   {DOM Element/Null} button
     *
     * @return  {Void}
     */

    addToCartError(data, button) {
      if (this.hideErrors) return;

      if (this.cartDrawerEnabled) {
        this.closeCartDrawer();
      }

      if (button !== null) {
        const outerContainer = button.closest(selectors$V.outerSection) || button.closest(selectors$V.quickAddHolder) || button.closest(selectors$V.quickAddModal);
        let errorContainer = outerContainer?.querySelector(selectors$V.formErrorsContainer);
        const buttonUpsellHolder = button.closest(selectors$V.quickAddHolder);

        if (buttonUpsellHolder && buttonUpsellHolder.querySelector(selectors$V.formErrorsContainer)) {
          errorContainer = buttonUpsellHolder.querySelector(selectors$V.formErrorsContainer);
        }

        if (errorContainer) {
          errorContainer.innerHTML = `<div class="errors">${data.message}: ${data.description}<button type="button" class="errors__close" data-close-error><svg aria-hidden="true" focusable="false" role="presentation" width="24px" height="24px" stroke-width="1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor" class="icon icon-cancel"><path d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path></svg></button></div>`;
          errorContainer.classList.add(classes$H.visible);
          this.formErrorsEvents(errorContainer);
        }

        button.dispatchEvent(
          new CustomEvent('theme:product:add-error', {
            detail: {
              response: data,
              button: button,
            },
            bubbles: true,
          })
        );
      }

      const quickAddHolder = button?.closest(selectors$V.quickAddHolder);

      if (quickAddHolder) {
        quickAddHolder.dispatchEvent(
          new CustomEvent('theme:cart:error', {
            bubbles: true,
            detail: {
              message: data.message,
              description: data.description,
              holder: quickAddHolder,
            },
          })
        );
      }

      this.cart?.classList.remove(classes$H.loading);
    }

    /**
     * Add product to cart events
     *
     * @return  {Void}
     */
    productAddCallback(event) {
      let buttons = [];
      let quickAddHolder = null;
      const hasError = event.type == 'theme:product:add-error';
      const buttonATC = event.detail.button;
      const cartBarButtonATC = document.querySelector(selectors$V.cartBarAdd);

      buttons.push(buttonATC);
      quickAddHolder = buttonATC.closest(selectors$V.quickAddHolder);

      if (cartBarButtonATC) {
        buttons.push(cartBarButtonATC);
      }

      buttons.forEach((button) => {
        button.classList.remove(classes$H.loading);
        if (!hasError) {
          button.classList.add(classes$H.added);
        }
      });

      setTimeout(() => {
        buttons.forEach((button) => {
          button.classList.remove(classes$H.added);
          const isVariantUnavailable =
            button.closest(selectors$V.formWrapper)?.classList.contains(classes$H.variantSoldOut) || button.closest(selectors$V.formWrapper)?.classList.contains(classes$H.variantUnavailable);

          if (!isVariantUnavailable) {
            button.disabled = false;
          }
        });

        quickAddHolder?.classList.remove(classes$H.visible);
      }, 1000);
    }

    /**
     * Open cart drawer when product is added to cart
     *
     * @return  {Void}
     */
    openCartDrawerOnProductAdded() {
      if (this.cartDrawerIsOpen) {
        this.showAnimatedItems();
      } else {
        this.openCartDrawer();
      }
    }

    /**
     * Open cart drawer and add class on body
     *
     * @return  {Void}
     */

    openCartDrawer() {
      if (!this.cartDrawer) return;

      this.cartDrawerIsOpen = true;

      this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
      document.body.addEventListener('click', this.onBodyClickEvent);

      document.dispatchEvent(new CustomEvent('theme:cart:open', {bubbles: true}));
      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));

      this.cartDrawer.classList.add(classes$H.open);

      // Observe Additional Checkout Buttons
      this.observeAdditionalCheckoutButtons();

      // Animate cart items
      // setTimeout is needed here to prevent animation issues on Safari
      setTimeout(this.showAnimatedItems);

      this.accessibility.trapFocus(this.cartDrawer, {
        elementToFocus: this.cartDrawer.querySelector(selectors$V.cartDrawerClose),
      });
    }

    /**
     * Close cart drawer and remove class on body
     *
     * @return  {Void}
     */

    closeCartDrawer() {
      if (!this.cartDrawer) return;
      if (!this.cartDrawer.classList.contains(classes$H.open)) return;

      this.cartDrawerIsOpen = false;

      document.dispatchEvent(
        new CustomEvent('theme:cart:close', {
          bubbles: true,
        })
      );

      // Cart elements animation reset
      this.resetAnimatedItems();
      this.itemsHolder.classList.remove(classes$H.updated);
      this.cartEmpty.classList.remove(classes$H.updated);
      this.cartErrorHolder.classList.remove(classes$H.expanded);
      this.cartDrawer.querySelectorAll(selectors$V.animation).forEach((item) => {
        const removeHidingClass = () => {
          item.classList.remove(classes$H.hiding);
          item.removeEventListener('animationend', removeHidingClass);
        };

        item.classList.add(classes$H.hiding);
        item.addEventListener('animationend', removeHidingClass);
      });
      this.cartDrawer.classList.remove(classes$H.open);
      this.accessibility.removeTrapFocus();
      document.body.removeEventListener('click', this.onBodyClickEvent);

      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    /**
     * Toggle cart drawer
     *
     * @return  {Void}
     */

    toggleCartDrawer() {
      if (!this.cartDrawerIsOpen) {
        this.openCartDrawer();
      } else {
        this.closeCartDrawer();
      }
    }

    /**
     * Event click to element to open cart drawer
     *
     * @return  {Void}
     */

    cartToggleEvents() {
      if (this.cartDrawer) {
        this.cartDrawerClose.addEventListener('click', (e) => {
          e.preventDefault();
          this.closeCartDrawer();
        });

        this.cartDrawer.addEventListener('keyup', (event) => {
          if (event.code === window.theme.keyboardKeys.ESCAPE) {
            this.closeCartDrawer();
          }
        });
      }
    }

    onBodyClick(event) {
      if (event.target.hasAttribute(attributes$m.drawerUnderlay)) this.closeCartDrawer();
    }

    /**
     * Toggle classes on different containers and messages
     *
     * @return  {Void}
     */

    toggleClassesOnContainers() {
      const hasItemsInCart = this.hasItemsInCart();

      this.cartEmpty.classList.toggle(classes$H.hidden, hasItemsInCart);
      this.buttonHolder.classList.toggle(classes$H.hidden, !hasItemsInCart);
      this.itemsHolder.classList.toggle(classes$H.hidden, !hasItemsInCart);
    }

    /**
     * Build cart depends on results
     *
     * @param   {Object}  data
     *
     * @return  {Void}
     */

    build(data) {
      const cartItemsData = data.querySelector(selectors$V.apiLineItems);
      const upsellItemsData = data.querySelector(selectors$V.apiUpsellItems);
      const cartEmptyData = Boolean(cartItemsData === null && upsellItemsData === null);
      const priceData = data.querySelector(selectors$V.apiCartPrice);
      const cartTotal = data.querySelector(selectors$V.cartTotal);

      if (this.priceHolder && priceData) {
        this.priceHolder.innerHTML = priceData.innerHTML;
      }

      if (cartEmptyData) {
        this.itemsHolder.innerHTML = data;
        this.upsellProductsHolder.innerHTML = '';
      } else {
        this.itemsHolder.innerHTML = cartItemsData.innerHTML;
        this.upsellProductsHolder.innerHTML = upsellItemsData.innerHTML;
        this.skipUpsellProductEvent();
        this.checkSkippedUpsellProductsFromStorage();
        this.toggleCartUpsellWidgetVisibility();
      }

      this.newTotalItems = cartItemsData && cartItemsData.querySelectorAll(selectors$V.item).length ? cartItemsData.querySelectorAll(selectors$V.item).length : 0;
      this.subtotal = cartTotal && cartTotal.hasAttribute(attributes$m.cartTotal) ? parseInt(cartTotal.getAttribute(attributes$m.cartTotal)) : 0;
      this.cartCount = this.getCartItemCount();

      document.dispatchEvent(
        new CustomEvent('theme:cart:change', {
          bubbles: true,
          detail: {
            cartCount: this.cartCount,
          },
        })
      );

      // Update cart total price
      this.cartTotal.innerHTML = this.subtotal === 0 ? window.theme.strings.free : themeCurrency.formatMoney(this.subtotal, theme.moneyWithCurrencyFormat);

      // Remove cart loading class
      this.cart.classList.remove(classes$H.loading);

      if (this.totalItems !== this.newTotalItems) {
        this.totalItems = this.newTotalItems;

        this.toggleClassesOnContainers();
      }

      // Add class "is-updated" line items holder to reduce cart items animation delay via CSS variables
      if (this.cartDrawerIsOpen) {
        this.itemsHolder.classList.add(classes$H.updated);
      }

      // Prepare empty cart buttons for animation
      if (!this.hasItemsInCart()) {
        this.cartEmpty.querySelectorAll(selectors$V.animation).forEach((item) => {
          item.classList.remove(classes$H.animated);
        });
      }

      this.freeShippingMessageHandle(this.subtotal);
      this.cartEvents();
      this.initQuantity();
      this.toggleErrorMessage();
      this.enableCartButtons();
      this.updateProgress();

      document.dispatchEvent(
        new CustomEvent('theme:product:added', {
          bubbles: true,
        })
      );

      if (!this.cartDrawer) {
        this.showAnimatedItems();
      }
    }

    /**
     * Get cart item count
     *
     * @return  {Void}
     */

    getCartItemCount() {
      return Array.from(this.cart.querySelectorAll(selectors$V.qtyInput)).reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
    }

    /**
     * Check for items in the cart
     *
     * @return  {Void}
     */

    hasItemsInCart() {
      return this.totalItems > 0;
    }

    /**
     * Show/hide free shipping message
     *
     * @param   {Number}  total
     *
     * @return  {Void}
     */

    freeShippingMessageHandle(total) {
      if (!this.freeShipping.length) return;

      this.cartFreeShippingLimit = Number(this.freeShipping[0].getAttribute(attributes$m.freeShippingLimit)) * 100 * window.Shopify.currency.rate;

      this.freeShipping.forEach((message) => {
        const hasQualifiedShippingMessage = message.hasAttribute(attributes$m.freeShipping) && message.getAttribute(attributes$m.freeShipping) === 'true' && total >= 0;
        message.classList.toggle(classes$H.success, hasQualifiedShippingMessage && total >= this.cartFreeShippingLimit);
      });
    }

    /**
     * Update progress when update cart
     *
     * @return  {Void}
     */

    updateProgress() {
      this.freeShipping = document.querySelectorAll(selectors$V.freeShipping);

      if (!this.freeShipping.length) return;

      const percentValue = isNaN(this.subtotal / this.cartFreeShippingLimit) ? 100 : this.subtotal / this.cartFreeShippingLimit;
      const percent = Math.min(percentValue * 100, 100);
      const dashoffset = this.circumference - ((percent / 100) * this.circumference) / 2;
      const leftToSpend = themeCurrency.formatMoney(this.cartFreeShippingLimit - this.subtotal, theme.moneyFormat);

      this.freeShipping.forEach((item) => {
        const progressBar = item.querySelector(selectors$V.freeShippingProgress);
        const progressGraph = item.querySelector(selectors$V.freeShippingGraph);
        const leftToSpendMessage = item.querySelector(selectors$V.leftToSpend);

        if (leftToSpendMessage) {
          leftToSpendMessage.innerHTML = leftToSpend.replace('.00', '').replace(',00', '');
        }

        // Set progress bar value
        if (progressBar) {
          progressBar.value = percent;
        }

        // Set circle progress
        if (progressGraph) {
          progressGraph.style.setProperty('--stroke-dashoffset', `${dashoffset}`);
        }
      });
    }

    /**
     * Skip upsell product
     */
    skipUpsellProductEvent() {
      if (this.upsellProductsHolder === null) {
        return;
      }
      const skipButtons = this.upsellProductsHolder.querySelectorAll(selectors$V.buttonSkipUpsellProduct);

      if (skipButtons.length) {
        skipButtons.forEach((button) => {
          button.addEventListener('click', (event) => {
            event.preventDefault();
            const productID = button.closest(selectors$V.quickAddHolder).getAttribute(attributes$m.quickAddHolder);

            if (!this.skipUpsellProductsArray.includes(productID)) {
              this.skipUpsellProductsArray.push(productID);
            }

            // Add skipped upsell product to session storage
            window.sessionStorage.setItem('skip_upsell_products', this.skipUpsellProductsArray);

            // Remove upsell product from cart
            this.removeUpsellProduct(productID);
            this.toggleCartUpsellWidgetVisibility();
          });
        });
      }
    }

    /**
     * Check for skipped upsell product added to session storage
     */
    checkSkippedUpsellProductsFromStorage() {
      const skippedUpsellItemsFromStorage = window.sessionStorage.getItem('skip_upsell_products');
      if (!skippedUpsellItemsFromStorage) return;

      const skippedUpsellItemsFromStorageArray = skippedUpsellItemsFromStorage.split(',');

      skippedUpsellItemsFromStorageArray.forEach((productID) => {
        if (!this.skipUpsellProductsArray.includes(productID)) {
          this.skipUpsellProductsArray.push(productID);
        }

        this.removeUpsellProduct(productID);
      });
    }

    removeUpsellProduct(productID) {
      if (!this.upsellProductsHolder) return;

      // Remove skipped upsell product from Cart
      const upsellProduct = this.upsellProductsHolder.querySelector(`[${attributes$m.quickAddHolder}="${productID}"]`);

      if (upsellProduct) {
        upsellProduct.parentNode.remove();
      }
    }

    /**
     * Show or hide cart upsell products widget visibility
     */
    toggleCartUpsellWidgetVisibility() {
      if (!this.upsellProductsHolder) return;

      // Hide upsell container if no items
      const upsellItems = this.upsellProductsHolder.querySelectorAll(selectors$V.quickAddHolder);
      const upsellWidget = this.upsellProductsHolder.closest(selectors$V.upsellWidget);

      if (!upsellWidget) return;

      upsellWidget.classList.toggle(classes$H.hidden, !upsellItems.length);
    }

    observeAdditionalCheckoutButtons() {
      // identify an element to observe
      const additionalCheckoutButtons = this.cartDrawer.querySelector(selectors$V.additionalCheckoutButtons);
      if (additionalCheckoutButtons) {
        // create a new instance of `MutationObserver` named `observer`,
        // passing it a callback function
        const observer = new MutationObserver(() => {
          this.accessibility.trapFocus(this.cartDrawer, {
            elementToFocus: this.cartDrawer.querySelector(selectors$V.cartDrawerClose),
          });
          observer.disconnect();
        });

        // call `observe()` on that MutationObserver instance,
        // passing it the element to observe, and the options object
        observer.observe(additionalCheckoutButtons, {subtree: true, childList: true});
      }
    }

    /**
     * Remove initially added AOS classes to allow animation on cart drawer open
     *
     * @return  {Void}
     */
    resetAnimatedItems() {
      this.cart.querySelectorAll(selectors$V.animation).forEach((item) => {
        item.classList.remove(classes$H.animated);
        item.classList.remove(classes$H.hiding);
      });
    }

    showAnimatedItems() {
      requestAnimationFrame(this.animateItems);
    }

    /**
     * Cart elements opening animation
     *
     * @return  {Void}
     */
    animateItems() {
      this.cart.querySelectorAll(selectors$V.animation).forEach((item) => {
        item.classList.add(classes$H.animated);
      });
    }
  }

  window.cart = new CartDrawer();

  const classes$G = {
    focus: 'is-focused',
  };

  const selectors$U = {
    inPageLink: '[data-skip-content]',
    linkesWithOnlyHash: 'a[href="#"]',
  };

  class Accessibility {
    constructor() {
      this.init();
    }

    init() {
      this.a11y = a11y;

      // DOM Elements
      this.html = document.documentElement;
      this.body = document.body;
      this.inPageLink = document.querySelector(selectors$U.inPageLink);
      this.linkesWithOnlyHash = document.querySelectorAll(selectors$U.linkesWithOnlyHash);

      // A11Y init methods
      this.a11y.focusHash();
      this.a11y.bindInPageLinks();

      // Events
      this.clickEvents();
      this.focusEvents();
    }

    /**
     * Clicked events accessibility
     *
     * @return  {Void}
     */

    clickEvents() {
      if (this.inPageLink) {
        this.inPageLink.addEventListener('click', (event) => {
          event.preventDefault();
        });
      }

      if (this.linkesWithOnlyHash) {
        this.linkesWithOnlyHash.forEach((item) => {
          item.addEventListener('click', (event) => {
            event.preventDefault();
          });
        });
      }
    }

    /**
     * Focus events
     *
     * @return  {Void}
     */

    focusEvents() {
      document.addEventListener('mousedown', () => {
        this.body.classList.remove(classes$G.focus);
      });

      document.addEventListener('keyup', (event) => {
        if (event.code !== window.theme.keyboardKeys.TAB) {
          return;
        }

        this.body.classList.add(classes$G.focus);
      });
    }
  }

  window.accessibility = new Accessibility();

  const selectors$T = {
    inputSearch: 'input[type="search"]',
  };

  class MainSearch extends HeaderSearchForm {
    constructor() {
      super();

      this.allSearchInputs = document.querySelectorAll(selectors$T.inputSearch);
      this.setupEventListeners();
    }

    setupEventListeners() {
      let allSearchForms = [];
      this.allSearchInputs.forEach((input) => allSearchForms.push(input.form));
      this.input.addEventListener('focus', this.onInputFocus.bind(this));
      if (allSearchForms.length < 2) return;
      allSearchForms.forEach((form) => form.addEventListener('reset', this.onFormReset.bind(this)));
      this.allSearchInputs.forEach((input) => input.addEventListener('input', this.onInput.bind(this)));
    }

    onFormReset(event) {
      super.onFormReset(event);
      if (super.shouldResetForm()) {
        this.keepInSync('', this.input);
      }
    }

    onInput(event) {
      const target = event.target;
      this.keepInSync(target.value, target);
    }

    onInputFocus() {
      if (!isDesktop()) {
        this.scrollIntoView({behavior: 'smooth'});
      }
    }

    keepInSync(value, target) {
      this.allSearchInputs.forEach((input) => {
        if (input !== target) {
          input.value = value;
        }
      });
    }
  }

  customElements.define('main-search', MainSearch);

  const selectors$S = {
    details: 'details',
    popdown: '[data-popdown]',
    popdownClose: '[data-popdown-close]',
    popdownToggle: '[data-popdown-toggle]',
    input: 'input:not([type="hidden"])',
  };

  const attributes$l = {
    popdownUnderlay: 'data-popdown-underlay',
  };

  class SearchPopdown extends HTMLElement {
    constructor() {
      super();
      this.popdown = this.querySelector(selectors$S.popdown);
      this.popdownContainer = this.querySelector(selectors$S.details);
      this.popdownToggle = this.querySelector(selectors$S.popdownToggle);
      this.popdownClose = this.querySelector(selectors$S.popdownClose);
      this.a11y = a11y;
    }

    connectedCallback() {
      this.popdownContainer.addEventListener('keyup', (event) => event.code.toUpperCase() === 'ESCAPE' && this.close());
      this.popdownClose.addEventListener('click', this.close.bind(this));
      this.popdownToggle.addEventListener('click', this.onPopdownToggleClick.bind(this));
      this.popdownToggle.setAttribute('role', 'button');
      this.popdown.addEventListener('transitionend', (event) => {
        if (event.propertyName == 'visibility' && this.popdownContainer.hasAttribute('open') && this.popdownContainer.getAttribute('open') == 'false') {
          this.popdownContainer.removeAttribute('open');
        }
      });
    }

    onPopdownToggleClick(event) {
      event.preventDefault();
      event.target.closest(selectors$S.details).hasAttribute('open') ? this.close() : this.open(event);
    }

    onBodyClick(event) {
      if (!this.contains(event.target) || event.target.hasAttribute(attributes$l.popdownUnderlay)) this.close();
    }

    open(event) {
      this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
      event.target.closest(selectors$S.details).setAttribute('open', '');

      document.body.addEventListener('click', this.onBodyClickEvent);
      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));

      // Safari opening transition fix
      requestAnimationFrame(() => {
        event.target.closest(selectors$S.details).setAttribute('open', 'true');
        this.a11y.trapFocus(this.popdown, {
          elementToFocus: this.popdown.querySelector(selectors$S.input),
        });
      });
    }

    close() {
      this.a11y.removeTrapFocus();
      this.popdownContainer.setAttribute('open', 'false');

      document.body.removeEventListener('click', this.onBodyClickEvent);
      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }
  }

  customElements.define('header-search-popdown', SearchPopdown);

  const selectors$R = {
    collapsible: '[data-collapsible]',
    trigger: '[data-collapsible-trigger]',
    body: '[data-collapsible-body]',
    content: '[data-collapsible-content]',
  };

  const attributes$k = {
    open: 'open',
    single: 'single',
  };

  class CollapsibleElements extends HTMLElement {
    constructor() {
      super();

      this.collapsibles = this.querySelectorAll(selectors$R.collapsible);
      this.single = this.hasAttribute(attributes$k.single);
    }

    connectedCallback() {
      this.collapsibles.forEach((collapsible) => {
        const trigger = collapsible.querySelector(selectors$R.trigger);
        const body = collapsible.querySelector(selectors$R.body);

        trigger.addEventListener('click', (event) => this.onCollapsibleClick(event));

        body.addEventListener('transitionend', (event) => {
          if (event.target !== body) return;

          if (collapsible.getAttribute(attributes$k.open) == 'true') {
            this.setBodyHeight(body, 'auto');
          }

          if (collapsible.getAttribute(attributes$k.open) == 'false') {
            collapsible.removeAttribute(attributes$k.open);
            this.setBodyHeight(body, '');
          }
        });
      });
    }

    open(collapsible) {
      if (collapsible.getAttribute('open') == 'true') return;

      const body = collapsible.querySelector(selectors$R.body);
      const content = collapsible.querySelector(selectors$R.content);

      collapsible.setAttribute('open', true);

      this.setBodyHeight(body, content.offsetHeight);
    }

    close(collapsible) {
      if (!collapsible.hasAttribute('open')) return;

      const body = collapsible.querySelector(selectors$R.body);
      const content = collapsible.querySelector(selectors$R.content);

      this.setBodyHeight(body, content.offsetHeight);

      collapsible.setAttribute('open', false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.setBodyHeight(body, 0);
        });
      });
    }

    setBodyHeight(body, contentHeight) {
      body.style.height = contentHeight !== 'auto' && contentHeight !== '' ? `${contentHeight}px` : contentHeight;
    }

    onCollapsibleClick(event) {
      event.preventDefault();

      const trigger = event.target.matches(selectors$R.trigger) ? event.target : event.target.closest(selectors$R.trigger);
      const collapsible = trigger.closest(selectors$R.collapsible);

      // When we want only one item expanded at the same time
      if (this.single) {
        this.collapsibles.forEach((otherCollapsible) => {
          // if otherCollapsible has attribute open and it's not the one we clicked on, remove the open attribute
          if (otherCollapsible.hasAttribute(attributes$k.open) && otherCollapsible != collapsible) {
            requestAnimationFrame(() => {
              this.close(otherCollapsible);
            });
          }
        });
      }

      if (collapsible.hasAttribute(attributes$k.open)) {
        this.close(collapsible);
      } else {
        this.open(collapsible);
      }

      collapsible.dispatchEvent(
        new CustomEvent('theme:form:sticky', {
          bubbles: true,
          detail: {
            element: 'accordion',
          },
        })
      );
    }
  }

  if (!customElements.get('collapsible-elements')) {
    customElements.define('collapsible-elements', CollapsibleElements);
  }

  theme.ProductModel = (function () {
    let modelJsonSections = {};
    let models = {};
    let xrButtons = {};
    const selectors = {
      productMediaWrapper: '[data-product-single-media-wrapper]',
      productSlideshow: '[data-product-slideshow]',
      productXr: '[data-shopify-xr]',
      dataMediaId: 'data-media-id',
      dataModelId: 'data-model-id',
      dataModel3d: 'data-shopify-model3d-id',
      modelViewer: 'model-viewer',
      modelJson: '#ModelJson-',
      classMediaHidden: 'media--hidden',
      deferredMedia: '[data-deferred-media]',
      deferredMediaButton: '[data-deferred-media-button]',
    };
    const classes = {
      isLoading: 'is-loading',
    };

    function init(mediaContainer, sectionId) {
      modelJsonSections[sectionId] = {
        loaded: false,
      };

      const deferredMediaButton = mediaContainer.querySelector(selectors.deferredMediaButton);

      if (deferredMediaButton) {
        deferredMediaButton.addEventListener('click', loadContent.bind(this, mediaContainer, sectionId));
      }
    }

    function loadContent(mediaContainer, sectionId) {
      if (mediaContainer.querySelector(selectors.deferredMedia).getAttribute('loaded')) {
        return;
      }

      mediaContainer.classList.add(classes.isLoading);
      const content = document.createElement('div');
      content.appendChild(mediaContainer.querySelector('template').content.firstElementChild.cloneNode(true));
      const modelViewerElement = content.querySelector('model-viewer');
      const deferredMedia = mediaContainer.querySelector(selectors.deferredMedia);
      deferredMedia.appendChild(modelViewerElement).focus();
      deferredMedia.setAttribute('loaded', true);
      const mediaId = mediaContainer.dataset.mediaId;
      const modelId = modelViewerElement.dataset.modelId;
      const xrButton = mediaContainer.closest(selectors.productSlideshow).parentElement.querySelector(selectors.productXr);
      xrButtons[sectionId] = {
        element: xrButton,
        defaultId: modelId,
      };

      models[mediaId] = {
        modelId: modelId,
        mediaId: mediaId,
        sectionId: sectionId,
        container: mediaContainer,
        element: modelViewerElement,
      };

      window.Shopify.loadFeatures([
        {
          name: 'shopify-xr',
          version: '1.0',
          onLoad: setupShopifyXr,
        },
        {
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: setupModelViewerUi,
        },
      ]);
    }

    function setupShopifyXr(errors) {
      if (errors) {
        console.warn(errors);
        return;
      }
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', function () {
          setupShopifyXr();
        });
        return;
      }

      for (const sectionId in modelJsonSections) {
        if (modelJsonSections.hasOwnProperty(sectionId)) {
          const modelSection = modelJsonSections[sectionId];
          if (modelSection.loaded) {
            continue;
          }

          const modelJson = document.querySelector(`${selectors.modelJson}${sectionId}`);
          if (modelJson) {
            window.ShopifyXR.addModels(JSON.parse(modelJson.innerHTML));
            modelSection.loaded = true;
          }
        }
      }
      window.ShopifyXR.setupXRElements();
    }

    function setupModelViewerUi(errors) {
      if (errors) {
        console.warn(errors);
        return;
      }

      for (const key in models) {
        if (models.hasOwnProperty(key)) {
          const model = models[key];
          if (!model.modelViewerUi) {
            model.modelViewerUi = new Shopify.ModelViewerUI(model.element);
          }
          setupModelViewerListeners(model);
        }
      }
    }

    function setupModelViewerListeners(model) {
      const xrButton = xrButtons[model.sectionId];

      model.container.addEventListener('theme:media:visible', function () {
        xrButton.element.setAttribute(selectors.dataModel3d, model.modelId);

        pauseOtherMedia(model.mediaId);

        if (window.theme.touch) {
          return;
        }
        model.modelViewerUi.play();
      });

      model.container.addEventListener('theme:media:hidden', function () {
        model.modelViewerUi.pause();
      });

      model.container.addEventListener('xrLaunch', function () {
        model.modelViewerUi.pause();
      });

      model.element.addEventListener('load', () => {
        model.container.classList.remove(classes.isLoading);
        pauseOtherMedia(model.mediaId);
      });

      model.element.addEventListener('shopify_model_viewer_ui_toggle_play', function () {
        pauseOtherMedia(model.mediaId);
      });
    }

    function pauseOtherMedia(mediaId) {
      const mediaIdString = `[${selectors.dataMediaId}="${mediaId}"]`;
      const currentMedia = document.querySelector(`${selectors.productMediaWrapper}${mediaIdString}`);
      const otherMedia = document.querySelectorAll(`${selectors.productMediaWrapper}:not(${mediaIdString})`);

      currentMedia.classList.remove(selectors.classMediaHidden);
      if (otherMedia.length) {
        otherMedia.forEach((element) => {
          element.dispatchEvent(new CustomEvent('theme:media:hidden'));
          element.classList.add(selectors.classMediaHidden);
        });
      }
    }

    function removeSectionModels(sectionId) {
      for (const key in models) {
        if (models.hasOwnProperty(key)) {
          const model = models[key];
          if (model.sectionId === sectionId) {
            delete models[key];
          }
        }
      }
      delete modelJsonSections[sectionId];
      delete theme.mediaInstances[sectionId];
    }

    return {
      init: init,
      loadContent: loadContent,
      removeSectionModels: removeSectionModels,
    };
  })();

  const selectors$Q = {
    templateAddresses: '.template-addresses',
    addressNewForm: '#AddressNewForm',
    btnNew: '.address-new-toggle',
    btnEdit: '.address-edit-toggle',
    btnDelete: '.address-delete',
    dataFormId: 'data-form-id',
    dataConfirmMessage: 'data-confirm-message',
    editAddress: '#EditAddress',
    addressCountryNew: 'AddressCountryNew',
    addressProvinceNew: 'AddressProvinceNew',
    addressProvinceContainerNew: 'AddressProvinceContainerNew',
    addressCountryOption: '.address-country-option',
    addressCountry: 'AddressCountry',
    addressProvince: 'AddressProvince',
    addressProvinceContainer: 'AddressProvinceContainer',
  };

  const classes$F = {
    hidden: 'hidden',
  };

  class Addresses {
    constructor(section) {
      this.section = section;
      this.addressNewForm = this.section.querySelector(selectors$Q.addressNewForm);

      this.init();
    }

    init() {
      if (this.addressNewForm) {
        const section = this.section;
        const newAddressForm = this.addressNewForm;
        this.customerAddresses();

        const newButtons = section.querySelectorAll(selectors$Q.btnNew);
        if (newButtons.length) {
          newButtons.forEach((element) => {
            element.addEventListener('click', function () {
              newAddressForm.classList.toggle(classes$F.hidden);
            });
          });
        }

        const editButtons = section.querySelectorAll(selectors$Q.btnEdit);
        if (editButtons.length) {
          editButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$Q.dataFormId);
              section.querySelector(`${selectors$Q.editAddress}_${formId}`).classList.toggle(classes$F.hidden);
            });
          });
        }

        const deleteButtons = section.querySelectorAll(selectors$Q.btnDelete);
        if (deleteButtons.length) {
          deleteButtons.forEach((element) => {
            element.addEventListener('click', function () {
              const formId = this.getAttribute(selectors$Q.dataFormId);
              const confirmMessage = this.getAttribute(selectors$Q.dataConfirmMessage);
              if (confirm(confirmMessage)) {
                Shopify.postLink(window.theme.routes.addresses_url + '/' + formId, {parameters: {_method: 'delete'}});
              }
            });
          });
        }
      }
    }

    customerAddresses() {
      // Initialize observers on address selectors, defined in shopify_common.js
      if (Shopify.CountryProvinceSelector) {
        new Shopify.CountryProvinceSelector(selectors$Q.addressCountryNew, selectors$Q.addressProvinceNew, {
          hideElement: selectors$Q.addressProvinceContainerNew,
        });
      }

      // Initialize each edit form's country/province selector
      const countryOptions = this.section.querySelectorAll(selectors$Q.addressCountryOption);
      countryOptions.forEach((element) => {
        const formId = element.getAttribute(selectors$Q.dataFormId);
        const countrySelector = `${selectors$Q.addressCountry}_${formId}`;
        const provinceSelector = `${selectors$Q.addressProvince}_${formId}`;
        const containerSelector = `${selectors$Q.addressProvinceContainer}_${formId}`;

        new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
          hideElement: containerSelector,
        });
      });
    }
  }

  const template$1 = document.querySelector(selectors$Q.templateAddresses);
  if (template$1) {
    new Addresses(template$1);
  }

  const selectors$P = {
    accountTemplateLogged: '.customer-logged-in',
    account: '.account',
    accountSidebarMobile: '.account-sidebar--mobile',
  };

  class Account {
    constructor(section) {
      this.section = section;

      this.init();
    }

    init() {
      if (this.section.querySelector(selectors$P.account)) {
        this.accountMobileSidebar();
      }
    }

    accountMobileSidebar() {
      if (this.section.querySelector(selectors$P.accountSidebarMobile)) {
        this.section.querySelector(selectors$P.accountSidebarMobile).addEventListener('click', function () {
          const nextElem = this.nextElementSibling;

          if (nextElem && nextElem.tagName === 'UL') {
            nextElem.classList.toggle('visible');
          }
        });
      }
    }
  }

  const template = document.querySelector(selectors$P.accountTemplateLogged);
  if (template) {
    new Account(template);
  }

  const selectors$O = {
    form: '[data-account-form]',
    showReset: '[data-show-reset]',
    hideReset: '[data-hide-reset]',
    recover: '[data-recover-password]',
    recoverSuccess: '[data-recover-success]',
    login: '[data-login-form]',
    recoverHash: '#recover',
    hideClass: 'is-hidden',
  };

  class Login {
    constructor(form) {
      this.form = form;
      this.showButton = form.querySelector(selectors$O.showReset);
      this.hideButton = form.querySelector(selectors$O.hideReset);
      this.recover = form.querySelector(selectors$O.recover);
      this.recoverSuccess = form.querySelector(selectors$O.recoverSuccess);
      this.login = form.querySelector(selectors$O.login);
      this.init();
    }

    init() {
      if (window.location.hash == selectors$O.recoverHash || this.recoverSuccess) {
        this.showRecoverPasswordForm();
      } else {
        this.hideRecoverPasswordForm();
      }
      this.showButton.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.showRecoverPasswordForm();
        }.bind(this),
        false
      );
      this.hideButton.addEventListener(
        'click',
        function (e) {
          e.preventDefault();
          this.hideRecoverPasswordForm();
        }.bind(this),
        false
      );
    }

    showRecoverPasswordForm() {
      this.login.classList.add(selectors$O.hideClass);
      this.recover.classList.remove(selectors$O.hideClass);
      window.location.hash = selectors$O.recoverHash;
      return false;
    }

    hideRecoverPasswordForm() {
      this.recover.classList.add(selectors$O.hideClass);
      this.login.classList.remove(selectors$O.hideClass);
      window.location.hash = '';
      return false;
    }
  }

  const loginForm = document.querySelector(selectors$O.form);
  if (loginForm) {
    new Login(loginForm);
  }

  window.Shopify = window.Shopify || {};
  window.Shopify.theme = window.Shopify.theme || {};
  window.Shopify.theme.sections = window.Shopify.theme.sections || {};

  window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
  window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
  const registered = window.Shopify.theme.sections.registered;
  const instances = window.Shopify.theme.sections.instances;

  const selectors$N = {
    id: 'data-section-id',
    type: 'data-section-type',
  };

  class Registration {
    constructor(type = null, components = []) {
      this.type = type;
      this.components = validateComponentsArray(components);
      this.callStack = {
        onLoad: [],
        onUnload: [],
        onSelect: [],
        onDeselect: [],
        onBlockSelect: [],
        onBlockDeselect: [],
        onReorder: [],
      };
      components.forEach((comp) => {
        for (const [key, value] of Object.entries(comp)) {
          const arr = this.callStack[key];
          if (Array.isArray(arr) && typeof value === 'function') {
            arr.push(value);
          } else {
            console.warn(`Unregisted function: '${key}' in component: '${this.type}'`);
            console.warn(value);
          }
        }
      });
    }

    getStack() {
      return this.callStack;
    }
  }

  class Section {
    constructor(container, registration) {
      this.container = validateContainerElement(container);
      this.id = container.getAttribute(selectors$N.id);
      this.type = registration.type;
      this.callStack = registration.getStack();

      try {
        this.onLoad();
      } catch (e) {
        console.warn(`Error in section: ${this.id}`);
        console.warn(this);
        console.warn(e);
      }
    }

    callFunctions(key, e = null) {
      this.callStack[key].forEach((func) => {
        const props = {
          id: this.id,
          type: this.type,
          container: this.container,
        };
        if (e) {
          func.call(props, e);
        } else {
          func.call(props);
        }
      });
    }

    onLoad() {
      this.callFunctions('onLoad');
    }

    onUnload() {
      this.callFunctions('onUnload');
    }

    onSelect(e) {
      this.callFunctions('onSelect', e);
    }

    onDeselect(e) {
      this.callFunctions('onDeselect', e);
    }

    onBlockSelect(e) {
      this.callFunctions('onBlockSelect', e);
    }

    onBlockDeselect(e) {
      this.callFunctions('onBlockDeselect', e);
    }

    onReorder(e) {
      this.callFunctions('onReorder', e);
    }
  }

  function validateContainerElement(container) {
    if (!(container instanceof Element)) {
      throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
    }
    if (container.getAttribute(selectors$N.id) === null) {
      throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + selectors$N.id + ' attribute.');
    }

    return container;
  }

  function validateComponentsArray(value) {
    if ((typeof value !== 'undefined' && typeof value !== 'object') || value === null) {
      throw new TypeError('Theme Sections: The components object provided is not a valid');
    }

    return value;
  }

  /*
   * @shopify/theme-sections
   * -----------------------------------------------------------------------------
   *
   * A framework to provide structure to your Shopify sections and a load and unload
   * lifecycle. The lifecycle is automatically connected to theme editor events so
   * that your sections load and unload as the editor changes the content and
   * settings of your sections.
   */

  function register(type, components) {
    if (typeof type !== 'string') {
      throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
    }

    if (typeof registered[type] !== 'undefined') {
      throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
    }

    if (!Array.isArray(components)) {
      components = [components];
    }

    const section = new Registration(type, components);
    registered[type] = section;

    return registered;
  }

  function load(types, containers) {
    types = normalizeType(types);

    if (typeof containers === 'undefined') {
      containers = document.querySelectorAll('[' + selectors$N.type + ']');
    }

    containers = normalizeContainers(containers);

    types.forEach(function (type) {
      const registration = registered[type];

      if (typeof registration === 'undefined') {
        return;
      }

      containers = containers.filter(function (container) {
        // Filter from list of containers because container already has an instance loaded
        if (isInstance(container)) {
          return false;
        }

        // Filter from list of containers because container doesn't have data-section-type attribute
        if (container.getAttribute(selectors$N.type) === null) {
          return false;
        }

        // Keep in list of containers because current type doesn't match
        if (container.getAttribute(selectors$N.type) !== type) {
          return true;
        }

        instances.push(new Section(container, registration));

        // Filter from list of containers because container now has an instance loaded
        return false;
      });
    });
  }

  function reorder(selector) {
    var instancesToReorder = getInstances(selector);

    instancesToReorder.forEach(function (instance) {
      instance.onReorder();
    });
  }

  function unload(selector) {
    var instancesToUnload = getInstances(selector);

    instancesToUnload.forEach(function (instance) {
      var index = instances
        .map(function (e) {
          return e.id;
        })
        .indexOf(instance.id);
      instances.splice(index, 1);
      instance.onUnload();
    });
  }

  function getInstances(selector) {
    var filteredInstances = [];

    // Fetch first element if its an array
    if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
      var firstElement = selector[0];
    }

    // If selector element is DOM element
    if (selector instanceof Element || firstElement instanceof Element) {
      var containers = normalizeContainers(selector);

      containers.forEach(function (container) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.container === container;
          })
        );
      });

      // If select is type string
    } else if (typeof selector === 'string' || typeof firstElement === 'string') {
      var types = normalizeType(selector);

      types.forEach(function (type) {
        filteredInstances = filteredInstances.concat(
          instances.filter(function (instance) {
            return instance.type === type;
          })
        );
      });
    }

    return filteredInstances;
  }

  function getInstanceById(id) {
    var instance;

    for (var i = 0; i < instances.length; i++) {
      if (instances[i].id === id) {
        instance = instances[i];
        break;
      }
    }
    return instance;
  }

  function isInstance(selector) {
    return getInstances(selector).length > 0;
  }

  function normalizeType(types) {
    // If '*' then fetch all registered section types
    if (types === '*') {
      types = Object.keys(registered);

      // If a single section type string is passed, put it in an array
    } else if (typeof types === 'string') {
      types = [types];

      // If single section constructor is passed, transform to array with section
      // type string
    } else if (types.constructor === Section) {
      types = [types.prototype.type];

      // If array of typed section constructors is passed, transform the array to
      // type strings
    } else if (Array.isArray(types) && types[0].constructor === Section) {
      types = types.map(function (Section) {
        return Section.type;
      });
    }

    types = types.map(function (type) {
      return type.toLowerCase();
    });

    return types;
  }

  function normalizeContainers(containers) {
    // Nodelist with entries
    if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
      containers = Array.prototype.slice.call(containers);

      // Empty Nodelist
    } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
      containers = [];

      // Handle null (document.querySelector() returns null with no match)
    } else if (containers === null) {
      containers = [];

      // Single DOM element
    } else if (!Array.isArray(containers) && containers instanceof Element) {
      containers = [containers];
    }

    return containers;
  }

  if (window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');

      if (container !== null) {
        load(container.getAttribute(selectors$N.type), container);
      }
    });

    document.addEventListener('shopify:section:reorder', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        reorder(container);
      }
    });

    document.addEventListener('shopify:section:unload', function (event) {
      var id = event.detail.sectionId;
      var container = event.target.querySelector('[' + selectors$N.id + '="' + id + '"]');
      var instance = getInstances(container)[0];

      if (typeof instance === 'object') {
        unload(container);
      }
    });

    document.addEventListener('shopify:section:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onSelect(event);
      }
    });

    document.addEventListener('shopify:section:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onDeselect(event);
      }
    });

    document.addEventListener('shopify:block:select', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockSelect(event);
      }
    });

    document.addEventListener('shopify:block:deselect', function (event) {
      var instance = getInstanceById(event.detail.sectionId);

      if (typeof instance === 'object') {
        instance.onBlockDeselect(event);
      }
    });
  }

  const throttle = (fn, wait) => {
    let prev, next;
    return function invokeFn(...args) {
      const now = Date.now();
      next = clearTimeout(next);
      if (!prev || now - prev >= wait) {
        // eslint-disable-next-line prefer-spread
        fn.apply(null, args);
        prev = now;
      } else {
        next = setTimeout(invokeFn.bind(null, ...args), wait - (now - prev));
      }
    };
  };

  const selectors$M = {
    tooltip: 'data-tooltip',
    tooltipStopMouseEnter: 'data-tooltip-stop-mouseenter',
  };

  const classes$E = {
    tooltipDefault: 'tooltip-default',
    visible: 'is-visible',
    hiding: 'is-hiding',
  };

  let sections$r = {};

  class Tooltip {
    constructor(el, options = {}) {
      this.tooltip = el;
      if (!this.tooltip.hasAttribute(selectors$M.tooltip)) return;
      this.label = this.tooltip.getAttribute(selectors$M.tooltip);
      this.class = options.class || classes$E.tooltipDefault;
      this.transitionSpeed = options.transitionSpeed || 200;
      this.hideTransitionTimeout = 0;
      this.addPinEvent = () => this.addPin();
      this.addPinMouseEvent = () => this.addPin(true);
      this.removePinEvent = (event) => throttle(this.removePin(event), 50);
      this.removePinMouseEvent = (event) => this.removePin(event, true, true);
      this.init();
    }

    init() {
      if (!document.querySelector(`.${this.class}`)) {
        const tooltipTemplate = `<div class="${this.class}__arrow"></div><div class="${this.class}__inner"><div class="${this.class}__text"></div></div>`;
        const tooltipElement = document.createElement('div');
        tooltipElement.className = this.class;
        tooltipElement.innerHTML = tooltipTemplate;
        document.body.appendChild(tooltipElement);
      }

      this.tooltip.addEventListener('mouseenter', this.addPinMouseEvent);
      this.tooltip.addEventListener('mouseleave', this.removePinMouseEvent);
      this.tooltip.addEventListener('theme:tooltip:init', this.addPinEvent);
      document.addEventListener('theme:tooltip:close', this.removePinEvent);
    }

    addPin(stopMouseEnter = false) {
      const tooltipTarget = document.querySelector(`.${this.class}`);

      if (tooltipTarget && ((stopMouseEnter && !this.tooltip.hasAttribute(selectors$M.tooltipStopMouseEnter)) || !stopMouseEnter)) {
        const tooltipTargetArrow = tooltipTarget.querySelector(`.${this.class}__arrow`);
        const tooltipTargetInner = tooltipTarget.querySelector(`.${this.class}__inner`);
        const tooltipTargetText = tooltipTarget.querySelector(`.${this.class}__text`);
        tooltipTargetText.textContent = this.label;

        const tooltipTargetWidth = tooltipTargetInner.offsetWidth;
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const tooltipTop = tooltipRect.top;
        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;
        const tooltipTargetPositionTop = tooltipTop + tooltipHeight + window.scrollY;
        let tooltipTargetPositionLeft = tooltipRect.left - tooltipTargetWidth / 2 + tooltipWidth / 2;
        const tooltipLeftWithWidth = tooltipTargetPositionLeft + tooltipTargetWidth;
        const tooltipTargetWindowDifference = tooltipLeftWithWidth - getWindowWidth();

        if (tooltipTargetWindowDifference > 0) {
          tooltipTargetPositionLeft -= tooltipTargetWindowDifference;
        }

        if (tooltipTargetPositionLeft < 0) {
          tooltipTargetPositionLeft = 0;
        }

        tooltipTargetArrow.style.left = `${tooltipRect.left + tooltipWidth / 2}px`;
        tooltipTarget.style.setProperty('--tooltip-top', `${tooltipTargetPositionTop}px`);
        tooltipTargetInner.style.transform = `translateX(${tooltipTargetPositionLeft}px)`;
        tooltipTarget.classList.remove(classes$E.hiding);
        tooltipTarget.classList.add(classes$E.visible);

        document.addEventListener('theme:scroll', this.removePinEvent);
      }
    }

    removePin(event, stopMouseEnter = false, hideTransition = false) {
      const tooltipTarget = document.querySelector(`.${this.class}`);
      const tooltipVisible = tooltipTarget.classList.contains(classes$E.visible);

      if (tooltipTarget && ((stopMouseEnter && !this.tooltip.hasAttribute(selectors$M.tooltipStopMouseEnter)) || !stopMouseEnter)) {
        if (tooltipVisible && (hideTransition || event.detail.hideTransition)) {
          tooltipTarget.classList.add(classes$E.hiding);

          if (this.hideTransitionTimeout) {
            clearTimeout(this.hideTransitionTimeout);
          }

          this.hideTransitionTimeout = setTimeout(() => {
            tooltipTarget.classList.remove(classes$E.hiding);
          }, this.transitionSpeed);
        }

        tooltipTarget.classList.remove(classes$E.visible);

        document.removeEventListener('theme:scroll', this.removePinEvent);
      }
    }

    unload() {
      this.tooltip.removeEventListener('mouseenter', this.addPinMouseEvent);
      this.tooltip.removeEventListener('mouseleave', this.removePinMouseEvent);
      this.tooltip.removeEventListener('theme:tooltip:init', this.addPinEvent);
      document.removeEventListener('theme:tooltip:close', this.removePinEvent);
      document.removeEventListener('theme:scroll', this.removePinEvent);
    }
  }

  const tooltipSection = {
    onLoad() {
      sections$r[this.id] = [];
      const els = this.container.querySelectorAll(`[${selectors$M.tooltip}]`);
      els.forEach((el) => {
        sections$r[this.id].push(new Tooltip(el));
      });
    },
    onUnload: function () {
      sections$r[this.id].forEach((el) => {
        if (typeof el.unload === 'function') {
          el.unload();
        }
      });
    },
  };

  var sections$q = {};

  const parallaxHero = {
    onLoad() {
      sections$q[this.id] = [];
      const frames = this.container.querySelectorAll('[data-parallax-wrapper]');
      frames.forEach((frame) => {
        const inner = frame.querySelector('[data-parallax-img]');

        sections$q[this.id].push(
          new Rellax(inner, {
            center: true,
            round: true,
            frame: frame,
          })
        );
      });

      window.addEventListener('load', () => {
        sections$q[this.id].forEach((image) => {
          if (typeof image.refresh === 'function') {
            image.refresh();
          }
        });
      });
    },
    onUnload: function () {
      sections$q[this.id].forEach((image) => {
        if (typeof image.destroy === 'function') {
          image.destroy();
        }
      });
    },
  };

  register('article', [tooltipSection, parallaxHero]);

  const selectors$L = {
    aos: '[data-aos]',
    collectionImage: '.collection-item__image',
    columnImage: '[data-column-image]',
    flickityNextArrow: '.flickity-button.next',
    flickityPrevArrow: '.flickity-button.previous',
    link: 'a:not(.btn)',
    nextArrow: '[data-next-arrow]',
    prevArrow: '[data-prev-arrow]',
    productItemImage: '.product-item__image',
    slide: '[data-slide]',
    slideValue: 'data-slide',
    slider: '[data-slider]',
    sliderThumb: '[data-slider-thumb]',
  };

  const attributes$j = {
    arrowPositionMiddle: 'data-arrow-position-middle',
    equalizeHeight: 'data-equalize-height',
    slideIndex: 'data-slide-index',
    sliderOptions: 'data-options',
    slideTextColor: 'data-slide-text-color',
  };

  const classes$D = {
    aosAnimate: 'aos-animate',
    desktop: 'desktop',
    focused: 'is-focused',
    flickityResize: 'flickity-resize',
    flickityResizing: 'flickity-resizing',
    flickityEnabled: 'flickity-enabled',
    heroContentTransparent: 'hero__content--transparent',
    initialized: 'is-initialized',
    isLoading: 'is-loading',
    isSelected: 'is-selected',
    mobile: 'mobile',
    sliderInitialized: 'js-slider--initialized',
  };

  const sections$p = {};

  class Slider {
    constructor(container, slideshow = null) {
      this.container = container;
      this.slideshow = slideshow || this.container.querySelector(selectors$L.slider);

      if (!this.slideshow) return;

      this.slideshowSlides = this.slideshow.querySelectorAll(selectors$L.slide);

      if (this.slideshowSlides.length <= 1) return;

      this.sliderPrev = this.container.querySelector(selectors$L.prevArrow);
      this.sliderNext = this.container.querySelector(selectors$L.nextArrow);
      this.sliderThumbs = this.container.querySelectorAll(selectors$L.sliderThumb);
      this.multipleSlides = this.slideshow.hasAttribute(attributes$j.slidesLargeDesktop);
      this.isHeightEqualized = this.slideshow.getAttribute(attributes$j.equalizeHeight) === 'true';

      this.sliderCallbackEventOnResize = () => this.sliderCallbackEvent();
      this.addRemoveSlidesForDevicesOnResize = () => this.addRemoveSlidesForDevices();
      this.resetSliderEvent = () => this.resetSlider();

      if (this.slideshow.hasAttribute(attributes$j.sliderOptions)) {
        this.customOptions = JSON.parse(decodeURIComponent(this.slideshow.getAttribute(attributes$j.sliderOptions)));
      }

      this.flkty = null;

      this.init();
    }

    init() {
      this.slideshow.classList.add(classes$D.isLoading);

      this.sliderOptions = {
        contain: true,
        wrapAround: true,
        adaptiveHeight: true,
        ...this.customOptions,
        on: {
          ready: () => {
            requestAnimationFrame(() => {
              this.slideshow.classList.add(classes$D.initialized);
              this.slideshow.classList.remove(classes$D.isLoading);
              this.slideshow.parentNode.dispatchEvent(
                new CustomEvent('theme:slider:loaded', {
                  bubbles: true,
                  detail: {
                    slider: this,
                  },
                })
              );
            });

            this.slideActions();

            if (this.sliderOptions.prevNextButtons) {
              this.positionArrows();
            }
          },
          change: (index) => {
            const slide = this.slideshowSlides[index];
            if (!slide || this.sliderOptions.groupCells) return;

            const elementsToAnimate = slide.querySelectorAll(selectors$L.aos);
            if (elementsToAnimate.length) {
              elementsToAnimate.forEach((el) => {
                el.classList.remove(classes$D.aosAnimate);
                requestAnimationFrame(() => {
                  el.classList.add(classes$D.aosAnimate);
                });
              });
            }
          },
          resize: () => {
            if (this.sliderOptions.prevNextButtons) {
              this.positionArrows();
            }
          },
        },
      };

      if (this.sliderOptions.fade) {
        this.flkty = new FlickityFade(this.slideshow, this.sliderOptions);
      }

      if (!this.sliderOptions.fade) {
        this.flkty = new Flickity(this.slideshow, this.sliderOptions);
      }

      if (this.isHeightEqualized) {
        this.equalizeHeight();
      }

      if (this.sliderPrev) {
        this.sliderPrev.addEventListener('click', (e) => {
          e.preventDefault();

          this.flkty.previous(true);
        });
      }

      if (this.sliderNext) {
        this.sliderNext.addEventListener('click', (e) => {
          e.preventDefault();

          this.flkty.next(true);
        });
      }

      this.flkty.on('change', () => this.slideActions(true));

      this.addRemoveSlidesForDevices();

      document.addEventListener('theme:resize', this.addRemoveSlidesForDevicesOnResize);

      if (this.multipleSlides) {
        document.addEventListener('theme:resize', this.sliderCallbackEventOnResize);
      }

      if (this.sliderThumbs.length) {
        this.sliderThumbs.forEach((element) => {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            const slideIndex = [...element.parentElement.children].indexOf(element);
            this.flkty.select(slideIndex);
          });
        });
      }

      this.container.addEventListener('theme:tab:change', this.resetSliderEvent);
    }

    // Move slides to their initial position
    resetSlider() {
      if (this.slideshow) {
        if (this.flkty && this.flkty.isActive) {
          this.flkty.select(0, false, true);
        } else {
          this.slideshow.scrollTo({
            left: 0,
            behavior: 'auto',
          });
        }
      }
    }

    addRemoveSlidesForDevices() {
      this.hasDiffSlidesForMobileDesktop =
        Array.prototype.filter.call(this.slideshowSlides, (slide) => {
          if (slide.classList.contains(classes$D.desktop) || slide.classList.contains(classes$D.mobile)) {
            return slide;
          }
        }).length > 0;

      if (!this.hasDiffSlidesForMobileDesktop) {
        return;
      }

      let selectorSlides = null;

      if (!isDesktop()) {
        selectorSlides = `${selectors$L.slide}.${classes$D.mobile}, ${selectors$L.slide}:not(.${classes$D.desktop})`;
      } else {
        selectorSlides = `${selectors$L.slide}.${classes$D.desktop}, ${selectors$L.slide}:not(.${classes$D.mobile})`;
      }

      this.flkty.options.cellSelector = selectorSlides;
      this.flkty.selectCell(0, false, true);
      this.flkty.reloadCells();
      this.flkty.reposition();
      this.flkty.resize();
      this.slideActions();
    }

    sliderCallbackEvent() {
      if (this.multipleSlides) {
        this.flkty.resize();
        if (!this.slideshow.classList.contains(classes$D.sliderInitialized)) {
          this.flkty.select(0);
        }
      }
    }

    slideActions(changeEvent = false) {
      const currentSlide = this.slideshow.querySelector(`.${classes$D.isSelected}`);
      const currentSlideTextColor = currentSlide.getAttribute(attributes$j.slideTextColor);
      const currentSlideLink = currentSlide.querySelector(selectors$L.link);
      const buttons = this.slideshow.querySelectorAll(`${selectors$L.slide} a, ${selectors$L.slide} button`);

      if (document.body.classList.contains(classes$D.focused) && currentSlideLink && this.sliderOptions.groupCells && changeEvent) {
        currentSlideLink.focus();
      }

      if (buttons.length) {
        buttons.forEach((button) => {
          const slide = button.closest(selectors$L.slide);
          if (slide) {
            const tabIndex = slide.classList.contains(classes$D.isSelected) ? 0 : -1;
            button.setAttribute('tabindex', tabIndex);
          }
        });
      }

      if (currentSlideTextColor !== 'rgba(0,0,0,0)' && currentSlideTextColor !== '') {
        this.slideshow.style.setProperty('--text', currentSlideTextColor);
      }

      if (this.sliderThumbs.length && this.sliderThumbs.length === this.slideshowSlides.length && currentSlide.hasAttribute(attributes$j.slideIndex)) {
        const slideIndex = parseInt(currentSlide.getAttribute(attributes$j.slideIndex));
        const currentThumb = this.container.querySelector(`${selectors$L.sliderThumb}.${classes$D.isSelected}`);
        if (currentThumb) {
          currentThumb.classList.remove(classes$D.isSelected);
        }
        this.sliderThumbs[slideIndex].classList.add(classes$D.isSelected);
      }
    }

    positionArrows() {
      if (this.slideshow.hasAttribute(attributes$j.arrowPositionMiddle) && this.sliderOptions.prevNextButtons) {
        const itemImage = this.slideshow.querySelector(selectors$L.collectionImage) || this.slideshow.querySelector(selectors$L.productItemImage) || this.slideshow.querySelector(selectors$L.columnImage);

        // Prevent 'clientHeight' of null error if no image
        if (!itemImage) return;

        this.slideshow.querySelector(selectors$L.flickityPrevArrow).style.top = itemImage.clientHeight / 2 + 'px';
        this.slideshow.querySelector(selectors$L.flickityNextArrow).style.top = itemImage.clientHeight / 2 + 'px';
      }
    }

    equalizeHeight() {
      Flickity.prototype._createResizeClass = function () {
        requestAnimationFrame(() => {
          this.element.classList.add(classes$D.flickityResize);
        });
      };

      this.flkty._createResizeClass();

      const resize = Flickity.prototype.resize;
      Flickity.prototype.resize = function () {
        this.element.classList.remove(classes$D.flickityResize);
        this.element.classList.add(classes$D.flickityResizing);
        resize.call(this);
        requestAnimationFrame(() => {
          this.element.classList.add(classes$D.flickityResize);
          this.element.classList.remove(classes$D.flickityResizing);
        });
      };
    }

    onUnload() {
      if (this.multipleSlides) {
        document.removeEventListener('theme:resize', this.sliderCallbackEventOnResize);
      }

      if (this.slideshow && this.flkty) {
        this.flkty.options.watchCSS = false;
        this.flkty.destroy();
      }

      this.container.removeEventListener('theme:tab:change', this.resetSliderEvent);

      document.removeEventListener('theme:resize', this.addRemoveSlidesForDevicesOnResize);
    }

    onBlockSelect(evt) {
      if (!this.slideshow) return;
      // Ignore the cloned version
      const slide = this.slideshow.querySelector(`[${selectors$L.slideValue}="${evt.detail.blockId}"]`);

      if (!slide) return;
      let slideIndex = parseInt(slide.getAttribute(attributes$j.slideIndex));

      if (this.multipleSlides && !this.slideshow.classList.contains(classes$D.sliderInitialized)) {
        slideIndex = 0;
      }

      this.slideshow.classList.add(classes$D.isSelected);

      // Go to selected slide, pause autoplay
      if (this.flkty && this.slideshow.classList.contains(classes$D.flickityEnabled)) {
        this.flkty.selectCell(slideIndex);
        this.flkty.stopPlayer();
      }
    }

    onBlockDeselect() {
      if (!this.slideshow) return;
      this.slideshow.classList.remove(classes$D.isSelected);

      if (this.flkty && this.sliderOptions.hasOwnProperty('autoPlay') && this.sliderOptions.autoPlay) {
        this.flkty.playPlayer();
      }
    }
  }

  const slider = {
    onLoad() {
      sections$p[this.id] = [];
      const els = this.container.querySelectorAll(selectors$L.slider);
      els.forEach((el) => {
        sections$p[this.id].push(new Slider(this.container, el));
      });
    },
    onUnload() {
      sections$p[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
    onBlockSelect(e) {
      sections$p[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
    onBlockDeselect(e) {
      sections$p[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(e);
        }
      });
    },
  };

  register('blog-section', [slider]);

  register('hero', parallaxHero);

  register('double', slider);

  const selectors$K = {
    headerSticky: '[data-header-sticky]',
    headerHeight: '[data-header-height]',
  };

  const scrollTo = (elementTop) => {
    /* Sticky header check */
    const headerHeight =
      document.querySelector(selectors$K.headerSticky) && document.querySelector(selectors$K.headerHeight) ? document.querySelector(selectors$K.headerHeight).getBoundingClientRect().height : 0;

    window.scrollTo({
      top: elementTop + window.scrollY - headerHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  class PopupCookie {
    constructor(name, value, daysToExpire = 7) {
      const today = new Date();
      const expiresDate = new Date();
      expiresDate.setTime(today.getTime() + 3600000 * 24 * daysToExpire);

      this.configuration = {
        expires: expiresDate.toGMTString(), // session cookie
        path: '/',
        domain: window.location.hostname,
        sameSite: 'none',
        secure: true,
      };
      this.name = name;
      this.value = value;
    }

    write() {
      const hasCookie = document.cookie.indexOf('; ') !== -1 && !document.cookie.split('; ').find((row) => row.startsWith(this.name));

      if (hasCookie || document.cookie.indexOf('; ') === -1) {
        document.cookie = `${this.name}=${this.value}; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}; sameSite=${this.configuration.sameSite}; secure=${this.configuration.secure}`;
      }
    }

    read() {
      if (document.cookie.indexOf('; ') !== -1 && document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        const returnCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith(this.name))
          .split('=')[1];

        return returnCookie;
      } else {
        return false;
      }
    }

    destroy() {
      if (document.cookie.split('; ').find((row) => row.startsWith(this.name))) {
        document.cookie = `${this.name}=null; expires=${this.configuration.expires}; path=${this.configuration.path}; domain=${this.configuration.domain}`;
      }
    }
  }

  const selectors$J = {
    newsletterForm: '[data-newsletter-form]',
    newsletterHeading: '[data-newsletter-heading]',
    newsletterPopup: '[data-newsletter]',
  };

  const classes$C = {
    success: 'has-success',
    error: 'has-error',
    hidden: 'hidden',
  };

  const attributes$i = {
    cookieNameAttribute: 'data-cookie-name',
  };

  const sections$o = {};

  class NewsletterCheckForResult {
    constructor(newsletter) {
      this.sessionStorage = window.sessionStorage;
      this.newsletter = newsletter;
      this.popup = this.newsletter.closest(selectors$J.newsletterPopup);
      if (this.popup) {
        this.cookie = new PopupCookie(this.popup.getAttribute(attributes$i.cookieNameAttribute), 'user_has_closed', null);
      }

      this.stopSubmit = true;
      this.isChallengePage = false;
      this.formID = null;

      this.checkForChallengePage();

      this.newsletterSubmit = (e) => this.newsletterSubmitEvent(e);

      if (!this.isChallengePage) {
        this.init();
      }
    }

    init() {
      this.newsletter.addEventListener('submit', this.newsletterSubmit);

      this.showMessage();
    }

    newsletterSubmitEvent(e) {
      if (this.stopSubmit) {
        e.preventDefault();
        e.stopImmediatePropagation();

        this.removeStorage();
        this.writeStorage();
        this.stopSubmit = false;
        this.newsletter.submit();
      }
    }

    checkForChallengePage() {
      this.isChallengePage = window.location.pathname === '/challenge';
    }

    writeStorage() {
      if (this.sessionStorage !== undefined) {
        this.sessionStorage.setItem('newsletter_form_id', this.newsletter.id);
      }
    }

    readStorage() {
      this.formID = this.sessionStorage.getItem('newsletter_form_id');
    }

    removeStorage() {
      this.sessionStorage.removeItem('newsletter_form_id');
    }

    showMessage() {
      this.readStorage();

      if (this.newsletter.id === this.formID) {
        const newsletter = document.getElementById(this.formID);
        const newsletterHeading = newsletter.parentElement.querySelector(selectors$J.newsletterHeading);
        const submissionSuccess = window.location.search.indexOf('?customer_posted=true') !== -1;
        const submissionFailure = window.location.search.indexOf('accepts_marketing') !== -1;

        if (submissionSuccess) {
          newsletter.classList.remove(classes$C.error);
          newsletter.classList.add(classes$C.success);

          if (newsletterHeading) {
            newsletterHeading.classList.add(classes$C.hidden);
            newsletter.classList.remove(classes$C.hidden);
          }

          if (this.popup) {
            this.cookie.write();
          }
        } else if (submissionFailure) {
          newsletter.classList.remove(classes$C.success);
          newsletter.classList.add(classes$C.error);

          if (newsletterHeading) {
            newsletterHeading.classList.add(classes$C.hidden);
            newsletter.classList.remove(classes$C.hidden);
          }
        }

        if (submissionSuccess || submissionFailure) {
          window.addEventListener('load', () => {
            this.scrollToForm(newsletter);
          });
        }
      }
    }

    scrollToForm(newsletter) {
      const rect = newsletter.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.left >= 0 && rect.bottom <= getWindowHeight() && rect.right <= getWindowWidth();

      if (!isVisible) {
        setTimeout(() => {
          scrollTo(newsletter.getBoundingClientRect().top);
        }, 500);
      }
    }

    unload() {
      this.newsletter.removeEventListener('submit', this.newsletterSubmit);
    }
  }

  const newsletterCheckForResultSection = {
    onLoad() {
      sections$o[this.id] = [];
      const newsletters = this.container.querySelectorAll(selectors$J.newsletterForm);
      newsletters.forEach((form) => {
        sections$o[this.id].push(new NewsletterCheckForResult(form));
      });
    },
    onUnload() {
      sections$o[this.id].forEach((form) => {
        if (typeof form.unload === 'function') {
          form.unload();
        }
      });
    },
  };

  register('footer', [parallaxHero, newsletterCheckForResultSection]);

  const selectors$I = {
    popoutWrapper: '[data-popout]',
    popoutList: '[data-popout-list]',
    popoutToggle: '[data-popout-toggle]',
    popoutToggleText: '[data-popout-toggle-text]',
    popoutToggleTextValue: 'data-popout-toggle-text',
    popoutInput: '[data-popout-input]',
    popoutOptions: '[data-popout-option]',
    popoutPrevent: 'data-popout-prevent',
    popoutQuantity: 'data-quantity-field',
    dataValue: 'data-value',
    ariaExpanded: 'aria-expanded',
    ariaCurrent: 'aria-current',
    productGridImage: '[data-product-image]',
    productGrid: '[data-product-grid-item]',
  };

  const classes$B = {
    listVisible: 'popout-list--visible',
    visible: 'is-visible',
    active: 'is-active',
    selectPopoutTop: 'select-popout--top',
  };

  let sections$n = {};

  class Popout {
    constructor(popout) {
      this.container = popout;
      this.popoutList = this.container.querySelector(selectors$I.popoutList);
      this.popoutToggle = this.container.querySelector(selectors$I.popoutToggle);
      this.popoutToggleText = this.container.querySelector(selectors$I.popoutToggleText);
      this.popoutInput = this.container.querySelector(selectors$I.popoutInput);
      this.popoutOptions = this.container.querySelectorAll(selectors$I.popoutOptions);
      this.productGrid = this.popoutList.closest(selectors$I.productGrid);
      this.popoutPrevent = this.container.getAttribute(selectors$I.popoutPrevent) === 'true';
      this.popupToggleFocusoutEvent = (evt) => this.popupToggleFocusout(evt);
      this.popupListFocusoutEvent = (evt) => this.popupListFocusout(evt);
      this.popupToggleClickEvent = (evt) => this.popupToggleClick(evt);
      this.containerKeyupEvent = (evt) => this.containerKeyup(evt);
      this.bodyClickEvent = (evt) => this.bodyClick(evt);

      this._connectOptions();
      this._connectToggle();
      this._onFocusOut();
      this.popupListMaxWidth();
    }

    popupToggleClick(evt) {
      const button = evt.currentTarget;
      const ariaExpanded = button.getAttribute(selectors$I.ariaExpanded) === 'true';

      if (this.productGrid) {
        const productGridItemImage = this.productGrid.querySelector(selectors$I.productGridImage);

        if (productGridItemImage) {
          productGridItemImage.classList.toggle(classes$B.visible, !ariaExpanded);
        }

        this.popoutList.style.maxHeight = `${Math.abs(this.popoutToggle.getBoundingClientRect().bottom - this.productGrid.getBoundingClientRect().bottom)}px`;
      }

      evt.currentTarget.setAttribute(selectors$I.ariaExpanded, !ariaExpanded);
      this.popoutList.classList.toggle(classes$B.listVisible);
      this.popupListMaxWidth();

      this.toggleListPosition();
    }

    popupToggleFocusout(evt) {
      const popoutLostFocus = this.container.contains(evt.relatedTarget);

      if (!popoutLostFocus) {
        this._hideList();
      }
    }

    popupListFocusout(evt) {
      const childInFocus = evt.currentTarget.contains(evt.relatedTarget);
      const isVisible = this.popoutList.classList.contains(classes$B.listVisible);

      if (isVisible && !childInFocus) {
        this._hideList();
      }
    }

    toggleListPosition() {
      const popoutHolder = this.popoutList.closest(selectors$I.popoutWrapper);
      const button = popoutHolder.querySelector(selectors$I.popoutToggle);
      const ariaExpanded = button.getAttribute(selectors$I.ariaExpanded) === 'true';
      const windowBottom = window.innerHeight;
      const bottom = this.popoutList.getBoundingClientRect().bottom;

      const removeTopClass = () => {
        popoutHolder.classList.remove(classes$B.selectPopoutTop);
        this.popoutList.removeEventListener('transitionend', removeTopClass);
      };

      if (ariaExpanded) {
        if (windowBottom < bottom) {
          popoutHolder.classList.add(classes$B.selectPopoutTop);
        }
      } else {
        this.popoutList.addEventListener('transitionend', removeTopClass);
      }
    }

    popupListMaxWidth() {
      this.popoutList.style.maxWidth = `${parseInt(document.body.clientWidth - this.popoutList.getBoundingClientRect().left)}px`;
    }

    popupOptionsClick(evt) {
      const link = evt.target.closest(selectors$I.popoutOptions);
      if (link.attributes.href.value === '#') {
        evt.preventDefault();

        let attrValue = '';

        if (evt.currentTarget.getAttribute(selectors$I.dataValue)) {
          attrValue = evt.currentTarget.getAttribute(selectors$I.dataValue);
        }

        this.popoutInput.value = attrValue;

        if (this.popoutPrevent) {
          const currentTarget = evt.currentTarget.parentElement;
          const listTargetElement = this.popoutList.querySelector(`.${classes$B.active}`);
          const targetAttribute = this.popoutList.querySelector(`[${selectors$I.ariaCurrent}]`);

          this.popoutInput.dispatchEvent(new Event('change'));

          if (listTargetElement) {
            listTargetElement.classList.remove(classes$B.active);
            currentTarget.classList.add(classes$B.active);
          }

          if (this.popoutInput.hasAttribute(selectors$I.popoutQuantity) && !currentTarget.nextSibling) {
            this.container.classList.add(classes$B.active);
          }

          if (targetAttribute && targetAttribute.hasAttribute(`${selectors$I.ariaCurrent}`)) {
            targetAttribute.removeAttribute(`${selectors$I.ariaCurrent}`);
            evt.currentTarget.setAttribute(`${selectors$I.ariaCurrent}`, 'true');
          }

          if (attrValue !== '') {
            this.popoutToggleText.textContent = attrValue;

            if (this.popoutToggleText.hasAttribute(selectors$I.popoutToggleTextValue) && this.popoutToggleText.getAttribute(selectors$I.popoutToggleTextValue) !== '') {
              this.popoutToggleText.setAttribute(selectors$I.popoutToggleTextValue, attrValue);
            }
          }
          this.popupToggleFocusout(evt);
          this.popupListFocusout(evt);
        } else {
          this._submitForm(attrValue);
        }
      }
    }

    containerKeyup(evt) {
      if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
        return;
      }
      this._hideList();
      this.popoutToggle.focus();
    }

    bodyClick(evt) {
      const isOption = this.container.contains(evt.target);
      const isVisible = this.popoutList.classList.contains(classes$B.listVisible);

      if (isVisible && !isOption) {
        this._hideList();
      }
    }

    unload() {
      document.body.removeEventListener('click', this.bodyClickEvent);
    }

    _connectToggle() {
      this.popoutToggle.addEventListener('click', this.popupToggleClickEvent);
    }

    _connectOptions() {
      if (this.popoutOptions.length) {
        this.popoutOptions.forEach((element) => {
          element.addEventListener('click', (evt) => this.popupOptionsClick(evt));
        });
      }
    }

    _onFocusOut() {
      this.popoutToggle.addEventListener('focusout', this.popupToggleFocusoutEvent);

      this.popoutList.addEventListener('focusout', this.popupListFocusoutEvent);

      this.container.addEventListener('keyup', this.containerKeyupEvent);

      document.body.addEventListener('click', this.bodyClickEvent);
    }

    _submitForm() {
      const form = this.container.closest('form');
      if (form) {
        form.submit();
      }
    }

    _hideList() {
      this.popoutList.classList.remove(classes$B.listVisible);
      this.popoutToggle.setAttribute(selectors$I.ariaExpanded, false);
      this.toggleListPosition();
    }
  }

  const popoutSection = {
    onLoad() {
      sections$n[this.id] = [];
      const wrappers = this.container.querySelectorAll(selectors$I.popoutWrapper);
      wrappers.forEach((wrapper) => {
        sections$n[this.id].push(new Popout(wrapper));
      });
    },
    onUnload() {
      sections$n[this.id].forEach((popout) => {
        if (typeof popout.unload === 'function') {
          popout.unload();
        }
      });
    },
  };

  function Listeners() {
    this.entries = [];
  }

  Listeners.prototype.add = function (element, event, fn) {
    this.entries.push({element: element, event: event, fn: fn});
    element.addEventListener(event, fn);
  };

  Listeners.prototype.removeAll = function () {
    this.entries = this.entries.filter(function (listener) {
      listener.element.removeEventListener(listener.event, listener.fn);
      return false;
    });
  };

  /**
   * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Number} value Accepts Number (e.g. 6908023078973)
   * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
   */

  /**
   * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromSerializedArray(product, collection) {
    _validateProductStructure(product);

    // If value is an array of options
    var optionArray = _createOptionArrayFromOptionCollection(product, collection);
    return getVariantFromOptionArray(product, optionArray);
  }

  /**
   * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
   * @param {Object} product Product JSON object
   * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
   * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
   */
  function getVariantFromOptionArray(product, options) {
    _validateProductStructure(product);
    _validateOptionsArray(options);

    var result = product.variants.filter(function (variant) {
      return options.every(function (option, index) {
        return variant.options[index] === option;
      });
    });

    return result[0] || null;
  }

  /**
   * Creates an array of selected options from the object
   * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
   * @param {Object} product Product JSON object
   * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
   * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
   */
  function _createOptionArrayFromOptionCollection(product, collection) {
    _validateProductStructure(product);
    _validateSerializedArray(collection);

    var optionArray = [];

    collection.forEach(function (option) {
      for (var i = 0; i < product.options.length; i++) {
        var name = product.options[i].name || product.options[i];
        if (name.toLowerCase() === option.name.toLowerCase()) {
          optionArray[i] = option.value;
          break;
        }
      }
    });

    return optionArray;
  }

  /**
   * Check if the product data is a valid JS object
   * Error will be thrown if type is invalid
   * @param {object} product Product JSON object
   */
  function _validateProductStructure(product) {
    if (typeof product !== 'object') {
      throw new TypeError(product + ' is not an object.');
    }

    if (Object.keys(product).length === 0 && product.constructor === Object) {
      throw new Error(product + ' is empty.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted like jQuery's serializeArray()
   * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
   */
  function _validateSerializedArray(collection) {
    if (!Array.isArray(collection)) {
      throw new TypeError(collection + ' is not an array.');
    }

    if (collection.length === 0) {
      throw new Error(collection + ' is empty.');
    }

    if (collection[0].hasOwnProperty('name')) {
      if (typeof collection[0].name !== 'string') {
        throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
      }
    } else {
      throw new Error(collection[0] + 'does not contain name key.');
    }
  }

  /**
   * Validate the structure of the array
   * It must be formatted as list of values
   * @param {Array} collection Array of object (e.g. ['36', 'Black'])
   */
  function _validateOptionsArray(options) {
    if (Array.isArray(options) && typeof options[0] === 'object') {
      throw new Error(options + 'is not a valid array of options.');
    }
  }

  var selectors$H = {
    idInput: '[name="id"]',
    planInput: '[name="selling_plan"]',
    optionInput: '[name^="options"]',
    quantityInput: '[name="quantity"]',
    propertyInput: '[name^="properties"]',
  };

  // Public Methods
  // -----------------------------------------------------------------------------

  /**
   * Returns a URL with a variant ID query parameter. Useful for updating window.history
   * with a new URL based on the currently select product variant.
   * @param {string} url - The URL you wish to append the variant ID to
   * @param {number} id  - The variant ID you wish to append to the URL
   * @returns {string} - The new url which includes the variant ID query parameter
   */

  function getUrlWithVariant(url, id) {
    if (/variant=/.test(url)) {
      return url.replace(/(variant=)[^&]+/, '$1' + id);
    } else if (/\?/.test(url)) {
      return url.concat('&variant=').concat(id);
    }

    return url.concat('?variant=').concat(id);
  }

  /**
   * Constructor class that creates a new instance of a product form controller.
   *
   * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
   * @param {Object} product - A product object
   * @param {Object} options - Optional options object
   * @param {Function} options.onOptionChange - Callback for whenever an option input changes
   * @param {Function} options.onPlanChange - Callback for changes to name=selling_plan
   * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
   * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
   * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
   */
  class ProductFormReader {
    constructor(element, product, options) {
      this.element = element;
      this.product = this._validateProductObject(product);
      this.variantElement = this.element.querySelector(selectors$H.idInput);

      options = options || {};

      this._listeners = new Listeners();
      this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

      this.optionInputs = this._initInputs(selectors$H.optionInput, options.onOptionChange);

      this.planInputs = this._initInputs(selectors$H.planInput, options.onPlanChange);

      this.quantityInputs = this._initInputs(selectors$H.quantityInput, options.onQuantityChange);

      this.propertyInputs = this._initInputs(selectors$H.propertyInput, options.onPropertyChange);
    }

    /**
     * Cleans up all event handlers that were assigned when the Product Form was constructed.
     * Useful for use when a section needs to be reloaded in the theme editor.
     */
    destroy() {
      this._listeners.removeAll();
    }

    /**
     * Getter method which returns the array of currently selected option values
     *
     * @returns {Array} An array of option values
     */
    options() {
      return this._serializeInputValues(this.optionInputs, function (item) {
        var regex = /(?:^(options\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the currently selected variant, or `null` if variant
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    variant() {
      const opts = this.options();
      if (opts.length) {
        return getVariantFromSerializedArray(this.product, opts);
      } else {
        return this.product.variants[0];
      }
    }

    /**
     * Getter method which returns the current selling plan, or `null` if plan
     * doesn't exist.
     *
     * @returns {Object|null} Variant object
     */
    plan(variant) {
      let plan = {
        allocation: null,
        group: null,
        detail: null,
      };
      const sellingPlanChecked = this.element.querySelector(`${selectors$H.planInput}:checked`);
      if (!sellingPlanChecked) return null;
      const sellingPlanCheckedValue = sellingPlanChecked.value;
      const id = sellingPlanCheckedValue && sellingPlanCheckedValue !== '' ? sellingPlanCheckedValue : null;

      if (id && variant) {
        plan.allocation = variant.selling_plan_allocations.find(function (item) {
          return item.selling_plan_id.toString() === id.toString();
        });
      }
      if (plan.allocation) {
        plan.group = this.product.selling_plan_groups.find(function (item) {
          return item.id.toString() === plan.allocation.selling_plan_group_id.toString();
        });
      }
      if (plan.group) {
        plan.detail = plan.group.selling_plans.find(function (item) {
          return item.id.toString() === id.toString();
        });
      }

      if (plan && plan.allocation && plan.detail && plan.allocation) {
        return plan;
      } else return null;
    }

    /**
     * Getter method which returns a collection of objects containing name and values
     * of property inputs
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    properties() {
      return this._serializeInputValues(this.propertyInputs, function (item) {
        var regex = /(?:^(properties\[))(.*?)(?:\])/;
        item.name = regex.exec(item.name)[2]; // Use just the value between 'properties[' and ']'
        return item;
      });
    }

    /**
     * Getter method which returns the current quantity or 1 if no quantity input is
     * included in the form
     *
     * @returns {Array} Collection of objects with name and value keys
     */
    quantity() {
      return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
    }

    getFormState() {
      const variant = this.variant();
      return {
        options: this.options(),
        variant: variant,
        properties: this.properties(),
        quantity: this.quantity(),
        plan: this.plan(variant),
      };
    }

    // Private Methods
    // -----------------------------------------------------------------------------
    _setIdInputValue(variant) {
      if (variant && variant.id) {
        this.variantElement.value = variant.id.toString();
      } else {
        this.variantElement.value = '';
      }

      this.variantElement.dispatchEvent(new Event('change'));
    }

    _onSubmit(options, event) {
      event.dataset = this.getFormState();
      if (options.onFormSubmit) {
        options.onFormSubmit(event);
      }
    }

    _onOptionChange(event) {
      this._setIdInputValue(event.dataset.variant);
    }

    _onFormEvent(cb) {
      if (typeof cb === 'undefined') {
        return Function.prototype.bind();
      }

      return function (event) {
        event.dataset = this.getFormState();
        this._setIdInputValue(event.dataset.variant);
        cb(event);
      }.bind(this);
    }

    _initInputs(selector, cb) {
      var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));

      return elements.map(
        function (element) {
          this._listeners.add(element, 'change', this._onFormEvent(cb));
          return element;
        }.bind(this)
      );
    }

    _serializeInputValues(inputs, transform) {
      return inputs.reduce(function (options, input) {
        if (
          input.checked || // If input is a checked (means type radio or checkbox)
          (input.type !== 'radio' && input.type !== 'checkbox') // Or if its any other type of input
        ) {
          options.push(transform({name: input.name, value: input.value}));
        }

        return options;
      }, []);
    }

    _validateProductObject(product) {
      if (typeof product !== 'object') {
        throw new TypeError(product + ' is not an object.');
      }

      if (typeof product.variants[0].options === 'undefined') {
        throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
      }
      return product;
    }
  }

  function fetchProduct(handle) {
    const requestRoute = `${window.theme.routes.root}products/${handle}.js`;

    return window
      .fetch(requestRoute)
      .then((response) => {
        return response.json();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function getScript(url, callback, callbackError) {
    let head = document.getElementsByTagName('head')[0];
    let done = false;
    let script = document.createElement('script');
    script.src = url;

    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
        done = true;
        callback();
      } else {
        callbackError();
      }
    };

    head.appendChild(script);
  }

  const loaders = {};
  window.isYoutubeAPILoaded = false;
  window.isVimeoAPILoaded = false;

  function loadScript(options = {}) {
    if (!options.type) {
      options.type = 'json';
    }

    if (options.url) {
      if (loaders[options.url]) {
        return loaders[options.url];
      } else {
        return getScriptWithPromise(options.url, options.type);
      }
    } else if (options.json) {
      if (loaders[options.json]) {
        return Promise.resolve(loaders[options.json]);
      } else {
        return window
          .fetch(options.json)
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            loaders[options.json] = response;
            return response;
          });
      }
    } else if (options.name) {
      const key = ''.concat(options.name, options.version);
      if (loaders[key]) {
        return loaders[key];
      } else {
        return loadShopifyWithPromise(options);
      }
    } else {
      return Promise.reject();
    }
  }

  function getScriptWithPromise(url, type) {
    const loader = new Promise((resolve, reject) => {
      if (type === 'text') {
        fetch(url)
          .then((response) => response.text())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        getScript(
          url,
          function () {
            resolve();
          },
          function () {
            reject();
          }
        );
      }
    });

    loaders[url] = loader;
    return loader;
  }

  function loadShopifyWithPromise(options) {
    const key = ''.concat(options.name, options.version);
    const loader = new Promise((resolve, reject) => {
      try {
        window.Shopify.loadFeatures([
          {
            name: options.name,
            version: options.version,
            onLoad: (err) => {
              onLoadFromShopify(resolve, reject, err);
            },
          },
        ]);
      } catch (err) {
        reject(err);
      }
    });
    loaders[key] = loader;
    return loader;
  }

  function onLoadFromShopify(resolve, reject, err) {
    if (err) {
      return reject(err);
    } else {
      return resolve();
    }
  }

  const selectors$G = {
    scrollbarAttribute: 'data-scrollbar',
    scrollbar: 'data-scrollbar-slider',
    scrollbarSlideFullWidth: 'data-scrollbar-slide-fullwidth',
    scrollbarArrowPrev: '[data-scrollbar-arrow-prev]',
    scrollbarArrowNext: '[data-scrollbar-arrow-next]',
  };
  const classes$A = {
    hidden: 'is-hidden',
  };
  const settings$2 = {
    delay: 200,
  };

  class NativeScrollbar {
    constructor(scrollbar) {
      this.scrollbar = scrollbar;

      this.arrowNext = this.scrollbar.parentNode.querySelector(selectors$G.scrollbarArrowNext);
      this.arrowPrev = this.scrollbar.parentNode.querySelector(selectors$G.scrollbarArrowPrev);

      if (this.scrollbar.hasAttribute(selectors$G.scrollbarAttribute)) {
        this.init();
        this.resize();
      }

      if (this.scrollbar.hasAttribute(selectors$G.scrollbar)) {
        this.scrollToVisibleElement();
      }
    }

    init() {
      if (this.arrowNext && this.arrowPrev) {
        this.toggleNextArrow();

        this.events();
      }
    }

    resize() {
      document.addEventListener('theme:resize', () => {
        this.toggleNextArrow();
      });
    }

    events() {
      this.arrowNext.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToNext();
      });

      this.arrowPrev.addEventListener('click', (event) => {
        event.preventDefault();

        this.goToPrev();
      });

      this.scrollbar.addEventListener('scroll', () => {
        this.togglePrevArrow();
        this.toggleNextArrow();
      });
    }

    goToNext() {
      const moveWith = this.scrollbar.hasAttribute(selectors$G.scrollbarSlideFullWidth) ? this.scrollbar.getBoundingClientRect().width : this.scrollbar.getBoundingClientRect().width / 2;
      const position = moveWith + this.scrollbar.scrollLeft;

      this.move(position);

      this.arrowPrev.classList.remove(classes$A.hidden);

      this.toggleNextArrow();
    }

    goToPrev() {
      const moveWith = this.scrollbar.hasAttribute(selectors$G.scrollbarSlideFullWidth) ? this.scrollbar.getBoundingClientRect().width : this.scrollbar.getBoundingClientRect().width / 2;
      const position = this.scrollbar.scrollLeft - moveWith;

      this.move(position);

      this.arrowNext.classList.remove(classes$A.hidden);

      this.togglePrevArrow();
    }

    toggleNextArrow() {
      setTimeout(() => {
        this.arrowNext.classList.toggle(classes$A.hidden, Math.round(this.scrollbar.scrollLeft + this.scrollbar.getBoundingClientRect().width + 1) >= this.scrollbar.scrollWidth);
      }, settings$2.delay);
    }

    togglePrevArrow() {
      setTimeout(() => {
        this.arrowPrev.classList.toggle(classes$A.hidden, this.scrollbar.scrollLeft <= 0);
      }, settings$2.delay);
    }

    scrollToVisibleElement() {
      [].forEach.call(this.scrollbar.children, (element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();

          this.move(element.offsetLeft - element.clientWidth);
        });
      });
    }

    move(offsetLeft) {
      this.scrollbar.scrollTo({
        top: 0,
        left: offsetLeft,
        behavior: 'smooth',
      });
    }
  }

  const defaults = {
    color: 'ash',
  };

  const selectors$F = {
    gridSwatchForm: '[data-grid-swatch-form]',
    swatch: 'data-swatch',
    outerGrid: '[data-product-grid-item]',
    slide: '[data-product-image]',
    image: 'data-swatch-image',
    sectionId: '[data-section-id]',
    productInfo: '[data-product-information]',
    variant: 'data-swatch-variant',
    variantName: 'data-swatch-variant-name',
    variantTitle: 'data-variant-title',
    button: '[data-swatch-button]',
    swatchLink: '[data-swatch-link]',
    wrapper: '[data-grid-swatches]',
    template: '[data-swatch-template]',
    handle: 'data-swatch-handle',
    label: 'data-swatch-label',
    input: '[data-swatch-input]',
    tooltip: 'data-tooltip',
    swatchCount: 'data-swatch-count',
    scrollbar: 'data-scrollbar',
  };

  const classes$z = {
    visible: 'is-visible',
    stopEvents: 'no-events',
  };

  class ColorMatch {
    constructor(options = {}) {
      this.settings = {
        ...defaults,
        ...options,
      };

      this.match = this.init();
    }

    getColor() {
      return this.match;
    }

    init() {
      const getColors = loadScript({json: window.theme.assets.swatches});
      return getColors
        .then((colors) => {
          return this.matchColors(colors, this.settings.color);
        })
        .catch((e) => {
          console.log('failed to load swatch colors script');
          console.log(e);
        });
    }

    matchColors(colors, name) {
      let bg = '#E5E5E5';
      let img = null;
      const path = window.theme.assets.base || '/';
      const comparisonName = name.toLowerCase().replace(/\s/g, '');
      const array = colors.colors;

      if (array) {
        let indexArray = null;

        const hexColorArr = array.filter((colorObj, index) => {
          const neatName = Object.keys(colorObj).toString().toLowerCase().replace(/\s/g, '');

          if (neatName === comparisonName) {
            indexArray = index;

            return colorObj;
          }
        });

        if (hexColorArr.length && indexArray !== null) {
          const value = Object.values(array[indexArray])[0];
          bg = value;

          if (value.includes('.jpg') || value.includes('.jpeg') || value.includes('.png') || value.includes('.svg')) {
            img = `${path}${value}`;
            bg = '#888888';
          }
        }
      }

      return {
        color: this.settings.color,
        path: img,
        hex: bg,
      };
    }
  }

  class Swatch {
    constructor(element) {
      this.element = element;
      this.colorString = element.getAttribute(selectors$F.swatch);
      this.image = element.getAttribute(selectors$F.image);
      this.variant = element.getAttribute(selectors$F.variant);
      this.variantName = element.getAttribute(selectors$F.variantName);
      this.tooltip = this.element.closest(`[${selectors$F.tooltip}]`);

      const matcher = new ColorMatch({color: this.colorString});
      matcher.getColor().then((result) => {
        this.colorMatch = result;
        this.init();
      });
    }

    init() {
      this.setStyles();
      if (this.variant) {
        this.handleEvents();
      }

      if (this.tooltip) {
        new Tooltip(this.tooltip);
      }
    }

    setStyles() {
      if (this.colorMatch.hex) {
        this.element.style.setProperty('--swatch', `${this.colorMatch.hex}`);
      }
      if (this.colorMatch.path) {
        this.element.style.setProperty('background-image', `url(${this.colorMatch.path})`);
        this.element.style.setProperty('background-size', 'cover');
        this.element.style.setProperty('background-position', 'center center');
      }
    }

    handleEvents() {
      this.outer = this.element.closest(selectors$F.outerGrid);
      if (this.outer) {
        this.slide = this.outer.querySelector(selectors$F.slide);
        this.button = this.element.closest(selectors$F.button);
        this.imagesHidden = this.outer.querySelectorAll(`[${selectors$F.variantTitle}][style*="display: none;"]`);
        this.outerHoverEvent = () => this.showHoverImages();
        this.outerLeaveEvent = () => this.hideHoverImages();

        if (this.button.closest(selectors$F.gridSwatchForm)) {
          this.button.addEventListener(
            'mouseenter',
            function () {
              this.changeImage();
            }.bind(this)
          );
        }

        if (this.imagesHidden.length) {
          this.outer.addEventListener('mouseenter', this.outerHoverEvent);
          this.outer.addEventListener('mouseleave', this.outerLeaveEvent);
        }
      }
    }

    showHoverImages() {
      this.imagesHidden.forEach((image) => {
        image.style.removeProperty('display');
      });

      this.outer.removeEventListener('mouseenter', this.outerHoverEvent);
    }

    hideHoverImages() {
      this.slide.querySelectorAll(`.${classes$z.visible}`)?.forEach((image) => {
        image.classList.remove(classes$z.visible);
      });
    }

    changeImage() {
      if (this.image) {
        const variantName = this.variantName.replaceAll('"', "'");
        const imageTarget = this.slide.querySelector(`[${selectors$F.variantTitle}="${variantName}"]`);

        if (imageTarget) {
          const imageVisible = this.slide.querySelector(`[${selectors$F.variantTitle}].${classes$z.visible}`);
          if (imageVisible) {
            imageVisible.classList.remove(classes$z.visible);
          }

          imageTarget.classList.add(classes$z.visible);
        }
      }
    }
  }

  class GridSwatch {
    constructor(wrap, container) {
      this.container = container;
      this.wrap = wrap;
      this.outerGrid = wrap.closest(selectors$F.outerGrid);
      this.productInfo = wrap.closest(selectors$F.productInfo);
      this.template = document.querySelector(selectors$F.template).innerHTML;
      this.handle = wrap.getAttribute(selectors$F.handle);
      this.sectionId = this.wrap.closest(selectors$F.sectionId).dataset.sectionId;

      const label = wrap.getAttribute(selectors$F.label).trim().toLowerCase();
      fetchProduct(this.handle).then((product) => {
        this.product = product;
        this.colorOption = product.options.find(function (element) {
          return element.name.toLowerCase() === label || null;
        });

        if (this.colorOption) {
          this.swatches = this.colorOption.values;
          this.init();
        }
      });
    }

    init() {
      this.wrap.innerHTML = '';
      this.count = 0;
      this.swatches.forEach((swatch) => {
        let variant = null;
        let variantAvailable = false;
        let image = '';

        for (const productVariant of this.product.variants) {
          const optionWithSwatch = productVariant.options.includes(swatch);

          if (!variant && optionWithSwatch) {
            variant = productVariant;
          }

          // Use a variant with image if exists
          if (optionWithSwatch && productVariant.featured_media) {
            image = productVariant.featured_media.preview_image.src;
            variant = productVariant;
            break;
          }
        }

        for (const productVariant of this.product.variants) {
          const optionWithSwatch = productVariant.options.includes(swatch);

          if (optionWithSwatch && productVariant.available) {
            variantAvailable = true;
            break;
          }
        }

        if (variant) {
          const swatchTemplate = document.createElement('div');
          swatchTemplate.innerHTML = this.template;
          const button = swatchTemplate.querySelector(selectors$F.button);
          const swatchLink = swatchTemplate.querySelector(selectors$F.swatchLink);
          const variantTitle = variant.title.replaceAll('"', "'");

          button.style = `--animation-delay: ${(100 * this.count) / 1000}s`;
          button.dataset.tooltip = swatch;
          swatchLink.href = getUrlWithVariant(this.product.url, variant.id);
          swatchLink.innerText = swatch;
          swatchLink.dataset.swatch = swatch;
          swatchLink.dataset.swatchVariant = variant.id;
          swatchLink.dataset.swatchVariantName = variantTitle;
          swatchLink.dataset.swatchImage = image;
          swatchLink.dataset.variant = variant.id;
          swatchLink.disabled = !variantAvailable;

          this.wrap.innerHTML += swatchTemplate.innerHTML;
          this.count++;
        }
      });

      this.swatchCount = this.productInfo.querySelector(`[${selectors$F.swatchCount}]`);
      this.swatchElements = this.wrap.querySelectorAll(selectors$F.swatchLink);
      this.swatchForm = this.productInfo.querySelector(selectors$F.gridSwatchForm);
      this.hideSwatchesTimer = 0;

      if (this.swatchCount.hasAttribute(selectors$F.swatchCount)) {
        this.swatchCount.innerText = `${this.count} ${this.count > 1 ? theme.strings.otherColor : theme.strings.oneColor}`;

        this.swatchCount.addEventListener('mouseenter', () => {
          if (this.hideSwatchesTimer) clearTimeout(this.hideSwatchesTimer);

          this.productInfo.classList.add(classes$z.stopEvents);
          this.swatchForm.classList.add(classes$z.visible);
        });

        // Prevent color swatches blinking on mouse move
        this.productInfo.addEventListener('mouseleave', () => {
          this.hideSwatchesTimer = setTimeout(() => {
            this.productInfo.classList.remove(classes$z.stopEvents);
            this.swatchForm.classList.remove(classes$z.visible);
          }, 100);
        });
      }

      if (this.wrap.hasAttribute(selectors$F.scrollbar)) {
        new NativeScrollbar(this.wrap);
      }

      this.swatchElements.forEach((el) => {
        new Swatch(el);
      });
    }
  }

  const makeGridSwatches = (section) => {
    const gridSwatchWrappers = section.container.querySelectorAll(selectors$F.wrapper);
    gridSwatchWrappers.forEach((wrap) => {
      new GridSwatch(wrap, undefined);
    });
  };

  const swatchSection = {
    onLoad() {
      this.swatches = [];
      const els = this.container.querySelectorAll(`[${selectors$F.swatch}]`);
      els.forEach((el) => {
        this.swatches.push(new Swatch(el));
      });
    },
  };

  const swatchGridSection = {
    onLoad() {
      makeGridSwatches(this);
    },
  };

  const selectors$E = {
    productCutline: '[data-product-cutline]',
    productLink: '[data-product-link]',
    productGridItem: '[data-product-grid-item]',
    productInfo: '[data-product-information]',
    productImage: '[data-product-image-default]',
    productImageSibling: '[data-product-image-sibling]',
    productPrice: '[data-product-price]',
    siblingsInnerHolder: '[data-sibling-inner]',
    siblingCount: '[data-sibling-count]',
    siblingHolder: '[data-sibling-holder]',
    siblingFieldset: '[data-sibling-fieldset]',
    siblingLink: '[data-sibling-link]',
  };

  const classes$y = {
    visible: 'is-visible',
    fade: 'is-fade',
    stopEvents: 'no-events',
    active: 'is-active',
  };

  const attributes$h = {
    siblingAddedImage: 'data-sibling-added-image',
    siblingCutline: 'data-sibling-cutline',
    siblingImage: 'data-sibling-image',
    siblingLink: 'data-sibling-link',
    siblingPrice: 'data-sibling-price',
    productLink: 'data-product-link',
  };

  class SiblingSwatches {
    constructor(swatches, product) {
      this.swatches = swatches;
      this.product = product;
      this.productLinks = this.product.querySelectorAll(selectors$E.productLink);
      this.productCutline = this.product.querySelector(selectors$E.productCutline);
      this.productPrice = this.product.querySelector(selectors$E.productPrice);
      this.productImage = this.product.querySelector(selectors$E.productImage);
      this.productImageSibling = this.product.querySelector(selectors$E.productImageSibling);

      this.init();
    }

    init() {
      this.cacheDefaultValues();

      this.product.addEventListener('mouseleave', () => this.resetProductValues());

      this.swatches.forEach((swatch) => {
        swatch.addEventListener('mouseenter', (event) => this.showSibling(event));
      });

      if (this.productLinks.length) {
        this.swatches.forEach((swatch) => {
          swatch.addEventListener('click', () => {
            this.productLinks[0].click();
          });
        });
      }
    }

    cacheDefaultValues() {
      this.productLinkValue = this.productLinks[0].hasAttribute(attributes$h.productLink) ? this.productLinks[0].getAttribute(attributes$h.productLink) : '';
      this.productPriceValue = this.productPrice.innerHTML;

      if (this.productCutline) {
        this.productCutlineValue = this.productCutline.innerHTML;
      }
    }

    resetProductValues() {
      this.product.classList.remove(classes$y.active);

      if (this.productLinkValue) {
        this.productLinks.forEach((productLink) => {
          productLink.href = this.productLinkValue;
        });
      }

      if (this.productPrice) {
        this.productPrice.innerHTML = this.productPriceValue;
      }

      if (this.productCutline && this.productCutline) {
        this.productCutline.innerHTML = this.productCutlineValue;
      }

      this.hideSiblingImage();
    }

    showSibling(event) {
      const swatch = event.target;
      const siblingLink = swatch.hasAttribute(attributes$h.siblingLink) ? swatch.getAttribute(attributes$h.siblingLink) : '';
      const siblingPrice = swatch.hasAttribute(attributes$h.siblingPrice) ? swatch.getAttribute(attributes$h.siblingPrice) : '';
      const siblingCutline = swatch.hasAttribute(attributes$h.siblingCutline) ? swatch.getAttribute(attributes$h.siblingCutline) : '';
      const siblingImage = swatch.hasAttribute(attributes$h.siblingImage) ? swatch.getAttribute(attributes$h.siblingImage) : '';

      if (siblingLink) {
        this.productLinks.forEach((productLink) => {
          productLink.href = siblingLink;
        });
      }

      if (siblingPrice) {
        this.productPrice.innerHTML = siblingPrice;
      }

      if (siblingCutline) {
        this.productCutline.innerHTML = siblingCutline;
      } else {
        this.productCutline.innerHTML = '';
      }

      if (siblingImage) {
        this.showSiblingImage(siblingImage);
      }
    }

    showSiblingImage(siblingImage) {
      if (!this.productImageSibling) return;

      // Add current sibling swatch image to PGI image
      const ratio = window.devicePixelRatio || 1;
      const pixels = this.productImage.offsetWidth * ratio;
      const widthRounded = Math.ceil(pixels / 180) * 180;
      const imageSrc = themeImages.getSizedImageUrl(siblingImage, `${widthRounded}x`);
      const imageExists = this.productImageSibling.querySelector(`[src="${imageSrc}"]`);
      const showCurrentImage = () => {
        this.productImageSibling.classList.add(classes$y.visible);
        this.productImageSibling.querySelector(`[src="${imageSrc}"]`).classList.add(classes$y.fade);
      };
      const swapImages = () => {
        this.productImageSibling.querySelectorAll('img').forEach((image) => {
          image.classList.remove(classes$y.fade);
        });
        requestAnimationFrame(showCurrentImage);
      };

      if (imageExists) {
        swapImages();
      } else {
        const imageTag = document.createElement('img');

        imageTag.src = imageSrc;

        if (this.productCutline) {
          imageTag.alt = this.productCutline.innerText;
        }

        imageTag.addEventListener('load', () => {
          this.productImageSibling.append(imageTag);

          swapImages();
        });
      }
    }

    hideSiblingImage() {
      if (!this.productImageSibling) return;

      this.productImageSibling.classList.remove(classes$y.visible);
      this.productImageSibling.querySelectorAll('img').forEach((image) => {
        image.classList.remove(classes$y.fade);
      });
    }
  }

  class Sibling {
    constructor(holder, product) {
      this.holder = holder;
      this.product = product;
      this.siblingScrollbar = this.holder.querySelector(selectors$E.siblingsInnerHolder);
      this.siblingCount = this.holder.querySelector(selectors$E.siblingCount);
      this.siblingFieldset = this.holder.querySelector(selectors$E.siblingFieldset);
      this.siblingLinks = this.holder.querySelectorAll(selectors$E.siblingLink);
      this.productInfo = this.holder.closest(selectors$E.productInfo);
      this.productLink = this.holder.closest(selectors$E.link);
      this.hideSwatchesTimer = 0;

      this.init();
    }

    init() {
      this.initScrollbar();

      if (this.siblingCount && this.siblingFieldset && this.productInfo) {
        this.siblingCount.addEventListener('mouseenter', () => this.showSiblings());

        // Prevent color swatches blinking on mouse move
        this.productInfo.addEventListener('mouseleave', () => this.hideSiblings());
      }

      if (this.siblingLinks.length) {
        new SiblingSwatches(this.siblingLinks, this.product);
      }
    }

    showSiblings() {
      if (this.hideSwatchesTimer) clearTimeout(this.hideSwatchesTimer);

      if (this.productLink) {
        this.productLink.classList.add(classes$y.stopEvents);
      }

      this.siblingFieldset.classList.add(classes$y.visible);
    }

    hideSiblings() {
      this.hideSwatchesTimer = setTimeout(() => {
        if (this.productLink) {
          this.productLink.classList.remove(classes$y.stopEvents);
        }

        this.siblingFieldset.classList.remove(classes$y.visible);
      }, 100);
    }

    initScrollbar() {
      if (this.siblingScrollbar) {
        new NativeScrollbar(this.siblingScrollbar);
      }
    }
  }

  class Siblings {
    constructor(section) {
      this.container = section.container;
      this.siblingHolders = this.container.querySelectorAll(`${selectors$E.productGridItem} ${selectors$E.siblingHolder}`);

      if (this.siblingHolders.length) {
        this.siblingHolders.forEach((siblingHolder) => {
          new Sibling(siblingHolder, siblingHolder.closest(selectors$E.productGridItem));
        });
      }
    }
  }

  const siblings = {
    onLoad() {
      new Siblings(this);
    },
  };

  const selectors$D = {
    rangeSlider: '[data-range-slider]',
    rangeDotLeft: '[data-range-left]',
    rangeDotRight: '[data-range-right]',
    rangeLine: '[data-range-line]',
    rangeHolder: '[data-range-holder]',
    dataMin: 'data-se-min',
    dataMax: 'data-se-max',
    dataMinValue: 'data-se-min-value',
    dataMaxValue: 'data-se-max-value',
    dataStep: 'data-se-step',
    dataFilterUpdate: 'data-range-filter-update',
    priceMin: '[data-field-price-min]',
    priceMax: '[data-field-price-max]',
  };

  const classes$x = {
    initialized: 'is-initialized',
  };

  class RangeSlider {
    constructor(section) {
      this.container = section.container;
      this.slider = section.querySelector(selectors$D.rangeSlider);
      this.resizeFilters = () => this.init();

      if (this.slider) {
        this.onMoveEvent = (event) => this.onMove(event);
        this.onStopEvent = (event) => this.onStop(event);
        this.onStartEvent = (event) => this.onStart(event);
        this.startX = 0;
        this.x = 0;

        // retrieve touch button
        this.touchLeft = this.slider.querySelector(selectors$D.rangeDotLeft);
        this.touchRight = this.slider.querySelector(selectors$D.rangeDotRight);
        this.lineSpan = this.slider.querySelector(selectors$D.rangeLine);

        // get some properties
        this.min = parseFloat(this.slider.getAttribute(selectors$D.dataMin));
        this.max = parseFloat(this.slider.getAttribute(selectors$D.dataMax));

        this.step = 0.0;

        // normalize flag
        this.normalizeFact = 26;

        this.init();
      }
    }

    init() {
      // retrieve default values
      let defaultMinValue = this.min;
      if (this.slider.hasAttribute(selectors$D.dataMinValue)) {
        defaultMinValue = parseFloat(this.slider.getAttribute(selectors$D.dataMinValue));
      }
      let defaultMaxValue = this.max;

      if (this.slider.hasAttribute(selectors$D.dataMaxValue)) {
        defaultMaxValue = parseFloat(this.slider.getAttribute(selectors$D.dataMaxValue));
      }

      // check values are correct
      if (defaultMinValue < this.min) {
        defaultMinValue = this.min;
      }

      if (defaultMaxValue > this.max) {
        defaultMaxValue = this.max;
      }

      if (defaultMinValue > defaultMaxValue) {
        defaultMinValue = defaultMaxValue;
      }

      if (this.slider.getAttribute(selectors$D.dataStep)) {
        this.step = Math.abs(parseFloat(this.slider.getAttribute(selectors$D.dataStep)));
      }

      // initial reset
      this.reset();
      document.addEventListener('theme:resize', this.resizeFilters);

      // usefull values, min, max, normalize fact is the width of both touch buttons
      this.maxX = this.slider.offsetWidth - this.touchRight.offsetWidth;
      this.selectedTouch = null;
      this.initialValue = this.lineSpan.offsetWidth - this.normalizeFact;

      // set defualt values
      this.setMinValue(defaultMinValue);
      this.setMaxValue(defaultMaxValue);

      // link events
      this.touchLeft.addEventListener('mousedown', this.onStartEvent);
      this.touchRight.addEventListener('mousedown', this.onStartEvent);
      this.touchLeft.addEventListener('touchstart', this.onStartEvent, {passive: true});
      this.touchRight.addEventListener('touchstart', this.onStartEvent, {passive: true});

      // initialize
      this.slider.classList.add(classes$x.initialized);
    }

    reset() {
      this.touchLeft.style.left = '0px';
      this.touchRight.style.left = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.lineSpan.style.marginLeft = '0px';
      this.lineSpan.style.width = this.slider.offsetWidth - this.touchLeft.offsetWidth + 'px';
      this.startX = 0;
      this.x = 0;
    }

    setMinValue(minValue) {
      const ratio = (minValue - this.min) / (this.max - this.min);
      this.touchLeft.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact))) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$D.dataMinValue, minValue);
    }

    setMaxValue(maxValue) {
      const ratio = (maxValue - this.min) / (this.max - this.min);
      this.touchRight.style.left = Math.ceil(ratio * (this.slider.offsetWidth - (this.touchLeft.offsetWidth + this.normalizeFact)) + this.normalizeFact) + 'px';
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';
      this.slider.setAttribute(selectors$D.dataMaxValue, maxValue);
    }

    onStart(event) {
      // Prevent default dragging of selected content
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      if (event.currentTarget === this.touchLeft) {
        this.x = this.touchLeft.offsetLeft;
      } else if (event.currentTarget === this.touchRight) {
        this.x = this.touchRight.offsetLeft;
      }

      this.startX = eventTouch.pageX - this.x;
      this.selectedTouch = event.currentTarget;
      document.addEventListener('mousemove', this.onMoveEvent);
      document.addEventListener('mouseup', this.onStopEvent);
      document.addEventListener('touchmove', this.onMoveEvent, {passive: true});
      document.addEventListener('touchend', this.onStopEvent, {passive: true});
    }

    onMove(event) {
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      this.x = eventTouch.pageX - this.startX;

      if (this.selectedTouch === this.touchLeft) {
        if (this.x > this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10) {
          this.x = this.touchRight.offsetLeft - this.selectedTouch.offsetWidth + 10;
        } else if (this.x < 0) {
          this.x = 0;
        }

        this.selectedTouch.style.left = this.x + 'px';
      } else if (this.selectedTouch === this.touchRight) {
        if (this.x < this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10) {
          this.x = this.touchLeft.offsetLeft + this.touchLeft.offsetWidth - 10;
        } else if (this.x > this.maxX) {
          this.x = this.maxX;
        }
        this.selectedTouch.style.left = this.x + 'px';
      }

      // update line span
      this.lineSpan.style.marginLeft = this.touchLeft.offsetLeft + 'px';
      this.lineSpan.style.width = this.touchRight.offsetLeft - this.touchLeft.offsetLeft + 'px';

      // write new value
      this.calculateValue();

      // call on change
      if (this.slider.getAttribute('on-change')) {
        const fn = new Function('min, max', this.slider.getAttribute('on-change'));
        fn(this.slider.getAttribute(selectors$D.dataMinValue), this.slider.getAttribute(selectors$D.dataMaxValue));
      }

      this.onChange(this.slider.getAttribute(selectors$D.dataMinValue), this.slider.getAttribute(selectors$D.dataMaxValue));
    }

    onStop() {
      document.removeEventListener('mousemove', this.onMoveEvent);
      document.removeEventListener('mouseup', this.onStopEvent);
      document.removeEventListener('touchmove', this.onMoveEvent);
      document.removeEventListener('touchend', this.onStopEvent);

      this.selectedTouch = null;

      // write new value
      this.calculateValue();

      // call did changed
      this.onChanged(this.slider.getAttribute(selectors$D.dataMinValue), this.slider.getAttribute(selectors$D.dataMaxValue));
    }

    onChange(min, max) {
      const rangeHolder = this.slider.closest(selectors$D.rangeHolder);
      if (rangeHolder) {
        const priceMin = rangeHolder.querySelector(selectors$D.priceMin);
        const priceMax = rangeHolder.querySelector(selectors$D.priceMax);

        if (priceMin && priceMax) {
          priceMin.value = min;
          priceMax.value = max;
        }
      }
    }

    onChanged(min, max) {
      if (this.slider.hasAttribute(selectors$D.dataFilterUpdate)) {
        this.slider.dispatchEvent(new CustomEvent('theme:range:update', {bubbles: true}));
      }
    }

    calculateValue() {
      const newValue = (this.lineSpan.offsetWidth - this.normalizeFact) / this.initialValue;
      let minValue = this.lineSpan.offsetLeft / this.initialValue;
      let maxValue = minValue + newValue;

      minValue = minValue * (this.max - this.min) + this.min;
      maxValue = maxValue * (this.max - this.min) + this.min;

      if (this.step !== 0.0) {
        let multi = Math.floor(minValue / this.step);
        minValue = this.step * multi;

        multi = Math.floor(maxValue / this.step);
        maxValue = this.step * multi;
      }

      if (this.selectedTouch === this.touchLeft) {
        this.slider.setAttribute(selectors$D.dataMinValue, minValue);
      }

      if (this.selectedTouch === this.touchRight) {
        this.slider.setAttribute(selectors$D.dataMaxValue, maxValue);
      }
    }

    onUnload() {
      if (this.resizeFilters) {
        document.removeEventListener('theme:resize', this.resizeFilters);
      }
    }
  }

  const selectors$C = {
    collectionSidebar: '[data-collection-sidebar]',
    form: '[data-collection-filters-form]',
    input: 'input',
    select: 'select',
    label: 'label',
    textarea: 'textarea',
    priceMin: '[data-field-price-min]',
    priceMax: '[data-field-price-max]',
    priceMinValue: 'data-field-price-min',
    priceMaxValue: 'data-field-price-max',
    rangeMin: '[data-se-min-value]',
    rangeMax: '[data-se-max-value]',
    rangeMinValue: 'data-se-min-value',
    rangeMaxValue: 'data-se-max-value',
    rangeMinDefault: 'data-se-min',
    rangeMaxDefault: 'data-se-max',
    productsContainer: '[data-products-grid]',
    product: '[data-product-grid-item]',
    filterUpdateUrlButton: '[data-filter-update-url]',
    activeFilters: '[data-active-filters]',
    activeFiltersCount: 'data-active-filters-count',
    sort: 'data-sort-enabled',
    collectionNav: '[data-collection-nav]',
  };

  const classes$w = {
    hidden: 'hidden',
    loading: 'is-loading',
  };

  let sections$m = {};

  class FiltersForm {
    constructor(section) {
      this.section = section;
      this.container = this.section.container;
      this.sidebar = this.container.querySelector(selectors$C.collectionSidebar);
      this.form = this.container.querySelector(selectors$C.form);
      this.sort = this.container.querySelector(`[${selectors$C.sort}]`);
      this.productsContainer = this.container.querySelector(selectors$C.productsContainer);
      this.collectionNav = this.container.querySelector(selectors$C.collectionNav);
      this.init();
    }

    init() {
      if (this.form) {
        this.initRangeSlider();

        this.sidebar.addEventListener(
          'input',
          debounce((e) => {
            const type = e.type;
            const target = e.target;

            if (type === selectors$C.input || type === selectors$C.select || type === selectors$C.label || type === selectors$C.textarea) {
              if (this.form && typeof this.form.submit === 'function') {
                const priceMin = this.form.querySelector(selectors$C.priceMin);
                const priceMax = this.form.querySelector(selectors$C.priceMax);
                if (priceMin && priceMax) {
                  if (target.hasAttribute(selectors$C.priceMinValue) && !priceMax.value) {
                    priceMax.value = priceMax.placeholder;
                  } else if (target.hasAttribute(selectors$C.priceMaxValue) && !priceMin.value) {
                    priceMin.value = priceMin.placeholder;
                  }
                }

                this.submitForm(e);
              }
            }
          }, 500)
        );

        this.sidebar.addEventListener('theme:range:update', (e) => this.updateRange(e));
      }

      if (this.sidebar) {
        this.sidebar.addEventListener('click', (e) => this.filterUpdateFromUrl(e));
      }

      if (this.productsContainer) {
        this.productsContainer.addEventListener('click', (e) => this.filterUpdateFromUrl(e));
      }

      if (this.sort) {
        this.container.addEventListener('theme:filter:update', (e) => this.submitForm(e));
      }

      if (this.sidebar || this.sort) {
        window.addEventListener('popstate', (e) => this.submitForm(e));
      }
    }

    initRangeSlider() {
      new RangeSlider(this.form);
    }

    filterUpdateFromUrl(e) {
      const target = e.target;
      if (target.matches(selectors$C.filterUpdateUrlButton) || (target.closest(selectors$C.filterUpdateUrlButton) && target)) {
        e.preventDefault();
        const button = target.matches(selectors$C.filterUpdateUrlButton) ? target : target.closest(selectors$C.filterUpdateUrlButton);
        this.submitForm(e, button.getAttribute('href'));
      }
    }

    submitForm(e, replaceHref = '') {
      this.sort = this.container.querySelector(`[${selectors$C.sort}]`);
      const sortValue = this.sort ? this.sort.getAttribute(selectors$C.sort) : '';
      if (!e || (e && e.type !== 'popstate')) {
        if (replaceHref === '') {
          const url = new window.URL(window.location.href);
          let filterUrl = url.searchParams;
          const filterUrlEntries = filterUrl;
          const filterUrlParams = Object.fromEntries(filterUrlEntries);
          const filterUrlRemoveString = filterUrl.toString();

          if (filterUrlRemoveString.includes('filter.') || filterUrlRemoveString.includes('page=')) {
            for (const key in filterUrlParams) {
              if (key.includes('filter.') || key === 'page') {
                filterUrl.delete(key);
              }
            }
          }

          if (this.form) {
            const formData = new FormData(this.form);
            const formParams = new URLSearchParams(formData);
            const rangeMin = this.form.querySelector(selectors$C.rangeMin);
            const rangeMax = this.form.querySelector(selectors$C.rangeMax);
            const rangeMinDefaultValue = rangeMin && rangeMin.hasAttribute(selectors$C.rangeMinDefault) ? rangeMin.getAttribute(selectors$C.rangeMinDefault) : '';
            const rangeMaxDefaultValue = rangeMax && rangeMax.hasAttribute(selectors$C.rangeMaxDefault) ? rangeMax.getAttribute(selectors$C.rangeMaxDefault) : '';
            let priceFilterDefaultCounter = 0;

            for (let [key, val] of formParams.entries()) {
              if (key.includes('filter.') && val) {
                filterUrl.append(key, val);

                if ((val === rangeMinDefaultValue && key === 'filter.v.price.gte') || (val === rangeMaxDefaultValue && key === 'filter.v.price.lte')) {
                  priceFilterDefaultCounter += 1;
                }
              }
            }

            if (priceFilterDefaultCounter === 2) {
              filterUrl.delete('filter.v.price.gte');
              filterUrl.delete('filter.v.price.lte');
            }
          }

          if (sortValue || (e && e.detail && e.detail.href)) {
            const sortString = sortValue ? sortValue : e.detail.href;
            filterUrl.set('sort_by', sortString);
          }

          const filterUrlString = filterUrl.toString();
          const filterNewParams = filterUrlString ? `?${filterUrlString}` : location.pathname;
          window.history.pushState(null, '', filterNewParams);
        } else {
          window.history.pushState(null, '', replaceHref);
        }
      } else if (this.sort) {
        this.sort.dispatchEvent(new CustomEvent('theme:filter:sort', {bubbles: false}));
      }

      if (this.productsContainer) {
        this.productsContainer.classList.add(classes$w.loading);
        fetch(`${window.location.pathname}${window.location.search}`)
          .then((response) => response.text())
          .then((data) => {
            this.productsContainer.innerHTML = new DOMParser().parseFromString(data, 'text/html').querySelector(selectors$C.productsContainer).innerHTML;

            if (this.sidebar) {
              this.sidebar.innerHTML = new DOMParser().parseFromString(data, 'text/html').querySelector(selectors$C.collectionSidebar).innerHTML;

              const activeFiltersCountContainer = this.sidebar.querySelector(`[${selectors$C.activeFiltersCount}]`);
              const activeFiltersContainer = this.container.querySelectorAll(selectors$C.activeFilters);
              if (activeFiltersCountContainer && activeFiltersContainer.length) {
                const activeFiltersCount = parseInt(activeFiltersCountContainer.getAttribute(selectors$C.activeFiltersCount));

                activeFiltersContainer.forEach((counter) => {
                  counter.textContent = activeFiltersCount;
                  counter.classList.toggle(classes$w.hidden, activeFiltersCount < 1);
                });
              }
            }

            if (this.form) {
              this.form = this.container.querySelector(selectors$C.form);

              // Init Range Slider
              this.initRangeSlider();
            }

            // Init Collection
            const collectionClass = new Collection(this.section);
            collectionClass.onUnload(false);

            // Init Grid Swatches
            makeGridSwatches(this.section);

            // Init Siblings
            new Siblings(this.section);

            // Init Tooltips
            document.dispatchEvent(
              new CustomEvent('theme:tooltip:close', {
                bubbles: false,
                detail: {
                  hideTransition: false,
                },
              })
            );

            if (this.collectionNav) {
              scrollTo(this.productsContainer.getBoundingClientRect().top - this.collectionNav.offsetHeight);
            }

            setTimeout(() => {
              this.productsContainer.classList.remove(classes$w.loading);
            }, 500);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    updateRange(e) {
      if (this.form && typeof this.form.submit === 'function') {
        const rangeMin = this.form.querySelector(selectors$C.rangeMin);
        const rangeMax = this.form.querySelector(selectors$C.rangeMax);
        const priceMin = this.form.querySelector(selectors$C.priceMin);
        const priceMax = this.form.querySelector(selectors$C.priceMax);
        const checkElements = rangeMin && rangeMax && priceMin && priceMax;

        if (checkElements && rangeMin.hasAttribute(selectors$C.rangeMinValue) && rangeMax.hasAttribute(selectors$C.rangeMaxValue)) {
          const priceMinValue = parseInt(priceMin.placeholder);
          const priceMaxValue = parseInt(priceMax.placeholder);
          const rangeMinValue = parseInt(rangeMin.getAttribute(selectors$C.rangeMinValue));
          const rangeMaxValue = parseInt(rangeMax.getAttribute(selectors$C.rangeMaxValue));

          if (priceMinValue !== rangeMinValue || priceMaxValue !== rangeMaxValue) {
            priceMin.value = rangeMinValue;
            priceMax.value = rangeMaxValue;

            this.submitForm(e);
          }
        }
      }
    }
  }

  const collectionFiltersForm = {
    onLoad() {
      sections$m[this.id] = new FiltersForm(this);
    },
  };

  const selectors$B = {
    dataSort: 'data-sort-enabled',
    sortLinks: '[data-sort-link]',
    sortValue: 'data-value',
    sortButton: '[data-popout-toggle]',
    sortButtonText: '[data-sort-button-text]',
    collectionSidebar: '[data-collection-sidebar]',
    collectionSidebarSlider: '[data-collection-sidebar-slider]',
    collectionSidebarSlideOut: '[data-collection-sidebar-slide-out]',
    collectionSidebarCloseButton: '[data-collection-sidebar-close]',
    showMoreOptions: '[data-show-more]',
    groupTagsButton: '[data-aria-toggle]',
    collectionNav: '[data-collection-nav]',
    linkHidden: '[data-link-hidden]',
    underlay: '[data-drawer-underlay]',
    swatch: 'data-swatch',
    animation: '[data-animation]',
  };

  const classes$v = {
    animated: 'drawer--animated',
    hiding: 'is-hiding',
    expanded: 'expanded',
    noMobileAnimation: 'no-mobile-animation',
    hidden: 'is-hidden',
    active: 'is-active',
    focused: 'is-focused',
  };

  let sections$l = {};
  class Collection {
    constructor(section) {
      this.container = section.container;
      this.sort = this.container.querySelector(`[${selectors$B.dataSort}]`);
      this.sortButton = this.container.querySelector(selectors$B.sortButton);
      this.sortLinks = this.container.querySelectorAll(selectors$B.sortLinks);
      this.collectionSidebar = this.container.querySelector(selectors$B.collectionSidebar);
      this.collectionSidebarCloseButtons = this.container.querySelectorAll(selectors$B.collectionSidebarCloseButton);
      this.groupTagsButton = this.container.querySelector(selectors$B.groupTagsButton);
      this.collectionNav = this.container.querySelector(selectors$B.collectionNav);
      this.showMoreOptions = this.container.querySelectorAll(selectors$B.showMoreOptions);
      this.underlay = this.container.querySelector(selectors$B.underlay);
      this.swatches = this.container.querySelectorAll(`[${selectors$B.swatch}]`);
      this.accessibility = a11y;

      this.groupTagsButtonClickEvent = (evt) => this.groupTagsButtonClick(evt);
      this.collectionSidebarCloseEvent = (evt) => this.collectionSidebarClose(evt);
      this.collectionSidebarScrollEvent = () => this.collectionSidebarScroll();
      this.onSortButtonClickEvent = (e) => this.onSortButtonClick(e);
      this.onSortCheckEvent = (e) => this.onSortCheck(e);
      this.sidebarResizeEvent = () => this.toggleSidebarSlider();

      this.init();
    }

    init() {
      if (this.sort) {
        this.initSort();
      }

      if (this.groupTagsButton !== null) {
        document.addEventListener('theme:resize', this.sidebarResizeEvent);

        this.groupTagsButton.addEventListener('click', this.groupTagsButtonClickEvent);

        // Prevent filters closing animation on page load
        if (this.collectionSidebar) {
          setTimeout(() => {
            this.collectionSidebar.classList.remove(classes$v.noMobileAnimation);
          }, 1000);
        }

        const toggleFiltersObserver = new MutationObserver((mutationList) => {
          for (const mutation of mutationList) {
            if (mutation.type === 'attributes') {
              const expanded = mutation.target.ariaExpanded == 'true';

              if (expanded) {
                this.showSidebarCallback();
              }
            }
          }
        });

        toggleFiltersObserver.observe(this.groupTagsButton, {
          attributes: true,
          childList: false,
          subtree: false,
        });
      }

      if (this.collectionSidebarCloseButtons.length) {
        this.collectionSidebarCloseButtons.forEach((button) => {
          button.addEventListener('click', this.collectionSidebarCloseEvent);
        });
      }

      // Hide filters sidebar on ESC keypress
      this.container.addEventListener(
        'keyup',
        function (evt) {
          if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideSidebar();
        }.bind(this)
      );

      // Hide filters sidebar on underlay click
      if (this.underlay) {
        this.underlay.addEventListener('click', this.collectionSidebarCloseEvent);
      }

      // Show more options from the group
      if (this.showMoreOptions) {
        this.showMoreOptions.forEach((element) => {
          element.addEventListener('click', (event) => {
            event.preventDefault();

            element.parentElement.classList.add(classes$v.hidden);

            element.parentElement.previousElementSibling.querySelectorAll(selectors$B.linkHidden).forEach((link, index) => {
              link.classList.remove(classes$v.hidden);
              if (index === 0) {
                window.accessibility.lastFocused = link;
              }
            });

            const collectionSidebarSlideOut = this.container.querySelector(selectors$B.collectionSidebarSlideOut);
            if (collectionSidebarSlideOut) {
              this.accessibility.removeTrapFocus();
              this.accessibility.trapFocus(this.collectionSidebar, {
                elementToFocus: window.accessibility.lastFocused,
              });
            }
          });
        });
      }

      // Init Swatches
      if (this.swatches) {
        this.swatches.forEach((swatch) => {
          new Swatch(swatch);
        });
      }

      if (this.collectionSidebar) {
        this.collectionSidebar.addEventListener('transitionend', () => {
          if (!this.collectionSidebar.classList.contains(classes$v.expanded)) {
            this.collectionSidebar.classList.remove(classes$v.animated);
          }
        });

        this.toggleSidebarSlider();
      }
    }

    collectionSidebarScroll() {
      document.dispatchEvent(
        new CustomEvent('theme:tooltip:close', {
          bubbles: false,
          detail: {
            hideTransition: false,
          },
        })
      );
    }

    sortActions(link, submitForm = true) {
      const sort = link ? link.getAttribute(selectors$B.sortValue) : '';
      this.sort.setAttribute(selectors$B.dataSort, sort);

      const sortButtonText = this.sort.querySelector(selectors$B.sortButtonText);
      const sortActive = this.sort.querySelector(`.${classes$v.active}`);
      if (sortButtonText) {
        const linkText = link ? link.textContent.trim() : '';
        sortButtonText.textContent = linkText;
      }
      if (sortActive) {
        sortActive.classList.remove(classes$v.active);
      }
      this.sort.classList.toggle(classes$v.active, link);

      if (link) {
        link.parentElement.classList.add(classes$v.active);

        if (submitForm) {
          link.dispatchEvent(
            new CustomEvent('theme:filter:update', {
              bubbles: true,
              detail: {
                href: sort,
              },
            })
          );
        }
      }
    }

    onSortButtonClick(e) {
      e.preventDefault();

      if (this.sortButton) {
        this.sortButton.dispatchEvent(new Event('click'));
      }
      this.sortActions(e.currentTarget);
    }

    onSortCheck(e) {
      let link = null;
      if (window.location.search.includes('sort_by')) {
        const url = new window.URL(window.location.href);
        const urlParams = url.searchParams;

        for (const [key, val] of urlParams.entries()) {
          const linkSort = this.sort.querySelector(`[${selectors$B.sortValue}="${val}"]`);
          if (key.includes('sort_by') && linkSort) {
            link = linkSort;
            break;
          }
        }
      }

      this.sortActions(link, false);
    }

    initSort() {
      this.sortLinks.forEach((link) => {
        link.addEventListener('click', this.onSortButtonClickEvent);
      });
      this.sort.addEventListener('theme:filter:sort', this.onSortCheckEvent);

      if (this.sortButton) {
        this.sortButton.addEventListener('click', () => {
          const isFiltersSidebarOpen = this.collectionSidebar.classList.contains(classes$v.expanded);

          if (isMobile() && isFiltersSidebarOpen) {
            this.hideSidebar();
          }
        });
      }
    }

    showSidebarCallback() {
      const collectionSidebarSlider = this.container.querySelector(selectors$B.collectionSidebarSlider);
      const collectionSidebarSlideOut = this.container.querySelector(selectors$B.collectionSidebarSlideOut);
      const collectionSidebarScrollable = collectionSidebarSlider || collectionSidebarSlideOut;
      const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

      const isMobileView = isMobile();
      this.collectionSidebar.classList.add(classes$v.animated);

      if (collectionSidebarSlideOut === null) {
        if (!isMobileView && isScrollLocked) {
          this.accessibility.removeTrapFocus();
          document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
        }
      }

      if (isMobileView || collectionSidebarSlideOut !== null) {
        if (collectionSidebarSlideOut) {
          this.accessibility.trapFocus(this.collectionSidebar, {
            elementToFocus: this.collectionSidebar.querySelector(selectors$B.collectionSidebarCloseButton),
          });
        }
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }

      if (collectionSidebarScrollable) {
        collectionSidebarScrollable.addEventListener('scroll', this.collectionSidebarScrollEvent);
      }
    }

    hideSidebar() {
      const collectionSidebarSlider = this.container.querySelector(selectors$B.collectionSidebarSlider);
      const collectionSidebarSlideOut = this.container.querySelector(selectors$B.collectionSidebarSlideOut);
      const collectionSidebarScrollable = collectionSidebarSlider || collectionSidebarSlideOut;
      const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

      this.groupTagsButton.setAttribute('aria-expanded', 'false');
      this.collectionSidebar.classList.remove(classes$v.expanded);

      if (collectionSidebarScrollable) {
        collectionSidebarScrollable.removeEventListener('scroll', this.collectionSidebarScrollEvent);
      }

      if (collectionSidebarSlideOut) {
        this.accessibility.removeTrapFocus();
      }

      if (isScrollLocked) {
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }
    }

    toggleSidebarSlider() {
      if (isMobile()) {
        this.hideSidebar();
      } else if (this.collectionSidebar.classList.contains(classes$v.expanded)) {
        this.showSidebarCallback();
      }
    }

    collectionSidebarClose(evt) {
      evt.preventDefault();
      this.hideSidebar();
      if (document.body.classList.contains(classes$v.focused) && this.groupTagsButton) {
        this.groupTagsButton.focus();
      }
    }

    groupTagsButtonClick() {
      const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');

      if (isScrollLocked) {
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }
    }

    onUnload(flag = true) {
      if (this.groupTagsButton !== null) {
        document.removeEventListener('theme:resize', this.sidebarResizeEvent);
        this.groupTagsButton.removeEventListener('click', this.groupTagsButtonClickEvent);
      }

      if (this.collectionSidebarCloseButtons.length && flag) {
        this.collectionSidebarCloseButtons.forEach((button) => {
          button.removeEventListener('click', this.collectionSidebarCloseEvent);
        });
      }

      if (this.collectionSidebarScrollable & flag) {
        this.collectionSidebarScrollable.removeEventListener('scroll', this.collectionSidebarScrollEvent);
      }

      if (this.underlay) {
        this.underlay.removeEventListener('click', this.collectionSidebarCloseEvent);
      }

      if (this.sort) {
        this.sortLinks.forEach((link) => {
          link.removeEventListener('click', this.onSortButtonClickEvent);
        });
        this.sort.removeEventListener('theme:filter:sort', this.onSortCheckEvent);
      }
    }
  }

  const collectionSection = {
    onLoad() {
      sections$l[this.id] = new Collection(this);
    },
    onUnload() {
      sections$l[this.id].onUnload();
    },
  };

  register('collection', [slider, parallaxHero, collectionSection, popoutSection, swatchGridSection, collectionFiltersForm, tooltipSection, siblings]);

  const selectors$A = {
    frame: '[data-ticker-frame]',
    scale: '[data-ticker-scale]',
    text: '[data-ticker-text]',
    clone: 'data-clone',
  };

  const attributes$g = {
    speed: 'data-marquee-speed',
  };

  const classes$u = {
    animation: 'ticker--animated',
    unloaded: 'ticker--unloaded',
    comparitor: 'ticker__comparitor',
  };

  const settings$1 = {
    textAnimationTime: 1.63, // 100px going to move for 1.63s
    space: 100, // 100px
  };

  class Ticker {
    constructor(el, stopClone = false) {
      this.frame = el;
      this.stopClone = stopClone;
      this.scale = this.frame.querySelector(selectors$A.scale);
      this.text = this.frame.querySelector(selectors$A.text);

      this.comparitor = this.text.cloneNode(true);
      this.comparitor.classList.add(classes$u.comparitor);
      this.frame.appendChild(this.comparitor);
      this.scale.classList.remove(classes$u.unloaded);
      this.resizeEvent = debounce(() => this.checkWidth(), 100);
      this.listen();
    }

    unload() {
      document.removeEventListener('theme:resize', this.resizeEvent);
    }

    listen() {
      document.addEventListener('theme:resize', this.resizeEvent);
      this.checkWidth();
    }

    checkWidth() {
      const padding = window.getComputedStyle(this.frame).paddingLeft.replace('px', '') * 2;
      const speed = this.frame.getAttribute(attributes$g.speed) ? this.frame.getAttribute(attributes$g.speed) : settings$1.textAnimationTime;

      if (this.frame.clientWidth - padding < this.comparitor.clientWidth || this.stopClone) {
        this.text.classList.add(classes$u.animation);
        if (this.scale.childElementCount === 1) {
          this.clone = this.text.cloneNode(true);
          this.clone.setAttribute(selectors$A.clone, '');
          this.scale.appendChild(this.clone);

          if (this.stopClone) {
            for (let index = 0; index < 10; index++) {
              const cloneSecond = this.text.cloneNode(true);
              cloneSecond.setAttribute(selectors$A.clone, '');
              this.scale.appendChild(cloneSecond);
            }
          }

          const animationTimeFrame = ((this.text.clientWidth / settings$1.space) * Number(speed)).toFixed(2);

          this.scale.style.setProperty('--animation-time', `${animationTimeFrame}s`);
        }
      } else {
        this.text.classList.add(classes$u.animation);
        let clone = this.scale.querySelector(`[${selectors$A.clone}]`);
        if (clone) {
          this.scale.removeChild(clone);
        }
        this.text.classList.remove(classes$u.animation);
      }
    }
  }

  const selectors$z = {
    bar: '[data-bar]',
    barSlide: '[data-slide]',
    frame: '[data-ticker-frame]',
    header: '[data-header-wrapper]',
    slider: '[data-slider]',
    marquee: '[data-marquee]',
    tickerScale: '[data-ticker-scale]',
    tickerText: '[data-ticker-text]',
  };

  const classes$t = {
    tickerAnimated: 'ticker--animated',
  };

  const attributes$f = {
    slide: 'data-slide',
    stop: 'data-stop',
    style: 'style',
    targetReferrer: 'data-target-referrer',
  };

  const sections$k = {};

  class Bar {
    constructor(holder) {
      this.barHolder = holder;
      this.locationPath = location.href;

      this.slides = this.barHolder.querySelectorAll(selectors$z.barSlide);
      this.slider = this.barHolder.querySelector(selectors$z.slider);
      this.marquee = this.barHolder.querySelector(selectors$z.marquee);

      this.init();
    }

    init() {
      this.removeAnnouncement();

      if (this.slider) {
        this.initSliders();
      }

      if (this.marquee) {
        this.initTickers(true);
      }

      document.dispatchEvent(new CustomEvent('theme:announcement:init', {bubbles: true}));
    }

    /**
     * Delete announcement which has a target referrer attribute and it is not contained in page URL
     */
    removeAnnouncement() {
      for (let index = 0; index < this.slides.length; index++) {
        const element = this.slides[index];

        if (!element.hasAttribute(attributes$f.targetReferrer)) {
          continue;
        }

        if (this.locationPath.indexOf(element.getAttribute(attributes$f.targetReferrer)) === -1 && !window.Shopify.designMode) {
          element.parentNode.removeChild(element);
        }
      }
    }

    /**
     * Init slider
     */
    initSliders() {
      this.slider = new Slider(this.barHolder);

      if (this.slider.flkty) {
        this.slider.flkty.reposition();

        this.barHolder.addEventListener('theme:slider:loaded', () => {
          this.initTickers();
        });
      } else {
        this.initTickers();
      }
    }

    /**
     * Init tickers in sliders
     */
    initTickers(stopClone = false) {
      const frames = this.barHolder.querySelectorAll(selectors$z.frame);

      frames.forEach((element) => {
        new Ticker(element, stopClone);
      });
    }

    toggleTicker(e, isStopped) {
      const tickerScale = document.querySelector(selectors$z.tickerScale);
      const element = document.querySelector(`[${attributes$f.slide}="${e.detail.blockId}"]`);

      if (isStopped && element) {
        tickerScale.setAttribute(attributes$f.stop, '');
        tickerScale.querySelectorAll(selectors$z.tickerText).forEach((textHolder) => {
          textHolder.classList.remove(classes$t.tickerAnimated);
          textHolder.style.transform = `translate3d(${-(element.offsetLeft - element.clientWidth)}px, 0, 0)`;
        });
      }

      if (!isStopped && element) {
        tickerScale.querySelectorAll(selectors$z.tickerText).forEach((textHolder) => {
          textHolder.classList.add(classes$t.tickerAnimated);
          textHolder.removeAttribute(attributes$f.style);
        });
        tickerScale.removeAttribute(attributes$f.stop);
      }
    }

    onBlockSelect(e) {
      if (this.slider) {
        this.slider.onBlockSelect(e);
      } else {
        this.toggleTicker(e, true);
      }
    }

    onBlockDeselect(e) {
      if (this.slider) {
        this.slider.onBlockDeselect(e);
      } else {
        this.toggleTicker(e, false);
      }
    }
  }

  const bar = {
    onLoad() {
      sections$k[this.id] = [];
      const element = this.container.querySelector(selectors$z.bar);
      if (element) {
        sections$k[this.id].push(new Bar(element));
      }
    },
    onBlockSelect(e) {
      if (sections$k[this.id].length) {
        sections$k[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockSelect(e);
          }
        });
      }
    },
    onBlockDeselect(e) {
      if (sections$k[this.id].length) {
        sections$k[this.id].forEach((el) => {
          if (typeof el.onBlockSelect === 'function') {
            el.onBlockDeselect(e);
          }
        });
      }
    },
  };

  register('announcement', [bar]);

  const selectors$y = {
    body: 'body',
    drawerWrappper: '[data-drawer]',
    drawerInner: '[data-drawer-inner]',
    underlay: '[data-drawer-underlay]',
    stagger: '[data-stagger-animation]',
    wrapper: '[data-header-transparent]',
    drawerToggle: 'data-drawer-toggle',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$s = {
    animated: 'drawer--animated',
    open: 'is-open',
    isFocused: 'is-focused',
    headerStuck: 'js__header__stuck',
  };

  let sections$j = {};

  class Drawer {
    constructor(el) {
      this.drawer = el;
      this.drawerWrapper = this.drawer.closest(selectors$y.drawerWrappper);
      this.drawerInner = this.drawer.querySelector(selectors$y.drawerInner);
      this.underlay = this.drawer.querySelector(selectors$y.underlay);
      this.wrapper = this.drawer.closest(selectors$y.wrapper);
      this.key = this.drawer.dataset.drawer;
      this.btnSelector = `[${selectors$y.drawerToggle}='${this.key}']`;
      this.buttons = document.querySelectorAll(this.btnSelector);
      this.staggers = this.drawer.querySelectorAll(selectors$y.stagger);
      this.body = document.querySelector(selectors$y.body);
      this.accessibility = a11y;

      this.initWatchFocus = (evt) => this.watchFocus(evt);
      this.showDrawer = this.showDrawer.bind(this);
      this.hideDrawer = this.hideDrawer.bind(this);

      this.connectToggle();
      this.connectDrawer();
      this.closers();
    }

    connectToggle() {
      this.buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:toggle', {
              bubbles: false,
            })
          );
        });
      });
    }

    connectDrawer() {
      this.drawer.addEventListener('theme:drawer:toggle', () => {
        if (this.drawer.classList.contains(classes$s.open)) {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:close', {
              bubbles: true,
            })
          );
        } else {
          this.drawer.dispatchEvent(
            new CustomEvent('theme:drawer:open', {
              bubbles: true,
            })
          );
        }
      });

      if (this.drawerInner) {
        this.drawerInner.addEventListener('transitionend', (event) => {
          if (event.target != this.drawerInner) return;

          if (!this.drawer.classList.contains(classes$s.open)) {
            this.drawer.classList.remove(classes$s.animated);
            // Reset menu items state after drawer hiding animation completes
            document.dispatchEvent(new CustomEvent('theme:sliderule:close', {bubbles: false}));
          }
        });
      }

      document.addEventListener('theme:cart:open', this.hideDrawer);
      document.addEventListener('theme:drawer:close', this.hideDrawer);
      document.addEventListener('theme:drawer:open', this.showDrawer);
    }

    watchFocus(evt) {
      let drawerInFocus = this.wrapper.contains(evt.target);
      if (!drawerInFocus && this.body.classList.contains(classes$s.isFocused)) {
        this.hideDrawer();
      }
    }

    closers() {
      this.wrapper.addEventListener(
        'keyup',
        function (evt) {
          if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
            return;
          }
          this.hideDrawer();
          this.buttons[0].focus();
        }.bind(this)
      );

      this.underlay.addEventListener('click', () => {
        this.hideDrawer();
      });
    }

    showDrawer() {
      if (this.drawerInner && this.drawerInner.querySelector(this.btnSelector)) {
        this.accessibility.removeTrapFocus();
        this.drawerInner.addEventListener('transitionend', (event) => {
          if (event.target != this.drawerInner) return;

          if (this.drawer.classList.contains(classes$s.open)) {
            this.accessibility.trapFocus(this.drawerInner, {
              elementToFocus: this.drawerInner.querySelector(this.btnSelector),
            });
          }
        });
      }

      this.buttons.forEach((el) => {
        el.setAttribute('aria-expanded', true);
      });

      this.drawer.classList.add(classes$s.open);
      this.drawer.classList.add(classes$s.animated);

      this.drawer.querySelector(selectors$y.focusable).focus();

      document.addEventListener('focusin', this.initWatchFocus);

      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
    }

    hideDrawer() {
      if (!this.drawer.classList.contains(classes$s.open)) {
        return;
      }

      this.accessibility.removeTrapFocus();
      if (this.body.classList.contains(classes$s.isFocused) && this.buttons.length) {
        this.buttons[0].focus();
      }

      this.buttons.forEach((el) => {
        el.setAttribute('aria-expanded', false);
      });

      this.drawer.classList.remove(classes$s.open);
      document.removeEventListener('focusin', this.initWatchFocus);

      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    onUnload() {
      document.removeEventListener('theme:cart:open', this.hideDrawer);
      document.removeEventListener('theme:drawer:close', this.hideDrawer);
      document.removeEventListener('theme:drawer:open', this.showDrawer);
    }
  }

  const drawer = {
    onLoad() {
      sections$j[this.id] = [];
      const els = this.container.querySelectorAll(selectors$y.drawerWrappper);
      els.forEach((el) => {
        sections$j[this.id].push(new Drawer(el));
      });
    },
    onUnload() {
      sections$j[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
  };

  const selectors$x = {
    headerWrapper: '[data-header-wrapper]',
    header: '[data-header-wrapper] header',
    pageHeader: '.page-header',
  };

  const classes$r = {
    stuck: 'js__header__stuck',
    stuckAnimated: 'js__header__stuck--animated',
    triggerAnimation: 'js__header__stuck--trigger-animation',
    stuckBackdrop: 'js__header__stuck__backdrop',
    headerIsNotVisible: 'is-not-visible',
    hasStickyHeader: 'has-sticky-header',
    headerGroup: 'shopify-section-group-header-group',
  };

  const attributes$e = {
    transparent: 'data-header-transparent',
    stickyHeader: 'data-header-sticky',
    scrollLock: 'data-scroll-locked',
  };

  let sections$i = {};

  class Sticky {
    constructor(el) {
      this.wrapper = el;
      this.type = this.wrapper.dataset.headerSticky;
      this.sticks = false;
      this.static = true;
      if (this.wrapper.hasAttribute(attributes$e.stickyHeader)) {
        this.sticks = true;
        this.static = false;
      }
      this.win = window;
      this.animated = this.type === 'directional';
      this.currentlyStuck = false;
      this.cls = this.wrapper.classList;
      this.headerOffset = document.querySelector(selectors$x.pageHeader)?.offsetTop;
      this.headerHeight = document.querySelector(selectors$x.header).clientHeight;
      this.scrollEventStatic = () => this.checkIsVisible();
      this.scrollEventListen = (e) => this.listenScroll(e);
      this.scrollEventUpListen = () => this.scrollUpDirectional();
      this.scrollEventDownListen = () => this.scrollDownDirectional();
      this.updateHeaderOffset = this.updateHeaderOffset.bind(this);

      if (this.sticks) {
        this.scrollDownInit();
        document.body.classList.add(classes$r.hasStickyHeader);
      }

      if (this.static) {
        document.addEventListener('theme:scroll', this.scrollEventStatic);
      }

      this.listen();
    }

    unload() {
      if (this.sticks || this.animated) {
        document.removeEventListener('theme:scroll', this.scrollEventListen);
      }

      if (this.animated) {
        document.removeEventListener('theme:scroll:up', this.scrollEventUpListen);
        document.removeEventListener('theme:scroll:down', this.scrollEventDownListen);
      }

      if (this.static) {
        document.removeEventListener('theme:scroll', this.scrollEventStatic);
      }

      document.removeEventListener('shopify:section:load', this.updateHeaderOffset);
      document.removeEventListener('shopify:section:unload', this.updateHeaderOffset);
    }

    listen() {
      if (this.sticks || this.animated) {
        document.addEventListener('theme:scroll', this.scrollEventListen);
      }

      if (this.animated) {
        document.addEventListener('theme:scroll:up', this.scrollEventUpListen);
        document.addEventListener('theme:scroll:down', this.scrollEventDownListen);
      }

      document.addEventListener('shopify:section:load', this.updateHeaderOffset);
      document.addEventListener('shopify:section:unload', this.updateHeaderOffset);
    }

    listenScroll(e) {
      if (e.detail.down) {
        if (!this.currentlyStuck && e.detail.position > this.headerOffset) {
          this.stickSimple();
        }
        if (!this.currentlyBlurred && e.detail.position > this.headerOffset) {
          this.addBlur();
        }
      } else {
        if (e.detail.position <= this.headerOffset) {
          this.unstickSimple();
        }
        if (e.detail.position <= this.headerOffset) {
          this.removeBlur();
        }
      }
    }

    updateHeaderOffset(event) {
      if (!event.target.classList.contains(classes$r.headerGroup)) return;

      // Update header offset after any "Header group" section has been changed
      setTimeout(() => {
        this.headerOffset = document.querySelector(selectors$x.pageHeader)?.offsetTop;
      });
    }

    stickSimple() {
      if (this.animated) {
        this.cls.add(classes$r.stuckAnimated);
      }
      this.cls.add(classes$r.stuck);
      this.wrapper.setAttribute(attributes$e.transparent, false);
      this.currentlyStuck = true;
    }

    unstickSimple() {
      if (!document.documentElement.hasAttribute(attributes$e.scrollLock)) {
        // check for scroll lock
        this.cls.remove(classes$r.stuck);
        this.wrapper.setAttribute(attributes$e.transparent, theme.settings.transparentHeader);
        if (this.animated) {
          this.cls.remove(classes$r.stuckAnimated);
        }
        this.currentlyStuck = false;
      }
    }

    scrollDownInit() {
      if (window.scrollY > this.headerOffset) {
        this.stickSimple();
      }
      if (window.scrollY > this.headerOffset) {
        this.addBlur();
      }
    }

    stickDirectional() {
      this.cls.add(classes$r.triggerAnimation);
    }

    unstickDirectional() {
      this.cls.remove(classes$r.triggerAnimation);
    }

    scrollDownDirectional() {
      this.unstickDirectional();
    }

    scrollUpDirectional() {
      if (window.scrollY <= this.headerOffset) {
        this.unstickDirectional();
      } else {
        this.stickDirectional();
      }
    }

    addBlur() {
      this.cls.add(classes$r.stuckBackdrop);
      this.currentlyBlurred = true;
    }

    removeBlur() {
      this.cls.remove(classes$r.stuckBackdrop);
      this.currentlyBlurred = false;
    }

    checkIsVisible() {
      const header = document.querySelector(selectors$x.headerWrapper);
      const isHeaderSticky = header.getAttribute(attributes$e.stickyHeader);
      const currentScroll = this.win.pageYOffset;

      if (!isHeaderSticky) {
        header.classList.toggle(classes$r.headerIsNotVisible, currentScroll >= this.headerHeight);
      }
    }
  }

  const stickyHeader = {
    onLoad() {
      sections$i = new Sticky(this.container);
    },
    onUnload: function () {
      if (typeof sections$i.unload === 'function') {
        sections$i.unload();
      }
    },
  };

  const selectors$w = {
    disclosureToggle: 'data-hover-disclosure-toggle',
    disclosureWrappper: '[data-hover-disclosure]',
    link: '[data-top-link]',
    wrapper: '[data-header-wrapper]',
    stagger: '[data-stagger]',
    staggerPair: '[data-stagger-first]',
    staggerAfter: '[data-stagger-second]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  };

  const classes$q = {
    isVisible: 'is-visible',
    meganavVisible: 'meganav--visible',
    meganavIsTransitioning: 'meganav--is-transitioning',
  };

  let sections$h = {};
  let disclosures = {};
  class HoverDisclosure {
    constructor(el) {
      this.disclosure = el;
      this.wrapper = el.closest(selectors$w.wrapper);
      this.key = this.disclosure.id;
      this.trigger = document.querySelector(`[${selectors$w.disclosureToggle}='${this.key}']`);
      this.link = this.trigger.querySelector(selectors$w.link);
      this.grandparent = this.trigger.classList.contains('grandparent');
      this.transitionTimeout = 0;

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);

      this.connectHoverToggle();
      this.handleTablets();
      this.staggerChildAnimations();
    }

    onBlockSelect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.showDisclosure(evt);
      }
    }

    onBlockDeselect(evt) {
      if (this.disclosure.contains(evt.target)) {
        this.hideDisclosure();
      }
    }

    showDisclosure(e) {
      if (e && e.type && e.type === 'mouseenter') {
        this.wrapper.classList.add(classes$q.meganavIsTransitioning);
      }

      if (this.grandparent) {
        this.wrapper.classList.add(classes$q.meganavVisible);
      } else {
        this.wrapper.classList.remove(classes$q.meganavVisible);
      }
      this.trigger.setAttribute('aria-expanded', true);
      this.trigger.classList.add(classes$q.isVisible);
      this.disclosure.classList.add(classes$q.isVisible);

      if (this.transitionTimeout) {
        clearTimeout(this.transitionTimeout);
      }

      this.transitionTimeout = setTimeout(() => {
        this.wrapper.classList.remove(classes$q.meganavIsTransitioning);
      }, 200);
    }

    hideDisclosure() {
      this.disclosure.classList.remove(classes$q.isVisible);
      this.trigger.classList.remove(classes$q.isVisible);
      this.trigger.setAttribute('aria-expanded', false);
      this.wrapper.classList.remove(classes$q.meganavVisible, classes$q.meganavIsTransitioning);
    }

    staggerChildAnimations() {
      const simple = this.disclosure.querySelectorAll(selectors$w.stagger);
      simple.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50 + 10}ms`;
      });

      const pairs = this.disclosure.querySelectorAll(selectors$w.staggerPair);
      pairs.forEach((child, i) => {
        const d1 = i * 100;
        child.style.transitionDelay = `${d1}ms`;
        child.parentElement.querySelectorAll(selectors$w.staggerAfter).forEach((grandchild, i2) => {
          const di1 = i2 + 1;
          const d2 = di1 * 20;
          grandchild.style.transitionDelay = `${d1 + d2}ms`;
        });
      });
    }

    handleTablets() {
      // first click opens the popup, second click opens the link
      this.trigger.addEventListener(
        'touchstart',
        function (e) {
          const isOpen = this.disclosure.classList.contains(classes$q.isVisible);
          if (!isOpen) {
            e.preventDefault();
            this.showDisclosure(e);
          }
        }.bind(this),
        {passive: true}
      );
    }

    connectHoverToggle() {
      this.trigger.addEventListener('mouseenter', (e) => this.showDisclosure(e));
      this.link.addEventListener('focus', (e) => this.showDisclosure(e));

      this.trigger.addEventListener('mouseleave', () => this.hideDisclosure());
      this.trigger.addEventListener('focusout', (e) => {
        const inMenu = this.trigger.contains(e.relatedTarget);
        if (!inMenu) {
          this.hideDisclosure();
        }
      });
      this.disclosure.addEventListener('keyup', (evt) => {
        if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
          return;
        }
        this.hideDisclosure();
      });
    }
  }

  const hoverDisclosure = {
    onLoad() {
      sections$h[this.id] = [];
      disclosures = this.container.querySelectorAll(selectors$w.disclosureWrappper);
      disclosures.forEach((el) => {
        sections$h[this.id].push(new HoverDisclosure(el));
      });
    },
    onBlockSelect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$h[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
  };

  const selectors$v = {
    count: 'data-cart-count',
  };

  class Totals {
    constructor(el) {
      this.section = el;
      this.counts = this.section.querySelectorAll(`[${selectors$v.count}]`);
      this.cartCount = null;
      this.listen();
    }

    listen() {
      document.addEventListener('theme:cart:change', (event) => {
        this.cartCount = event.detail.cartCount;
        this.update();
      });
    }

    update() {
      if (this.cartCount !== null) {
        this.counts.forEach((count) => {
          count.setAttribute(selectors$v.count, this.cartCount);
          count.innerHTML = this.cartCount < 10 ? `${this.cartCount}` : '9+';
        });
      }
    }
  }
  const headerTotals = {
    onLoad() {
      new Totals(this.container);
    },
  };

  const selectors$u = {
    slideruleOpen: 'data-sliderule-open',
    slideruleClose: 'data-sliderule-close',
    sliderulePane: 'data-sliderule-pane',
    slideruleWrappper: '[data-sliderule]',
    drawerContent: '[data-drawer-content]',
    focusable: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    dataAnimates: 'data-animates',
    children: `:scope > [data-animates], 
             :scope > * > [data-animates], 
             :scope > * > * >[data-animates],
             :scope > * > .sliderule-grid  > *`,
  };

  const classes$p = {
    isVisible: 'is-visible',
    isHiding: 'is-hiding',
    isHidden: 'is-hidden',
    focused: 'is-focused',
    scrolling: 'is-scrolling',
  };

  let sections$g = {};

  class HeaderMobileSliderule {
    constructor(el) {
      this.sliderule = el;
      this.key = this.sliderule.id;
      const btnSelector = `[${selectors$u.slideruleOpen}='${this.key}']`;
      this.exitSelector = `[${selectors$u.slideruleClose}='${this.key}']`;
      this.trigger = document.querySelector(btnSelector);
      this.exit = document.querySelectorAll(this.exitSelector);
      this.pane = document.querySelector(`[${selectors$u.sliderulePane}]`);
      this.children = this.sliderule.querySelectorAll(selectors$u.children);
      this.drawerContent = document.querySelector(selectors$u.drawerContent);
      this.cachedButton = null;
      this.accessibility = a11y;

      this.trigger.setAttribute('aria-haspopup', true);
      this.trigger.setAttribute('aria-expanded', false);
      this.trigger.setAttribute('aria-controls', this.key);
      this.closeSliderule = this.closeSliderule.bind(this);

      this.clickEvents();
      this.keyboardEvents();

      document.addEventListener('theme:sliderule:close', this.closeSliderule);
    }

    clickEvents() {
      this.trigger.addEventListener('click', () => {
        this.cachedButton = this.trigger;
        this.showSliderule();
      });
      this.exit.forEach((element) => {
        element.addEventListener('click', () => {
          this.hideSliderule();
        });
      });
    }

    keyboardEvents() {
      this.sliderule.addEventListener('keyup', (evt) => {
        evt.stopPropagation();
        if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
          return;
        }

        this.hideSliderule();
      });
    }

    trapFocusSliderule(showSliderule = true) {
      const trapFocusButton = showSliderule ? this.sliderule.querySelector(this.exitSelector) : this.cachedButton;

      this.accessibility.removeTrapFocus();

      if (trapFocusButton && this.drawerContent) {
        this.accessibility.trapFocus(this.drawerContent, {
          elementToFocus: document.body.classList.contains(classes$p.focused) ? trapFocusButton : null,
        });
      }
    }

    hideSliderule(close = false) {
      const newPosition = parseInt(this.pane.dataset.sliderulePane, 10) - 1;
      this.pane.setAttribute(selectors$u.sliderulePane, newPosition);
      this.pane.classList.add(classes$p.isHiding);
      this.sliderule.classList.add(classes$p.isHiding);
      const hiddenSelector = close ? `[${selectors$u.dataAnimates}].${classes$p.isHidden}` : `[${selectors$u.dataAnimates}="${newPosition}"]`;
      const hiddenItems = this.pane.querySelectorAll(hiddenSelector);
      if (hiddenItems.length) {
        hiddenItems.forEach((element) => {
          element.classList.remove(classes$p.isHidden);
        });
      }

      const children = close ? this.pane.querySelectorAll(`.${classes$p.isVisible}, .${classes$p.isHiding}`) : this.children;
      children.forEach((element, index) => {
        const lastElement = children.length - 1 == index;
        element.classList.remove(classes$p.isVisible);
        if (close) {
          element.classList.remove(classes$p.isHiding);
          this.pane.classList.remove(classes$p.isHiding);
        }
        const removeHidingClass = () => {
          if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) === newPosition) {
            this.sliderule.classList.remove(classes$p.isVisible);
          }
          this.sliderule.classList.remove(classes$p.isHiding);
          this.pane.classList.remove(classes$p.isHiding);

          if (lastElement) {
            this.accessibility.removeTrapFocus();
            if (!close) {
              this.trapFocusSliderule(false);
            }
          }

          element.removeEventListener('animationend', removeHidingClass);
        };

        if (window.theme.settings.enableAnimations) {
          element.addEventListener('animationend', removeHidingClass);
        } else {
          removeHidingClass();
        }
      });
    }

    showSliderule() {
      let lastScrollableFrame = null;
      const parent = this.sliderule.closest(`.${classes$p.isVisible}`);
      let lastScrollableElement = this.pane;

      if (parent) {
        lastScrollableElement = parent;
      }

      lastScrollableElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });

      lastScrollableElement.classList.add(classes$p.scrolling);

      const lastScrollableIsScrolling = () => {
        if (lastScrollableElement.scrollTop <= 0) {
          lastScrollableElement.classList.remove(classes$p.scrolling);
          if (lastScrollableFrame) {
            cancelAnimationFrame(lastScrollableFrame);
          }
        } else {
          lastScrollableFrame = requestAnimationFrame(lastScrollableIsScrolling);
        }
      };

      lastScrollableFrame = requestAnimationFrame(lastScrollableIsScrolling);

      this.sliderule.classList.add(classes$p.isVisible);
      const oldPosition = parseInt(this.pane.dataset.sliderulePane, 10);
      const newPosition = oldPosition + 1;
      this.pane.setAttribute(selectors$u.sliderulePane, newPosition);

      const hiddenItems = this.pane.querySelectorAll(`[${selectors$u.dataAnimates}="${oldPosition}"]`);
      if (hiddenItems.length) {
        hiddenItems.forEach((element, index) => {
          const lastElement = hiddenItems.length - 1 == index;
          element.classList.add(classes$p.isHiding);
          const removeHidingClass = () => {
            element.classList.remove(classes$p.isHiding);
            if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) !== oldPosition) {
              element.classList.add(classes$p.isHidden);
            }

            if (lastElement) {
              this.trapFocusSliderule();
            }
            element.removeEventListener('animationend', removeHidingClass);
          };

          if (window.theme.settings.enableAnimations) {
            element.addEventListener('animationend', removeHidingClass);
          } else {
            removeHidingClass();
          }
        });
      }
    }

    closeSliderule() {
      if (this.pane && this.pane.hasAttribute(selectors$u.sliderulePane) && parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) > 0) {
        this.hideSliderule(true);
        if (parseInt(this.pane.getAttribute(selectors$u.sliderulePane)) > 0) {
          this.pane.setAttribute(selectors$u.sliderulePane, 0);
        }
      }
    }

    onUnload() {
      document.removeEventListener('theme:sliderule:close', this.closeSliderule);
    }
  }

  const headerMobileSliderule = {
    onLoad() {
      sections$g[this.id] = [];
      const els = this.container.querySelectorAll(selectors$u.slideruleWrappper);
      els.forEach((el) => {
        sections$g[this.id].push(new HeaderMobileSliderule(el));
      });
    },
    onUnload() {
      sections$g[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
  };

  const selectors$t = {
    wrapper: '[data-header-wrapper]',
    style: 'data-header-style',
    widthContentWrapper: '[data-takes-space-wrapper]',
    widthContent: '[data-child-takes-space]',
    desktop: '[data-header-desktop]',
    cloneClass: 'js__header__clone',
    showMobileClass: 'js__show__mobile',
    backfill: '[data-header-backfill]',
    transparent: 'data-header-transparent',
    firstSectionHasImage: '.main-content > .shopify-section:first-child [data-overlay-header]',
    preventTransparentHeader: '.main-content > .shopify-section:first-child [data-prevent-transparent-header]',
    deadLink: '.navlink[href="#"]',
    cartToggleButton: '[data-cart-toggle]',
  };

  const classes$o = {
    hasTransparentHeader: 'has-transparent-header',
  };

  let sections$f = {};

  class Header {
    constructor(el) {
      this.wrapper = el;
      this.style = this.wrapper.dataset.style;
      this.desktop = this.wrapper.querySelector(selectors$t.desktop);
      this.isTransparentHeader = this.wrapper.getAttribute(selectors$t.transparent) !== 'false';
      this.overlayedImages = document.querySelectorAll(selectors$t.firstSectionHasImage);
      this.deadLinks = document.querySelectorAll(selectors$t.deadLink);
      this.resizeObserver = null;
      this.headerUpdateEvent = debounce(() => this.checkForImage(), 500);
      this.resizeEventOverlay = () => this.subtractAnnouncementHeight();
      this.checkWidth = this.checkWidth.bind(this);

      this.killDeadLinks();
      if (this.style !== 'drawer' && this.desktop) {
        this.minWidth = this.getMinWidth();
        this.listenWidth();
      }
      this.checkForImage();
      this.listenSectionEvents();
      this.cartToggleEvent();
      this.screenOrientation = getScreenOrientation();
    }

    checkForImage() {
      // check again for overlayed images
      this.overlayedImages = document.querySelectorAll(selectors$t.firstSectionHasImage);
      let preventTransparentHeader = document.querySelectorAll(selectors$t.preventTransparentHeader).length;

      if (this.overlayedImages.length && !preventTransparentHeader && this.isTransparentHeader) {
        // is transparent and has image, overlay the image
        this.listenOverlay();
        this.wrapper.setAttribute(selectors$t.transparent, true);
        document.querySelector(selectors$t.backfill).style.display = 'none';
        theme.settings.transparentHeader = true;
        document.body.classList.add(classes$o.hasTransparentHeader);
      } else {
        this.wrapper.setAttribute(selectors$t.transparent, false);
        document.querySelector(selectors$t.backfill).style.display = 'block';
        theme.settings.transparentHeader = false;
        document.body.classList.remove(classes$o.hasTransparentHeader);
      }

      this.subtractAnnouncementHeight();
    }

    listenOverlay() {
      document.addEventListener('theme:resize', this.resizeEventOverlay);
      this.subtractAnnouncementHeight();
    }

    listenWidth() {
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(this.checkWidth);
        this.resizeObserver.observe(this.wrapper);
      } else {
        document.addEventListener('theme:resize', this.checkWidth);
      }
    }

    listenSectionEvents() {
      document.addEventListener('shopify:section:load', this.headerUpdateEvent);
      document.addEventListener('shopify:section:unload', this.headerUpdateEvent);
      document.addEventListener('shopify:section:reorder', this.headerUpdateEvent);
    }

    killDeadLinks() {
      this.deadLinks.forEach((el) => {
        el.onclick = (e) => {
          e.preventDefault();
        };
      });
    }

    subtractAnnouncementHeight() {
      const currentScreenOrientation = getScreenOrientation();
      const {announcementHeight, headerHeight} = readHeights();
      let {windowHeight} = readHeights();

      // Use the initial window height on mobile devices except if screen oriantation changes
      if (this.screenOrientation === currentScreenOrientation && isMobile()) {
        windowHeight = window.initialWindowHeight;
      } else {
        window.initialWindowHeight = windowHeight;
      }

      this.overlayedImages.forEach((el) => {
        if (theme.settings.transparentHeader) {
          el.style.setProperty('--full-screen', `${windowHeight - announcementHeight}px`);
        } else {
          // headerHeight includes announcement bar height
          el.style.setProperty('--full-screen', `${windowHeight - headerHeight}px`);
        }
        el.classList.add('has-overlay');
      });

      // Update screenOrientation state
      if (this.screenOrientation !== currentScreenOrientation) {
        this.screenOrientation = currentScreenOrientation;
      }
    }

    checkWidth() {
      if (document.body.clientWidth < this.minWidth) {
        this.wrapper.classList.add(selectors$t.showMobileClass);
      } else {
        this.wrapper.classList.remove(selectors$t.showMobileClass);
      }
    }

    getMinWidth() {
      const comparitor = this.wrapper.cloneNode(true);
      comparitor.classList.add(selectors$t.cloneClass);
      document.body.appendChild(comparitor);
      const widthWrappers = comparitor.querySelectorAll(selectors$t.widthContentWrapper);
      let minWidth = 0;
      let spaced = 0;

      widthWrappers.forEach((context) => {
        const wideElements = context.querySelectorAll(selectors$t.widthContent);
        let thisWidth = 0;
        if (wideElements.length === 3) {
          thisWidth = _sumSplitWidths(wideElements);
        } else {
          thisWidth = _sumWidths(wideElements);
        }
        if (thisWidth > minWidth) {
          minWidth = thisWidth;
          spaced = wideElements.length * 20;
        }
      });

      document.body.removeChild(comparitor);
      return minWidth + spaced;
    }

    cartToggleEvent() {
      const cartToggleButtons = this.wrapper.querySelectorAll(selectors$t.cartToggleButton);
      if (cartToggleButtons.length) {
        cartToggleButtons.forEach((button) => {
          button.addEventListener('click', (e) => {
            e.preventDefault();

            document.dispatchEvent(new CustomEvent('theme:cart:toggle', {bubbles: true}));
          });
        });
      }
    }

    unload() {
      if ('ResizeObserver' in window) {
        this.resizeObserver?.unobserve(this.wrapper);
      } else {
        document.removeEventListener('theme:resize', this.checkWidth);
      }
      document.removeEventListener('theme:resize', this.resizeEventOverlay);
      document.removeEventListener('shopify:section:load', this.headerUpdateEvent);
      document.removeEventListener('shopify:section:unload', this.headerUpdateEvent);
      document.removeEventListener('shopify:section:reorder', this.headerUpdateEvent);
    }
  }

  function _sumSplitWidths(nodes) {
    let arr = [];
    nodes.forEach((el) => {
      if (el.firstElementChild) {
        arr.push(el.firstElementChild.clientWidth);
      }
    });
    if (arr[0] > arr[2]) {
      arr[2] = arr[0];
    } else {
      arr[0] = arr[2];
    }
    const width = arr.reduce((a, b) => a + b);
    return width;
  }
  function _sumWidths(nodes) {
    let width = 0;
    nodes.forEach((el) => {
      width += el.clientWidth;
    });
    return width;
  }

  const header = {
    onLoad() {
      sections$f = new Header(this.container);

      setVarsOnResize();
    },
    onUnload() {
      if (typeof sections$f.unload === 'function') {
        sections$f.unload();
      }
    },
  };

  register('header', [header, drawer, popoutSection, headerMobileSliderule, stickyHeader, hoverDisclosure, headerTotals]);

  const selectors$s = {
    scrollElement: '[data-block-scroll]',
    flickityEnabled: 'flickity-enabled',
  };

  const sections$e = {};

  class BlockScroll {
    constructor(el) {
      this.container = el.container;
    }

    onBlockSelect(evt) {
      const scrollElement = this.container.querySelector(selectors$s.scrollElement);
      if (scrollElement && !scrollElement.classList.contains(selectors$s.flickityEnabled)) {
        const currentElement = evt.srcElement;
        if (currentElement) {
          scrollElement.scrollTo({
            top: 0,
            left: currentElement.offsetLeft,
            behavior: 'smooth',
          });
        }
      }
    }
  }

  const blockScroll = {
    onLoad() {
      sections$e[this.id] = new BlockScroll(this);
    },
    onBlockSelect(e) {
      sections$e[this.id].onBlockSelect(e);
    },
  };

  const selectors$r = {
    slider: '[data-slider-mobile]',
    slide: '[data-slide]',
    thumb: '[data-slider-thumb]',
    sliderContainer: '[data-slider-container]',
    popupContainer: '[data-popup-container]',
    popupClose: '[data-popup-close]',
    headerSticky: '[data-header-sticky]',
    headerHeight: '[data-header-height]',
  };

  const classes$n = {
    isAnimating: 'is-animating',
    isSelected: 'is-selected',
    isOpen: 'is-open',
  };

  const attributes$d = {
    thumbValue: 'data-slider-thumb',
  };

  const sections$d = {};

  class Look {
    constructor(section) {
      this.container = section.container;
      this.slider = this.container.querySelector(selectors$r.slider);
      this.slides = this.container.querySelectorAll(selectors$r.slide);
      this.thumbs = this.container.querySelectorAll(selectors$r.thumb);
      this.popupContainer = this.container.querySelector(selectors$r.popupContainer);
      this.popupClose = this.container.querySelectorAll(selectors$r.popupClose);
      this.popupCloseByEvent = this.popupCloseByEvent.bind(this);

      this.init();
    }

    init() {
      if (this.slider && this.slides.length && this.thumbs.length) {
        this.popupContainer.addEventListener('transitionend', (e) => {
          if (e.target != this.popupContainer) return;

          this.popupContainer.classList.remove(classes$n.isAnimating);
          if (e.target.classList.contains(classes$n.isOpen)) {
            this.popupOpenCallback();
          } else {
            this.popupCloseCallback();
          }
        });

        this.popupContainer.addEventListener('transitionstart', (e) => {
          if (e.target != this.popupContainer) return;

          this.popupContainer.classList.add(classes$n.isAnimating);
        });

        this.popupClose.forEach((button) => {
          button.addEventListener('click', () => {
            this.popupContainer.classList.remove(classes$n.isOpen);
            this.scrollUnlock();
          });
        });

        this.thumbs.forEach((thumb, i) => {
          thumb.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = thumb.hasAttribute(attributes$d.thumbValue) && thumb.getAttribute(attributes$d.thumbValue) !== '' ? parseInt(thumb.getAttribute(attributes$d.thumbValue)) : i;
            const slide = this.slides[idx];
            if (isMobile()) {
              const parentPadding = parseInt(window.getComputedStyle(this.slider).paddingLeft);
              const slideLeft = slide.offsetLeft;
              this.slider.scrollTo({
                top: 0,
                left: slideLeft - parentPadding,
                behavior: 'auto',
              });
              this.scrollLock();
              this.popupContainer.classList.add(classes$n.isAnimating, classes$n.isOpen);
            } else {
              const headerHeight =
                document.querySelector(selectors$r.headerSticky) && document.querySelector(selectors$r.headerHeight) ? document.querySelector(selectors$r.headerHeight).getBoundingClientRect().height : 0;
              const slideTop = slide.getBoundingClientRect().top;
              const slideHeightHalf = slide.offsetHeight / 2;
              const windowHeight = window.innerHeight;
              const windowHeightHalf = windowHeight / 2;
              const sliderContainer = this.container.querySelector(selectors$r.sliderContainer);
              let scrollTarget = slideTop + slideHeightHalf - windowHeightHalf + window.scrollY;

              if (sliderContainer) {
                const sliderContainerTop = sliderContainer.getBoundingClientRect().top + window.scrollY;
                const sliderContainerHeight = sliderContainer.offsetHeight;
                const sliderContainerBottom = sliderContainerTop + sliderContainerHeight;

                if (scrollTarget < sliderContainerTop) {
                  scrollTarget = sliderContainerTop - headerHeight;
                } else if (scrollTarget + windowHeight > sliderContainerBottom) {
                  scrollTarget = sliderContainerBottom - windowHeight;
                }
              }

              window.scrollTo({
                top: scrollTarget,
                left: 0,
                behavior: 'smooth',
              });
            }
          });
        });
      }
    }

    popupCloseByEvent() {
      this.popupContainer.classList.remove(classes$n.isOpen);
    }

    popupOpenCallback() {
      document.addEventListener('theme:quick-add:open', this.popupCloseByEvent, {once: true});
      document.addEventListener('theme:product:added', this.popupCloseByEvent, {once: true});
    }

    popupCloseCallback() {
      document.removeEventListener('theme:quick-add:open', this.popupCloseByEvent, {once: true});
      document.removeEventListener('theme:product:added', this.popupCloseByEvent, {once: true});
    }

    scrollLock() {
      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
    }

    scrollUnlock() {
      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }
  }

  const lookSection = {
    onLoad() {
      sections$d[this.id] = new Look(this);
    },
  };

  register('look', [lookSection, swatchGridSection, siblings, blockScroll]);

  const selectors$q = {
    body: 'body',
    dataRelatedSectionElem: '[data-related-section]',
    dataTabsHolder: '[data-tabs-holder]',
    dataTab: 'data-tab',
    dataTabIndex: 'data-tab-index',
    dataAos: '[data-aos]',
    blockId: 'data-block-id',
    tabsLi: '[data-tab]',
    tabLink: '.tab-link',
    tabLinkRecent: '.tab-link__recent',
    tabContent: '.tab-content',
    scrollbarHolder: '[data-scrollbar]',
  };

  const classes$m = {
    current: 'current',
    hidden: 'hidden',
    aosAnimate: 'aos-animate',
    aosNoTransition: 'aos-no-transition',
    focused: 'is-focused',
  };

  const sections$c = {};

  class GlobalTabs {
    constructor(holder) {
      this.container = holder;
      this.body = document.querySelector(selectors$q.body);
      this.accessibility = window.accessibility;

      if (this.container) {
        this.scrollbarHolder = this.container.querySelectorAll(selectors$q.scrollbarHolder);

        this.init();

        // Init native scrollbar
        this.initNativeScrollbar();
      }
    }

    init() {
      const tabsNavList = this.container.querySelectorAll(selectors$q.tabsLi);

      this.container.addEventListener('theme:tab:check', () => this.checkRecentTab());
      this.container.addEventListener('theme:tab:hide', () => this.hideRelatedTab());

      if (tabsNavList.length) {
        tabsNavList.forEach((element) => {
          const tabId = parseInt(element.getAttribute(selectors$q.dataTab));
          const tab = this.container.querySelector(`${selectors$q.tabContent}-${tabId}`);

          element.addEventListener('click', () => {
            this.tabChange(element, tab);
          });

          element.addEventListener('keyup', (event) => {
            if ((event.code === window.theme.keyboardKeys.SPACE || event.code === window.theme.keyboardKeys.ENTER) && this.body.classList.contains(classes$m.focused)) {
              this.tabChange(element, tab);
            }
          });
        });
      }
    }

    tabChange(element, tab) {
      if (element.classList.contains(classes$m.current)) {
        return;
      }

      const currentTab = this.container.querySelector(`${selectors$q.tabsLi}.${classes$m.current}`);
      const currentTabContent = this.container.querySelector(`${selectors$q.tabContent}.${classes$m.current}`);

      currentTab?.classList.remove(classes$m.current);
      currentTabContent?.classList.remove(classes$m.current);

      element.classList.add(classes$m.current);
      tab.classList.add(classes$m.current);

      if (element.classList.contains(classes$m.hidden)) {
        tab.classList.add(classes$m.hidden);
      }

      this.accessibility.a11y.removeTrapFocus();

      this.container.dispatchEvent(new CustomEvent('theme:tab:change', {bubbles: true}));

      element.dispatchEvent(
        new CustomEvent('theme:form:sticky', {
          bubbles: true,
          detail: {
            element: 'tab',
          },
        })
      );

      this.animateItems(tab);
    }

    animateItems(tab, animated = true) {
      const animatedItems = tab.querySelectorAll(selectors$q.dataAos);

      if (animatedItems.length) {
        animatedItems.forEach((animatedItem) => {
          animatedItem.classList.remove(classes$m.aosAnimate);

          if (animated) {
            animatedItem.classList.add(classes$m.aosNoTransition);

            requestAnimationFrame(() => {
              animatedItem.classList.remove(classes$m.aosNoTransition);
              animatedItem.classList.add(classes$m.aosAnimate);
            });
          }
        });
      }
    }

    initNativeScrollbar() {
      if (this.scrollbarHolder.length) {
        this.scrollbarHolder.forEach((scrollbar) => {
          new NativeScrollbar(scrollbar);
        });
      }
    }

    checkRecentTab() {
      const tabLink = this.container.querySelector(selectors$q.tabLinkRecent);

      if (tabLink) {
        tabLink.classList.remove(classes$m.hidden);
        const tabLinkIdx = parseInt(tabLink.getAttribute(selectors$q.dataTab));
        const tabContent = this.container.querySelector(`${selectors$q.tabContent}[${selectors$q.dataTabIndex}="${tabLinkIdx}"]`);

        if (tabContent) {
          tabContent.classList.remove(classes$m.hidden);

          this.animateItems(tabContent, false);
        }

        this.initNativeScrollbar();
      }
    }

    hideRelatedTab() {
      const relatedSection = this.container.querySelector(selectors$q.dataRelatedSectionElem);
      if (!relatedSection) {
        return;
      }

      const parentTabContent = relatedSection.closest(`${selectors$q.tabContent}.${classes$m.current}`);
      if (!parentTabContent) {
        return;
      }
      const parentTabContentIdx = parseInt(parentTabContent.getAttribute(selectors$q.dataTabIndex));
      const tabsNavList = this.container.querySelectorAll(selectors$q.tabsLi);

      if (tabsNavList.length > parentTabContentIdx) {
        const nextTabsNavLink = tabsNavList[parentTabContentIdx].nextSibling;

        if (nextTabsNavLink) {
          tabsNavList[parentTabContentIdx].classList.add(classes$m.hidden);
          nextTabsNavLink.dispatchEvent(new Event('click'));
          this.initNativeScrollbar();
        }
      }
    }

    onBlockSelect(evt) {
      const element = this.container.querySelector(`${selectors$q.tabLink}[${selectors$q.blockId}="${evt.detail.blockId}"]`);
      if (element) {
        element.dispatchEvent(new Event('click'));

        element.parentNode.scrollTo({
          top: 0,
          left: element.offsetLeft - element.clientWidth,
          behavior: 'smooth',
        });
      }
    }
  }

  const tabs = {
    onLoad() {
      sections$c[this.id] = [];
      const tabHolders = this.container.querySelectorAll(selectors$q.dataTabsHolder);

      tabHolders.forEach((holder) => {
        sections$c[this.id].push(new GlobalTabs(holder));
      });
    },
    onBlockSelect(e) {
      sections$c[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(e);
        }
      });
    },
  };

  const selectors$p = {
    dataEnableSound: 'data-enable-sound',
    dataEnableBackground: 'data-enable-background',
    dataEnableAutoplay: 'data-enable-autoplay',
    dataEnableLoop: 'data-enable-loop',
    dataVideoId: 'data-video-id',
    dataVideoType: 'data-video-type',
    videoIframe: '[data-video-id]',
  };

  const classes$l = {
    loaded: 'loaded',
  };

  class LoadVideoVimeo {
    constructor(container) {
      this.container = container;
      this.player = this.container.querySelector(selectors$p.videoIframe);

      if (this.player) {
        this.videoID = this.player.getAttribute(selectors$p.dataVideoId);
        this.videoType = this.player.getAttribute(selectors$p.dataVideoType);
        this.enableBackground = this.player.getAttribute(selectors$p.dataEnableBackground) === 'true';
        this.disableSound = this.player.getAttribute(selectors$p.dataEnableSound) === 'false';
        this.enableAutoplay = this.player.getAttribute(selectors$p.dataEnableAutoplay) !== 'false';
        this.enableLoop = this.player.getAttribute(selectors$p.dataEnableLoop) !== 'false';

        if (this.videoType == 'vimeo') {
          this.init();
        }
      }
    }

    init() {
      this.loadVimeoPlayer();
    }

    loadVimeoPlayer() {
      const oembedUrl = 'https://vimeo.com/api/oembed.json';
      const vimeoUrl = 'https://vimeo.com/' + this.videoID;
      let paramsString = '';
      const state = this.player;

      const params = {
        url: vimeoUrl,
        background: this.enableBackground,
        muted: this.disableSound,
        autoplay: this.enableAutoplay,
        loop: this.enableLoop,
      };

      for (let key in params) {
        paramsString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&';
      }

      fetch(`${oembedUrl}?${paramsString}`)
        .then((response) => response.json())
        .then(function (data) {
          state.innerHTML = data.html;

          setTimeout(function () {
            state.parentElement.classList.add(classes$l.loaded);
          }, 1000);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  const selectors$o = {
    dataSectionId: 'data-section-id',
    dataEnableSound: 'data-enable-sound',
    dataHideOptions: 'data-hide-options',
    dataVideoId: 'data-video-id',
    dataVideoType: 'data-video-type',
    videoIframe: '[data-video-id]',
    videoWrapper: '.video-wrapper',
    youtubeWrapper: '[data-youtube-wrapper]',
  };

  const classes$k = {
    loaded: 'loaded',
  };

  const players = [];

  class LoadVideoYT {
    constructor(container) {
      this.container = container;
      this.player = this.container.querySelector(selectors$o.videoIframe);

      if (this.player) {
        this.videoOptionsVars = {};
        this.videoID = this.player.getAttribute(selectors$o.dataVideoId);
        this.videoType = this.player.getAttribute(selectors$o.dataVideoType);
        if (this.videoType == 'youtube') {
          this.playerID = this.player.querySelector(selectors$o.youtubeWrapper) ? this.player.querySelector(selectors$o.youtubeWrapper).id : this.player.id;
          if (this.player.hasAttribute(selectors$o.dataHideOptions)) {
            this.videoOptionsVars = {
              cc_load_policy: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              playsinline: 1,
              autohide: 0,
              controls: 0,
              branding: 0,
              showinfo: 0,
              rel: 0,
              fs: 0,
              wmode: 'opaque',
            };
          }

          this.init();

          this.container.addEventListener(
            'touchstart',
            function (e) {
              if (e.target.matches(selectors$o.videoWrapper) || e.target.closest(selectors$o.videoWrapper)) {
                const playerID = e.target.querySelector(selectors$o.videoIframe).id;
                players[playerID].playVideo();
              }
            },
            {passive: true}
          );
        }
      }
    }

    init() {
      if (window.isYoutubeAPILoaded) {
        this.loadYoutubePlayer();
      } else {
        // Load Youtube API if not loaded yet
        loadScript({url: 'https://www.youtube.com/iframe_api'}).then(() => this.loadYoutubePlayer());
      }
    }

    loadYoutubePlayer() {
      const defaultYoutubeOptions = {
        height: '720',
        width: '1280',
        playerVars: this.videoOptionsVars,
        events: {
          onReady: (event) => {
            const eventIframe = event.target.getIframe();
            const id = eventIframe.id;
            const enableSound = document.querySelector(`#${id}`).getAttribute(selectors$o.dataEnableSound) === 'true';

            eventIframe.setAttribute('tabindex', '-1');

            if (enableSound) {
              event.target.unMute();
            } else {
              event.target.mute();
            }
            event.target.playVideo();
          },
          onStateChange: (event) => {
            // Loop video if state is ended
            if (event.data == 0) {
              event.target.playVideo();
            }
            if (event.data == 1) {
              // video is playing
              event.target.getIframe().parentElement.classList.add(classes$k.loaded);
            }
          },
        },
      };

      const currentYoutubeOptions = {...defaultYoutubeOptions};
      currentYoutubeOptions.videoId = this.videoID;
      if (this.videoID.length) {
        YT.ready(() => {
          players[this.playerID] = new YT.Player(this.playerID, currentYoutubeOptions);
        });
      }
      window.isYoutubeAPILoaded = true;
    }

    onUnload() {
      const playerID = 'youtube-' + this.container.getAttribute(selectors$o.dataSectionId);
      if (!players[playerID]) return;
      players[playerID].destroy();
    }
  }

  const selectors$n = {
    popupContainer: '.pswp',
    popupCloseBtn: '.pswp__custom-close',
    popupIframe: 'iframe, video',
    popupCustomIframe: '.pswp__custom-iframe',
    popupThumbs: '.pswp__thumbs',
    popupButtons: '.pswp__button, .pswp__caption-close',
  };

  const classes$j = {
    current: 'is-current',
    customLoader: 'pswp--custom-loader',
    customOpen: 'pswp--custom-opening',
    loader: 'pswp__loader',
    popupCloseButton: 'pswp__button--close',
    isFocused: 'is-focused',
  };

  const attributes$c = {
    dataOptionClasses: 'data-pswp-option-classes',
    dataVideoType: 'data-video-type',
    ariaCurrent: 'aria-current',
  };

  const loaderHTML = `<div class="${classes$j.loader}"><div class="loader pswp__loader-line"><div class="loader-indeterminate"></div></div></div>`;

  class LoadPhotoswipe {
    constructor(items, options = '') {
      this.items = items;
      this.pswpElement = document.querySelectorAll(selectors$n.popupContainer)[0];
      this.popup = null;
      this.popupThumbs = null;
      this.isVideo = false;
      this.popupThumbsContainer = this.pswpElement.querySelector(selectors$n.popupThumbs);
      this.closeBtn = this.pswpElement.querySelector(selectors$n.popupCloseBtn);
      this.keyupCloseEvent = (e) => this.keyupClose(e);
      this.a11y = a11y;

      const defaultOptions = {
        history: false,
        focus: false,
        mainClass: '',
      };
      this.options = options !== '' ? options : defaultOptions;

      this.init();
    }

    init() {
      this.pswpElement.classList.add(classes$j.customOpen);

      this.initLoader();

      loadScript({url: window.theme.assets.photoswipe})
        .then(() => this.loadPopup())
        .catch((e) => console.error(e));
    }

    initLoader() {
      if (this.pswpElement.classList.contains(classes$j.customLoader) && this.options !== '' && this.options.mainClass) {
        this.pswpElement.setAttribute(attributes$c.dataOptionClasses, this.options.mainClass);
        let loaderElem = document.createElement('div');
        loaderElem.innerHTML = loaderHTML;
        loaderElem = loaderElem.firstChild;
        this.pswpElement.appendChild(loaderElem);
      } else {
        this.pswpElement.setAttribute(attributes$c.dataOptionClasses, '');
      }
    }

    loadPopup() {
      const PhotoSwipe = window.themePhotoswipe.PhotoSwipe.default;
      const PhotoSwipeUI = window.themePhotoswipe.PhotoSwipeUI.default;

      if (this.pswpElement.classList.contains(classes$j.customLoader)) {
        this.pswpElement.classList.remove(classes$j.customLoader);
      }

      this.pswpElement.classList.remove(classes$j.customOpen);

      this.popup = new PhotoSwipe(this.pswpElement, PhotoSwipeUI, this.items, this.options);
      this.popup.init();

      this.initVideo();

      this.thumbsActions();

      if (this.isVideo) {
        this.hideUnusedButtons();
      }

      setTimeout(() => {
        this.a11y.trapFocus(this.pswpElement, {
          elementToFocus: this.closeBtn,
        });
      }, 200);

      this.popup.listen('close', () => this.onClose());

      if (this.options && this.options.closeElClasses && this.options.closeElClasses.length) {
        this.options.closeElClasses.forEach((closeClass) => {
          const closeElement = this.pswpElement.querySelector(`.pswp__${closeClass}`);
          if (closeElement) {
            closeElement.addEventListener('keyup', this.keyupCloseEvent);
          }
        });
      }
    }

    initVideo() {
      const videoContainer = this.pswpElement.querySelector(selectors$n.popupCustomIframe);
      if (videoContainer) {
        const videoType = videoContainer.getAttribute(attributes$c.dataVideoType);
        this.isVideo = true;

        if (videoType == 'youtube') {
          new LoadVideoYT(videoContainer.parentElement);
        } else if (videoType == 'vimeo') {
          new LoadVideoVimeo(videoContainer.parentElement);
        }
      }
    }

    thumbsActions() {
      if (this.popupThumbsContainer && this.popupThumbsContainer.firstChild) {
        this.popupThumbsContainer.addEventListener('wheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('mousewheel', (e) => this.stopDisabledScroll(e));
        this.popupThumbsContainer.addEventListener('DOMMouseScroll', (e) => this.stopDisabledScroll(e));

        this.popupThumbs = this.pswpElement.querySelectorAll(`${selectors$n.popupThumbs} > *`);
        this.popupThumbs.forEach((element, i) => {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            const lastCurrentElement = element.parentElement.querySelector(`.${classes$j.current}`);
            lastCurrentElement.classList.remove(classes$j.current);
            lastCurrentElement.setAttribute(attributes$c.ariaCurrent, false);
            element.classList.add(classes$j.current);
            element.setAttribute(attributes$c.ariaCurrent, true);
            this.popup.goTo(i);
          });
        });

        this.popup.listen('imageLoadComplete', () => this.setCurrentThumb());
        this.popup.listen('beforeChange', () => this.setCurrentThumb());
      }
    }

    hideUnusedButtons() {
      const buttons = this.pswpElement.querySelectorAll(selectors$n.popupButtons);
      if (buttons.length) {
        buttons.forEach((element) => {
          if (!element.classList.contains(classes$j.popupCloseButton)) {
            element.style.display = 'none';
          }
        });
      }
    }

    stopDisabledScroll(e) {
      e.stopPropagation();
    }

    keyupClose(e) {
      if (e.code === window.theme.keyboardKeys.ENTER) {
        this.popup.close();
      }
    }

    onClose() {
      const popupIframe = this.pswpElement.querySelector(selectors$n.popupIframe);
      if (popupIframe) {
        popupIframe.parentNode.removeChild(popupIframe);
      }

      if (this.popupThumbsContainer && this.popupThumbsContainer.firstChild) {
        while (this.popupThumbsContainer.firstChild) this.popupThumbsContainer.removeChild(this.popupThumbsContainer.firstChild);
      }

      this.pswpElement.setAttribute(attributes$c.dataOptionClasses, '');
      const loaderElem = this.pswpElement.querySelector(`.${classes$j.loader}`);
      if (loaderElem) {
        this.pswpElement.removeChild(loaderElem);
      }

      if (this.options && this.options.closeElClasses && this.options.closeElClasses.length) {
        this.options.closeElClasses.forEach((closeClass) => {
          const closeElement = this.pswpElement.querySelector(`.pswp__${closeClass}`);
          if (closeElement) {
            closeElement.removeEventListener('keyup', this.keyupCloseEvent);
          }
        });
      }

      this.a11y.removeTrapFocus();

      if (window.accessibility.lastElement && document.body.classList.contains(classes$j.isFocused)) {
        requestAnimationFrame(() => {
          window.accessibility.lastElement.focus();
        });
      }
    }

    setCurrentThumb() {
      const lastCurrentThumb = this.pswpElement.querySelector(`${selectors$n.popupThumbs} > .${classes$j.current}`);
      if (lastCurrentThumb) {
        lastCurrentThumb.classList.remove(classes$j.current);
        lastCurrentThumb.setAttribute(attributes$c.ariaCurrent, false);
      }

      if (!this.popupThumbs) return;
      const currentThumb = this.popupThumbs[this.popup.getCurrentIndex()];
      currentThumb.classList.add(classes$j.current);
      currentThumb.setAttribute(attributes$c.ariaCurrent, true);
      this.scrollThumbs(currentThumb);
    }

    scrollThumbs(currentThumb) {
      const thumbsContainerLeft = this.popupThumbsContainer.scrollLeft;
      const thumbsContainerWidth = this.popupThumbsContainer.offsetWidth;
      const thumbsContainerPos = thumbsContainerLeft + thumbsContainerWidth;
      const currentThumbLeft = currentThumb.offsetLeft;
      const currentThumbWidth = currentThumb.offsetWidth;
      const currentThumbPos = currentThumbLeft + currentThumbWidth;

      if (thumbsContainerPos <= currentThumbPos || thumbsContainerPos > currentThumbLeft) {
        const currentThumbMarginLeft = parseInt(window.getComputedStyle(currentThumb).marginLeft);
        this.popupThumbsContainer.scrollTo({
          top: 0,
          left: currentThumbLeft - currentThumbMarginLeft,
          behavior: 'smooth',
        });
      }
    }
  }

  const selectors$m = {
    zoomWrapper: '[data-zoom-wrapper]',
    dataImageSrc: 'data-image-src',
    dataImageWidth: 'data-image-width',
    dataImageHeight: 'data-image-height',
    dataImageAlt: 'data-image-alt',
    dataImageZoomEnable: 'data-image-zoom-enable',
    thumbs: '.pswp__thumbs',
    caption: '[data-zoom-caption]',
  };

  const classes$i = {
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailable',
    popupThumb: 'pswp__thumb',
    popupClass: 'pswp-zoom-gallery',
    popupClassNoThumbs: 'pswp-zoom-gallery--single',
    popupTitle: 'product__title',
    popupTitleNew: 'product__title pswp__title',
  };

  class Zoom {
    constructor(section) {
      this.container = section.container;
      this.zoomWrappers = this.container.querySelectorAll(selectors$m.zoomWrapper);
      this.thumbsContainer = document.querySelector(selectors$m.thumbs);
      this.zoomCaptionElem = this.container.querySelector(selectors$m.caption);
      this.zoomEnable = this.container.getAttribute(selectors$m.dataImageZoomEnable) === 'true';

      if (this.zoomEnable) {
        this.init();
      }
    }

    init() {
      if (this.zoomWrappers.length) {
        this.zoomWrappers.forEach((element, i) => {
          element.addEventListener('click', (e) => {
            e.preventDefault();

            this.createZoom(i);

            window.accessibility.lastElement = element;
          });

          element.addEventListener('keyup', (e) => {
            // On keypress Enter move the focus to the first focusable element in the related slide
            if (e.code === window.theme.keyboardKeys.ENTER) {
              e.preventDefault();

              this.createZoom(i);

              window.accessibility.lastElement = element;
            }
          });
        });
      }
    }

    createZoom(indexImage) {
      let items = [];
      let counter = 0;
      let thumbs = '';
      this.zoomWrappers.forEach((elementImage) => {
        const imgSrc = elementImage.getAttribute(selectors$m.dataImageSrc);
        const imgAlt = elementImage.hasAttribute(selectors$m.dataImageAlt) ? elementImage.getAttribute(selectors$m.dataImageAlt) : '';

        counter += 1;

        items.push({
          src: imgSrc,
          w: parseInt(elementImage.getAttribute(selectors$m.dataImageWidth)),
          h: parseInt(elementImage.getAttribute(selectors$m.dataImageHeight)),
          msrc: imgSrc,
        });

        thumbs += `<a href="#" class="${classes$i.popupThumb}" style="background-image: url('${imgSrc}')" aria-label="${imgAlt}" aria-current="false"></a>`;

        if (this.zoomWrappers.length === counter) {
          const options = {
            history: false,
            focus: false,
            index: indexImage,
            mainClass: counter === 1 ? `${classes$i.popupClass} ${classes$i.popupClassNoThumbs}` : `${classes$i.popupClass}`,
            showHideOpacity: true,
            howAnimationDuration: 150,
            hideAnimationDuration: 250,
            closeOnScroll: false,
            closeOnVerticalDrag: false,
            captionEl: true,
            closeEl: true,
            closeElClasses: ['caption-close', 'title'],
            tapToClose: false,
            clickToCloseNonZoomable: false,
            maxSpreadZoom: 2,
            loop: true,
            spacing: 0,
            allowPanToNext: true,
            pinchToClose: false,
            addCaptionHTMLFn: (item, captionEl, isFake) => {
              this.zoomCaption(item, captionEl, isFake);
            },
            getThumbBoundsFn: () => {
              const imageLocation = this.zoomWrappers[indexImage];
              const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
              const rect = imageLocation.getBoundingClientRect();
              return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
            },
          };

          new LoadPhotoswipe(items, options);

          if (this.thumbsContainer && thumbs !== '') {
            this.thumbsContainer.innerHTML = thumbs;
          }
        }
      });
    }

    zoomCaption(item, captionEl) {
      let captionHtml = '';
      const targetContainer = captionEl.children[0];
      if (this.zoomCaptionElem) {
        captionHtml = this.zoomCaptionElem.innerHTML;

        if (this.zoomCaptionElem.closest(`.${classes$i.variantSoldOut}`)) {
          targetContainer.classList.add(classes$i.variantSoldOut);
        } else {
          targetContainer.classList.remove(classes$i.variantSoldOut);
        }

        if (this.zoomCaptionElem.closest(`.${classes$i.variantUnavailable}`)) {
          targetContainer.classList.add(classes$i.variantUnavailable);
        } else {
          targetContainer.classList.remove(classes$i.variantUnavailable);
        }
      }

      captionHtml = captionHtml.replaceAll(classes$i.popupTitle, classes$i.popupTitleNew);
      targetContainer.innerHTML = captionHtml;
      return false;
    }
  }

  const hosts = {
    html5: 'html5',
    youtube: 'youtube',
    vimeo: 'vimeo',
  };

  const selectors$l = {
    deferredMedia: '[data-deferred-media]',
    deferredMediaButton: '[data-deferred-media-button]',
    productMediaWrapper: '[data-product-single-media-wrapper]',
    productMediaSlider: '[data-product-single-media-slider]',
    mediaContainer: '[data-video]',
    mediaId: 'data-media-id',
    dataTallLayout: 'data-tall-layout',
  };

  const classes$h = {
    mediaHidden: 'media--hidden',
  };

  theme.mediaInstances = {};
  class Video {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.id = section.id;
      this.tallLayout = this.container.getAttribute(selectors$l.dataTallLayout) === 'true';
      this.players = {};
      this.init();
    }

    init() {
      const mediaContainers = this.container.querySelectorAll(selectors$l.mediaContainer);

      mediaContainers.forEach((mediaContainer) => {
        const deferredMediaButton = mediaContainer.querySelector(selectors$l.deferredMediaButton);

        if (deferredMediaButton) {
          deferredMediaButton.addEventListener('click', this.loadContent.bind(this, mediaContainer));
        }
      });
    }

    loadContent(mediaContainer) {
      if (mediaContainer.querySelector(selectors$l.deferredMedia).getAttribute('loaded')) {
        return;
      }

      const content = document.createElement('div');
      content.appendChild(mediaContainer.querySelector('template').content.firstElementChild.cloneNode(true));
      const mediaId = mediaContainer.dataset.mediaId;
      const element = content.querySelector('video, iframe');
      const host = this.hostFromVideoElement(element);
      const deferredMedia = mediaContainer.querySelector(selectors$l.deferredMedia);
      deferredMedia.appendChild(element).focus();
      deferredMedia.setAttribute('loaded', true);

      this.players[mediaId] = {
        mediaId: mediaId,
        sectionId: this.id,
        container: mediaContainer,
        element: element,
        host: host,
        ready: () => this.createPlayer(mediaId),
      };

      const video = this.players[mediaId];

      switch (video.host) {
        case hosts.html5:
          this.loadVideo(video, hosts.html5);
          break;
        case hosts.vimeo:
          if (window.isVimeoAPILoaded) {
            this.loadVideo(video, hosts.vimeo);
          } else {
            loadScript({url: 'https://player.vimeo.com/api/player.js'}).then(() => this.loadVideo(video, hosts.vimeo));
          }
          break;
        case hosts.youtube:
          if (window.isYoutubeAPILoaded) {
            this.loadVideo(video, hosts.youtube);
          } else {
            loadScript({url: 'https://www.youtube.com/iframe_api'}).then(() => this.loadVideo(video, hosts.youtube));
          }
          break;
      }
    }

    hostFromVideoElement(video) {
      if (video.tagName === 'VIDEO') {
        return hosts.html5;
      }

      if (video.tagName === 'IFRAME') {
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(video.src)) {
          return hosts.youtube;
        } else if (video.src.includes('vimeo.com')) {
          return hosts.vimeo;
        }
      }

      return null;
    }

    loadVideo(video, host) {
      if (video.host === host) {
        video.ready();
      }
    }

    createPlayer(mediaId) {
      const video = this.players[mediaId];

      switch (video.host) {
        case hosts.html5:
          // Force video play on iOS
          video.element.play();
          video.element.addEventListener('play', () => this.pauseOtherMedia(mediaId));

          video.element.play(); // Force video play on iOS
          video.container.addEventListener('theme:media:hidden', (event) => this.onHidden(event));
          video.container.addEventListener('xrLaunch', (event) => this.onHidden(event));
          video.container.addEventListener('theme:media:visible', (event) => this.onVisible(event));

          if (this.tallLayout) {
            this.observeVideo(video, mediaId);
          }

          break;
        case hosts.vimeo:
          this.players[mediaId].player = new Vimeo.Player(video.element);
          this.players[mediaId].player.play(); // Force video play on iOS

          window.isVimeoAPILoaded = true;

          video.container.addEventListener('theme:media:hidden', (event) => this.onHidden(event));
          video.container.addEventListener('xrLaunch', (event) => this.onHidden(event));
          video.container.addEventListener('theme:media:visible', (event) => this.onVisible(event));

          if (this.tallLayout) {
            this.observeVideo(video, mediaId);
          }

          break;
        case hosts.youtube:
          if (video.host == hosts.youtube && video.player) {
            return;
          }

          YT.ready(() => {
            const videoId = video.container.dataset.videoId;

            this.players[mediaId].player = new YT.Player(video.element, {
              videoId: videoId,
              events: {
                onReady: (event) => event.target.playVideo(), // Force video play on iOS
              },
            });

            window.isYoutubeAPILoaded = true;

            video.container.addEventListener('theme:media:hidden', (event) => this.onHidden(event));
            video.container.addEventListener('xrLaunch', (event) => this.onHidden(event));
            video.container.addEventListener('theme:media:visible', (event) => this.onVisible(event));

            if (this.tallLayout) {
              this.observeVideo(video, mediaId);
            }
          });

          break;
      }
    }

    observeVideo(video, mediaId) {
      let observer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            const outsideViewport = entry.intersectionRatio != 1;

            if (outsideViewport) {
              this.pauseVideo(video);
            } else {
              this.playVideo(video);
              this.pauseOtherMedia(mediaId);
            }
          });
        },
        {threshold: 1}
      );
      observer.observe(video.element);
    }

    playVideo(video) {
      if (video.player && video.player.playVideo) {
        video.player.playVideo();
      } else if (video.element && video.element.play) {
        video.element.play();
      } else if (video.player && video.player.play) {
        video.player.play();
      }
    }

    pauseVideo(video) {
      if (video.player && video.player.pauseVideo) {
        video.player.pauseVideo();
      } else if (video.element && video.element.pause) {
        video.element.pause();
      } else if (video.player && video.player.pause) {
        video.player.pause();
      }
    }

    onHidden(event) {
      if (typeof event.target.dataset.mediaId !== 'undefined') {
        this.pauseVideo(this.players[event.target.dataset.mediaId]);
      }
    }

    onVisible(event) {
      if (typeof event.target.dataset.mediaId !== 'undefined') {
        this.playVideo(this.players[event.target.dataset.mediaId]);
      }
    }

    pauseOtherMedia(mediaId) {
      const mediaIdString = `[${selectors$l.mediaId}="${mediaId}"]`;
      const otherMedia = document.querySelectorAll(`${selectors$l.productMediaWrapper}:not(${mediaIdString})`);

      document.querySelector(`${selectors$l.productMediaWrapper}${mediaIdString}`).classList.remove(classes$h.mediaHidden);

      if (otherMedia.length) {
        otherMedia.forEach((element) => {
          element.dispatchEvent(new CustomEvent('theme:media:hidden'));
          element.classList.add(classes$h.mediaHidden);
        });
      }
    }
  }

  theme.mediaInstances = {};

  const selectors$k = {
    videoPlayer: '[data-video]',
    modelViewer: '[data-model]',
    sliderEnabled: 'flickity-enabled',
  };

  const classes$g = {
    mediaHidden: 'media--hidden',
  };

  class Media {
    constructor(section) {
      this.section = section;
      this.id = section.id;
      this.container = section.container;
    }

    init() {
      this.detect3d();
      this.launch3d();

      new Video(this.section);
      new Zoom(this.section);
    }

    detect3d() {
      const modelViewerElements = this.container.querySelectorAll(selectors$k.modelViewer);
      if (modelViewerElements.length) {
        modelViewerElements.forEach((element) => {
          theme.ProductModel.init(element, this.id);
        });
      }
    }

    launch3d() {
      document.addEventListener('shopify_xr_launch', () => {
        const currentMedia = this.container.querySelector(`${selectors$k.modelViewer}:not(.${classes$g.mediaHidden})`);
        currentMedia.dispatchEvent(new CustomEvent('xrLaunch'));
      });
    }
  }

  const selectors$j = {
    ariaLabel: 'aria-label',
    dataMediaId: 'data-media-id',
    dataTallLayout: 'data-tall-layout',
    dataThumb: 'data-thumb',
    dataThumbIndex: 'data-thumb-index',
    deferredMediaButton: '[data-deferred-media-button]',
    focusedElement: 'model-viewer, video, iframe, button, [href], input, [tabindex]',
    isActive: '.is-active',
    mediaType: 'data-type',
    mobileSliderDisabled: 'data-slideshow-disabled-mobile',
    productSlideshow: '[data-product-slideshow]',
    productThumbs: '[data-product-thumbs]',
    thumb: '[data-thumb-item]',
    thumbLink: '[data-thumb-link]',
    thumbSlider: '[data-thumbs-slider]',
    quickAddModal: '[data-quick-add-modal]',
    zoomElement: '[data-zoom-wrapper]',
  };

  const classes$f = {
    active: 'is-active',
    focused: 'is-focused',
    dragging: 'is-dragging',
    selected: 'is-selected',
    sliderEnabled: 'flickity-enabled',
    mediaHidden: 'media--hidden',
  };

  const attributes$b = {
    ariaCurrent: 'aria-current',
    sliderOptions: 'data-options',
  };

  let sections$b = {};

  class InitSlider {
    constructor(section, modalHolder = null) {
      this.container = modalHolder || section.container;
      this.tallLayout = this.container.getAttribute(selectors$j.dataTallLayout) === 'true';
      this.slideshow = this.container.querySelector(selectors$j.productSlideshow);
      this.thumbSlider = this.container.querySelector(selectors$j.thumbSlider);
      this.thumbLinks = this.container.querySelectorAll(selectors$j.thumbLink);
      this.mobileSliderDisabled = this.container.getAttribute(selectors$j.mobileSliderDisabled) === 'true';
      this.initSliderMobileEvent = () => this.initSliderMobile();
      this.initSliderDesktopEvent = () => this.initSliderDesktop();

      if (this.slideshow && this.slideshow.hasAttribute(attributes$b.sliderOptions)) {
        this.customOptions = JSON.parse(decodeURIComponent(this.slideshow.getAttribute(attributes$b.sliderOptions)));
      }

      this.flkty = null;

      this.init();
    }

    init() {
      if (!this.slideshow) return;

      if (this.tallLayout) {
        if (!this.mobileSliderDisabled) {
          this.initSliderMobile();

          document.addEventListener('theme:resize:width', this.initSliderMobileEvent);
        }
      } else if (this.mobileSliderDisabled) {
        this.initSliderDesktop();

        document.addEventListener('theme:resize:width', this.initSliderDesktopEvent);
      } else {
        this.createSlider();
      }
    }

    initSliderMobile() {
      if (isMobile()) {
        this.createSlider();
      } else {
        this.destroySlider();
      }
    }

    initSliderDesktop() {
      if (isMobile()) {
        this.destroySlider();
      } else {
        this.createSlider();
      }
    }

    destroySlider() {
      const isSliderInitialized = this.slideshow.classList.contains(classes$f.sliderEnabled);

      if (isSliderInitialized) {
        this.flkty.destroy();
      }
    }

    createSlider() {
      if (!this.slideshow || (this.mobileSliderDisabled && isMobile())) {
        return;
      }

      const sliderOptions = {
        autoPlay: false,
        pageDots: false,
        wrapAround: true,
        ...this.customOptions,
      };

      const instance = this;
      const firstSlide = this.slideshow.querySelectorAll(`[${selectors$j.mediaType}]`)[0];
      let options = {
        ...sliderOptions,
        on: {
          ready: function () {
            const slides = this.element;
            slides.addEventListener('keyup', (e) => {
              if (e.code === window.theme.keyboardKeys.ENTER) {
                const zoomElement = slides.querySelector(`.${classes$f.selected} ${selectors$j.zoomElement}`);
                if (zoomElement) {
                  zoomElement.dispatchEvent(new Event('click', {bubbles: false}));
                  window.accessibility.lastElement = slides;
                }
              }
            });

            instance.sliderThumbs(this);

            instance.accessibilityActions(this);
          },
        },
      };

      this.flkty = new FlickityFade(this.slideshow, options);
      this.flkty.resize();

      if (firstSlide) {
        const firstType = firstSlide.getAttribute(selectors$j.mediaType);

        if (firstType === 'model' || firstType === 'video' || firstType === 'external_video') {
          this.flkty.options.draggable = false;
          this.flkty.updateDraggable();
        }
      }

      this.flkty.on('change', function (index) {
        let lastSLideIdx = index;

        if (instance.thumbSlider) {
          const selectedElem = instance.thumbSlider.querySelector(selectors$j.isActive);
          const currentSlide = instance.thumbSlider.querySelector(`${selectors$j.thumb} [${selectors$j.dataThumbIndex}="${index}"]`);

          if (selectedElem) {
            const selectedElemThumb = selectedElem.querySelector(`[${selectors$j.dataThumbIndex}]`);
            lastSLideIdx = Array.from(selectedElem.parentElement.children).indexOf(selectedElem);
            selectedElem.classList.remove(classes$f.active);

            if (selectedElemThumb) {
              selectedElemThumb.setAttribute(attributes$b.ariaCurrent, false);
            }
          }

          if (currentSlide) {
            currentSlide.parentElement.classList.add(classes$f.active);
            currentSlide.setAttribute(attributes$b.ariaCurrent, true);
          }

          instance.scrollToThumb();
        }

        const currentMedia = this.cells[lastSLideIdx].element;
        const newMedia = this.selectedElement;

        currentMedia.dispatchEvent(new CustomEvent('theme:media:hidden'));
        newMedia.classList.remove(classes$f.mediaHidden);
      });

      this.flkty.on('settle', function () {
        const currentMedia = this.selectedElement;
        const otherMedia = Array.prototype.filter.call(currentMedia.parentNode.children, function (child) {
          return child !== currentMedia;
        });
        const mediaType = currentMedia.getAttribute(selectors$j.mediaType);
        const isFocusEnabled = document.body.classList.contains(classes$f.focused);

        if (mediaType === 'model' || mediaType === 'video' || mediaType === 'external_video') {
          // fisrt boolean sets value, second option false to prevent refresh
          instance.flkty.options.draggable = false;
          instance.flkty.updateDraggable();
        } else {
          instance.flkty.options.draggable = true;
          instance.flkty.updateDraggable();
        }

        if (isFocusEnabled) currentMedia.dispatchEvent(new Event('focus'));

        if (otherMedia.length) {
          otherMedia.forEach((element) => {
            element.classList.add(classes$f.mediaHidden);
          });
        }

        currentMedia.dispatchEvent(new CustomEvent('theme:media:visible'));

        // Force media loading if slide becomes visible
        const deferredMedia = currentMedia.querySelector('deferred-media');
        if (deferredMedia && deferredMedia.getAttribute('loaded') !== true) {
          currentMedia.querySelector(selectors$j.deferredMediaButton).dispatchEvent(new Event('click', {bubbles: false}));
        }

        instance.accessibilityActions(this);
      });

      this.flkty.on('dragStart', (event, pointer) => {
        event.target.classList.add(classes$f.dragging);
      });

      this.flkty.on('dragEnd', (event, pointer) => {
        const draggedElem = this.flkty.element.querySelector(`.${classes$f.dragging}`);
        if (draggedElem) {
          draggedElem.classList.remove(classes$f.dragging);
        }
      });
    }

    accessibilityActions(slider) {
      const slides = slider.slides;

      if (slides.length) {
        slides.forEach((element) => {
          const slide = element.cells[0].element;
          const focusedElements = slide.querySelectorAll(selectors$j.focusedElement);

          if (slide.classList.contains(classes$f.selected)) {
            slide.setAttribute('tabindex', '0');
          } else {
            slide.setAttribute('tabindex', '-1');
          }

          if (focusedElements.length) {
            focusedElements.forEach((focusedElement) => {
              if (slide.classList.contains(classes$f.selected)) {
                focusedElement.setAttribute('tabindex', '0');
              } else {
                focusedElement.setAttribute('tabindex', '-1');
              }
            });
          }
        });
      }
    }

    scrollToThumb() {
      const thumbs = this.thumbSlider;

      if (thumbs) {
        const thumb = thumbs.querySelector(selectors$j.isActive);
        if (!thumb) return;
        const thumbsScrollTop = thumbs.scrollTop;
        const thumbsScrollLeft = thumbs.scrollLeft;
        const thumbsWidth = thumbs.offsetWidth;
        const thumbsHeight = thumbs.offsetHeight;
        const thumbsPositionBottom = thumbsScrollTop + thumbsHeight;
        const thumbsPositionRight = thumbsScrollLeft + thumbsWidth;
        const thumbPosTop = thumb.offsetTop;
        const thumbPosLeft = thumb.offsetLeft;
        const thumbWidth = thumb.offsetWidth;
        const thumbHeight = thumb.offsetHeight;
        const thumbRightPos = thumbPosLeft + thumbWidth;
        const thumbBottomPos = thumbPosTop + thumbHeight;
        const topCheck = thumbsScrollTop > thumbPosTop;
        const bottomCheck = thumbBottomPos > thumbsPositionBottom;
        const leftCheck = thumbsScrollLeft > thumbPosLeft;
        const rightCheck = thumbRightPos > thumbsPositionRight;
        const verticalCheck = bottomCheck || topCheck;
        const horizontalCheck = rightCheck || leftCheck;
        const isMobileView = isMobile();

        if (verticalCheck || horizontalCheck) {
          let scrollTopPosition = thumbPosTop - thumbsHeight + thumbHeight;
          let scrollLeftPosition = thumbPosLeft - thumbsWidth + thumbWidth;

          if (topCheck) {
            scrollTopPosition = thumbPosTop;
          }

          if (rightCheck && isMobileView) {
            scrollLeftPosition += parseInt(window.getComputedStyle(thumbs).paddingRight);
          }

          if (leftCheck) {
            scrollLeftPosition = thumbPosLeft;

            if (isMobileView) {
              scrollLeftPosition -= parseInt(window.getComputedStyle(thumbs).paddingLeft);
            }
          }

          thumbs.scrollTo({
            top: scrollTopPosition,
            left: scrollLeftPosition,
            behavior: 'smooth',
          });
        }
      }
    }

    sliderThumbs(slider) {
      if (this.thumbLinks.length) {
        this.thumbLinks.forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();
            const slideIdx = item.hasAttribute(selectors$j.dataThumbIndex) ? parseInt(item.getAttribute(selectors$j.dataThumbIndex)) : 0;

            this.flkty.select(slideIdx);
          });

          item.addEventListener('keyup', (e) => {
            // On keypress Enter move the focus to the first focusable element in the related slide
            if (e.code === window.theme.keyboardKeys.ENTER) {
              const mediaId = item.getAttribute(selectors$j.dataMediaId);
              const mediaElem = slider.element
                .querySelector(`[${selectors$j.dataMediaId}="${mediaId}"]`)
                .querySelectorAll('model-viewer, video, iframe, button, [href], input, [tabindex]:not([tabindex="-1"])')[0];
              if (mediaElem) {
                mediaElem.dispatchEvent(new Event('focus'));
                mediaElem.dispatchEvent(new Event('select'));
              }
            }
          });
        });
      }
    }

    onUnload() {
      if (this.tallLayout) {
        if (!this.mobileSliderDisabled) {
          document.removeEventListener('theme:resize:width', this.initSliderMobileEvent);
        }
      } else if (this.mobileSliderDisabled) {
        document.removeEventListener('theme:resize:width', this.initSliderDesktopEvent);
      }
    }
  }

  const initSlider = {
    onLoad() {
      sections$b[this.id] = new InitSlider(this);
    },
    onUnload(e) {
      sections$b[this.id].onUnload(e);
    },
  };

  const classes$e = {
    added: 'is-added',
    animated: 'is-animated',
    disabled: 'is-disabled',
    error: 'has-error',
    loading: 'is-loading',
    open: 'is-open',
    overlayText: 'product-item--overlay-text',
    visible: 'is-visible',
    siblingLinkCurrent: 'sibling__link--current',
    focused: 'is-focused',
  };

  const settings = {
    errorDelay: 3000,
  };

  const selectors$i = {
    animation: '[data-animation]',
    apiContent: '[data-api-content]',
    buttonQuickAdd: '[data-quick-add-btn]',
    buttonAddToCart: '[data-add-to-cart]',
    cartDrawer: '[data-cart-drawer]',
    cartLineItems: '[data-line-items]',
    dialog: 'dialog',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    media: '[data-media-slide]',
    messageError: '[data-message-error]',
    modalButton: '[data-quick-add-modal-handle]',
    modalContainer: '[data-product-upsell-container]',
    modalContent: '[data-product-upsell-ajax]',
    modalClose: '[data-quick-add-modal-close]',
    productGridItem: 'data-product-grid-item',
    productInformationHolder: '[data-product-information]',
    popoutWrapper: '[data-popout]',
    quickAddHolder: '[data-quick-add-holder]',
    quickAddModal: '[data-quick-add-modal]',
    quickAddModalTemplate: '[data-quick-add-modal-template]',
    swatch: '[data-swatch]',
  };

  const attributes$a = {
    closing: 'closing',
    productId: 'data-product-id',
    modalHandle: 'data-quick-add-modal-handle',
    siblingSwapper: 'data-sibling-swapper',
    quickAddHolder: 'data-quick-add-holder',
  };

  class QuickAddProduct extends HTMLElement {
    constructor() {
      super();

      this.container = this;
      this.quickAddHolder = this.container.querySelector(selectors$i.quickAddHolder);

      if (this.quickAddHolder) {
        this.modal = null;
        this.currentModal = null;
        this.productId = this.quickAddHolder.getAttribute(attributes$a.quickAddHolder);
        this.modalButton = this.quickAddHolder.querySelector(selectors$i.modalButton);
        this.handle = this.modalButton?.getAttribute(attributes$a.modalHandle);
        this.cartDrawer = document.querySelector(selectors$i.cartDrawer);
        this.buttonQuickAdd = this.quickAddHolder.querySelector(selectors$i.buttonQuickAdd);
        this.buttonATC = this.quickAddHolder.querySelector(selectors$i.buttonAddToCart);
        this.button = this.modalButton || this.buttonATC;
        this.modalClose = this.modalClose.bind(this);
        this.modalCloseOnProductAdded = this.modalCloseOnProductAdded.bind(this);
        this.isAnimating = false;

        this.modalButtonClickEvent = this.modalButtonClickEvent.bind(this);
        this.quickAddLoadingToggle = this.quickAddLoadingToggle.bind(this);
      }
    }

    connectedCallback() {
      /**
       * Modal button works for multiple variants products
       */
      if (this.modalButton) {
        this.modalButton.addEventListener('click', this.modalButtonClickEvent);
      }

      /**
       * Quick add button works for single variant products
       */

      if (this.buttonATC) {
        this.buttonATC.addEventListener('click', (e) => {
          e.preventDefault();

          document.dispatchEvent(
            new CustomEvent('theme:cart:add', {
              detail: {
                button: this.buttonATC,
              },
            })
          );
        });
      }

      if (this.quickAddHolder) {
        this.quickAddHolder.addEventListener('animationend', this.quickAddLoadingToggle);
        this.errorHandler();
      }
    }

    modalButtonClickEvent(e) {
      e.preventDefault();

      const isSiblingSwapper = this.modalButton.hasAttribute(attributes$a.siblingSwapper);
      const isSiblingLinkCurrent = this.modalButton.classList.contains(classes$e.siblingLinkCurrent);

      if (isSiblingLinkCurrent) return;

      this.modalButton.classList.add(classes$e.loading);
      this.modalButton.disabled = true;

      // Siblings product modal swapper
      if (isSiblingSwapper && !isSiblingLinkCurrent) {
        this.currentModal = e.target.closest(selectors$i.quickAddModal);
        this.currentModal.classList.add(classes$e.loading);
      }

      this.renderModal();
    }

    modalCreate(response) {
      const cachedModal = document.querySelector(`${selectors$i.quickAddModal}[${attributes$a.productId}="${this.productId}"]`);

      if (cachedModal) {
        this.modal = cachedModal;
        this.modalOpen();
      } else {
        const modalTemplate = this.quickAddHolder.querySelector(selectors$i.quickAddModalTemplate);
        if (!modalTemplate) return;

        const htmlObject = document.createElement('div');
        htmlObject.innerHTML = modalTemplate.innerHTML;

        // Add dialog to the body
        document.body.appendChild(htmlObject.querySelector(selectors$i.quickAddModal));
        modalTemplate.remove();

        this.modal = document.querySelector(`${selectors$i.quickAddModal}[${attributes$a.productId}="${this.productId}"]`);
        this.modal.querySelector(selectors$i.modalContent).innerHTML = new DOMParser().parseFromString(response, 'text/html').querySelector(selectors$i.apiContent).innerHTML;

        this.modalCreatedCallback();
      }
    }

    modalOpen() {
      this.modal.showModal();
      this.modal.setAttribute('open', true);
      this.modal.removeAttribute('inert');

      if (this.currentModal) {
        this.currentModal.dispatchEvent(new CustomEvent('theme:modal:close', {bubbles: false}));
      }

      const focusTarget = this.modal.querySelector('[autofocus]') || this.modal.querySelector(selectors$i.focusable);
      focusTarget.focus();

      const mediaObject = {
        container: this.modal,
        id: this.productId,
      };

      theme.mediaInstances[this.id] = new Media(mediaObject);
      theme.mediaInstances[this.id].init();

      this.quickAddHolder.classList.add(classes$e.disabled);

      if (this.modalButton) {
        this.modalButton.classList.remove(classes$e.loading);
        this.modalButton.disabled = false;
      }

      // Animate items
      requestAnimationFrame(() => {
        this.modal.querySelectorAll(selectors$i.animation).forEach((item) => {
          item.classList.add(classes$e.animated);
        });
      });

      document.dispatchEvent(new CustomEvent('theme:quick-add:open', {bubbles: true}));
      document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      document.addEventListener('theme:product:added', this.modalCloseOnProductAdded, {once: true});
    }

    modalClose() {
      if (this.isAnimating) {
        return;
      }

      if (!this.modal.hasAttribute(attributes$a.closing)) {
        this.modal.setAttribute(attributes$a.closing, '');
        this.isAnimating = true;
        return;
      }

      this.modal.close();
      this.modal.removeAttribute(attributes$a.closing);
      this.modal.setAttribute('inert', '');
      this.modal.classList.remove(classes$e.loading);

      const allMedia = this.modal.querySelectorAll(selectors$i.media);

      allMedia.forEach((media) => {
        media.dispatchEvent(new CustomEvent('pause'));
      });

      if (this.modalButton) {
        this.modalButton.disabled = false;
      }

      if (this.quickAddHolder && this.quickAddHolder.classList.contains(classes$e.disabled)) {
        this.quickAddHolder.classList.remove(classes$e.disabled);
      }

      this.resetAnimatedItems();

      const hasOpenDrawer = this.cartDrawer && this.cartDrawer.classList.contains(classes$e.open);
      const hasOpenModal = document.querySelector('dialog[open]');

      // Unlock scroll if no other drawers & modals are open
      if (!hasOpenDrawer && !hasOpenModal) {
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
      }

      document.removeEventListener('theme:product:added', this.modalCloseOnProductAdded);
    }

    modalEvents() {
      // Close button click event
      this.modal.querySelector(selectors$i.modalClose)?.addEventListener('click', (e) => {
        e.preventDefault();
        this.modalClose();
      });

      // Close dialog on click outside content
      this.modal.addEventListener('click', (event) => {
        if (event.target.nodeName === 'DIALOG' && event.type === 'click') {
          this.modalClose();
        }
      });

      // Close dialog on click ESC key pressed
      this.modal.addEventListener('keydown', (event) => {
        if (event.code == theme.keyboardKeys.ESCAPE) {
          event.preventDefault();
          this.modalClose();
        }
      });

      this.modal.addEventListener('theme:modal:close', () => {
        this.modalClose();
      });

      // Close dialog after animation completes
      this.modal.addEventListener('animationend', (event) => {
        if (event.target !== this.modal) return;
        this.isAnimating = false;

        if (this.modal.hasAttribute(attributes$a.closing)) {
          this.modalClose();

          // Return focus to quick add button
          if (document.body.classList.contains(classes$e.focused) && this.buttonQuickAdd) {
            this.buttonQuickAdd.addEventListener(
              'transitionend',
              () => {
                this.buttonQuickAdd.focus();
                this.buttonQuickAdd.classList.remove(classes$e.visible);
              },
              {once: true}
            );
            this.buttonQuickAdd.classList.add(classes$e.visible);
          }
        }
      });
    }

    modalCloseOnProductAdded() {
      this.resetQuickAddButtons();
      if (this.modal && this.modal.hasAttribute('open')) {
        this.modalClose();
      }
    }

    quickAddLoadingToggle(e) {
      if (e.target != this.quickAddHolder) return;

      this.quickAddHolder.classList.remove(classes$e.disabled);
    }

    /**
     * Handle error cart response
     */
    errorHandler() {
      this.quickAddHolder.addEventListener('theme:cart:error', (event) => {
        const holder = event.detail.holder;
        const parentProduct = holder.closest(`[${selectors$i.productGridItem}]`);
        if (!parentProduct) return;

        const errorMessageHolder = holder.querySelector(selectors$i.messageError);
        const hasOverlayText = parentProduct.classList.contains(classes$e.overlayText);
        const productInfo = parentProduct.querySelector(selectors$i.productInformationHolder);
        const button = holder.querySelector(selectors$i.buttonAddToCart);

        if (button) {
          button.classList.remove(classes$e.added, classes$e.loading);
          holder.classList.add(classes$e.error);
        }

        if (errorMessageHolder) {
          errorMessageHolder.innerText = event.detail.description;
        }

        if (hasOverlayText) {
          productInfo.classList.add(classes$e.hidden);
        }

        setTimeout(() => {
          this.resetQuickAddButtons();

          if (hasOverlayText) {
            productInfo.classList.remove(classes$e.hidden);
          }
        }, settings.errorDelay);
      });
    }

    /**
     * Reset buttons to default states
     */
    resetQuickAddButtons() {
      if (this.quickAddHolder) {
        this.quickAddHolder.classList.remove(classes$e.visible, classes$e.error);
      }

      if (this.buttonQuickAdd) {
        this.buttonQuickAdd.classList.remove(classes$e.added);
        this.buttonQuickAdd.disabled = false;
      }
    }

    renderModal() {
      if (this.modal) {
        this.modalOpen();
      } else {
        window
          .fetch(`${window.theme.routes.root}products/${this.handle}?section_id=api-product-upsell`)
          .then(this.upsellErrorsHandler)
          .then((response) => {
            return response.text();
          })
          .then((response) => {
            this.modalCreate(response);
          });
      }
    }

    modalCreatedCallback() {
      this.modalEvents();
      this.modalOpen();

      new InitSlider(null, this.modal);

      const swatchElements = this.modal.querySelectorAll(selectors$i.swatch);
      if (swatchElements.length) {
        swatchElements.forEach((el) => {
          new Swatch(el);
        });
      }

      const wrappers = this.modal.querySelectorAll(selectors$i.popoutWrapper);
      if (wrappers.length) {
        wrappers.forEach((wrapper) => {
          new Popout(wrapper);
        });
      }

      wrapElements(this.modal);
    }

    upsellErrorsHandler(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }

    resetAnimatedItems() {
      this.modal?.querySelectorAll(selectors$i.animation).forEach((item) => {
        item.classList.remove(classes$e.animated);
      });
    }
  }

  register('product-grid', [slider, swatchGridSection, tabs, siblings]);

  if (!customElements.get('quick-add-product')) {
    customElements.define('quick-add-product', QuickAddProduct);
  }

  const tokensReducer = (acc, token) => {
    const {el, elStyle, elHeight, rowsLimit, rowsWrapped, options} = acc;
    let oldBuffer = acc.buffer;
    let newBuffer = oldBuffer;

    if (rowsWrapped === rowsLimit + 1) {
      return {...acc};
    }
    const textBeforeWrap = oldBuffer;
    let newRowsWrapped = rowsWrapped;
    let newHeight = elHeight;
    el.innerHTML = newBuffer = oldBuffer.length ? `${oldBuffer}${options.delimiter}${token}${options.replaceStr}` : `${token}${options.replaceStr}`;

    if (parseFloat(elStyle.height) > parseFloat(elHeight)) {
      newRowsWrapped++;
      newHeight = elStyle.height;

      if (newRowsWrapped === rowsLimit + 1) {
        el.innerHTML = newBuffer = textBeforeWrap[textBeforeWrap.length - 1] === '.' && options.replaceStr === '...' ? `${textBeforeWrap}..` : `${textBeforeWrap}${options.replaceStr}`;

        return {...acc, elHeight: newHeight, rowsWrapped: newRowsWrapped};
      }
    }

    el.innerHTML = newBuffer = textBeforeWrap.length ? `${textBeforeWrap}${options.delimiter}${token}` : `${token}`;

    return {...acc, buffer: newBuffer, elHeight: newHeight, rowsWrapped: newRowsWrapped};
  };

  const ellipsis = (selector = '', rows = 1, options = {}) => {
    const defaultOptions = {
      replaceStr: '...',
      debounceDelay: 250,
      delimiter: ' ',
    };

    const opts = {...defaultOptions, ...options};

    const elements =
      selector &&
      (selector instanceof NodeList
        ? selector
        : selector.nodeType === 1 // if node type is Node.ELEMENT_NODE
        ? [selector] // wrap it in (NodeList) if it is a single node
        : document.querySelectorAll(selector));

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const elementHtml = el.innerHTML;
      const commentRegex = /<!--[\s\S]*?-->/g;
      const htmlWithoutComments = elementHtml.replace(commentRegex, '');
      const splittedText = htmlWithoutComments.split(opts.delimiter);

      el.innerHTML = '';
      const elStyle = window.getComputedStyle(el);

      splittedText.reduce(tokensReducer, {
        el,
        buffer: el.innerHTML,
        elStyle,
        elHeight: 0,
        rowsLimit: rows,
        rowsWrapped: 0,
        options: opts,
      });
    }
  };

  const fadeOut = (el, callback = null) => {
    el.style.opacity = 1;

    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }

      if (parseFloat(el.style.opacity) === 0 && typeof callback === 'function') {
        callback();
      }
    })();
  };

  const selectors$h = {
    pickupContainer: 'data-store-availability-container',
    shopifySection: '.shopify-section',
    drawer: '[data-pickup-drawer]',
    drawerOpen: '[data-pickup-drawer-open]',
    drawerClose: '[data-pickup-drawer-close]',
  };

  const classes$d = {
    isOpen: 'is-open',
    isHidden: 'hidden',
    isFocused: 'is-focused',
  };

  const attributes$9 = {
    drawerUnderlay: 'data-drawer-underlay',
  };

  let sections$a = {};

  class PickupAvailability {
    constructor(section) {
      this.container = section.container;
      this.drawer = null;
      this.buttonDrawerOpen = null;
      this.buttonDrawerClose = null;
      this.a11y = a11y;

      this.container.addEventListener('theme:variant:change', (event) => this.fetchPickupAvailability(event));
    }

    fetchPickupAvailability(event) {
      const container = this.container.querySelector(`[${selectors$h.pickupContainer}]`);
      if (!container) return;
      if ((event && !event.detail.variant) || (event && event.detail.variant && !event.detail.variant.available)) {
        container.classList.add(classes$d.isHidden);
        return;
      }
      const variantID = event && event.detail.variant ? event.detail.variant.id : container.getAttribute(selectors$h.pickupContainer);
      this.drawer = document.querySelector(selectors$h.drawer);

      // Remove cloned instances of pickup drawer
      if (this.drawer) {
        document.body.removeChild(this.drawer);
      }

      if (variantID) {
        fetch(`${window.theme.routes.root}variants/${variantID}/?section_id=api-pickup-availability`)
          .then(this.handleErrors)
          .then((response) => response.text())
          .then((text) => {
            const pickupAvailabilityHTML = new DOMParser().parseFromString(text, 'text/html').querySelector(selectors$h.shopifySection).innerHTML;
            container.innerHTML = pickupAvailabilityHTML;

            this.drawer = this.container.querySelector(selectors$h.drawer);
            if (!this.drawer) {
              container.classList.add(classes$d.isHidden);
              return;
            }
            // Clone Pickup drawer and append it to the end of <body>
            this.clone = this.drawer.cloneNode(true);
            document.body.appendChild(this.clone);

            // Delete the original instance of pickup drawer
            container.classList.remove(classes$d.isHidden);
            container.removeChild(this.drawer);

            this.drawer = document.querySelector(selectors$h.drawer);
            this.buttonDrawerOpen = document.querySelector(selectors$h.drawerOpen);
            this.buttonDrawerClose = document.querySelectorAll(selectors$h.drawerClose);

            if (this.buttonDrawerOpen) {
              this.buttonDrawerOpen.addEventListener('click', () => {
                this.openDrawer();

                window.accessibility.lastElement = this.buttonDrawerOpen;
              });
            }

            if (this.buttonDrawerClose.length) {
              this.buttonDrawerClose.forEach((element) => {
                element.addEventListener('click', () => this.closeDrawer());
              });
            }

            this.drawer.addEventListener('keyup', (evt) => {
              if (evt.code !== window.theme.keyboardKeys.ESCAPE) {
                return;
              }
              this.closeDrawer();
            });
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }

    openDrawer() {
      if (this.drawer) {
        this.drawer.classList.add(classes$d.isOpen);
        this.drawer.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
        this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
        document.body.addEventListener('click', this.onBodyClickEvent);

        // Focus the close button on pickup drawer open
        setTimeout(() => {
          const elementToFocus = this.drawer.querySelector(selectors$h.drawerClose);
          this.a11y.trapFocus(this.drawer, {
            elementToFocus: elementToFocus,
          });
        }, 200);
      }
    }

    closeDrawer() {
      if (this.drawer) {
        this.a11y.removeTrapFocus();
        this.drawer.classList.remove(classes$d.isOpen);
        document.body.removeEventListener('click', this.onBodyClickEvent);
        document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));

        // Focus the last element on pickup drawer close
        if (window.accessibility.lastElement && document.body.classList.contains(classes$d.isFocused)) {
          requestAnimationFrame(() => {
            window.accessibility.lastElement.focus();
          });
        }
      }
    }

    onBodyClick(event) {
      if (!this.container.contains(event.target) || event.target.hasAttribute(attributes$9.drawerUnderlay)) this.closeDrawer();
    }

    handleErrors(response) {
      if (!response.ok) {
        return response.json().then(function (json) {
          const e = new FetchError({
            status: response.statusText,
            headers: response.headers,
            json: json,
          });
          throw e;
        });
      }
      return response;
    }
  }

  const pickupAvailability = {
    onLoad() {
      sections$a[this.id] = new PickupAvailability(this);
    },
  };

  const selectors$g = {
    complementaryProducts: 'complementary-products',
    quickAddProduct: 'quick-add-product',
  };

  const classes$c = {
    loaded: 'is-loaded',
  };

  const attributes$8 = {
    url: 'data-url',
  };

  class ComplementaryProducts extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        if (this.hasAttribute(attributes$8.url) && this.getAttribute(attributes$8.url) !== '') {
          fetch(this.getAttribute(attributes$8.url))
            .then((response) => response.text())
            .then((text) => {
              const html = document.createElement('div');
              html.innerHTML = text;
              const recommendations = html.querySelector(selectors$g.complementaryProducts);

              if (recommendations && recommendations.innerHTML.trim().length) {
                this.innerHTML = recommendations.innerHTML;
              }

              if (html.querySelector(`${selectors$g.complementaryProducts} ${selectors$g.quickAddProduct}`)) {
                this.classList.add(classes$c.loaded);
              }
            })
            .catch((e) => {
              console.error(e);
            });
        }
      };

      new IntersectionObserver(handleIntersection.bind(this), {rootMargin: '0px 0px 400px 0px'}).observe(this);
    }
  }

  const events$1 = {
    cartUpdate: 'cart-update',
    variantChange: 'variant-change',
    cartError: 'cart-error',
  };

  class RecipientForm extends HTMLElement {
    cartUpdateUnsubscriber = undefined;
    variantChangeUnsubscriber = undefined;
    cartErrorUnsubscriber = undefined;
    constructor() {
      super();
      this.checkboxInput = this.querySelector(`#Recipient-Checkbox-${this.dataset.sectionIdForm}`);
      this.checkboxInput.disabled = false;
      this.hiddenControlField = this.querySelector(`#Recipient-Control-${this.dataset.sectionIdForm}`);
      this.hiddenControlField.disabled = true;
      this.emailInput = this.querySelector(`#Recipient-email-${this.dataset.sectionIdForm}`);
      this.nameInput = this.querySelector(`#Recipient-name-${this.dataset.sectionIdForm}`);
      this.messageInput = this.querySelector(`#Recipient-message-${this.dataset.sectionIdForm}`);
      this.errorMessageWrapper = this.querySelector('.product-form__recipient-error-message-wrapper');
      this.errorMessageList = this.errorMessageWrapper?.querySelector('ul');
      this.errorMessage = this.errorMessageWrapper?.querySelector('span.error-message');
      this.defaultErrorHeader = this.errorMessage?.textContent;
      this.currentProductVariantId = this.dataset.productVariantId;
      this.addEventListener('change', this.onChange.bind(this));
    }

    connectedCallback() {
      this.cartUpdateUnsubscriber = subscribe(events$1.cartUpdate, (event) => {
        if (event.source === 'product-form' && event.productVariantId && event.productVariantId.toString() === this.currentProductVariantId) {
          this.resetRecipientForm();
        }
      });

      this.variantChangeUnsubscriber = subscribe(events$1.variantChange, (event) => {
        if (event.data.sectionId === this.dataset.sectionIdForm) {
          this.currentProductVariantId = event.data.variant.id.toString();
        }
      });

      this.cartUpdateUnsubscriber = subscribe(events$1.cartError, (event) => {
        if (event.source === 'product-form' && event.productVariantId && event.productVariantId.toString() === this.currentProductVariantId) {
          this.displayErrorMessage(event.message, event.errors);
        }
      });
    }

    disconnectedCallback() {
      if (this.cartUpdateUnsubscriber) {
        this.cartUpdateUnsubscriber();
      }

      if (this.variantChangeUnsubscriber) {
        this.variantChangeUnsubscriber();
      }

      if (this.cartErrorUnsubscriber) {
        this.cartErrorUnsubscriber();
      }
    }

    onChange() {
      if (!this.checkboxInput.checked) {
        this.clearInputFields();
        this.clearErrorMessage();
      }

      this.dispatchEvent(
        new CustomEvent('theme:form:sticky', {
          bubbles: true,
          detail: {
            element: 'accordion',
          },
        })
      );
    }

    clearInputFields() {
      this.emailInput.value = '';
      this.nameInput.value = '';
      this.messageInput.value = '';
    }

    displayErrorMessage(title, body) {
      this.clearErrorMessage();
      this.errorMessageWrapper.classList.add('is-visible');
      if (typeof body === 'object') {
        this.errorMessage.innerText = this.defaultErrorHeader;
        return Object.entries(body).forEach(([key, value]) => {
          const errorMessageId = `RecipientForm-${key}-error-${this.dataset.sectionIdForm}`;
          const fieldSelector = `#Recipient-${key}-${this.dataset.sectionIdForm}`;
          const placeholderElement = this.querySelector(`${fieldSelector}`);
          const label = placeholderElement?.getAttribute('placeholder') || key;
          const message = `${label} ${value}`;
          const errorMessageElement = this.querySelector(`#${errorMessageId}`);
          const errorTextElement = errorMessageElement?.querySelector('.error-message');
          if (!errorTextElement) return;

          if (this.errorMessageList) {
            this.errorMessageList.appendChild(this.createErrorListItem(fieldSelector, message));
          }

          errorTextElement.innerText = `${message}.`;
          errorMessageElement.classList.remove('hidden');

          const inputElement = this[`${key}Input`];
          if (!inputElement) return;

          inputElement.setAttribute('aria-invalid', true);
          inputElement.setAttribute('aria-describedby', errorMessageId);
        });
      }

      this.errorMessage.innerText = body;
    }

    createErrorListItem(target, message) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.setAttribute('href', target);
      a.innerText = message;
      li.appendChild(a);
      li.className = 'error-message';
      return li;
    }

    clearErrorMessage() {
      this.errorMessageWrapper.classList.remove('is-visible');

      if (this.errorMessageList) this.errorMessageList.innerHTML = '';

      this.querySelectorAll('.recipient-fields .form__message').forEach((field) => {
        field.classList.add('hidden');
        const textField = field.querySelector('.error-message');
        if (textField) textField.innerText = '';
      });

      [this.emailInput, this.messageInput, this.nameInput].forEach((inputElement) => {
        inputElement.setAttribute('aria-invalid', false);
        inputElement.removeAttribute('aria-describedby');
      });
    }

    resetRecipientForm() {
      if (this.checkboxInput.checked) {
        this.checkboxInput.checked = false;
        this.clearInputFields();
        this.clearErrorMessage();
      }
    }
  }

  const selectors$f = {
    slideshow: '[data-product-slideshow]',
    dataStickyEnabled: 'data-sticky-enabled',
    productPage: '.product__page',
    formWrapper: '[data-form-wrapper]',
    headerSticky: '[data-header-sticky]',
    headerHeight: '[data-header-height]',
  };

  const classes$b = {
    sticky: 'is-sticky',
  };

  window.theme.variables = {
    productPageSticky: false,
  };

  const sections$9 = {};

  class ProductSticky {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.stickyEnabled = this.container.getAttribute(selectors$f.dataStickyEnabled) === 'true';
      this.formWrapper = this.container.querySelector(selectors$f.formWrapper);
      this.stickyScrollTop = 0;
      this.scrollLastPosition = 0;
      this.stickyDefaultTop = 0;
      this.currentPoint = 0;
      this.defaultTopBottomSpacings = 30;
      this.scrollTop = window.scrollY;
      this.scrollDirectionDown = true;
      this.requestAnimationSticky = null;
      this.stickyFormLoad = true;
      this.stickyFormLastHeight = null;
      this.onChangeCounter = 0;
      this.scrollEvent = (e) => this.scrollEvents(e);
      this.resizeEvent = (e) => this.resizeEvents(e);

      // The code should execute after truncate text in product.js - 50ms
      setTimeout(() => {
        this.init();
      }, 50);
    }

    init() {
      if (this.stickyEnabled) {
        this.stickyScrollCheck();

        document.addEventListener('theme:resize', this.resizeEvent);
      }

      this.initSticky();
    }

    initSticky() {
      if (theme.variables.productPageSticky) {
        this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition());

        this.formWrapper.addEventListener('theme:form:sticky', (e) => {
          this.removeAnimationFrame();

          this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition(e));
        });

        document.addEventListener('theme:scroll', this.scrollEvent);
      }
    }

    scrollEvents(e) {
      this.scrollTop = e.detail.position;
      this.scrollDirectionDown = e.detail.down;

      if (!this.requestAnimationSticky) {
        this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition());
      }
    }

    resizeEvents(e) {
      this.stickyScrollCheck();

      document.removeEventListener('theme:scroll', this.scrollEvent);

      this.initSticky();
    }

    stickyScrollCheck() {
      const targetFormWrapper = this.container.querySelector(`${selectors$f.productPage} ${selectors$f.formWrapper}`);

      if (!targetFormWrapper) return;

      if (isDesktop()) {
        const form = this.container.querySelector(selectors$f.formWrapper);
        const slideshow = this.container.querySelector(selectors$f.slideshow);
        if (!form || !slideshow) return;
        const productCopyHeight = form.offsetHeight;
        const productImagesHeight = slideshow.offsetHeight;

        // Is the product description and form taller than window space
        // Is also shorter than the window and images
        if (productCopyHeight < productImagesHeight) {
          theme.variables.productPageSticky = true;
          targetFormWrapper.classList.add(classes$b.sticky);
        } else {
          theme.variables.productPageSticky = false;
          targetFormWrapper.classList.remove(classes$b.sticky);
        }
      } else {
        theme.variables.productPageSticky = false;
        targetFormWrapper.classList.remove(classes$b.sticky);
      }
    }

    calculateStickyPosition(e = null) {
      const isScrollLocked = document.documentElement.hasAttribute('data-scroll-locked');
      if (isScrollLocked) {
        this.removeAnimationFrame();
        return;
      }

      const eventExist = Boolean(e && e.detail);
      const isAccordion = Boolean(eventExist && e.detail.element && e.detail.element === 'accordion');
      const formWrapperHeight = this.formWrapper.offsetHeight;
      const heightDifference = window.innerHeight - formWrapperHeight - this.defaultTopBottomSpacings;
      const scrollDifference = Math.abs(this.scrollTop - this.scrollLastPosition);

      if (this.scrollDirectionDown) {
        this.stickyScrollTop -= scrollDifference;
      } else {
        this.stickyScrollTop += scrollDifference;
      }

      if (this.stickyFormLoad) {
        if (document.querySelector(selectors$f.headerSticky) && document.querySelector(selectors$f.headerHeight)) {
          this.stickyDefaultTop = parseInt(document.querySelector(selectors$f.headerHeight).getBoundingClientRect().height);
        } else {
          this.stickyDefaultTop = this.defaultTopBottomSpacings;
        }

        this.stickyScrollTop = this.stickyDefaultTop;
      }

      this.stickyScrollTop = Math.min(Math.max(this.stickyScrollTop, heightDifference), this.stickyDefaultTop);

      const differencePoint = this.stickyScrollTop - this.currentPoint;
      this.currentPoint = this.stickyFormLoad ? this.stickyScrollTop : this.currentPoint + differencePoint * 0.5;

      this.formWrapper.style.setProperty('--sticky-top', `${this.currentPoint}px`);

      this.scrollLastPosition = this.scrollTop;
      this.stickyFormLoad = false;

      if (
        (isAccordion && this.onChangeCounter <= 10) ||
        (isAccordion && this.stickyFormLastHeight !== formWrapperHeight) ||
        (this.stickyScrollTop !== this.currentPoint && this.requestAnimationSticky)
      ) {
        if (isAccordion) {
          this.onChangeCounter += 1;
        }

        if (isAccordion && this.stickyFormLastHeight !== formWrapperHeight) {
          this.onChangeCounter = 11;
        }

        this.requestAnimationSticky = requestAnimationFrame(() => this.calculateStickyPosition(e));
      } else if (this.requestAnimationSticky) {
        this.removeAnimationFrame();
      }

      this.stickyFormLastHeight = formWrapperHeight;
    }

    removeAnimationFrame() {
      if (this.requestAnimationSticky) {
        cancelAnimationFrame(this.requestAnimationSticky);
        this.requestAnimationSticky = null;
        this.onChangeCounter = 0;
      }
    }

    onUnload() {
      if (this.stickyEnabled) {
        document.removeEventListener('theme:resize', this.resizeEvent);
      }

      if (theme.variables.productPageSticky) {
        document.removeEventListener('theme:scroll', this.scrollEvent);
      }
    }
  }

  const productStickySection = {
    onLoad() {
      sections$9[this.id] = new ProductSticky(this);
    },
    onUnload() {
      sections$9[this.id].onUnload();
    },
  };

  const selectors$e = {
    section: 'data-section-type',
    shareButton: '[data-share-button]',
    shareMessage: '[data-share-message]',
  };

  const classes$a = {
    visible: 'is-visible',
  };

  class ShareButton extends HTMLElement {
    constructor() {
      super();

      this.container = this.closest(`[${selectors$e.section}]`);
      this.shareButton = this.querySelector(selectors$e.shareButton);
      this.shareMessage = this.querySelector(selectors$e.shareMessage);
      this.urlToShare = this.shareButton.dataset.shareUrl ? this.shareButton.dataset.shareUrl : document.location.href;

      this.init();
      this.updateShareLink();
    }

    init() {
      if (navigator.share) {
        this.shareButton.addEventListener('click', () => {
          navigator.share({url: this.urlToShare, title: document.title});
        });
      } else {
        this.shareButton.addEventListener('click', this.copyToClipboard.bind(this));
      }
    }

    updateShareLink() {
      if (this.container.getAttribute(selectors$e.section) == 'product') {
        this.container.addEventListener('theme:variant:change', (event) => {
          if (event.detail.variant) {
            this.urlToShare = `${this.urlToShare.split('?')[0]}?variant=${event.detail.variant.id}`;
          }
        });
      }
    }

    copyToClipboard() {
      navigator.clipboard.writeText(this.urlToShare).then(() => {
        this.shareMessage.classList.add(classes$a.visible);

        const removeVisibleClass = () => {
          this.shareMessage.classList.remove(classes$a.visible);
          this.shareMessage.removeEventListener('animationend', removeVisibleClass);
        };

        this.shareMessage.addEventListener('animationend', removeVisibleClass);
      });
    }
  }

  const selectors$d = {
    optionPosition: 'data-option-position',
    optionInput: '[name^="options"], [data-popout-option]',
    optionInputCurrent: '[name^="options"]:checked, [name^="options"][type="hidden"]',
    selectOptionValue: 'data-value',
    popout: '[data-popout]',
  };

  const classes$9 = {
    soldOut: 'sold-out',
    unavailable: 'unavailable',
    sale: 'sale',
  };

  /**
   * Variant Sellout Precrime Click Preview
   * I think of this like the precrime machine in Minority report.  It gives a preview
   * of every possible click action, given the current form state.  The logic is:
   *
   * for each clickable name=options[] variant selection element
   * find the value of the form if the element were clicked
   * lookup the variant with those value in the product json
   * clear the classes, add .unavailable if it's not found,
   * and add .sold-out if it is out of stock
   *
   * Caveat: we rely on the option position so we don't need
   * to keep a complex map of keys and values.
   */

  class SelloutVariants {
    constructor(section, productJSON) {
      this.container = section;
      this.productJSON = productJSON;
      this.optionElements = this.container.querySelectorAll(selectors$d.optionInput);

      if (this.productJSON && this.optionElements.length) {
        this.init();
      }
    }

    init() {
      this.update();
    }

    update() {
      this.getCurrentState();

      this.optionElements.forEach((el) => {
        const parent = el.closest(`[${selectors$d.optionPosition}]`);
        if (!parent) return;
        const val = el.value || el.getAttribute(selectors$d.selectOptionValue);
        const positionString = parent.getAttribute(selectors$d.optionPosition);
        // subtract one because option.position in liquid does not count form zero, but JS arrays do
        const position = parseInt(positionString, 10) - 1;
        const selectPopout = el.closest(selectors$d.popout);

        let newVals = [...this.selections];
        newVals[position] = val;

        const found = this.productJSON.variants.find((element) => {
          // only return true if every option matches our hypothetical selection
          let perfectMatch = true;
          for (let index = 0; index < newVals.length; index++) {
            if (element.options[index] !== newVals[index]) {
              perfectMatch = false;
            }
          }
          return perfectMatch;
        });

        el.classList.remove(classes$9.soldOut, classes$9.unavailable);
        el.parentNode.classList.remove(classes$9.sale);

        if (selectPopout) {
          selectPopout.classList.remove(classes$9.soldOut, classes$9.unavailable, classes$9.sale);
        }

        if (typeof found === 'undefined') {
          el.classList.add(classes$9.unavailable);

          if (selectPopout) {
            selectPopout.classList.add(classes$9.unavailable);
          }
        } else if (found && found.available === false) {
          el.classList.add(classes$9.soldOut);

          if (selectPopout) {
            selectPopout.classList.add(classes$9.soldOut);
          }
        }

        if (found && found.compare_at_price > found.price && theme.settings.variantOnSale) {
          el.parentNode.classList.add(classes$9.sale);
        }
      });
    }

    getCurrentState() {
      this.selections = [];

      const options = this.container.querySelectorAll(selectors$d.optionInputCurrent);
      if (options.length) {
        options.forEach((element) => {
          const elemValue = element.value;
          if (elemValue && elemValue !== '') {
            this.selections.push(elemValue);
          }
        });
      }
    }
  }

  const events = {
    variantChange: 'variant-change',
  };

  const selectors$c = {
    product: '[data-product]',
    productForm: '[data-product-form]',
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    formWrapper: '[data-form-wrapper]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productSlideshow: '[data-product-slideshow]',
    productImage: '[data-product-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    unitPrice: '[data-product-unit-price]',
    unitBase: '[data-product-base]',
    unitWrapper: '[data-product-unit]',
    isPreOrder: '[data-product-preorder]',
    sliderEnabled: 'flickity-enabled',
    productSlide: '.product__slide',
    subPrices: '[data-subscription-watch-price]',
    subSelectors: '[data-subscription-selectors]',
    subsToggle: '[data-toggles-group]',
    subsChild: 'data-group-toggle',
    subDescription: '[data-plan-description]',
    section: '[data-section-type]',
    quickAddModal: '[data-quick-add-modal]',
    priceOffWrap: '[data-price-off]',
    priceOffType: '[data-price-off-type]',
    priceOffAmount: '[data-price-off-amount]',
    remainingCount: '[data-remaining-count]',
    remainingMax: '[data-remaining-max]',
    remainingWrapper: '[data-remaining-wrapper]',
    remainingJSON: '[data-product-remaining-json]',
    optionValue: '[data-option-value]',
    optionPosition: '[data-option-position]',
    installment: '[data-product-form-installment]',
    inputId: 'input[name="id"]',
  };

  const classes$8 = {
    hidden: 'hidden',
    variantSoldOut: 'variant--soldout',
    variantUnavailable: 'variant--unavailable',
    productPriceSale: 'product__price--sale',
    remainingLow: 'count-is-low',
    remainingIn: 'count-is-in',
    remainingOut: 'count-is-out',
    remainingUnavailable: 'count-is-unavailable',
  };

  const attributes$7 = {
    dataTallLayout: 'data-tall-layout',
    remainingMaxAttr: 'data-remaining-max',
    dataEnableHistoryState: 'data-enable-history-state',
    optionPosition: 'data-option-position',
    dataImageId: 'data-image-id',
  };

  class ProductForm extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.cartAddEvents();

      this.container = this.closest(selectors$c.section) || this.closest(selectors$c.quickAddModal);
      if (!this.container) return;

      this.sectionId = this.container.dataset.sectionId;
      this.tallLayout = this.container.getAttribute(attributes$7.dataTallLayout) === 'true';
      this.product = this.container.querySelector(selectors$c.product);
      this.productForm = this.container.querySelector(selectors$c.productForm);
      this.installmentForm = this.container.querySelector(selectors$c.installment);
      this.sellout = null;

      this.priceOffWrap = this.container.querySelector(selectors$c.priceOffWrap);
      this.priceOffAmount = this.container.querySelector(selectors$c.priceOffAmount);
      this.priceOffType = this.container.querySelector(selectors$c.priceOffType);
      this.planDescription = this.container.querySelector(selectors$c.subDescription);

      this.remainingWrapper = this.container.querySelector(selectors$c.remainingWrapper);

      if (this.remainingWrapper) {
        const remainingMaxWrap = this.container.querySelector(selectors$c.remainingMax);
        if (remainingMaxWrap) {
          this.remainingMaxInt = parseInt(remainingMaxWrap.getAttribute(attributes$7.remainingMaxAttr), 10);
          this.remainingCount = this.container.querySelector(selectors$c.remainingCount);
          this.remainingJSONWrapper = this.container.querySelector(selectors$c.remainingJSON);
          this.remainingJSON = null;

          if (this.remainingJSONWrapper && this.remainingJSONWrapper.innerHTML !== '') {
            this.remainingJSON = JSON.parse(this.remainingJSONWrapper.innerHTML);
          } else {
            console.warn('Missing product quantity JSON');
          }
        }
      }

      this.enableHistoryState = this.container.getAttribute(attributes$7.dataEnableHistoryState) === 'true';
      this.hasUnitPricing = this.container.querySelector(selectors$c.unitWrapper);
      this.subSelectors = this.container.querySelector(selectors$c.subSelectors);
      this.subPrices = this.container.querySelector(selectors$c.subPrices);
      this.isPreOrder = this.container.querySelector(selectors$c.isPreOrder);

      const counter = new QuantityCounter(this.container);
      counter.init();

      let productJSON = null;
      const productElemJSON = this.container.querySelector(selectors$c.productJson);
      if (productElemJSON) {
        productJSON = productElemJSON.innerHTML;
      }
      if (productJSON) {
        this.productJSON = JSON.parse(productJSON);
        this.linkForm();
        this.sellout = new SelloutVariants(this.container, this.productJSON);
      } else {
        console.error('Missing product JSON');
      }
    }

    cartAddEvents() {
      this.buttonATC = this.querySelector(selectors$c.addToCart);
      if (!this.buttonATC) return;

      this.buttonATC.addEventListener('click', (e) => {
        e.preventDefault();

        document.dispatchEvent(
          new CustomEvent('theme:cart:add', {
            detail: {
              button: this.buttonATC,
            },
            bubbles: false,
          })
        );
      });
    }

    destroy() {
      this.productForm.destroy();
    }

    linkForm() {
      this.productForm = new ProductFormReader(this.container, this.productJSON, {
        onOptionChange: this.onOptionChange.bind(this),
        onPlanChange: this.onPlanChange.bind(this),
      });
      this.pushState(this.productForm.getFormState());
      this.subsToggleListeners();
    }

    onOptionChange(evt) {
      this.pushState(evt.dataset);
      this.updateProductImage(evt);
    }

    onPlanChange(evt) {
      if (this.subPrices) {
        this.pushState(evt.dataset);
      }
    }

    pushState(formState) {
      this.productState = this.setProductState(formState);
      this.updateAddToCartState(formState);
      this.updateProductPrices(formState);
      this.updateSaleText(formState);
      this.updateSubscriptionText(formState);
      this.updateRemaining(formState);
      this.updateLegend(formState);
      this.fireHookEvent(formState);
      this.sellout?.update(formState);
      if (this.enableHistoryState) {
        this.updateHistoryState(formState);
      }
    }

    updateAddToCartState(formState) {
      const variant = formState.variant;
      let addText = theme.strings.addToCart;
      const priceWrapper = this.container.querySelectorAll(selectors$c.priceWrapper);
      const addToCart = this.container.querySelectorAll(selectors$c.addToCart);
      const addToCartText = this.container.querySelectorAll(selectors$c.addToCartText);
      const formWrapper = this.container.querySelectorAll(selectors$c.formWrapper);

      if (this.installmentForm && variant) {
        const installmentInput = this.installmentForm.querySelector(selectors$c.inputId);
        installmentInput.value = variant.id;
        installmentInput.dispatchEvent(new Event('change', {bubbles: true}));
      }

      if (this.isPreOrder) {
        addText = theme.strings.preOrder;
      }

      if (priceWrapper.length && variant) {
        priceWrapper.forEach((element) => {
          element.classList.remove(classes$8.hidden);
        });
      }

      if (addToCart.length) {
        addToCart.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.disabled = false;
            } else {
              element.disabled = true;
            }
          } else {
            element.disabled = true;
          }
        });
      }

      if (addToCartText.length) {
        addToCartText.forEach((element) => {
          if (variant) {
            if (variant.available) {
              if(element.attributes['data-product-with-price']){
                const discountFloat = Math.floor(variant.price / 100).toFixed(2);
                element.innerHTML=`<span class="text-box">${addText}</span><span class="text-box-price">$${discountFloat}</span>`
              }
              else
              element.innerHTML = addText;
            } else {
              if(element.attributes['data-product-with-price']){
                const discountFloat = Math.floor(variant.price / 100).toFixed(2);
                element.innerHTML=`<span class="text-box">${theme.strings.soldOut}</span><span class="text-box-price">$${discountFloat}</span>`
              }
              else
              element.innerHTML = theme.strings.soldOut;
            }
          } else {
            element.innerHTML = theme.strings.unavailable;
          }
        });
      }

      if (formWrapper.length) {
        formWrapper.forEach((element) => {
          if (variant) {
            if (variant.available) {
              element.classList.remove(classes$8.variantSoldOut, classes$8.variantUnavailable);
            } else {
              element.classList.add(classes$8.variantSoldOut);
              element.classList.remove(classes$8.variantUnavailable);
            }

            const formSelect = element.querySelector(selectors$c.originalSelectorId);
            if (formSelect) {
              formSelect.value = variant.id;
            }

            const inputId = element.querySelector(`${selectors$c.inputId}[form]`);
            if (inputId) {
              inputId.value = variant.id;
              inputId.dispatchEvent(new Event('change'));
            }
          } else {
            element.classList.add(classes$8.variantUnavailable);
            element.classList.remove(classes$8.variantSoldOut);
          }
        });
      }
    }

    updateHistoryState(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const location = window.location.href;
      if (variant && location.includes('/product')) {
        const url = new window.URL(location);
        const params = url.searchParams;
        params.set('variant', variant.id);
        if (plan && plan.detail && plan.detail.id && this.productState.hasPlan) {
          params.set('selling_plan', plan.detail.id);
        } else {
          params.delete('selling_plan');
        }
        url.search = params.toString();
        const urlString = url.toString();
        window.history.replaceState({path: urlString}, '', urlString);
      }
    }

    updateRemaining(formState) {
      const variant = formState.variant;

      this.remainingWrapper?.classList.remove(classes$8.remainingIn, classes$8.remainingOut, classes$8.remainingUnavailable, classes$8.remainingLow);

      if (variant && this.remainingWrapper && this.remainingJSON) {
        const remaining = this.remainingJSON[variant.id];

        if (remaining === 'out' || remaining < 1) {
          this.remainingWrapper.classList.add(classes$8.remainingOut);
        }

        if (remaining === 'in' || remaining >= this.remainingMaxInt) {
          this.remainingWrapper.classList.add(classes$8.remainingIn);
        }
        if (remaining === 'low' || (remaining > 0 && remaining < this.remainingMaxInt)) {
          this.remainingWrapper.classList.add(classes$8.remainingLow);

          if (this.remainingCount) {
            this.remainingCount.innerHTML = remaining;
          }
        }
      } else if (!variant && this.remainingWrapper) {
        this.remainingWrapper.classList.add(classes$8.remainingUnavailable);
      }
    }

    getBaseUnit(variant) {
      return variant.unit_price_measurement.reference_value === 1
        ? variant.unit_price_measurement.reference_unit
        : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    }

    subsToggleListeners() {
      const toggles = this.container.querySelectorAll(selectors$c.subsToggle);

      toggles.forEach((toggle) => {
        toggle.addEventListener(
          'change',
          function (e) {
            const val = e.target.value.toString();
            const selected = this.container.querySelector(`[${selectors$c.subsChild}="${val}"]`);
            const groups = this.container.querySelectorAll(`[${selectors$c.subsChild}]`);
            if (selected) {
              selected.classList.remove(classes$8.hidden);
              const first = selected.querySelector(`[name="selling_plan"]`);
              first.checked = true;
              first.dispatchEvent(new Event('change'));
            }
            groups.forEach((group) => {
              if (group !== selected) {
                group.classList.add(classes$8.hidden);
                const plans = group.querySelectorAll(`[name="selling_plan"]`);
                plans.forEach((plan) => {
                  plan.checked = false;
                  plan.dispatchEvent(new Event('change'));
                });
              }
            });
          }.bind(this)
        );
      });
    }

    updateSaleText(formState) {
      if (this.productState.planSale) {
        this.updateSaleTextSubscription(formState);
      } else if (this.productState.onSale) {
        this.updateSaleTextStandard(formState);
      } else if (this.priceOffWrap) {
        this.priceOffWrap.classList.add(classes$8.hidden);
      }
    }

    updateSaleTextStandard(formState) {
      if (this.priceOffType) {
        this.priceOffType.innerHTML = window.theme.strings.sale || 'sale';
      }
      if (this.priceOffAmount && this.priceOffWrap) {
        const variant = formState.variant;
        const discountFloat = (variant.compare_at_price - variant.price) / 100;
        const discountInt = Math.floor(discountFloat);
        this.priceOffAmount.innerHTML = `$${discountInt}`;
        this.priceOffWrap.classList.remove(classes$8.hidden);
      }
    }

    updateSubscriptionText(formState) {
      if (formState.plan && this.planDescription) {
        this.planDescription.innerHTML = formState.plan.detail.description;
        this.planDescription.classList.remove(classes$8.hidden);
      } else if (this.planDescription) {
        this.planDescription.classList.add(classes$8.hidden);
      }
    }

    updateSaleTextSubscription(formState) {
      if (this.priceOffType) {
        this.priceOffType.innerHTML = window.theme.strings.subscription || 'subscripton';
      }

      if (this.priceOffAmount && this.priceOffWrap) {
        const adjustment = formState.plan.detail.price_adjustments[0];
        const discount = adjustment.value;
        if (adjustment && adjustment.value_type === 'percentage') {
          this.priceOffAmount.innerHTML = `${discount}%`;
        } else {
          this.priceOffAmount.innerHTML = themeCurrency.formatMoney(discount, theme.moneyFormat);
        }
        this.priceOffWrap.classList.remove(classes$8.hidden);
      }
    }

    updateProductPrices(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      const priceWrappers = this.container.querySelectorAll(selectors$c.priceWrapper);

      priceWrappers.forEach((wrap) => {
        const comparePriceEl = wrap.querySelector(selectors$c.comparePrice);
        const productPriceEl = wrap.querySelector(selectors$c.productPrice);
        const comparePriceText = wrap.querySelector(selectors$c.comparePriceText);

        let comparePrice = '';
        let price = '';

        if (this.productState.available) {
          comparePrice = variant.compare_at_price;
          price = variant.price;
        }

        if (this.productState.hasPlan) {
          price = plan.allocation.price;
        }

        if (this.productState.planSale) {
          comparePrice = plan.allocation.compare_at_price;
          price = plan.allocation.price;
        }

        if (comparePriceEl) {
          if (this.productState.onSale || this.productState.planSale) {
            comparePriceEl.classList.remove(classes$8.hidden);
            comparePriceText.classList.remove(classes$8.hidden);
            productPriceEl.classList.add(classes$8.productPriceSale);
          } else {
            comparePriceEl.classList.add(classes$8.hidden);
            comparePriceText.classList.add(classes$8.hidden);
            productPriceEl.classList.remove(classes$8.productPriceSale);
          }
          comparePriceEl.innerHTML = themeCurrency.formatMoney(comparePrice, theme.moneyFormat);
        }

        productPriceEl.innerHTML = price === 0 ? window.theme.strings.free : themeCurrency.formatMoney(price, theme.moneyFormat);
      });

      if (this.hasUnitPricing) {
        this.updateProductUnits(formState);
      }
    }

    updateProductUnits(formState) {
      const variant = formState.variant;
      const plan = formState.plan;
      let unitPrice = null;

      if (variant && variant.unit_price) {
        unitPrice = variant.unit_price;
      }
      if (plan && plan.allocation && plan.allocation.unit_price) {
        unitPrice = plan.allocation.unit_price;
      }

      if (unitPrice) {
        const base = this.getBaseUnit(variant);
        const formattedPrice = themeCurrency.formatMoney(unitPrice, theme.moneyFormat);
        this.container.querySelector(selectors$c.unitPrice).innerHTML = formattedPrice;
        this.container.querySelector(selectors$c.unitBase).innerHTML = base;
        showElement(this.container.querySelector(selectors$c.unitWrapper));
      } else {
        hideElement(this.container.querySelector(selectors$c.unitWrapper));
      }
    }

    fireHookEvent(formState) {
      const variant = formState.variant;
      this.container.dispatchEvent(
        new CustomEvent('theme:variant:change', {
          detail: {
            variant: variant,
          },
          bubbles: true,
        })
      );

      publish(events.variantChange, {
        data: {
          sectionId: this.sectionId,
          variant,
        },
      });
    }

    /**
     * Tracks aspects of the product state that are relevant to UI updates
     * @param {object} evt - variant change event
     * @return {object} productState - represents state of variant + plans
     *  productState.available - current variant and selling plan options result in valid offer
     *  productState.soldOut - variant is sold out
     *  productState.onSale - variant is on sale
     *  productState.showUnitPrice - variant has unit price
     *  productState.requiresPlan - all the product variants requires a selling plan
     *  productState.hasPlan - there is a valid selling plan
     *  productState.planSale - plan has a discount to show next to price
     *  productState.planPerDelivery - plan price does not equal per_delivery_price - a prepaid subscription
     */
    setProductState(dataset) {
      const variant = dataset.variant;
      const plan = dataset.plan;

      const productState = {
        available: true,
        soldOut: false,
        onSale: false,
        showUnitPrice: false,
        requiresPlan: false,
        hasPlan: false,
        planPerDelivery: false,
        planSale: false,
      };

      if (!variant || (variant.requires_selling_plan && !plan)) {
        productState.available = false;
      } else {
        if (!variant.available) {
          productState.soldOut = true;
        }

        if (variant.compare_at_price > variant.price) {
          productState.onSale = true;
        }

        if (variant.unit_price) {
          productState.showUnitPrice = true;
        }

        if (this.product && this.product.requires_selling_plan) {
          productState.requiresPlan = true;
        }

        if (plan && this.subPrices) {
          productState.hasPlan = true;
          if (plan.allocation.per_delivery_price !== plan.allocation.price) {
            productState.planPerDelivery = true;
          }
          if (variant.price > plan.allocation.price) {
            productState.planSale = true;
          }
        }
      }
      return productState;
    }

    updateProductImage(evt) {
      const variant = evt.dataset.variant;

      if (variant) {
        // Update variant image, if one is set
        if (variant.featured_media) {
          const newImg = this.container.querySelector(`[${attributes$7.dataImageId}="${variant.featured_media.id}"]`);
          const newImageParent = newImg?.closest(selectors$c.productSlide);
          // If we have a mobile breakpoint or the tall layout is disabled,
          // just switch the slideshow.

          if (newImageParent) {
            const newImagePos = Array.from(newImageParent.parentElement.children).indexOf(newImageParent);
            const slider = this.container.querySelector(selectors$c.productSlideshow);
            const isDesktopView = isDesktop();

            if (slider && slider.classList.contains(selectors$c.sliderEnabled)) {
              FlickityFade.data(slider).select(newImagePos);
            } else if (slider && !isDesktopView) {
              slider.scrollTo({
                top: 0,
                left: newImageParent.offsetLeft,
                behavior: 'smooth',
              });
            }

            if (isDesktopView && this.tallLayout) {
              // We know its a tall layout, if it's sticky
              // scroll to the images
              // Scroll to/reorder image unless it's the first photo on load
              const newImgTop = newImg.getBoundingClientRect().top;

              if (newImagePos === 0 && newImgTop + window.scrollY > window.pageYOffset) return;

              // Scroll to variant image
              document.dispatchEvent(
                new CustomEvent('theme:tooltip:close', {
                  bubbles: false,
                  detail: {
                    hideTransition: false,
                  },
                })
              );

              scrollTo(newImgTop);
            }
          }
        }
      }
    }

    updateLegend(formState) {
      const variant = formState.variant;
      if (variant) {
        const optionValues = this.container.querySelectorAll(selectors$c.optionValue);
        if (optionValues.length) {
          optionValues.forEach((optionValue) => {
            const selectorWrapper = optionValue.closest(selectors$c.optionPosition);
            if (selectorWrapper) {
              const optionPosition = selectorWrapper.getAttribute(attributes$7.optionPosition);
              const optionIndex = parseInt(optionPosition, 10) - 1;
              const selectedOptionValue = variant.options[optionIndex];
              optionValue.innerHTML = selectedOptionValue;
            }
          });
        }
      }
    }
  }

  const selectors$b = {
    dialog: 'dialog',
    focusable: 'button, [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    buttonModalOpen: '[data-modal-open]',
    buttonModalClose: '[data-modal-close]',
  };

  const attributes$6 = {
    closing: 'closing',
  };

  class ProductModal extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.modal = this.querySelector(selectors$b.dialog);
      this.buttonModalOpen = this.querySelector(selectors$b.buttonModalOpen);
      this.buttonModalClose = this.querySelector(selectors$b.buttonModalClose);
      this.focusTarget = this.modal.querySelector('[autofocus]') || this.modal.querySelector(selectors$b.focusable);
      this.isAnimating = false;

      this.modalEvents();
    }

    modalOpen() {
      this.modal.showModal();
      this.modal.setAttribute('open', true);
      this.modal.removeAttribute('inert');

      this.focusTarget?.focus();

      document.dispatchEvent(new CustomEvent('theme:modal:open', {bubbles: true}));
    }

    modalClose() {
      if (this.isAnimating) {
        return;
      }

      if (!this.modal.hasAttribute(attributes$6.closing)) {
        this.modal.setAttribute(attributes$6.closing, '');
        this.isAnimating = true;
        return;
      }

      this.modal.close();
      this.modal.removeAttribute(attributes$6.closing);
      this.modal.setAttribute('inert', '');
    }

    modalEvents() {
      // Open modal on button click event
      this.buttonModalOpen.addEventListener('click', (e) => {
        e.preventDefault();
        this.modalOpen();
      });

      // Close button click event
      this.buttonModalClose.addEventListener('click', (e) => {
        e.preventDefault();
        this.modalClose();
      });

      // Close dialog on click outside content
      this.modal.addEventListener('click', (event) => {
        if (event.target.nodeName === 'DIALOG' && event.type === 'click') {
          this.modalClose();
        }
      });

      // Close dialog on click ESC key pressed
      this.modal.addEventListener('keydown', (event) => {
        if (event.code == theme.keyboardKeys.ESCAPE) {
          event.preventDefault();
          this.modalClose();
        }
      });

      this.modal.addEventListener('theme:modal:close', () => {
        this.modalClose();
      });

      // Close dialog after animation completes
      this.modal.addEventListener('animationend', (event) => {
        if (event.target !== this.modal) return;
        this.isAnimating = false;

        if (this.modal.hasAttribute(attributes$6.closing)) {
          this.modalClose();
        }
      });
    }
  }

  const selectors$a = {
    addToCart: '[data-add-to-cart]',
    priceWrapper: '[data-price-wrapper]',
    productImage: '[data-product-image]',
    productJson: '[data-product-json]',
    form: '[data-product-form]',
    dataSectionId: 'data-section-id',
    dataCartBar: 'data-cart-bar',
    cartBar: '#cart-bar',
    cartBarAdd: 'data-add-to-cart-bar',
    cartBarScroll: 'data-cart-bar-scroll',
    productSubmitAdd: '.product__submit__add',
    toggleTruncateHolder: '[data-truncated-holder]',
    toggleTruncateButton: '[data-truncated-button]',
    toggleTruncateContent: '[data-truncated-content]',
    toggleTruncateContentAttr: 'data-truncated-content',
    formWrapper: '[data-form-wrapper]',
    slider: '[data-slider]',
    sliderIndex: 'data-slider-index',
  };

  const classes$7 = {
    expanded: 'is-expanded',
    visible: 'is-visible',
    loading: 'is-loading',
    added: 'is-added',
  };

  const sections$8 = {};

  /**
   * Product section constructor.
   * @param {string} container - selector for the section container DOM element
   */
  class Product {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.id = this.container.getAttribute(selectors$a.dataSectionId);
      this.sliders = this.container.querySelectorAll(selectors$a.slider);
      this.slider = [];
      this.truncateElementHolder = this.container.querySelector(selectors$a.toggleTruncateHolder);
      this.truncateElement = this.container.querySelector(selectors$a.toggleTruncateContent);
      this.formWrapper = this.container.querySelector(selectors$a.formWrapper);
      this.cartBarExist = this.container.getAttribute(selectors$a.dataCartBar) === 'true';
      this.cartBar = this.container.querySelector(selectors$a.cartBar);
      this.scrollToTop = this.scrollToTop.bind(this);
      this.scrollEvent = (e) => this.scrollEvents(e);
      this.resizeEvent = (e) => this.resizeEvents(e);
      this.unlockTimer = 0;
      this.accessibility = a11y;

      if (this.truncateElementHolder && this.truncateElement) {
        setTimeout(() => this.truncateText(), 50);

        document.addEventListener('theme:resize', this.resizeEvent);
      }

      // Stop parsing if we don't have the product json script tag when loading
      // section in the Theme Editor
      const productJson = this.container.querySelector(selectors$a.productJson);
      if ((productJson && !productJson.innerHTML) || !productJson) {
        const counter = new QuantityCounter(this.container);
        counter.init();
        return;
      }
      const productJsonHandle = JSON.parse(productJson.innerHTML).handle;
      let recentObj = {};
      if (productJsonHandle) {
        recentObj = {
          handle: productJsonHandle,
        };
      }

      // Record recently viewed products when the product page is loading
      Shopify.Products.recordRecentlyViewed(recentObj);

      this.form = this.container.querySelector(selectors$a.form);

      this.init();

      if (this.sliders.length) {
        this.sliders.forEach((slider, index) => {
          slider.setAttribute(selectors$a.sliderIndex, index);
          this.slider.push(new Slider(this.container, slider));
        });
      }

      if (this.cartBarExist) {
        this.initCartBar();
        document.addEventListener('theme:scroll', this.scrollEvent);
      }
    }

    init() {
      theme.mediaInstances[this.id] = new Media(this.section);
      theme.mediaInstances[this.id].init();
    }

    scrollEvents(e) {
      if (this.cartBarExist) {
        this.cartBarScroll();
      }
    }

    resizeEvents(e) {
      this.truncateText();
    }

    truncateText() {
      if (this.truncateElementHolder.classList.contains(classes$7.visible)) return;
      const styles = this.truncateElement.querySelectorAll('style');
      if (styles.length) {
        styles.forEach((style) => {
          this.truncateElementHolder.prepend(style);
        });
      }

      const truncateElementCloned = this.truncateElement.cloneNode(true);
      const truncateElementClass = this.truncateElement.getAttribute(selectors$a.toggleTruncateContentAttr);
      const truncateNextElement = this.truncateElement.nextElementSibling;
      if (truncateNextElement) {
        truncateNextElement.remove();
      }

      this.truncateElement.parentElement.append(truncateElementCloned);

      const truncateAppendedElement = this.truncateElement.nextElementSibling;
      truncateAppendedElement.classList.add(truncateElementClass);
      truncateAppendedElement.removeAttribute(selectors$a.toggleTruncateContentAttr);

      showElement(truncateAppendedElement);

      ellipsis(truncateAppendedElement, 5, {
        replaceStr: '',
        delimiter: ' ',
      });

      hideElement(truncateAppendedElement);

      if (this.truncateElement.innerHTML !== truncateAppendedElement.innerHTML) {
        this.truncateElementHolder.classList.add(classes$7.expanded);
      } else {
        truncateAppendedElement.remove();
        this.truncateElementHolder.classList.remove(classes$7.expanded);
      }

      this.toggleTruncatedContent(this.truncateElementHolder);
    }

    toggleTruncatedContent(holder) {
      const toggleButton = holder.querySelector(selectors$a.toggleTruncateButton);
      if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
          e.preventDefault();
          holder.classList.remove(classes$7.expanded);
          holder.classList.add(classes$7.visible);
        });
      }
    }

    initCartBar() {
      // Submit product form on cart bar button click
      this.cartBarBtn = this.cartBar.querySelector(selectors$a.productSubmitAdd);
      if (this.cartBarBtn) {
        this.cartBarBtn.addEventListener('click', (e) => {
          e.preventDefault();

          if (e.currentTarget.hasAttribute(selectors$a.cartBarAdd)) {
            if (theme.settings.cartDrawerEnabled) {
              e.currentTarget.classList.add(classes$7.loading);
              e.currentTarget.setAttribute('disabled', 'disabled');
            }

            this.form.querySelector(selectors$a.addToCart).dispatchEvent(
              new Event('click', {
                bubbles: true,
              })
            );
          } else if (e.currentTarget.hasAttribute(selectors$a.cartBarScroll)) {
            this.scrollToTop();
          }
        });

        if (this.cartBarBtn.hasAttribute(selectors$a.cartBarAdd)) {
          document.addEventListener('theme:product:add-error', this.scrollToTop);
        }
      }
    }

    scrollToTop() {
      const scrollTarget = isDesktop() ? this.container : this.form;

      scrollTo(scrollTarget.getBoundingClientRect().top);
    }

    cartBarScroll() {
      const scrolled = window.pageYOffset;
      const element = theme.variables.productPageSticky && this.formWrapper ? this.formWrapper : this.form;

      if (element && this.cartBar) {
        const formOffset = element.offsetTop;
        const formHeight = element.offsetHeight;
        const checkPosition = scrolled > formOffset + formHeight;

        this.cartBar.classList.toggle(classes$7.visible, checkPosition);
      }
    }

    onUnload() {
      document.removeEventListener('theme:product:add-error', this.scrollToTop);

      if (this.truncateElementHolder && this.truncateElement) {
        document.removeEventListener('theme:resize', this.resizeEvent);
      }

      if (this.cartBarExist) {
        document.removeEventListener('theme:scroll', this.scrollEvent);
      }
    }

    onBlockSelect(e) {
      const slider = e.srcElement.closest(selectors$a.slider);
      if (slider && this.slider.length) {
        const sliderIndex = slider.hasAttribute(selectors$a.sliderIndex) ? slider.getAttribute(selectors$a.sliderIndex) : 0;
        if (!this.slider[sliderIndex]) return;
        this.slider[sliderIndex].onBlockSelect(e);
      }
    }

    onBlockDeselect(e) {
      const slider = e.srcElement.closest(selectors$a.slider);
      if (slider && this.slider.length) {
        const sliderIndex = slider.hasAttribute(selectors$a.sliderIndex) ? slider.getAttribute(selectors$a.sliderIndex) : 0;
        if (!this.slider[sliderIndex]) return;
        this.slider[sliderIndex].onBlockDeselect(e);
      }
    }
  }

  const productSection = {
    onLoad() {
      sections$8[this.id] = new Product(this);
    },
    onUnload(e) {
      sections$8[this.id].onUnload(e);
    },
    onBlockSelect(e) {
      sections$8[this.id].onBlockSelect(e);
    },
    onBlockDeselect(e) {
      sections$8[this.id].onBlockDeselect(e);
    },
  };

  register('product', [productSection, pickupAvailability, swatchSection, tooltipSection, popoutSection, tabs, productStickySection, initSlider]);

  if (!customElements.get('complementary-products')) {
    customElements.define('complementary-products', ComplementaryProducts);
  }

  if (!customElements.get('share-button')) {
    customElements.define('share-button', ShareButton);
  }

  if (!customElements.get('recipient-form')) {
    customElements.define('recipient-form', RecipientForm);
  }

  if (!customElements.get('product-form')) {
    customElements.define('product-form', ProductForm);
  }

  if (!customElements.get('product-modal')) {
    customElements.define('product-modal', ProductModal);
  }

  const selectors$9 = {
    apiRelatedProductsTemplate: '[data-api-related-template]',
    relatedSection: '[data-related-section]',
    relatedProduct: '[data-product-grid-item]',
    recentlyViewed: '[data-recent-wrapper]',
    recentlyViewedWrapper: '[data-recently-viewed-wrapper]',
    productItem: '.product-item',
    slider: '[data-slider]',
  };

  const attributes$5 = {
    limit: 'data-limit',
    minimum: 'data-minimum',
    productId: 'data-product-id',
  };

  const classes$6 = {
    isHidden: 'is-hidden',
  };

  const sections$7 = {};
  class Related {
    constructor(section) {
      this.section = section;
      this.sectionId = section.id;
      this.container = section.container;

      this.related();
      this.recent();
    }

    related() {
      const relatedSection = this.container.querySelector(selectors$9.relatedSection);

      if (!relatedSection) {
        return;
      }

      const productId = relatedSection.getAttribute(attributes$5.productId);
      const limit = relatedSection.getAttribute(attributes$5.limit);
      const requestUrl = `${window.theme.routes.product_recommendations_url}?section_id=api-product-recommendation&limit=${limit}&product_id=${productId}&intent=related`;

      fetch(requestUrl)
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          const relatedContent = document.createElement('div');
          relatedContent.innerHTML = new DOMParser().parseFromString(data, 'text/html').querySelector(selectors$9.apiRelatedProductsTemplate).innerHTML;
          const hasProducts = relatedContent.querySelector(selectors$9.relatedProduct);

          if (hasProducts) {
            relatedSection.innerHTML = relatedContent.innerHTML;
            const relatedProducts = relatedSection.querySelectorAll(selectors$9.relatedProduct);

            makeGridSwatches(this.section);

            // Init Siblings
            new Siblings(this.section);

            if (relatedProducts.length > 4 && relatedSection.querySelector(selectors$9.slider)) {
              new Slider(relatedSection);
            }
          } else {
            relatedSection.dispatchEvent(
              new CustomEvent('theme:tab:hide', {
                bubbles: true,
              })
            );
          }
        })
        .catch(function () {
          relatedSection.dispatchEvent(
            new CustomEvent('theme:tab:hide', {
              bubbles: true,
            })
          );
        });
    }

    recent() {
      const recentlyViewed = this.container.querySelector(selectors$9.recentlyViewed);
      const howManyToshow = recentlyViewed ? parseInt(recentlyViewed.getAttribute(attributes$5.limit)) : 4;

      Shopify.Products.showRecentlyViewed({
        howManyToShow: howManyToshow,
        wrapperId: `recently-viewed-products-${this.sectionId}`,
        section: this.section,
        onComplete: (wrapper, section) => {
          const container = section.container;
          const recentlyViewedHolder = container.querySelector(selectors$9.recentlyViewed);
          const recentlyViewedWrapper = container.querySelector(selectors$9.recentlyViewedWrapper);
          const recentProducts = wrapper.querySelectorAll(selectors$9.productItem);
          const minimumNumberProducts = recentlyViewedHolder.hasAttribute(attributes$5.minimum) ? parseInt(recentlyViewedHolder.getAttribute(attributes$5.minimum)) : 4;
          const checkRecentInRelated = !recentlyViewedWrapper && recentProducts.length > 0;
          const checkRecentOutsideRelated = recentlyViewedWrapper && recentProducts.length >= minimumNumberProducts;

          if (checkRecentInRelated || checkRecentOutsideRelated) {
            if (checkRecentOutsideRelated) {
              recentlyViewedWrapper.classList.remove(classes$6.isHidden);
            }

            fadeIn(recentlyViewedHolder);

            recentlyViewedHolder.dispatchEvent(
              new CustomEvent('theme:tab:check', {
                bubbles: true,
              })
            );

            makeGridSwatches(section);

            // Init Siblings
            new Siblings(section);

            if (recentProducts.length > 4 && recentlyViewedHolder.querySelector(selectors$9.slider)) {
              new Slider(recentlyViewedHolder);
            }
          }
        },
      });
    }
  }

  const relatedSection = {
    onLoad() {
      sections$7[this.id] = new Related(this);
    },
  };

  register('related', [relatedSection, popoutSection, tabs]);

  register('reviews', [slider, blockScroll]);

  const sections$6 = {};

  const selectors$8 = {
    sliderLogos: '[data-slider-logos]',
    sliderText: '[data-slider-text]',
    slide: '[data-slide]',
    slideIndex: '[data-slide-index]',
  };

  const classes$5 = {
    isSelected: 'is-selected',
    flickityEnabled: 'flickity-enabled',
  };

  const attributes$4 = {
    slideData: 'data-slide',
    slideIndex: 'data-slide-index',
  };

  class LogoList {
    constructor(section) {
      this.container = section.container;
      this.slideshowNav = this.container.querySelector(selectors$8.sliderLogos);
      this.slideshowText = this.container.querySelector(selectors$8.sliderText);
      this.setSlideshowNavStateOnResize = () => this.setSlideshowNavState();
      this.flkty = null;
      this.flktyNav = null;

      this.initSlideshowText();
      this.initSlideshowNav();
    }

    initSlideshowText() {
      if (!this.slideshowText) return;

      this.flkty = new FlickityFade(this.slideshowText, {
        fade: true,
        autoPlay: false,
        prevNextButtons: false,
        cellAlign: 'left', // Prevents blurry text on Safari
        contain: true,
        pageDots: false,
        wrapAround: false,
        selectedAttraction: 0.2,
        friction: 0.6,
        draggable: false,
        accessibility: false,
        on: {
          ready: () => this.sliderAccessibility(),
          change: () => this.sliderAccessibility(),
        },
      });

      const textSlides = this.slideshowText.querySelectorAll(selectors$8.slide);
      if (textSlides.length) {
        let maxHeight = -1;
        textSlides.forEach((element) => {
          const elementHeight = parseFloat(getComputedStyle(element, null).height.replace('px', ''));

          if (elementHeight > maxHeight) {
            maxHeight = elementHeight;
          }
        });

        textSlides.forEach((element) => {
          const elementHeight = parseFloat(getComputedStyle(element, null).height.replace('px', ''));

          if (elementHeight < maxHeight) {
            const calculateMargin = Math.ceil((maxHeight - elementHeight) / 2);
            element.style.margin = `${calculateMargin}px 0`;
          }
        });
      }
    }

    sliderAccessibility() {
      const buttons = this.slideshowText.querySelectorAll(`${selectors$8.slide} a, ${selectors$8.slide} button`);

      if (buttons.length) {
        buttons.forEach((button) => {
          const slide = button.closest(selectors$8.slide);
          if (slide) {
            const tabIndex = slide.classList.contains(classes$5.isSelected) ? 0 : -1;
            button.setAttribute('tabindex', tabIndex);
          }
        });
      }
    }

    initSlideshowNav() {
      if (!this.slideshowNav) return;

      this.logoSlides = this.slideshowNav.querySelectorAll(selectors$8.slideIndex);

      if (this.logoSlides.length) {
        this.logoSlides.forEach((logoItem) => {
          logoItem.addEventListener('click', (e) => {
            e.preventDefault();

            const index = parseInt(logoItem.getAttribute(attributes$4.slideIndex));
            const hasSlider = this.slideshowNav.classList.contains(classes$5.flickityEnabled);

            if (this.flkty) {
              this.flkty.select(index);
            }

            if (hasSlider) {
              this.flktyNav.select(index);
              if (!this.slideshowNav.classList.contains(classes$5.isSelected)) {
                this.flktyNav.playPlayer();
              }
            } else {
              const selectedSlide = this.slideshowNav.querySelector(`.${classes$5.isSelected}`);
              if (selectedSlide) {
                selectedSlide.classList.remove(classes$5.isSelected);
              }
              logoItem.classList.add(classes$5.isSelected);
            }
          });
        });
      }

      this.setSlideshowNavState();

      document.addEventListener('theme:resize', this.setSlideshowNavStateOnResize);
    }

    setSlideshowNavState() {
      const slides = this.slideshowNav.querySelectorAll(selectors$8.slide);
      const slidesCount = slides.length;
      const slideWidth = 200;
      const slidesWidth = slidesCount * slideWidth;
      const sliderInitialized = this.slideshowNav.classList.contains(classes$5.flickityEnabled);

      if (slidesWidth > getWindowWidth()) {
        if (!sliderInitialized) {
          const selectedSlide = this.slideshowNav.querySelector(`.${classes$5.isSelected}`);
          if (selectedSlide) {
            selectedSlide.classList.remove(classes$5.isSelected);
          }
          slides[0].classList.add(classes$5.isSelected);

          this.flktyNav = new Flickity(this.slideshowNav, {
            autoPlay: 4000,
            prevNextButtons: false,
            contain: false,
            pageDots: false,
            wrapAround: true,
            watchCSS: true,
            selectedAttraction: 0.05,
            friction: 0.8,
            initialIndex: 0,
          });

          if (this.flkty) {
            this.flkty.select(0);

            this.flktyNav.on('change', (index) => this.flkty.select(index));
          }
        }
      } else if (sliderInitialized) {
        this.flktyNav.destroy();
        slides[0].classList.add(classes$5.isSelected);

        if (this.flkty) {
          this.flkty.select(0);
        }
      }
    }

    onBlockSelect(evt) {
      if (!this.slideshowNav) return;
      const slide = this.slideshowNav.querySelector(`[${attributes$4.slideData}="${evt.detail.blockId}"]`);
      const slideIndex = parseInt(slide.getAttribute(attributes$4.slideIndex));

      if (this.slideshowNav.classList.contains(classes$5.flickityEnabled)) {
        this.flktyNav.select(slideIndex);
        this.flktyNav.stopPlayer();
        this.slideshowNav.classList.add(classes$5.isSelected);
      } else {
        slide.dispatchEvent(new Event('click'));
      }
    }

    onBlockDeselect() {
      if (this.slideshowNav && this.slideshowNav.classList.contains(classes$5.flickityEnabled)) {
        this.flktyNav.playPlayer();
        this.slideshowNav.classList.remove(classes$5.isSelected);
      }
    }

    onUnload() {
      if (!this.slideshowNav) return;
      const sliderInitialized = this.slideshowNav.classList.contains(classes$5.flickityEnabled);
      if (sliderInitialized) {
        this.flktyNav.destroy();
      }

      if (this.flkty) {
        this.flkty.destroy();
      }

      document.removeEventListener('theme:resize', this.setSlideshowNavStateOnResize);
    }
  }

  const LogoListSection = {
    onLoad() {
      sections$6[this.id] = new LogoList(this);
    },
    onUnload(e) {
      sections$6[this.id].onUnload(e);
    },
    onBlockSelect(e) {
      sections$6[this.id].onBlockSelect(e);
    },
    onBlockDeselect(e) {
      sections$6[this.id].onBlockDeselect(e);
    },
  };

  register('logos', [LogoListSection, blockScroll]);

  const selectors$7 = {
    videoPlay: '[data-video-play]',
    videoPlayValue: 'data-video-play',
  };

  class VideoPlay {
    constructor(section, selector = selectors$7.videoPlay, selectorValue = selectors$7.videoPlayValue) {
      this.container = section;
      this.videoPlay = this.container.querySelectorAll(selector);

      if (this.videoPlay.length) {
        this.videoPlay.forEach((element) => {
          element.addEventListener('click', (e) => {
            const button = e.currentTarget;
            if (button.hasAttribute(selectorValue) && button.getAttribute(selectorValue).trim() !== '') {
              e.preventDefault();

              const items = [
                {
                  html: button.getAttribute(selectorValue),
                },
              ];

              new LoadPhotoswipe(items);
              window.accessibility.lastElement = button;
            }
          });
        });
      }
    }
  }

  const videoPlay = {
    onLoad() {
      new VideoPlay(this.container);
    },
  };

  const selectors$6 = {
    videoId: '[data-video-id]',
    videoPlayer: '[data-video-player]',
    videoTemplate: '[data-video-template]',
  };

  const classes$4 = {
    loading: 'is-loading',
  };

  const sections$5 = {};

  /**
   * Video section constructor.
   * @param {string} container - selector for the section container DOM element
   */
  class VideoBackground {
    constructor(section) {
      this.container = section.container;
      this.videoId = this.container.querySelector(selectors$6.videoId);
      this.videoPlayer = this.container.querySelector(selectors$6.videoPlayer);
      this.videoTemplate = this.container.querySelector(selectors$6.videoTemplate);
      this.video = null;
      this.init();
    }

    init() {
      if (this.videoId) {
        // Force video autoplay on iOS when Low Power Mode is On
        this.container.addEventListener(
          'touchstart',
          () => {
            this.video?.play();
          },
          {passive: true}
        );

        this.renderVideo();
      }
    }

    renderVideo() {
      /*
        Observe video element and pull it out from its template tag
      */
      this.videoTemplateObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const content = this.videoTemplate.innerHTML;

              this.videoPlayer.innerHTML = content;
              this.videoPlayer.classList.remove(classes$4.loading);
              this.video = this.container.querySelector('video');
              this.observeVideoPlayToggle();

              // Stop observing element after it was animated
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '300px',
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        }
      );

      this.videoTemplateObserver.observe(this.videoPlayer);
    }

    observeVideoPlayToggle() {
      if (!this.video) return;

      const options = {
        rootMargin: '0px',
        threshold: [0, 1.0],
      };

      this.videoPlayObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          if (isVisible && typeof this.video.play === 'function') {
            this.video.play();
          }
          if (!isVisible && typeof this.video.pause === 'function') {
            this.video.pause();
          }
        });
      }, options);

      this.videoPlayObserver.observe(this.video);
    }

    onUnload() {
      if (this.videoTemplateObserver) {
        this.videoTemplateObserver.disconnect();
      }

      if (this.videoPlayObserver) {
        this.videoPlayObserver.disconnect();
      }
    }
  }

  const videoBackground = {
    onLoad() {
      sections$5[this.id] = new VideoBackground(this);
    },
    onUnload() {
      sections$5[this.id].onUnload();
    },
  };

  /**
   * FeaturedVideo Template Script
   * ------------------------------------------------------------------------------
   * A file that contains scripts highly couple code to the FeaturedVideo template.
   *
   * @namespace FeaturedVideo
   */

  register('featured-video', [videoPlay, videoBackground, parallaxHero]);

  register('slideshow', [slider, parallaxHero]);

  const selectors$5 = {
    imagesHolder: '[data-images-holder]',
    imageHolder: '[data-image-holder]',
    imageElement: '[data-image-element]',
    imagesButton: '[data-images-button]',
    dataStartPosition: 'data-start-position',
  };

  const sections$4 = {};

  class CompareImages {
    constructor(section) {
      this.imagesHolder = section;

      if (this.imagesHolder) {
        this.imageHolder = this.imagesHolder.querySelector(selectors$5.imageHolder);
        this.imageElement = this.imagesHolder.querySelector(selectors$5.imageElement);
        this.imagesButton = this.imagesHolder.querySelector(selectors$5.imagesButton);
        this.startPosition = this.imagesHolder.hasAttribute(selectors$5.dataStartPosition) ? this.imagesHolder.getAttribute(selectors$5.dataStartPosition) : 0;
        this.startX = 0;
        this.x = 0;
        this.changeValuesEvent = (event) => this.changeValues(event);
        this.onMoveEvent = (event) => this.onMove(event);
        this.onStopEvent = (event) => this.onStop(event);
        this.onStartEvent = (event) => this.onStart(event);

        this.init();
        document.addEventListener('theme:resize', this.changeValuesEvent);
      }
    }

    init() {
      this.changeValues();
      this.imagesButton.addEventListener('mousedown', this.onStartEvent);
      this.imagesButton.addEventListener('touchstart', this.onStartEvent, {passive: true});
    }

    changeValues(event) {
      const imagesHolderWidth = this.imagesHolder.offsetWidth;
      const buttonWidth = this.imagesButton.offsetWidth;

      if (!event || (event && event.type !== 'touchmove' && event.type !== 'mousemove')) {
        this.imageElement.style.width = `${imagesHolderWidth}px`;
        this.imageHolder.style.width = `${100 - parseInt(this.startPosition)}%`;

        if (this.startPosition !== 0) {
          const newButtonPositionPixels = (imagesHolderWidth * parseInt(this.startPosition)) / 100;
          this.x = newButtonPositionPixels - buttonWidth / 2;
        }
      }

      if (this.x > imagesHolderWidth - buttonWidth) {
        this.x = imagesHolderWidth - buttonWidth;
      } else if (this.x < 0) {
        this.x = 0;
      }

      this.imagesButton.style.left = `${(this.x / imagesHolderWidth) * 100}%`;
      this.imageHolder.style.width = `${100 - ((this.x + buttonWidth / 2) / imagesHolderWidth) * 100}%`;
    }

    onStart(event) {
      event.preventDefault();
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      this.x = this.imagesButton.offsetLeft;
      this.startX = eventTouch.pageX - this.x;

      this.imagesHolder.addEventListener('mousemove', this.onMoveEvent);
      this.imagesHolder.addEventListener('mouseup', this.onStopEvent);
      this.imagesHolder.addEventListener('touchmove', this.onMoveEvent);
      this.imagesHolder.addEventListener('touchend', this.onStopEvent);
    }

    onMove(event) {
      let eventTouch = event;

      if (event.touches) {
        eventTouch = event.touches[0];
      }

      this.x = eventTouch.pageX - this.startX;

      this.changeValues(event);
    }

    onStop(event) {
      this.imagesHolder.removeEventListener('mousemove', this.onMoveEvent);
      this.imagesHolder.removeEventListener('mouseup', this.onStopEvent);
      this.imagesHolder.removeEventListener('touchmove', this.onMoveEvent);
      this.imagesHolder.removeEventListener('touchend', this.onStopEvent);
    }

    onUnload() {
      if (this.changeValuesEvent) {
        document.removeEventListener('theme:resize', this.changeValuesEvent);
      }
    }
  }

  const compareImages = {
    onLoad() {
      sections$4[this.id] = [];
      const els = this.container.querySelectorAll(selectors$5.imagesHolder);
      els.forEach((el) => {
        sections$4[this.id].push(new CompareImages(el));
      });
    },
    onUnload() {
      sections$4[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
  };

  register('custom-content', [slider, videoPlay, videoBackground, parallaxHero, swatchGridSection, compareImages, newsletterCheckForResultSection, siblings]);

  var styles = {};
  styles.basic = [];

  styles.light = [
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '64'}, {hue: '#ff0000'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#bdbdbd'}]},
    {featureType: 'administrative', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f0f0f0'}, {visibility: 'simplified'}]},
    {featureType: 'landscape.natural.landcover', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'landscape.natural.terrain', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry.fill', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'labels', stylers: [{lightness: '100'}]},
    {featureType: 'poi.park', elementType: 'all', stylers: [{visibility: 'on'}]},
    {featureType: 'poi.park', elementType: 'geometry', stylers: [{saturation: '-41'}, {color: '#e8ede7'}]},
    {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: '-100'}]},
    {featureType: 'road', elementType: 'labels', stylers: [{lightness: '25'}, {gamma: '1.06'}, {saturation: '-100'}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{gamma: '10.00'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}, {visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.fill', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{gamma: '10.00'}, {lightness: '100'}, {weight: '0.4'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'simplified'}, {weight: '0.01'}, {lightness: '39'}]},
    {featureType: 'road.local', elementType: 'labels.text.stroke', stylers: [{weight: '0.50'}, {gamma: '10.00'}, {lightness: '100'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#cfe5ee'}, {visibility: 'on'}]},
  ];

  styles.white_label = [
    {featureType: 'all', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{gamma: '3.86'}, {lightness: '100'}]},
    {featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{color: '#cccccc'}]},
    {featureType: 'landscape', elementType: 'all', stylers: [{color: '#f2f2f2'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'road', elementType: 'all', stylers: [{saturation: -100}, {lightness: 45}]},
    {featureType: 'road.highway', elementType: 'all', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0'}]},
    {featureType: 'road.arterial', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'water', elementType: 'all', stylers: [{color: '#e4e4e4'}, {visibility: 'on'}]},
  ];

  styles.dark_label = [
    {featureType: 'all', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'all', elementType: 'labels.text.fill', stylers: [{saturation: 36}, {color: '#000000'}, {lightness: 40}]},
    {featureType: 'all', elementType: 'labels.text.stroke', stylers: [{visibility: 'on'}, {color: '#000000'}, {lightness: 16}]},
    {featureType: 'all', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
    {featureType: 'administrative', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 17}, {weight: 1.2}]},
    {featureType: 'administrative', elementType: 'labels', stylers: [{visibility: 'simplified'}, {lightness: '-82'}]},
    {featureType: 'administrative', elementType: 'labels.text.stroke', stylers: [{invert_lightness: true}, {weight: '7.15'}]},
    {featureType: 'landscape', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 20}]},
    {featureType: 'landscape', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'poi', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 21}]},
    {featureType: 'road', elementType: 'labels', stylers: [{visibility: 'simplified'}]},
    {featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{color: '#000000'}, {lightness: 17}, {weight: '0.8'}]},
    {featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{color: '#000000'}, {lightness: 29}, {weight: '0.01'}]},
    {featureType: 'road.highway', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'road.arterial', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 18}]},
    {featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 16}]},
    {featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{weight: '0.01'}]},
    {featureType: 'road.local', elementType: 'labels', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'all', stylers: [{visibility: 'off'}]},
    {featureType: 'transit', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 19}]},
    {featureType: 'water', elementType: 'geometry', stylers: [{color: '#000000'}, {lightness: 17}]},
  ];

  function mapStyle(key) {
    return styles[key];
  }

  window.theme.allMaps = window.theme.allMaps || {};
  let allMaps = window.theme.allMaps;

  window.theme.mapAPI = window.theme.mapAPI || null;

  /* global google */

  class Map {
    constructor(section) {
      this.container = section.container;
      this.mapContainer = this.container.querySelector('[data-map-container]');
      this.key = this.container.getAttribute('data-api-key');
      this.styleString = this.container.getAttribute('data-style') || '';
      this.zoomString = this.container.getAttribute('data-zoom') || 14;
      this.address = this.container.getAttribute('data-address');
      this.enableCorrection = this.container.getAttribute('data-latlong-correction');
      this.lat = this.container.getAttribute('data-lat');
      this.long = this.container.getAttribute('data-long');

      if (this.key) {
        this.initMaps();
      }
    }

    initMaps() {
      const apiLoaded = loadAPI(this.key);
      apiLoaded
        .then(() => {
          return this.enableCorrection === 'true' && this.lat !== '' && this.long !== '' ? new google.maps.LatLng(this.lat, this.long) : geocodeAddressPromise(this.address);
        })
        .then((center) => {
          const zoom = parseInt(this.zoomString, 10);
          const styles = mapStyle(this.styleString);
          const mapOptions = {
            zoom,
            styles,
            center,
            draggable: true,
            clickableIcons: false,
            scrollwheel: false,
            zoomControl: false,
            disableDefaultUI: true,
          };
          const map = createMap(this.mapContainer, mapOptions);

          return map;
        })
        .then((map) => {
          this.map = map;
          allMaps[this.id] = map;
        })
        .catch((e) => {
          console.log('Failed to load Google Map');
          console.log(e);
        });
    }

    unload() {
      if (typeof window.google !== 'undefined') {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    }
  }

  const mapSection = {
    onLoad() {
      allMaps[this.id] = new Map(this);
    },
    onUnload() {
      if (typeof allMaps[this.id].unload === 'function') {
        allMaps[this.id].unload();
      }
    },
  };

  register('map', mapSection);

  function loadAPI(key) {
    if (window.theme.mapAPI === null) {
      const urlKey = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      window.theme.mapAPI = loadScript({url: urlKey});
    }
    return window.theme.mapAPI;
  }

  function createMap(container, options) {
    var map = new google.maps.Map(container, options);
    var center = map.getCenter();

    // eslint-disable-next-line no-unused-vars
    new google.maps.Marker({
      map: map,
      position: center,
    });

    google.maps.event.addDomListener(window, 'resize', function () {
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);
    });
    return map;
  }

  function geocodeAddressPromise(address) {
    return new Promise((resolve, reject) => {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({address: address}, function (results, status) {
        if (status == 'OK') {
          var latLong = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          resolve(latLong);
        } else {
          reject(status);
        }
      });
    });
  }

  register('search', [swatchGridSection, siblings]);

  const selectors$4 = {
    largePromo: '[data-large-promo]',
    largePromoInner: '[data-large-promo-inner]',
    trackingInner: '[data-tracking-consent-inner]',
    tracking: '[data-tracking-consent]',
    trackingAccept: '[data-confirm-cookies]',
    cartBar: 'cart-bar',
    close: '[data-close-modal]',
    modalUnderlay: '[data-modal-underlay]',

    newsletterPopup: '[data-newsletter]',
    newsletterPopupHolder: '[data-newsletter-holder]',
    newsletterClose: '[data-newsletter-close]',
    newsletterHeading: '[data-newsletter-heading]',
    newsletterField: '[data-newsletter-field]',
    promoPopup: '[data-promo-text]',
    newsletterForm: '[data-newsletter-form]',
    delayAttribite: 'data-popup-delay',
    cookieNameAttribute: 'data-cookie-name',
    dataTargetReferrer: 'data-target-referrer',
  };

  const classes$3 = {
    hidden: 'hidden',
    hasValue: 'has-value',
    cartBarVisible: 'cart-bar-visible',
    isVisible: 'is-visible',
    success: 'has-success',
    selected: 'selected',
    hasBlockSelected: 'has-block-selected',
    mobile: 'mobile',
    desktop: 'desktop',
    bottom: 'bottom',
  };

  const attributes$3 = {
    enable: 'data-enable',
  };

  let sections$3 = {};

  class DelayShow {
    constructor(holder, element, callback = null) {
      this.element = element;
      this.delay = holder.getAttribute(selectors$4.delayAttribite);
      this.isSubmitted = window.location.href.indexOf('accepts_marketing') !== -1 || window.location.href.indexOf('customer_posted=true') !== -1;
      this.callback = callback;
      this.showPopupOnScrollEvent = () => this.showPopupOnScroll();

      if (this.delay === 'always' || this.isSubmitted) {
        this.always();
      }

      if (this.delay && this.delay.includes('delayed') && !this.isSubmitted) {
        const seconds = this.delay.includes('_') ? parseInt(this.delay.split('_')[1]) : 10;
        this.delayed(seconds);
      }

      if (this.delay === 'bottom' && !this.isSubmitted) {
        this.bottom();
      }

      if (this.delay === 'idle' && !this.isSubmitted) {
        this.idle();
      }
    }

    always() {
      fadeIn(this.element, null, this.callback);
    }

    delayed(seconds = 10) {
      // Show popup after specific seconds
      setTimeout(() => {
        fadeIn(this.element, null, this.callback);
      }, seconds * 1000);
    }

    // Idle for 1 min
    idle() {
      let timer = 0;
      let idleTime = 60000;
      const documentEvents = ['mousemove', 'mousedown', 'click', 'touchmove', 'touchstart', 'touchend', 'keydown', 'keypress'];
      const windowEvents = ['load', 'resize', 'scroll'];

      const startTimer = () => {
        timer = setTimeout(() => {
          timer = 0;
          fadeIn(this.element, null, this.callback);
        }, idleTime);

        documentEvents.forEach((eventType) => {
          document.addEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.addEventListener(eventType, resetTimer);
        });
      };

      const resetTimer = () => {
        if (timer) {
          clearTimeout(timer);
        }

        documentEvents.forEach((eventType) => {
          document.removeEventListener(eventType, resetTimer);
        });

        windowEvents.forEach((eventType) => {
          window.removeEventListener(eventType, resetTimer);
        });

        startTimer();
      };

      startTimer();
    }

    // Scroll to the bottom of the page
    bottom() {
      document.addEventListener('theme:scroll', this.showPopupOnScrollEvent);
    }

    showPopupOnScroll() {
      if (window.scrollY + window.innerHeight >= document.body.clientHeight) {
        fadeIn(this.element, null, this.callback);
        document.removeEventListener('theme:scroll', this.showPopupOnScrollEvent);
      }
    }

    onUnload() {
      document.removeEventListener('theme:scroll', this.showPopupOnScrollEvent);
    }
  }

  class TargetReferrer {
    constructor(el) {
      this.el = el;
      this.locationPath = location.href;

      if (!this.el.hasAttribute(selectors$4.dataTargetReferrer)) {
        return false;
      }

      this.init();
    }

    init() {
      if (this.locationPath.indexOf(this.el.getAttribute(selectors$4.dataTargetReferrer)) === -1 && !window.Shopify.designMode) {
        this.el.parentNode.removeChild(this.el);
      }
    }
  }

  class LargePopup {
    constructor(el) {
      this.popup = el;
      this.modal = this.popup.querySelector(selectors$4.largePromoInner);
      this.close = this.popup.querySelector(selectors$4.close);
      this.underlay = this.popup.querySelector(selectors$4.modalUnderlay);
      this.form = this.popup.querySelector(selectors$4.newsletterForm);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors$4.cookieNameAttribute), 'user_has_closed');
      this.isTargeted = new TargetReferrer(this.popup);
      this.a11y = a11y;

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;
      const targetMobile = this.popup.classList.contains(classes$3.mobile);
      const targetDesktop = this.popup.classList.contains(classes$3.desktop);
      const isMobileView = !isDesktop();
      let targetMatches = true;

      if ((targetMobile && !isMobileView) || (targetDesktop && isMobileView)) {
        targetMatches = false;
      }

      if (!targetMatches) {
        this.scrollUnlock();
        return;
      }

      if (!cookieExists || window.Shopify.designMode) {
        if (!window.Shopify.designMode) {
          new DelayShow(this.popup, this.modal, () => this.scrollLock());
        }

        if (this.form && this.form.classList.contains(classes$3.success)) {
          this.checkForSuccess();
        }

        this.initClosers();
      }
    }

    checkForSuccess() {
      fadeIn(this.modal, null, () => this.scrollLock());
      this.cookie.write();
    }

    initClosers() {
      this.close.addEventListener('click', this.closeModal.bind(this));
      this.underlay.addEventListener('click', this.closeModal.bind(this));
    }

    closeModal(e) {
      e.preventDefault();
      fadeOut(this.modal);
      this.cookie.write();
      this.scrollUnlock();
    }

    scrollLock() {
      if (window.getComputedStyle(this.popup).display !== 'none') {
        this.a11y.trapFocus(this.modal);
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }
    }

    scrollUnlock() {
      this.a11y.removeTrapFocus();
      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.modal, null, () => this.scrollLock());
        this.popup.classList.add(classes$3.selected);
        this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modal);
        this.scrollUnlock();
        this.popup.classList.remove(classes$3.selected);
        this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
      }
    }
  }

  class Tracking {
    constructor(el) {
      this.popup = el;
      this.modal = document.querySelector(selectors$4.tracking);
      this.acceptButton = this.modal.querySelector(selectors$4.trackingAccept);
      this.enable = this.modal.getAttribute(attributes$3.enable) === 'true';
      this.showPopup = false;

      window.Shopify.loadFeatures(
        [
          {
            name: 'consent-tracking-api',
            version: '0.1',
          },
        ],
        (error) => {
          if (error) {
            throw error;
          }

          const userCanBeTracked = window.Shopify.customerPrivacy.userCanBeTracked();
          const userTrackingConsent = window.Shopify.customerPrivacy.getTrackingConsent();

          this.showPopup = !userCanBeTracked && userTrackingConsent === 'no_interaction' && this.enable;

          if (window.Shopify.designMode) {
            this.showPopup = true;
          }

          this.init();
        }
      );
    }

    init() {
      if (this.showPopup) {
        fadeIn(this.modal);
      }

      this.clickEvents();
    }

    clickEvents() {
      this.acceptButton.addEventListener('click', (event) => {
        event.preventDefault();

        window.Shopify.customerPrivacy.setTrackingConsent(true, () => fadeOut(this.modal));

        document.documentElement.style.setProperty('--cookie-bar-height', '0px');
      });

      document.addEventListener('trackingConsentAccepted', () => {
        // trackingConsentAccepted event fired
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target) && this.showPopup) {
        fadeIn(this.modal);
        this.popup.classList.add(classes$3.selected);
        this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.modal);
        this.popup.classList.remove(classes$3.selected);
        this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
      }
    }
  }

  class PromoText {
    constructor(el) {
      this.popup = el;
      this.close = this.popup.querySelector(selectors$4.close);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors$4.cookieNameAttribute), 'user_has_closed');
      this.isTargeted = new TargetReferrer(this.popup);

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;

      if (!cookieExists || window.Shopify.designMode) {
        if (!window.Shopify.designMode) {
          new DelayShow(this.popup, this.popup);
        } else {
          fadeIn(this.popup);
        }

        this.clickEvents();
      }
    }

    clickEvents() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.popup);
        this.cookie.write();
      });
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.popup);
        this.popup.classList.add(classes$3.selected);
        this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.popup);
        this.popup.classList.remove(classes$3.selected);
        this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
      }
    }
  }

  class NewsletterPopup {
    constructor(el) {
      this.popup = el;
      this.holder = this.popup.querySelector(selectors$4.newsletterPopupHolder);
      this.close = this.popup.querySelector(selectors$4.newsletterClose);
      this.heading = this.popup.querySelector(selectors$4.newsletterHeading);
      this.newsletterField = this.popup.querySelector(selectors$4.newsletterField);
      this.cookie = new PopupCookie(this.popup.getAttribute(selectors$4.cookieNameAttribute), 'newsletter_is_closed');
      this.form = this.popup.querySelector(selectors$4.newsletterForm);
      this.isTargeted = new TargetReferrer(this.popup);
      this.resetClassTimer = 0;

      this.init();
    }

    init() {
      const cookieExists = this.cookie.read() !== false;
      const submissionSuccess = window.location.search.indexOf('?customer_posted=true') !== -1;
      const classesString = [...this.holder.classList].toString();
      const isPositionBottom = classesString.includes(classes$3.bottom);

      if (submissionSuccess) {
        this.delay = 0;
      }

      if (!cookieExists || window.Shopify.designMode) {
        this.show();

        if (this.form.classList.contains(classes$3.success)) {
          this.checkForSuccess();
        }
      }

      if (isPositionBottom) {
        this.observeCartBar();
      }
    }

    show() {
      if (!window.Shopify.designMode) {
        new DelayShow(this.popup, this.holder);
      } else {
        fadeIn(this.holder);
      }

      this.showForm();
      this.inputField();
      this.closePopup();
    }

    checkForSuccess() {
      fadeIn(this.holder);
      this.cookie.write();
    }

    observeCartBar() {
      this.cartBar = document.getElementById(selectors$4.cartBar);

      if (!this.cartBar) return;

      const config = {attributes: true, childList: false, subtree: false};
      let isVisible = this.cartBar.classList.contains(classes$3.isVisible);
      document.body.classList.toggle(classes$3.cartBarVisible, isVisible);

      // Callback function to execute when mutations are observed
      const callback = (mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === 'attributes') {
            isVisible = mutation.target.classList.contains(classes$3.isVisible);
            document.body.classList.toggle(classes$3.cartBarVisible, isVisible);
          }
        }
      };

      this.observer = new MutationObserver(callback);
      this.observer.observe(this.cartBar, config);
    }

    showForm() {
      this.heading.addEventListener('click', (event) => {
        event.preventDefault();

        this.heading.classList.add(classes$3.hidden);
        this.form.classList.remove(classes$3.hidden);
        this.newsletterField.focus();
      });

      this.heading.addEventListener('keyup', (event) => {
        if (event.code === window.theme.keyboardKeys.ENTER) {
          this.heading.dispatchEvent(new Event('click'));
        }
      });
    }

    closePopup() {
      this.close.addEventListener('click', (event) => {
        event.preventDefault();

        fadeOut(this.holder);
        this.cookie.write();
      });
    }

    inputField() {
      const setClass = () => {
        // Reset timer if exists and is active
        if (this.resetClassTimer) {
          clearTimeout(this.resetClassTimer);
        }

        if (this.newsletterField.value !== '') {
          this.holder.classList.add(classes$3.hasValue);
        }
      };

      const unsetClass = () => {
        // Reset timer if exists and is active
        if (this.resetClassTimer) {
          clearTimeout(this.resetClassTimer);
        }

        // Reset class
        this.resetClassTimer = setTimeout(() => {
          this.holder.classList.remove(classes$3.hasValue);
        }, 2000);
      };

      this.newsletterField.addEventListener('input', setClass);
      this.newsletterField.addEventListener('focus', setClass);
      this.newsletterField.addEventListener('focusout', unsetClass);
    }

    onBlockSelect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeIn(this.holder);
        this.popup.classList.add(classes$3.selected);
        this.popup.parentNode.classList.add(classes$3.hasBlockSelected);
      }
    }

    onBlockDeselect(evt) {
      if (this.popup.contains(evt.target)) {
        fadeOut(this.holder);
        this.popup.classList.remove(classes$3.selected);
        this.popup.parentNode.classList.remove(classes$3.hasBlockSelected);
      }
    }

    onUnload() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  const popupSection = {
    onLoad() {
      sections$3[this.id] = [];

      const newsletters = this.container.querySelectorAll(selectors$4.largePromo);
      newsletters.forEach((el) => {
        sections$3[this.id].push(new LargePopup(el));
      });

      const tracking = this.container.querySelectorAll(selectors$4.tracking);
      tracking.forEach((el) => {
        sections$3[this.id].push(new Tracking(el));
      });

      const newsletterPopup = this.container.querySelectorAll(selectors$4.newsletterPopup);
      newsletterPopup.forEach((el) => {
        sections$3[this.id].push(new NewsletterPopup(el));
      });

      const promoPopup = this.container.querySelectorAll(selectors$4.promoPopup);
      promoPopup.forEach((el) => {
        sections$3[this.id].push(new PromoText(el));
      });
    },

    onBlockSelect(evt) {
      sections$3[this.id].forEach((el) => {
        if (typeof el.onBlockSelect === 'function') {
          el.onBlockSelect(evt);
        }
      });
    },
    onBlockDeselect(evt) {
      sections$3[this.id].forEach((el) => {
        if (typeof el.onBlockDeselect === 'function') {
          el.onBlockDeselect(evt);
        }
      });
    },
    onUnload() {
      sections$3[this.id].forEach((el) => {
        if (typeof el.onUnload === 'function') {
          el.onUnload();
        }
      });
    },
  };

  register('popups', [popupSection, newsletterCheckForResultSection]);

  const selectors$3 = {
    passwordLogin: '[data-password-login]',
    passwordModal: '[data-password-modal]',
    modalBody: '[data-modal-body]',
    close: '[data-modal-close]',
    loginErrors: '#login_form .errors',
  };

  const classes$2 = {
    open: 'is-open',
  };

  class Password {
    constructor(section) {
      this.container = section.container;
      this.passwordLogin = this.container.querySelectorAll(selectors$3.passwordLogin);
      this.modal = this.container.querySelector(selectors$3.passwordModal);
      this.modalBody = this.container.querySelector(selectors$3.modalBody);
      this.closeButtons = this.container.querySelectorAll(selectors$3.close);
      this.a11y = a11y;
      this.loginErrors = this.container.querySelector(selectors$3.loginErrors);
      this.init();
    }

    init() {
      if (this.passwordLogin.length && this.modal && this.modalBody) {
        this.passwordLogin.forEach((passwordLogin) => {
          passwordLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
          });
        });

        if (this.closeButtons.length) {
          this.closeButtons.forEach((closeButton) => {
            closeButton.addEventListener('click', (e) => {
              e.preventDefault();
              this.closeModal();
            });
          });
        }

        if (this.loginErrors) {
          this.openModal();
        }
      }
    }

    openModal() {
      fadeIn(this.modal, 'block', () => {
        this.modal.classList.add(classes$2.open);
      });
      this.scrollLock();
    }

    closeModal() {
      fadeOut(this.modal);
      this.modal.classList.remove(classes$2.open);
      this.scrollUnlock();
    }

    scrollLock() {
      if (window.getComputedStyle(this.modal).display !== 'none') {
        this.a11y.trapFocus(this.modal);
        document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true}));
      }
    }

    scrollUnlock() {
      this.a11y.removeTrapFocus();
      document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));
    }
  }

  const passwordSection = {
    onLoad() {
      new Password(this);
    },
  };

  register('password-template', passwordSection);

  register('supporting-menu', [popoutSection]);

  register('list-collections', [slider, swatchGridSection, blockScroll, siblings]);

  register('columns', [blockScroll, slider]);

  register('newsletter', newsletterCheckForResultSection);

  register('before-after', [compareImages]);

  const selectors$2 = {
    scrollToElement: '[data-scroll-to]',
    tooltip: '[data-tooltip]',
    collapsibleTrigger: '[data-collapsible-trigger]',
  };

  const attributes$2 = {
    open: 'open',
    dataScrollTo: 'data-scroll-to',
    tooltipStopMousenterValue: 'data-tooltip-stop-mouseenter',
  };

  const sections$2 = {};

  class ScrollToElement {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.scrollToButtons = this.container.querySelectorAll(selectors$2.scrollToElement);

      if (this.scrollToButtons.length) {
        this.init();
      }
    }

    init() {
      this.scrollToButtons.forEach((element) => {
        element.addEventListener('click', () => {
          const target = this.container.querySelector(element.getAttribute(attributes$2.dataScrollTo));

          if (!target || element.tagName === 'A') return;

          this.scrollToElement(target);
        });
      });
    }

    scrollToElement(element) {
      scrollTo(element.getBoundingClientRect().top + 1);

      const collapsibleElement = element.nextElementSibling.matches('details') ? element.nextElementSibling : null;

      if (collapsibleElement) {
        const collapsibleTrigger = collapsibleElement?.querySelector(selectors$2.collapsibleTrigger);
        const isOpen = collapsibleElement.hasAttribute(attributes$2.open);

        if (!isOpen) {
          collapsibleTrigger?.dispatchEvent(new Event('click'));
        }
      }

      const tooltips = document.querySelectorAll(`${selectors$2.tooltip}:not([${attributes$2.tooltipStopMousenterValue}])`);
      if (tooltips.length) {
        tooltips.forEach((tooltip) => {
          tooltip.setAttribute(attributes$2.tooltipStopMousenterValue, '');

          setTimeout(() => {
            tooltip.removeAttribute(attributes$2.tooltipStopMousenterValue);
          }, 1000);
        });
      }
    }
  }

  const scrollToElement = {
    onLoad() {
      sections$2[this.id] = new ScrollToElement(this);
    },
  };

  const selectors$1 = {
    scrollSpy: '[data-scroll-spy]',
    headerSticky: '[data-header-sticky]',
  };

  const classes$1 = {
    selected: 'is-selected',
  };

  const attributes$1 = {
    scrollSpy: 'data-scroll-spy',
    mobile: 'data-scroll-spy-mobile',
    desktop: 'data-scroll-spy-desktop',
  };

  const sections$1 = {};

  class ScrollSpy {
    constructor(section) {
      this.section = section;
      this.container = section.container;
      this.scrollSpyAnchors = this.container.querySelectorAll(selectors$1.scrollSpy);
      this.loopAnchors = this.loopAnchors.bind(this);
      this.observers = [];

      this.init();
    }

    init() {
      this.loopAnchors();
      document.addEventListener('theme:resize:width', this.loopAnchors);
    }

    loopAnchors() {
      if (!this.scrollSpyAnchors.length) return;

      this.scrollSpyAnchors.forEach((anchor) => {
        this.toggleObserver(anchor);
      });
    }

    toggleObserver(anchor) {
      const anchorSpy = this.container.querySelector(anchor.getAttribute(attributes$1.scrollSpy));

      if (!anchorSpy) return;

      // Stop observer to prevent running it multuple times
      if (this.observers[anchorSpy.id]) {
        this.observers[anchorSpy.id].unobserve(anchorSpy);
      }

      const isDesktopView = isDesktop();
      const isEligible =
        (!isDesktopView && anchor.hasAttribute(attributes$1.mobile)) ||
        (isDesktopView && anchor.hasAttribute(attributes$1.desktop)) ||
        (!anchor.hasAttribute(attributes$1.desktop) && !anchor.hasAttribute(attributes$1.mobile));

      if (isEligible) {
        this.runObserver(anchorSpy);
      }
    }

    runObserver(anchorSpy) {
      let {menuHeight} = readHeights();
      const stickyHeader = Boolean(document.querySelector(selectors$1.headerSticky));
      const headerHeight = stickyHeader ? menuHeight : 0;
      const rootMargin = stickyHeader ? headerHeight * -1 + 'px 0px 0px 0px' : '0px';

      const options = {
        rootMargin: rootMargin,
        threshold: [0.5, 1],
      };

      this.observers[anchorSpy.id] = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const anchorOld = this.container.querySelector(`[${attributes$1.scrollSpy}].${classes$1.selected}`);
          const anchorNew = this.container.querySelector(`[${attributes$1.scrollSpy}="#${entry.target.id}"]`);

          if (entry.intersectionRatio > 0.5 && entry.boundingClientRect.top - headerHeight <= entry.boundingClientRect.height) {
            anchorOld?.classList.remove(classes$1.selected);
            anchorNew?.classList.add(classes$1.selected);
          }
        });
      }, options);
      this.observers[anchorSpy.id].observe(anchorSpy);
    }

    onUnload() {
      document.removeEventListener('theme:resize:width', this.loopAnchors);

      if (this.observers.length) {
        this.observers.forEach((observer) => {
          observer.disconnect();
        });
      }
    }
  }

  const scrollSpy = {
    onLoad() {
      sections$1[this.id] = new ScrollSpy(this);
    },
    onUnload() {
      sections$1[this.id].onUnload();
    },
  };

  register('sidebar', [scrollToElement, scrollSpy]);

  const selectors = {
    button: '[data-hover-target]',
    image: '[data-collection-image]',
  };

  const attributes = {
    target: 'data-hover-target',
  };

  const classes = {
    visible: 'is-visible',
    selected: 'is-selected',
  };

  let sections = {};

  class CollectionsHover {
    constructor(section) {
      this.container = section.container;
      this.buttons = this.container.querySelectorAll(selectors.button);

      this.init();
    }

    init() {
      if (this.buttons.length) {
        this.buttons.forEach((button) => {
          button.addEventListener('mouseenter', (e) => {
            const targetId = e.currentTarget.getAttribute(attributes.target);

            this.updateState(targetId);
          });
        });
      }
    }

    updateState(targetId) {
      const button = this.container.querySelector(`[${attributes.target}="${targetId}"]`);
      const target = this.container.querySelector(`#${targetId}:not(.${classes.visible})`);
      const buttonSelected = this.container.querySelector(`${selectors.button}.${classes.selected}`);
      const imageVisible = this.container.querySelector(`${selectors.image}.${classes.visible}`);

      if (target && isDesktop()) {
        imageVisible?.classList.remove(classes.visible);
        buttonSelected?.classList.remove(classes.selected);

        target.classList.add(classes.visible);
        button.classList.add(classes.selected);
      }
    }

    onBlockSelect(e) {
      this.updateState(e.target.id);
    }
  }

  const collectionsHover = {
    onLoad() {
      sections[this.id] = new CollectionsHover(this);
    },
    onBlockSelect(e) {
      sections[this.id].onBlockSelect(e);
    },
  };

  register('collections-hover', [collectionsHover, scrollSpy]);

  document.addEventListener('DOMContentLoaded', function () {
    // Load all registered sections on the page.
    load('*');

    // Scroll to top button
    const scrollTopButton = document.querySelector('[data-scroll-top-button]');
    if (scrollTopButton) {
      scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
      document.addEventListener('theme:scroll', () => {
        scrollTopButton.classList.toggle('is-visible', window.pageYOffset > window.innerHeight);
      });
    }

    if (window.self !== window.top) {
      document.querySelector('html').classList.add('iframe');
    }

    // Safari smoothscroll polyfill
    let hasNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    if (!hasNativeSmoothScroll) {
      loadScript({url: window.theme.assets.smoothscroll});
    }
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (window.navigator.cookieEnabled) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }

})(themeVendor.ScrollLock, themeVendor.themeAddresses, themeVendor.themeCurrency, themeVendor.Rellax, themeVendor.Flickity, themeVendor.FlickityFade, themeVendor.themeImages);
