function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var queries = new URLSearchParams(location.search);

if (queries.get('variant') == '2') {
  var element = document.querySelector('[data-test=mobileCategoryTrigger]');

  if (element) {
    run();
  } else {
    var wrapper = document.querySelector('#ecommerceHeader');
    var observer = new MutationObserver(function (mutationsList) {
      console.debug('<experiment> change detected');

      var _iterator = _createForOfIteratorHelper(mutationsList),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var mutation = _step.value;
          console.debug('<experiment> mutation', mutation);

          if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].querySelector('[data-test=mobileCategoryTrigger]')) {
            console.debug('<experiment> run change');
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
    console.debug('<experiment> observing search results');
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
      sidebarTriggerBarIcon.innerHTML = "\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M2.39129 9.91157C2.712 9.32634 3.1735 8.83029 3.73409 8.46826C4.23718 8.02976 4.84165 7.72364 5.49281 7.57755C6.1639 7.44679 6.82624 7.84052 7.03196 8.49253C7.03196 8.49253 9.27412 13.4526 10.0377 15.784C10.1235 16.0563 10.0283 16.3531 9.80019 16.5248C9.57205 16.6965 9.26048 16.7058 9.02259 16.5479C6.99474 15.1684 2.84864 11.639 2.84864 11.639C2.28137 11.2617 2.08507 10.5203 2.39129 9.91157Z\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M3.73429 8.46681L2.51133 6.8417\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M3.00424 9.07271L0.977493 8.41774\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M4.51911 7.93308L4.45053 5.80372\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M7.03399 8.49729L5.21148 9.86883\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M8.95796 12.9517L7.50844 14.0425\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M6.15721 11.6866L4.4413 12.9779\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M15.3678 2.30645C15.3678 1.82543 14.9779 1.43549 14.4969 1.43549H9.27105C8.79004 1.43549 8.40008 1.82543 8.40008 2.30645V4.04839H15.3678V2.30645Z\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M8.10975 6.80645H11.5936\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M14.4969 6.80645H15.6581\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M7.05756 5.93955L8.52833 4.04839H15.4961\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <path d=\"M12.9374 15.371L13.0452 6.86684C13.0452 6.73161 13.0766 6.59822 13.137 6.47723L14.7872 4.04839H15.491L17.129 6.47723V6.86684V15.371C17.1162 15.6613 16.8911 16.2419 16.0936 16.2419H13.6452H11.8839C12.813 16.2419 12.9374 15.6613 12.9374 15.371ZM12.9374 15.371C12.9374 15.4362 12.9446 15.4998 12.9582 15.5608L12.9374 15.371ZM12.9374 15.371L12.9582 15.5608L12.9374 15.371ZM12.9582 15.5608C12.9671 15.6008 12.9787 15.6398 12.9929 15.6774L12.9582 15.5608ZM12.9582 15.5608L12.9929 15.6774L12.9582 15.5608ZM12.9929 15.6774C13.0077 15.7168 13.0252 15.7548 13.0453 15.7912L12.9929 15.6774ZM12.9929 15.6774L13.0453 15.7912L12.9929 15.6774ZM13.0453 15.7912C13.0693 15.8347 13.097 15.876 13.1279 15.9146L13.0453 15.7912ZM13.0453 15.7912L13.1279 15.9146L13.0453 15.7912ZM13.1279 15.9146C13.1619 15.9571 13.1999 15.9964 13.2411 16.0319L13.1279 15.9146ZM13.1279 15.9146L13.2411 16.0319L13.1279 15.9146ZM13.2411 16.0319C13.2767 16.0624 13.3147 16.0901 13.3548 16.1147L13.2411 16.0319ZM13.2411 16.0319L13.3548 16.1147L13.2411 16.0319ZM13.3548 16.1147C13.4015 16.1432 13.451 16.1674 13.5028 16.1868L13.3548 16.1147ZM13.3548 16.1147L13.5028 16.1868L13.3548 16.1147ZM13.5028 16.1868C13.5485 16.204 13.5962 16.2174 13.6452 16.2267L13.5028 16.1868Z\" stroke=\"#005537\" stroke-width=\"0.870968\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    ";
    }
  }
} else {
  var _element = document.querySelector('[data-test=mobileCategoryTrigger]');

  if (_element) {
    run();
  } else {
    var _wrapper = document.querySelector('#ecommerceHeader');

    var _observer = new MutationObserver(function (mutationsList) {
      console.debug('<experiment> change detected');

      var _iterator2 = _createForOfIteratorHelper(mutationsList),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var mutation = _step2.value;
          console.debug('<experiment> mutation', mutation);

          if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].querySelector('[data-test=mobileCategoryTrigger]')) {
            console.debug('<experiment> run change');
            run();

            _observer.disconnect();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    });

    console.debug('<experiment> observing search results');

    _observer.observe(_wrapper, {
      attributes: false,
      childList: true
    });
  }

  function run() {
    var sidebarTriggerBarIcon = document.querySelector('.js-sidebarTrigger .Bar-icon');

    if (sidebarTriggerBarIcon) {
      sidebarTriggerBarIcon.style.width = '18px';
      sidebarTriggerBarIcon.style.height = '18px';
      sidebarTriggerBarIcon.innerHTML = "\n      <line x1=\"5.5\" y1=\"15.5\" x2=\"16.5\" y2=\"15.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <line x1=\"5.5\" y1=\"9.5\" x2=\"16.5\" y2=\"9.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <line x1=\"5.5\" y1=\"3.5\" x2=\"16.5\" y2=\"3.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n      <circle cx=\"1.5\" cy=\"15.5\" r=\"1\" fill=\"#005537\"/>\n      <circle cx=\"1.5\" cy=\"9.5\" r=\"1\" fill=\"#005537\"/>\n      <circle cx=\"1.5\" cy=\"3.5\" r=\"1\" fill=\"#005537\"/>\n    ";
    }
  }
}