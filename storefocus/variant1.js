var _document$querySelect;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var itemsInCart = (_document$querySelect = document.querySelector('.CartButton .Badge')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent;

if (itemsInCart === '0') {
  window.addEventListener('ga:modifyCart', function () {
    run();
  }, {
    once: true
  });
}

var modalContainer;

function run() {
  document.querySelector('.CartButton').click();
  var modal = document.querySelector('#portal .Modal.Modal--right');
  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');
  modalContainer = document.querySelector('#portal .Modal-container');
  modalContainerObserver.observe(modalContainer, {
    childList: true,
    subtree: true
  });
}

function containClassInNodes(nodes, containClass) {
  var foundNode = false;

  var _iterator = _createForOfIteratorHelper(nodes),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var node = _step.value;

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
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return foundNode;
}

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
var deliverymethod;
var postalcode;
var storename;

function getVariables() {
  var _document$querySelect2, _document$querySelect3, _document$querySelect4;

  deliverymethod = (_document$querySelect2 = document.querySelector('[data-test=cncheader-changedeliverymethod]')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.textContent;
  postalcode = (_document$querySelect3 = document.querySelector('[data-test=changePostalCode]')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.textContent;
  storename = (_document$querySelect4 = document.querySelector('[data-test=pickupStoreLink]')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.textContent;
  createBox();
}

function createBox() {
  var questionbox = document.createElement('div');
  questionbox.classList.add('u-flex', 'u-flexDirectionColumn', 'u-bgWhite', 'u-sizeFull', 'u-sm-size540');
  questionbox.style.position = 'absolute';
  questionbox.innerText = "Ditt val fr\xE5n tidigare k\xF6p \xE4r ".concat(deliverymethod);
  var okbutton = document.createElement('button');
  okbutton.innerText = 'Jag vill ändra';
  okbutton.addEventListener('click', function () {
    document.querySelector('[data-test=cncheader-chagedeliverymethodbutton]').click();
    questionbox.remove();
    modalContainer.querySelector('div').style.visibility = 'unset';
  });
  questionbox.append(okbutton);
  var cancelbutton = document.createElement('button');
  cancelbutton.innerText = 'Fortsätt handla';
  cancelbutton.addEventListener('click', function () {
    document.querySelector('.FlyIn-close').click();
    questionbox.remove();
  });
  questionbox.append(cancelbutton);
  modalContainer.querySelector('div').style.visibility = 'hidden';
  modalContainer.prepend(questionbox);
}