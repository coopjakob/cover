function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function checkAllSlotsEmpty() {
  var nextday = document.querySelector('.Timeslots-daySwitch--nextDay');
  var skeleton = document.querySelector('.TimeslotCell--skeleton');

  if (nextday && !skeleton) {
    var timeslots = document.querySelectorAll('.TimeslotCell');
    var emptyTimeslots = 0;

    var _iterator = _createForOfIteratorHelper(timeslots),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var timeslot = _step.value;

        if (timeslot.textContent.includes('Fullbokad')) {
          emptyTimeslots++;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (timeslots.length == emptyTimeslots) {
      dataLayer.push({
        event: 'optimize.activate.skiptotime'
      });
    } else {}
  } else if (document.querySelector('#portal .Modal')) {
    setTimeout(function () {
      checkAllSlotsEmpty();
    }, 200);
  }
}

checkAllSlotsEmpty();