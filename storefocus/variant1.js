var _document$querySelect, _document$querySelect2;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var itemsInCart = (_document$querySelect = document.querySelector('.CartButton .Badge')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent;
var isStoreSet = !!((_document$querySelect2 = document.querySelector('.TimeslotPreview-info')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.textContent);

if (!isStoreSet) {}

var portalObserver = new MutationObserver(function (mutations) {
  var _iterator = _createForOfIteratorHelper(mutations),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var addedNodes = _step.value.addedNodes;

      if (containClassInNodes(addedNodes, 'FlyIn-header')) {
        portalObserver.disconnect();
        run();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
});

if (isStoreSet) {
  window.addEventListener('ga:modifyCart', function () {
    run();
  });
} else {
  portalObserver.observe(document.getElementById('portal'), {
    childList: true,
    subtree: true
  });
}

var modalContainer;

function run() {
  if (isStoreSet) {
    document.querySelector('.CartButton').click();
  }

  modalContainer = document.querySelector('#portal .Modal-container');

  if (isStoreSet) {
    var modalContainerObserver = new MutationObserver(function (mutations) {
      var _iterator2 = _createForOfIteratorHelper(mutations),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var addedNodes = _step2.value.addedNodes;

          if (containClassInNodes(addedNodes, 'Cart-header')) {
            modalContainerObserver.disconnect();
            getVariables();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    });
    modalContainerObserver.observe(modalContainer, {
      childList: true,
      subtree: true
    });
  } else {
    createBox();
  }

  var modal = document.querySelector('#portal .Modal.Modal--right');
  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');
}

function containClassInNodes(nodes, containClass) {
  var foundNode = false;

  var _iterator3 = _createForOfIteratorHelper(nodes),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var node = _step3.value;

      if (node.childNodes) {
        foundNode = containClassInNodes(node.childNodes, containClass);
      }

      if (!node.tagName) continue;

      if (node.classList.contains(containClass)) {
        foundNode = node;
        break;
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return foundNode;
}

var deliverymethod;
var postalcode;
var storename;

function getVariables() {
  var _document$querySelect3, _document$querySelect4, _document$querySelect5;

  deliverymethod = (_document$querySelect3 = document.querySelector('[data-test=cncheader-changedeliverymethod]')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.textContent;
  postalcode = (_document$querySelect4 = document.querySelector('[data-test=changePostalCode]')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.textContent;
  storename = (_document$querySelect5 = document.querySelector('[data-test=pickupStoreLink]')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.textContent;
  createBox();
}

function createBox() {
  var questionbox = document.createElement('div');
  questionbox.classList.add('u-flex', 'u-flexDirectionColumn', 'u-bgWhite', 'u-sizeFull', 'u-sm-size540');
  questionbox.style.position = 'absolute';
  var containerDiv = modalContainer.querySelector('div');

  if (deliverymethod) {
    questionbox.innerText = "Ditt val fr\xE5n tidigare k\xF6p \xE4r ".concat(deliverymethod);
    var okbutton = document.createElement('button');
    okbutton.innerText = 'Jag vill ändra';
    okbutton.addEventListener('click', function () {
      document.querySelector('[data-test=cncheader-chagedeliverymethodbutton]').click();
      questionbox.remove();
      containerDiv.classList.add('u-flex');
      containerDiv.classList.remove('u-hidden');
    });
    questionbox.append(okbutton);
    var cancelbutton = document.createElement('button');
    cancelbutton.innerText = 'Fortsätt handla';
    cancelbutton.addEventListener('click', function () {
      document.querySelector('.FlyIn-close').click();
      questionbox.remove();
    });
    questionbox.append(cancelbutton);
  } else {
    questionbox.innerText = 'Välkommen!';
  }

  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');
  modalContainer.prepend(questionbox);
}