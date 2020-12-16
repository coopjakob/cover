function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var drawerObserver = new MutationObserver(function (mutationsList) {
  var _iterator = _createForOfIteratorHelper(mutationsList),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var mutation = _step.value;

      // console.debug('mutation', mutation);
      var _iterator2 = _createForOfIteratorHelper(mutation.addedNodes),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var addedNode = _step2.value;

          //   console.log('addedNode', addedNode);
          try {
            if (addedNode.querySelector('h2').innerText == 'Varukorg') {
              (function () {
                var header = document.querySelector('.Cart-header.Cart-headerInfo');
                header.style.paddingBottom = 0;
                var clickLink = header.querySelector('.Link');

                if (clickLink.innerText == 'Hemleverans') {
                  clickLink = header.querySelectorAll('.Link')[1];
                }

                var buyButton = document.createElement('button');
                buyButton.setAttribute('type', 'button');
                buyButton.classList.add('Button', 'Button--green', 'Button--small', 'Button--radius');
                buyButton.style.marginTop = '8px';
                buyButton.style.marginBottom = '12px';
                buyButton.innerText = 'Ändra leveranssätt';
                buyButton.addEventListener('click', function () {
                  clickLink.click();
                  console.log('click()', clickLink);
                });
                header.appendChild(buyButton);
              })();
            }
          } catch (error) {}
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
drawerObserver.observe(document.querySelector('#portal'), {
  attributes: false,
  childList: true,
  subtree: true
});