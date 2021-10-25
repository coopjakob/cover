t73();

document.addEventListener('cover.ready T73', (event) => {
  t73();
});

function t73() {
  const experimentStyle = document.createElement('style');
  experimentStyle.innerHTML = `
      .T73.Grid--product>.Grid-cell {
        flex-basis: 170px;
        flex-grow: 1;
      }`;

  document.body.append(experimentStyle);
}
