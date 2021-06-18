var _document$querySelect;

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var isStoreSet = !!((_document$querySelect = document.querySelector('.TimeslotPreview-info')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.textContent);
var isPhone = window.innerWidth < 600;

function pushEvent(action) {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'storefocus-' + action,
    eventLabel: ''
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

waitFor('.Modal-overlay', '#portal', function (element) {
  if (!isPhone) {
    var overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.height = '100%';
    overlay.style.width = '100%';
    overlay.style.background = 'black';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.opacity = '0.25';
    overlay.addEventListener('click', function () {
      pushEvent('overlayclick');
    });
    document.querySelector('#portal .Modal-container').prepend(overlay);
  }

  element.addEventListener('click', function () {
    pushEvent('blackclick');
  });
});

function centerModal() {
  var modal = document.querySelector('#portal .Modal.Modal--right.is-visible');
  modal.classList.add('u-hidden');
  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');
  setTimeout(function () {
    modal.classList.remove('u-hidden');
  }, 500);
}

var imageLaptop = document.createElement('img');
imageLaptop.style.margin = '0 auto';
imageLaptop.style.display = 'block';
imageLaptop.style.height = '242px';
imageLaptop.src = 'https://www.coop.se/assets/icons/computer.svg';

function welcome() {
  var welcomeDiv = document.querySelector('#portal .Modal-container > div:not(.overlay)');
  welcomeDiv.querySelector('.FlyIn-scroll').prepend(imageLaptop);
  welcomeDiv.querySelector('.FlyIn-header .Heading').innerHTML = 'Välkommen till<br>vår butik online!';
  welcomeDiv.querySelector('.FlyIn-scroll p').innerHTML = 'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';
  setTimeout(function () {
    welcomeDiv.querySelector('.FlyIn-scroll input').focus();
  }, 1000);
  welcomeDiv.querySelector('.FlyIn-close').classList.add('u-hidden');
  welcomeDiv.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display = 'none';
  welcomeDiv.querySelector('.FlyIn-scroll > div:last-of-type').style.display = 'none';
  setStyling(welcomeDiv);
  waitFor('.Heading--h2', welcomeDiv, function () {
    redesignDelivery();
  });
  waitFor('.Cart', welcomeDiv, function () {
    var _document$querySelect2;

    (_document$querySelect2 = document.querySelector('.FlyIn-close')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.click();
  });
}

function setStyling(element) {
  element.style.height = 'auto';
  element.style.padding = '21px 10px 42px 10px';

  if (!isPhone) {
    element.style.position = 'relative';
    element.style.borderRadius = '20px';
    element.classList.remove('u-heightAll');
  }

  var h2 = element.querySelector('h2');

  if (h2) {
    h2.style.fontSize = '34px';
    h2.style.fontFamily = 'CoopNew-Black, sans-serif';
  }
}

function redesignDelivery() {
  if (!isPhone) {
    document.querySelector('#portal .Modal-container > div:not(.overlay)').classList.add('u-heightAll');
    document.querySelector('#portal .Modal-container').style.padding = '20px';
    document.querySelector('#portal .Modal-container > div:not(.overlay)').style.position = 'relative';
  }

  document.querySelector('.FlyIn-back').classList.remove('u-hidden');
  document.querySelector('.FlyIn-close').classList.add('u-hidden');
  document.querySelector('.FlyIn-back').addEventListener('click', function () {
    pushEvent('deliveryback');
  });
}

function redesignZip() {
  var imageSigns = document.createElement('img');
  imageSigns.style.margin = '0 auto';
  imageSigns.style.display = 'block';
  imageSigns.style.height = '233px';
  imageSigns.src = 'https://res.cloudinary.com/coopjakob/image/upload/v1622715712/T55/postnum_ct5pko.svg';
  document.querySelector('.FlyIn-scroll').prepend(imageSigns);
  document.querySelector('.FlyIn-header .Heading').innerHTML = 'Ändra dina val';
  document.querySelector('.FlyIn-scroll p').innerHTML = 'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';
  document.querySelector('.FlyIn-scroll input').focus();
  document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display = 'none';
  document.querySelector('.FlyIn-scroll > div:last-of-type').style.display = 'none';
  waitFor('.List', '.FlyIn-scroll', function () {
    document.querySelector('.FlyIn-scroll h4').style.display = 'none';
    document.querySelector('.FlyIn-scroll ul').style.display = 'none';
  });
  waitFor('.Cart', '#portal .Modal-container > div:not(.overlay)', function () {
    var _document$querySelect3;

    (_document$querySelect3 = document.querySelector('.FlyIn-close')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.click();
  });
  document.querySelector('.FlyIn-scroll').classList.add('is-redesign');
}

function newCart() {
  var _document$querySelect4, _document$querySelect5;

  var questionbox = document.createElement('div');
  questionbox.classList.add('u-flex', 'u-flexDirectionColumn', 'u-bgWhite', 'u-sizeFull', 'u-sm-size540');

  if (isPhone) {
    questionbox.classList.add('u-heightAll');
  }

  questionbox.style.position = 'absolute';
  questionbox.append(imageLaptop);
  var h2 = document.createElement('h2');
  h2.innerText = 'Dina senaste val';
  h2.style.marginBottom = '0';
  questionbox.append(h2);
  var p = document.createElement('p');
  var deliveryData = {
    postalcode: (_document$querySelect4 = document.querySelector('[data-test=changePostalCode]')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.textContent,
    storename: (_document$querySelect5 = document.querySelector('[data-test=pickupStoreLink]')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.textContent
  };

  if (deliveryData.postalcode) {
    p.innerHTML = "<strong>Hemleverans</strong> till <strong>".concat(deliveryData.postalcode, "<strong>");
  } else {
    p.innerHTML = "<strong>H\xE4mtas</strong> p\xE5 <strong>".concat(deliveryData.storename, "</strong>");
  }

  p.querySelectorAll('strong').forEach(function (element) {
    element.style.color = '#008844';
  });
  questionbox.append(p);
  var question = document.createElement('p');
  question.innerText = 'Stämmer dina val fortfarande?';
  questionbox.append(question);
  var closebutton = document.createElement('button');
  closebutton.classList.add('Button', 'Button--green', 'Button--radius', 'u-marginBsm');

  if (isPhone) {
    closebutton.classList.add('u-sizeFull');
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
    changebutton.classList.add('u-sizeFull');
  } else {
    changebutton.style.width = '280px';
  }

  changebutton.style.margin = '0 auto';
  changebutton.innerText = 'Nej, jag vill ändra mina val';
  var containerDiv = document.querySelector('#portal .Modal-container > div:not(.overlay)');
  changebutton.addEventListener('click', function () {
    var _document$querySelect6;

    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-change',
      eventLabel: ''
    });

    if (!isPhone) {
      document.querySelector('#portal .Modal-container > div:not(.overlay)').classList.add('u-heightAll');
    }

    (_document$querySelect6 = document.querySelector('[data-test=cncheader-chagedeliverymethodbutton]')) === null || _document$querySelect6 === void 0 ? void 0 : _document$querySelect6.click();
    questionbox.remove();
    containerDiv.classList.add('u-flex');
    containerDiv.classList.remove('u-hidden');
    setStyling(document.querySelector('#portal .Modal-container > div:not(.overlay)'));
    document.querySelector('.FlyIn-back').classList.add('u-hidden');
    document.querySelector('.FlyIn-close').addEventListener('click', function () {
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'storefocus-x',
        eventLabel: ''
      });
    });
    var back = document.createElement('button');
    back.classList.add('FlyIn-back');
    back.innerHTML = '<svg role="img"><svg id="pointer-left" viewBox="0 0 12 14"><path d="M12.3 6.9H-.2m5 5l-5-5 5-5"></path></svg></svg>';
    containerDiv.prepend(back);
    back.addEventListener('click', function (event) {
      pushEvent('zipback');
      newCart();
    });
    waitFor('.Heading--h2', '#portal .Modal-container > div:not(.overlay)', function () {
      redesignDelivery();
    });

    if (!document.querySelector('.FlyIn-scroll.is-redesign')) {
      redesignZip();
    }
  });
  questionbox.append(changebutton);
  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');
  questionbox.style.textAlign = 'center';
  setStyling(questionbox);
  document.querySelector('#portal .Modal-container').append(questionbox);
}

if (isStoreSet) {
  document.querySelector('.CartButton').click();
  centerModal();
  waitFor('.Cart-header', '#portal', function () {
    pushEvent('newCart');
    newCart();
  });
} else {
  waitFor('.FlyIn-header', '#portal', function () {
    pushEvent('welcome');
    welcome();
  });
}