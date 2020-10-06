document.querySelectorAll('.js-ecommerceSearchInput').forEach((e) => {
  e.addEventListener(
    'focus',
    () => {
      dataLayer.push({ event: 'optimize.activate' });
    },
    { once: true }
  );
});
