function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var queries = new URLSearchParams(location.search);

if (queries.get('variant') == '2') {
  var element = document.querySelector('[data-test=mobileCategoryTrigger]');

  if (element) {
    run();
  } else {
    var observer = new MutationObserver(function (mutationsList) {
      var _iterator = _createForOfIteratorHelper(mutationsList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mutation = _step.value;

          if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].querySelector('[data-test=mobileCategoryTrigger]')) {
            run();
            observer.disconnect();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    var wrapper = document.querySelector('[data-react-component=EcommerceExtendedHeader]');
    observer.observe(wrapper, {
      childList: true
    });
  }

  function run() {
    var sidebarTriggerBarIcon = document.querySelector('.js-sidebarTrigger .Bar-icon');

    if (sidebarTriggerBarIcon) {
      sidebarTriggerBarIcon.style.width = '18px';
      sidebarTriggerBarIcon.style.height = '18px';
      sidebarTriggerBarIcon.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M2.391 9.912a4.015 4.015 0 011.343-1.444 4.014 4.014 0 011.759-.89 1.344 1.344 0 011.539.915s2.242 4.96 3.006 7.291a.674.674 0 01-1.015.764c-2.028-1.38-6.174-4.909-6.174-4.909a1.347 1.347 0 01-.458-1.727z" stroke="#005537" stroke-width=".871" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.734 8.467L2.511 6.842M3.004 9.073L.977 8.418M4.52 7.933l-.07-2.13M7.034 8.497L5.211 9.87M8.958 12.952l-1.45 1.09M6.157 11.687l-1.716 1.29" stroke="#005537" stroke-width=".871" stroke-linecap="round" stroke-linejoin="round"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.368 2.306a.87.87 0 00-.871-.87H9.27a.871.871 0 00-.87.87v1.742h6.967V2.306z" stroke="#005537" stroke-width=".871" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.11 6.806h3.484M14.497 6.806h1.161M7.058 5.94l1.47-1.892h6.968" stroke="#005537" stroke-width=".871" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.937 15.371l.108-8.504c0-.135.032-.269.092-.39l1.65-2.429h.704l1.638 2.43V15.37c-.013.29-.238.87-1.035.87h-4.21c.929 0 1.053-.58 1.053-.87zm0 0c0 .065.008.129.021.19l-.02-.19zm0 0l.021.19-.02-.19zm.021.19c.01.04.02.079.035.116l-.035-.116zm0 0l.035.116-.035-.116zm.035.116c.015.04.032.078.052.114l-.052-.114zm0 0l.052.114-.052-.114zm.052.114a.87.87 0 00.083.124l-.083-.124zm0 0l.083.124-.083-.124zm.083.124a.884.884 0 00.113.117l-.113-.117zm0 0l.113.117-.113-.117zm.113.117a.89.89 0 00.114.083l-.114-.083zm0 0l.114.083-.114-.083zm.114.083a.87.87 0 00.148.072l-.148-.072zm0 0l.148.072-.148-.072zm.148.072a.86.86 0 00.142.04l-.142-.04z" stroke="#005537" stroke-width=".871" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  }
} else {
  var _element = document.querySelector('[data-test=mobileCategoryTrigger]');

  if (_element) {
    run();
  } else {
    var _wrapper = document.querySelector('[data-react-component=EcommerceExtendedHeader]');

    var _observer = new MutationObserver(function (mutationsList) {
      var _iterator2 = _createForOfIteratorHelper(mutationsList),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var mutation = _step2.value;

          if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].querySelector('[data-test=mobileCategoryTrigger]')) {
            run();

            _observer.disconnect();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    });

    _observer.observe(_wrapper, {
      attributes: false,
      childList: true
    });
  }

  function run() {
    var sidebarTriggerBarIcon = document.querySelector('.js-sidebarTrigger .Bar-icon');

    if (sidebarTriggerBarIcon) {
      sidebarTriggerBarIcon.style.width = '18px';
      sidebarTriggerBarIcon.style.height = '18px';
      sidebarTriggerBarIcon.innerHTML = '<path stroke="#005537" stroke-linecap="round" stroke-linejoin="round" d="M5.5 15.5h11M5.5 9.5h11M5.5 3.5h11"/><circle cx="1.5" cy="15.5" r="1" fill="#005537"/><circle cx="1.5" cy="9.5" r="1" fill="#005537"/><circle cx="1.5" cy="3.5" r="1" fill="#005537"/>';
    }
  }
}