document.getElementsByClassName('js-ecommerceSearchInput').forEach((e) => {
  e.addEventListener(
    'keydown',
    () => {
      dataLayer.push({ event: 'optimize.activate' });
    },
    { once: true }
  );
});
