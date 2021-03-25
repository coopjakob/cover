var search = document.querySelector('.Search');
search.addEventListener('click', experimentRun);
var searchInput = document.querySelector('.Search-input');
searchInput.addEventListener('change', experimentRun);
searchInput.addEventListener('input', experimentRun);

function experimentRun() {
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
    }

    modal.addEventListener('click', experimentClose);
    window.addEventListener('ga:virtualPageView', experimentClose);
    searchInput.addEventListener('keydown', function (event) {
      // not needed because we use ga:virutalPageView event?
      if (event.key === 'Enter') {
        experimentClose();
      } // replace with observer?


      setTimeout(function () {
        var searchClear = document.querySelector('.Search-clear');
        searchClear.addEventListener('click', function () {
          setTimeout(function () {
            experimentClose();
          }, 50);
        });
      }, 50);
    });
  }
} // function experimentEvent() {
//   dataLayer.push({
//     event: 'interaction',
//     eventCategory: 'Experiment',
//     eventAction: 'blackoutsearch-close',
//     eventLabel: '',
//   });
// }


experimentRun();