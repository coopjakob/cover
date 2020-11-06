const miniCartManagerObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.addedNodes.length > 0 &&
      document.querySelector(
        '.MiniCartManager .Cart.Cart--mini:not(.u-hidden)'
      ) &&
      document.querySelector(
        '.MiniCartManager .Cart.Cart--mini:not(.u-hidden) .Cart-header.Cart-headerInfo h2'
      ).textContent == 'Hurra!'
    ) {
      console.debug('<experiment> Reserve timeslot click');
      document.querySelector('.MiniCartManager .js-reserveTimeslot').click();
    } else {
      console.debug('<experiment> No hurray added yet');
    }
  }
});

miniCartManagerObserver.observe(document.querySelector('.MiniCartManager'), {
  attributes: false,
  childList: true,
  subtree: false,
});
