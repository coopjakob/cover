function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

document.querySelector('.Search-input').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    console.debug('<experiment> enterkey');
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'search-enterkey',
      eventLabel: ''
    });
  }
});

function containClassInNodes(nodes, containClass) {
  var foundNode = false;

  var _iterator = _createForOfIteratorHelper(nodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var node = _step.value;

      if (node.childNodes) {
        // console.debug('<experiment> child exist');
        foundNode = containClassInNodes(node.childNodes, containClass);
      } // console.debug('<experiment> node', node);


      if (!node.tagName) continue;

      if (node.classList.contains(containClass)) {
        console.debug('<experiment> see ', containClass);
        foundNode = node;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return foundNode;
}

var observer = new MutationObserver(function (mutations) {
  // console.debug('<experiment> change detected');
  var _iterator2 = _createForOfIteratorHelper(mutations),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var addedNodes = _step2.value.addedNodes;

      // console.debug('<experiment> added node', addedNodes);
      if (containClassInNodes(addedNodes, 'ProductSearch-footer')) {
        console.debug('return true');
        var element = document.querySelector('.ProductSearch-footer button');
        console.debug('<experiment> see resultslink');
        element.addEventListener('click', function () {
          console.debug('<experiment> click resultslink');
          dataLayer.push({
            event: 'interaction',
            eventCategory: 'Experiment',
            eventAction: 'search-resultslink',
            eventLabel: ''
          });
        });
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
});
var wrapper = document.querySelector('.Search');
console.debug('<experiment> observing search results');
observer.observe(wrapper, {
  childList: true,
  subtree: false
});