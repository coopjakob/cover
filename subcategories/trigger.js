function triggerSubcategories() {
  dataLayer.push({
    event: 'optimize.activate.subcategories'
  });
  console.log('Experiment: subcategories');
}

triggerSubcategories();
window.addEventListener('ga:virtualPageView', function () {
  window.addEventListener('ga:productImpression', triggerSubcategories, {
    once: true
  });
});