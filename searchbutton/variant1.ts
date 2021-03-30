let style = document.createElement('style');
style.innerHTML = `
  .Search.Search--online .Search-icon {
    top: -1px;
    right: -1px;
    left: unset;
    width: 40px;
    height: 44px;
    padding: 0;
    border-right: 4px solid #00aa46;
    background-color: #00aa46;
    border-radius: 0 22px 22px 0;
  }

  .Search.Search--radiusDropdown.is-active .Search-icon {
    border-radius: 0 22px 0 0;
  }

  .Search-clear {
    right: 44px !important;
  }

  .Search-input {
    padding-left: 1rem;
  }

  .Search.Search--green .Search-content .Search-icon svg {
    stroke: white !important;
  }
`;
document.body.appendChild(style);

let element = document.querySelector('.Search.Search--online .Search-icon');

element.addEventListener('click', () => {
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'searchbutton-click',
    eventLabel: '',
  });
  const enterkey = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  document.querySelector('.Search-input').dispatchEvent(enterkey);
});
