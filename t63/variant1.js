t63(document.querySelector(".Experiment.T63"));

document.addEventListener('cover.ready T63', (element) => {
  t63(element);
});

function t63(element) {
  const firstBuy = document.querySelector('[data-list="First Buy"]').closest(".Grid-cell.u-sizeFull");
  element.parentNode.insertBefore(element,firstBuy.nextSibling)
}