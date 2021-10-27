T63();

document.addEventListener('cover.ready T63', () => {
  T63();
});

function T63() {
  const element = document.querySelector('.Experiment.T63');

  const firstBuy = document
    .querySelector('[data-list="First Buy"]')
    .closest('.Grid-cell.u-sizeFull');

  firstBuy.after(element);
}
