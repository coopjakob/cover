function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var modalRightElement = document.querySelector('.Modal.Modal--right:not(.js-flyInProfile)');
var modalRightObserver = new MutationObserver(function (mutationsList) {
  var _iterator = _createForOfIteratorHelper(mutationsList),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mutation = _step.value;

      if (mutation.addedNodes.length > 0 && document.querySelector('.MiniCartManager .Cart.Cart--mini:not(.u-hidden):not(.js-miniCart)')) {
        if (document.querySelector('.MiniCartManager .Cart.Cart--mini:not(.u-hidden) .Cart-header.Cart-headerInfo h2').textContent == 'Ange postnummer' || document.querySelector('.MiniCartManager .Cart.Cart--mini:not(.u-hidden) .Cart-header.Cart-headerInfo h2').textContent == 'Välj butik') {
          modalRightObserver.disconnect();
          console.debug('<experiment> activate nohurray');
          dataLayer.push({
            event: 'optimize.activate.nohurray'
          });
          ga('send', {
            hitType: 'event',
            eventCategory: 'Experiment',
            eventAction: 'activate-nohurray',
            eventLabel: '',
            nonInteraction: true
          });
          break;
        } else {
          console.debug("<experiment> Don't activate nohurray yet");
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});
modalRightObserver.observe(modalRightElement, {
  attributes: false,
  childList: true,
  subtree: true
});