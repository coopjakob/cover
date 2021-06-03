var _document$querySelect;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isStoreSet = !!((_document$querySelect = document.querySelector('.TimeslotPreview-info')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent);
var isPhone = window.innerWidth < 600;
var modalContainer;

if (isStoreSet) {
  run();
} else {
  if (document.getElementById('portal')) {
    run();
  } else {
    var portalObserver = new MutationObserver(function (mutations) {
      portalObserver.disconnect();
      run();
    });
    portalObserver.observe(document.getElementById('portal'), {
      childList: true,
      subtree: false
    });
  }
}

function run() {
  if (isStoreSet) {
    waitForModal();
  } else {
    centerModal();
    waitFor('FlyIn-header', '#portal', function () {
      remake();
    });
  }
}

function centerModal() {
  if (!isPhone) {
    var modal = document.querySelector('#portal .Modal.Modal--right');
    modal.classList.add('u-hidden');
    modal.classList.remove('Modal--right');
    modal.classList.add('Modal--center');
    setTimeout(function () {
      modal.classList.remove('u-hidden');
    }, 500);
    document.querySelector('#portal .Modal-overlay').addEventListener('click', function (event) {
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'storefocus-blackclick',
        eventLabel: ''
      });
    });
  }
}

function waitForModal() {
  document.querySelector('.CartButton').click();
  centerModal();
  modalContainer = document.querySelector('#portal .Modal-container');
  var modalContainerObserver = new MutationObserver(function (mutations) {
    var _iterator = _createForOfIteratorHelper(mutations),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var addedNodes = _step.value.addedNodes;

        if (containClassInNodes(addedNodes, 'Cart-header')) {
          modalContainerObserver.disconnect();
          getVariables();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  modalContainerObserver.observe(modalContainer, {
    childList: true,
    subtree: true
  });
}

function containClassInNodes(nodes, containClass) {
  var foundNode = false;

  var _iterator2 = _createForOfIteratorHelper(nodes),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var node = _step2.value;

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
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  return foundNode;
}

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

var isLoggedIn = coopUserSettings.isAuthenticated;

function remake() {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'storefocus-welcome',
    eventLabel: ''
  });
  document.querySelector('.FlyIn-close').classList.add('u-hidden');
  document.querySelector('.FlyIn-scroll').prepend(imageLaptop);
  document.querySelector('.FlyIn-header .Heading').innerHTML = 'Välkommen till<br>vår butik online!';
  document.querySelector('.FlyIn-scroll p').innerHTML = 'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';
  setTimeout(function () {
    document.querySelector('.FlyIn-scroll input').focus();
  }, 1000);
  document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display = 'none';
  document.querySelector('.FlyIn-scroll > div:last-of-type').style.display = 'none';
  setStyling(document.querySelector('#portal .Modal-container > div'));
  waitFor('Heading--h2', '#portal .Modal-container > div', function () {
    setDeliveryStyle();
  });
  waitFor('Cart', '#portal .Modal-container > div', function () {
    var _document$querySelect5;

    (_document$querySelect5 = document.querySelector('.FlyIn-close')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.click();
  });
}

function setStyling(element) {
  element.style.height = 'auto';
  element.style.padding = '21px 15px 42px 15px';

  if (!isPhone) {
    element.style.borderRadius = '20px';
    element.classList.remove('u-heightAll');
  }

  var h2 = element.querySelector('h2');

  if (h2) {
    h2.style.fontSize = '34px';
    h2.style.fontFamily = 'CoopNew-Black, sans-serif';
  }

  element.querySelectorAll('strong').forEach(function (element) {
    element.style.color = '#008844';
  });
}

function setDeliveryStyle() {
  if (!isPhone) {
    document.querySelector('#portal .Modal-container > div').classList.add('u-heightAll');
    document.querySelector('#portal .Modal-container').style.padding = '20px';
    document.querySelector('#portal .Modal-container > div').style.position = 'relative';
  }

  document.querySelector('.FlyIn-back').classList.remove('u-hidden');
  document.querySelector('.FlyIn-close').classList.add('u-hidden');
  document.querySelector('.FlyIn-back').addEventListener('click', function () {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-back',
      eventLabel: ''
    });
  });
}

var imageLaptop = document.createElement('img');
imageLaptop.style.margin = '0 auto';
imageLaptop.style.display = 'block';
imageLaptop.style.height = '242px';
imageLaptop.src = 'https://www.coop.se/assets/icons/computer.svg';

var imageSigns = document.createElement('img');
imageSigns.style.margin = '0 auto';
imageSigns.style.display = 'block';
imageSigns.style.height = '233px';
imageSigns.src = 'https://res.cloudinary.com/coopjakob/image/upload/v1622715712/T55/postnum_ct5pko.svg';

function createBox() {
  var questionbox = document.createElement('div');
  questionbox.classList.add('u-flex', 'u-flexDirectionColumn', 'u-bgWhite', 'u-sizeFull', 'u-sm-size540');

  if (isPhone) {
    questionbox.classList.add('u-heightAll');
  }

  questionbox.style.position = 'absolute';
  var containerDiv = modalContainer.querySelector('div');
  questionbox.append(imageLaptop);
  var h2 = document.createElement('h2');
  h2.innerText = 'Dina senaste val';
  h2.style.marginBottom = '0';
  questionbox.append(h2);
  var p = document.createElement('p');

  if (postalcode) {
    p.innerHTML = "<strong>".concat(deliverymethod, "</strong> till <strong>").concat(postalcode, "<strong>");
  } else {
    p.innerHTML = "<strong>".concat(deliverymethod, "</strong> p\xE5 <strong>").concat(storename, "</strong>");
  }

  questionbox.append(p);
  var question = document.createElement('p');
  question.innerText = 'Stämmer dina val fortfarande?';
  questionbox.append(question);
  var closebutton = document.createElement('button');
  closebutton.classList.add('Button', 'Button--green', 'Button--radius', 'u-marginBsm');

  if (isPhone) {
    closebutton.style.width = '100%';
  } else {
    closebutton.style.width = '280px';
  }

  closebutton.style.margin = '0 auto';
  closebutton.innerText = 'Ja, fortsätt handla';
  closebutton.addEventListener('click', function () {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-close',
      eventLabel: ''
    });
    document.querySelector('.FlyIn-close').classList.remove('u-hidden');
    document.querySelector('.FlyIn-close').click();
    questionbox.remove();
  });
  questionbox.append(closebutton);
  var changebutton = document.createElement('button');
  changebutton.classList.add('Button', 'Button--transparentGreen', 'Button--radius');

  if (isPhone) {
    changebutton.style.width = '100%';
  } else {
    changebutton.style.width = '280px';
  }

  changebutton.style.margin = '0 auto';
  changebutton.innerText = 'Nej, jag vill ändra mina val';
  changebutton.addEventListener('click', function () {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-change',
      eventLabel: ''
    });

    if (!isPhone) {
      document.querySelector('#portal .Modal-container > div').classList.add('u-heightAll');
    }

    document.querySelector('[data-test=cncheader-chagedeliverymethodbutton]').click();
    questionbox.remove();
    containerDiv.classList.add('u-flex');
    containerDiv.classList.remove('u-hidden');
    setStyling(document.querySelector('#portal .Modal-container > div'));
    document.querySelector('.FlyIn-back').classList.add('u-hidden');
    document.querySelector('.FlyIn-close').classList.add('u-hidden');
    waitFor('Heading--h2', '#portal .Modal-container > div', function () {
      setDeliveryStyle();
    });
    document.querySelector('.FlyIn-scroll').prepend(imageSigns);
    document.querySelector('.FlyIn-header .Heading').innerHTML = 'Ändra dina val';
    document.querySelector('.FlyIn-scroll p').innerHTML = 'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';
    document.querySelector('.FlyIn-scroll input').focus();
    document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display = 'none';
    document.querySelector('.FlyIn-scroll > div:last-of-type').style.display = 'none';
    waitFor('List', '.FlyIn-scroll', function () {
      document.querySelector('.FlyIn-scroll h4').style.display = 'none';
      document.querySelector('.FlyIn-scroll ul').style.display = 'none';
    });
    waitFor('Cart', '#portal .Modal-container > div', function () {
      var _document$querySelect6;

      (_document$querySelect6 = document.querySelector('.FlyIn-close')) === null || _document$querySelect6 === void 0 ? void 0 : _document$querySelect6.click();
    });
  });
  questionbox.append(changebutton);
  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');
  questionbox.style.textAlign = 'center';
  setStyling(questionbox);
  modalContainer.prepend(questionbox);
}

function waitFor(className, element, callback) {
  if (!element) {
    element = 'body';
  }

  if (!element.tagName) {
    element = document.querySelector(element);
  }

  var observer = new MutationObserver(function (mutations) {
    var _iterator3 = _createForOfIteratorHelper(mutations),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var addedNodes = _step3.value.addedNodes;

        if (containClassInNodes(addedNodes, className)) {
          observer.disconnect();
          callback();
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  });
  observer.observe(element, {
    childList: true,
    subtree: true
  });
}