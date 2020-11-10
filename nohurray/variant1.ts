const hurrayObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    console.debug(mutation);
    if (mutation.addedNodes.length > 0) {
      // console.debug(mutation.addedNodes[0].textContent);
      if (
        document.querySelector(
          '.MiniCartManager .Cart.Cart--mini:not(.u-hidden):not(.is-loading) .Cart-header.Cart-headerInfo h2'
        ) &&
        document.querySelector(
          '.MiniCartManager .Cart.Cart--mini:not(.u-hidden):not(.is-loading) .Cart-header.Cart-headerInfo h2'
        ).textContent == 'Hurra!'
      ) {
        console.debug('<experiment> Reserve timeslot click');
        document.querySelector('.MiniCartManager .js-reserveTimeslot').click();
      } else {
        console.debug('<experiment> No hurray click yet');
      }
    }
  }
});

hurrayObserver.observe(document.querySelector('.MiniCartManager'), {
  attributes: false,
  childList: true,
  subtree: false,
});
