function labelButtons() {
  document
    .querySelectorAll(
      '.ProductSearch-itemAmountSelector .ProductSearch-itemCell:not(.experiment)'
    )
    .forEach((element) => {
      element.classList.add('experiment');

      const buttonView = document.createElement('div');
      buttonView.classList.add('js-buttonView');

      const buttonContainer = element.getElementsByClassName(
        'js-buttonContainer'
      )[0];
      buttonContainer.classList.add('js-changeButtonsContainer');
      buttonContainer.classList.remove('AddToCart--mediumToSmall');

      const buyButton = document.createElement('button');
      buyButton.setAttribute('type', 'button');
      buyButton.classList.add(
        'Button',
        'Button--green',
        'Button--medium',
        'Button--full',
        'Button--radius',
        'js-kop',
        'experiement',
        'u-hidden'
      );
      buyButton.style.width = '125px';

      buttonView.appendChild(buttonContainer);
      buttonView.appendChild(buyButton);

      element.appendChild(buttonView);
    });

  document.querySelectorAll('.js-kop:not(.experiment)').forEach((element) => {
    element.classList.add('experiment');
    element.style.textOverflow = 'unset';
    element.style.paddingLeft = 0;
    element.style.paddingRight = 0;
    element.textContent = 'Lägg till';
  });

  document
    .querySelectorAll(
      '.js-buttonView:not(.ProductSearch-itemCta) .js-kop.u-hidden'
    )
    .forEach((element) => {
      if (
        element.parentElement.getElementsByClassName('js-input')[0].value == 0
      ) {
        element.classList.remove('u-hidden');

        element.parentElement
          .getElementsByClassName('js-buttonContainer')[0]
          .classList.add('u-hidden');
      }
    });
}

labelButtons();

window.addEventListener('ga:modifyCart', () => {
  window.setTimeout(labelButtons, 500);
});

window.addEventListener('resize', () => {
  window.setTimeout(labelButtons, 500);
});

window.addEventListener('ga:productImpression', labelButtons);
