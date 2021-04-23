function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var search = document.querySelector('.Search');
search.addEventListener('click', run);
var searchInput = search.querySelector('.Search-input');
searchInput.addEventListener('change', run);
searchInput.addEventListener('input', run);

function run() {
  if (!document.querySelector('.experiment.t45')) {
    var modal = document.createElement('div');
    modal.classList.add('experiment', 't45', 'Modal', 'is-visible');
    modal.style.zIndex = '9';
    var modalOverlay = document.createElement('div');
    modalOverlay.classList.add('Modal-overlay');
    modal.appendChild(modalOverlay);
    document.body.appendChild(modal);

    function experimentClose() {
      modal.remove();
      observer.disconnect();
    }

    searchInput.addEventListener('blur', experimentClose);
    window.addEventListener('ga:virtualPageView', experimentClose);
    modal.addEventListener('click', function () {
      experimentClose();
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'blackoutsearch-blackclick',
        eventLabel: ''
      });
    });
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
              if (!node.tagName) continue;

              if (node.classList.contains('Search-clear')) {
                node.addEventListener('click', function () {
                  setTimeout(function () {
                    experimentClose();
                  }, 50);
                });
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
    var wrapper = document.querySelector('.Search-content');
    observer.observe(wrapper, {
      childList: true,
      subtree: false
    });
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        experimentClose();
      }
    });
  }
}

run();