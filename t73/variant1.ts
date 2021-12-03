const experimentStyle = document.createElement('style');
experimentStyle.innerHTML = `
  .Grid--product>.Grid-cell {
    flex-basis: 170px;
    flex-grow: 1;
    max-width: 220px;
  }`;

document.body.append(experimentStyle);
