const modalRightElement = document.querySelector(
  '.Modal.Modal--right:not(.js-flyInProfile)'
);

const modalRightObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.addedNodes.length > 0 &&
      document.querySelector(
        '.MiniCartManager .Cart.Cart--mini:not(.u-hidden):not(.js-miniCart)'
      )
    ) {
      if (
        document.querySelector(
          '.MiniCartManager .Cart.Cart--mini:not(.u-hidden) .Cart-header.Cart-headerInfo h2'
        ).textContent == 'Ange postnummer' ||
        document.querySelector(
          '.MiniCartManager .Cart.Cart--mini:not(.u-hidden) .Cart-header.Cart-headerInfo h2'
        ).textContent == 'Välj butik'
      ) {
        modalRightObserver.disconnect();
        console.debug('<experiment> activate nohurray');
        dataLayer.push({ event: 'optimize.activate.nohurray' });
        ga('send', {
          hitType: 'event',
          eventCategory: 'Experiment',
          eventAction: 'activate-nohurray',
          eventLabel: '',
          nonInteraction: true,
        });
        break;
      } else {
        console.debug("<experiment> Don't activate nohurray yet");
      }
    }
  }
});

modalRightObserver.observe(modalRightElement, {
  attributes: false,
  childList: true,
  subtree: true,
});
