const element = document.querySelector('.Experiment.T63');

const firstBuy = document
  .querySelector('[data-list="First Buy"]')
  .closest('.Grid-cell.u-sizeFull');

firstBuy.after(element);
