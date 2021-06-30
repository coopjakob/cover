function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function () {
  var selector = '.Notice.Notice--info.Notice--animated.Notice--center';
  var content = 'Nu visas varor för: Hemleverans i StockholmÄndra';
  var element = document.querySelector(selector);

  var hasCorrectContent = function hasCorrectContent(element) {
    if ((element === null || element === void 0 ? void 0 : element.textContent) == content) {
      return true;
    }

    return false;
  };

  var addIdentifierClasses = function addIdentifierClasses(element) {
    element.classList.add('Experiment', 'T35', 'variant1-delete');
  };

  if (hasCorrectContent(element)) {
    addIdentifierClasses(element);
  } else {
    waitFor(selector, '.Main', function (element) {
      if (hasCorrectContent(element)) {
        addIdentifierClasses(element);
      }
    });
  }

  function waitFor(selector, element, callback) {
    if (!element.tagName) {
      element = document.querySelector(element);
    }

    var observer = new MutationObserver(function (mutations) {
      var _iterator = _createForOfIteratorHelper(mutations),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var addedNodes = _step.value.addedNodes;

          var _iterator2 = _createForOfIteratorHelper(addedNodes),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var node = _step2.value;

              if (!node.tagName) {
                continue;
              }

              if (node.matches(selector)) {
                observer.disconnect();
                callback(node);
              } else if (node.querySelector(selector)) {
                observer.disconnect();
                callback(node.querySelector(selector));
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    observer.observe(element, {
      childList: true,
      subtree: true
    });
  }
})();