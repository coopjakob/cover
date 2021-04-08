function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var element = document.querySelector('[data-test=mobileCategoryTrigger]');

if (element) {
  run();
} else {
  var wrapper = document.getElementById('ecommerceHeader');
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
  observer.observe(wrapper, {
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