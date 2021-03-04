document
  .querySelector('.js-sidebarTrigger')
  .addEventListener('click', (event) => {
    if (event.currentTarget.classList.contains('is-active')) {
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'categoryicon-click',
      });
    }
  });
