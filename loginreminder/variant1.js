// ==UserScript==
// @name         1044 - T20_AB_login_reminder_all_sitewide
// @namespace    https://www.coop.se/
// @version      1.2
// @description
// @author       Team Croco: Nancy Henry
// @match        https://www.coop.se/*
// @grant        none

// ==/UserScript==

(function (croco) {
  var time = 1500; // thatd the time in milliseconds
  var config = {
    va: 'b',
    id: '1044', // Ticket number
    s3: '',
  };

  var isGALoad = 0;
  var toolConfig = {
    gaid: 'UA-12055413-1',
    category: 'AB-test',
    action: 'B: Variant',
  };

  function gaLoad(d, g, j, e) {
    var a = 0,
      c,
      i,
      f;
    if (typeof d === 'undefined') {
      console.log('Code: L-GACONNF');
      return;
    }
    function b() {
      var l,
        m = { hasGA: 0, ga: undefined };
      for (var k = 0; k < g.length; k++) {
        if (typeof window[g[k]] !== 'undefined') {
          l = window[g[k]];
          break;
        }
      }
      if (typeof l === 'undefined' || l === undefined) {
        return m;
      } else {
        if (l.loaded && typeof l.getAll === 'function') {
          m.hasGA = 1;
          m.ga = l;
          return m;
        }
      }
      return m;
    }
    (function h() {
      var l;
      if (b().hasGA) {
        l = b().ga;
        c = l.getAll();
        if (c.length > 1) {
          for (var k = 0; k < c.length; k++) {
            i = l.getAll()[k].get('trackingId');
            if (i == d.ODgaid || i == d.gaid) {
              f = l.getAll()[k].get('name');
              break;
            }
          }
        } else {
          if (l.getAll().length) {
            f = l.getAll()[0].get('name');
          }
        }
        if (typeof l !== 'undefined' && f) {
          return j({
            gaSend: function (q, n, p) {
              var s = 'pageview',
                t = { nonInteraction: n },
                o = q.toLowerCase();
              if (p) {
                for (var m in p) {
                  t[m] = p[m];
                }
              }
              if (d.custom) {
                for (var r in d.custom) {
                  t[r] = d.custom[r];
                }
              }
              if (o !== s) {
                q = 'Event - ' + q;
              }
              if (d.ODgaid) {
                if (o === s) {
                  q =
                    'Loaded - ' + d.ODdev + ' - ' + d.ODpage + ' - ' + d.ODname;
                }
                l(
                  f + '.send',
                  'event',
                  d.ODecat,
                  d.ODid + ' ' + d.ODvar + ': ' + q,
                  '',
                  t
                );
              } else {
                if (d.variant) {
                  if (o === s) {
                    q = 'Loaded - ' + q;
                  }
                  l(
                    f + '.send',
                    'event',
                    d.category + ': ' + d.variant + ' : ' + d.label,
                    q,
                    t
                  );
                } else {
                  if (d.action) {
                    l(f + '.send', 'event', d.category, d.action, q, t);
                  }
                }
              }
            },
          });
        } else {
          console.log('Code: L-GACNF');
        }
      } else {
        if (a++ > (e ? e : 50)) {
          console.log('Code: L-GACNF');
        } else {
          setTimeout(h, 500);
        }
      }
    })();
  }

  croco(config, function (win, doc, q, fn, applied, css, asset) {
    var assets = {
      // xxx = assest name
    };

    var isMobile = window.matchMedia('only screen and (max-width: 768px)');

    function style() {
      css([
        ' .popup{width:295px;height:140px;background:#156547;position:absolute;right:9px;top:35px;border-radius:11px;color:#fff;font-size:15px;text-align:left;padding:14px 22px;z-index:10;}',
        ' .popup:before{content:"";width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:12px solid #156648;display:block;position:relative;top:-24px;left:190px}',
        ' .popup a{display:inline-block;margin-right:10px;margin-top:11px}',
        ' .popup p{margin:0}',
        ' a#log{background:#1aaa45;padding:3px 13px;border-radius:14px;color: #fff!important}',
        ' .popup a#close{color:rgba(255, 255, 255, 0.72)}',
        ' .popup.h-popup span{color:#fff!important;}',
        ' .h-popup.popup{top:55px}',
        ' div#mobx{height:32px;width:32px;position:absolute;padding:5px;right:5px;top:5px;cursor:pointer;text-align:right}',
        ' #mobx svg{height:12px;width:12px;fill:none;stroke:#fff;vertical-align:top}',

        '@media (max-width: 769px) {',
        ' .popup {right: -37px;padding: 20px 19px;height: 130px}',
        ' .popup:before{border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:12px solid #156648;top:-32px;left:201px}',
        ' .h-popup.popup:before{left:226px}',

        '}',
        '',
      ]);
    }
    function elementLoaded(el, cb) {
      if ($(el).length) {
        // Element is now loaded.
        cb($(el));
      } else {
        setTimeout(function () {
          elementLoaded(el, cb);
        }, 500);
      }
    }
    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
      var expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }
    function getCookie(cname) {
      var name = cname + '=';
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return '';
    }
    function events() {}
    function variant() {
      var yetVisited = getCookie('experiment-loginreminder-close');
      if (!yetVisited) {
        console.log('experiment-loginreminder view');
        var popupContent =
          '<p><strong>Hej! </strong><span>Glöm inte att logga in för att se erbjudanden i ditt område.</span></p><a id="log" class="experiment-login" href="https://www.coop.se/logga-in/">Logga in</a><a id="close" class="experiment-register" href="https://login.coop.se/account/login#register">Skapa inloggning</a>';
        if ($('.user-account-link').length) {
          $('.user-account-link').append(
            '<div class="popup h-popup">' + popupContent + '</div>'
          );
        } else {
          $('.Navigation-item--avatar').append(
            '<div class="popup">' + popupContent + '</div>'
          );
        }
        var loginLink =
          $('.js-loginLink').attr('href') ||
          $('.user-account-link a').attr('href');
        $('#log').attr('href', loginLink);
        $('.popup').prepend(
          '<div id="mobx"><svg id="experiment-close" class="experiment-close" role="img" alt="Stäng"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?=4.5781.0.0#close"><title>Stäng</title></use></svg></div>'
        );
      }
      $('#mobx').click(function () {
        $('.popup').slideUp();
        setCookie('experiment-loginreminder-close', 'true', 28);
      });
    }

    // Run immediately
    if (!applied()) {
      style();
      elementLoaded('.AddToCart-button', function (el) {
        events();
      });

      setTimeout(function () {
        variant();
      }, time);
    }
  });
})(function (b, l) {
  var h = window,
    k = document;
  var c = ('croco-' + b.id + '-' + b.va).toLowerCase(),
    a = '//ta-client-assets.s3.amazonaws.com/' + b.s3 + '/' + b.id;
  var g, i, j;
  g = function (m, p) {
    var q;
    if (!m) {
      return;
    }
    if (m instanceof Window || m instanceof Document) {
      this.length = 1;
      this[0] = m;
      return this;
    }
    if (m.match(/(<\w+>)/g)) {
      q = k.createElement(m.replace(/(<|>)/g, ''));
      if (typeof p === 'object') {
        for (var n in p) {
          if (n.toUpperCase() === 'HTML') {
            q.innerHTML = p[n];
          } else {
            q.setAttribute(n, p[n]);
          }
        }
      }
      q = [q];
    } else {
      if (p) {
        p = p[0] || p;
        q = p.querySelectorAll(m);
      } else {
        q = k.querySelectorAll(m);
      }
    }
    this.length = q.length;
    for (var o = 0; o < q.length; o++) {
      this[o] = q[o];
    }
    return this;
  };
  j = g.prototype = {
    parse: function (n) {
      var m;
      if (n.match(/(\<\/.*\>)/)) {
        m = k.createElement('div');
        m.innerHTML = n;
        return m.childNodes[0];
      }
      return k.createTextNode(n);
    },
    each: function (n) {
      var m = 0;
      while (m < this.length) {
        n.call(this[m], this[m], m);
        m++;
      }
      return this;
    },
  };
  i = function (m, n) {
    return new g(m, n);
  };
  function f(m) {
    var n = '';
    if (c.indexOf('a') < 0) {
      m.forEach(function (p, o) {
        if (p.charAt(0) === ' ') {
          n += '.' + c + ' ' + p + ' ';
        } else {
          n += p + ' ';
        }
      });
      i('head')[0].appendChild(i('<style>', { html: n })[0]);
    }
  }
  function e() {
    return !i('html')[0].classList.contains(c);
  }
  function d(m) {
    return a + '/' + m;
  }
  i('html')[0].classList.add(c);
  h.croco = i;
  l(h, k, i, j, e, f, d);

  if (window.location.pathname == '/') {
    console.log('experiment-heatmap');
    hj('trigger', 'experiment-loginreminder-variant1');
  }
});
