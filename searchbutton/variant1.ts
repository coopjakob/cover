let search = document.querySelector('.Search.Search--green');

let input = search.querySelector('.Search-input');
input.style.paddingLeft = '1rem';

let icon = search.querySelector('.Search.Search--online .Search-icon');
icon.style.top = '-1px';
icon.style.right = '-1px';
icon.style.left = 'unset';
icon.style.width = '40px';
icon.style.height = '44px';
icon.style.padding = '0';
icon.style.borderRight = '4px solid #00aa46';
icon.style.backgroundColor = '#00aa46';
icon.style.borderRadius = '0 22px 22px 0';

// Include svg to be able to set color of path
let svg = icon.querySelector('svg');
svg.setAttribute('viewBox', '0 0 20 20');
svg.innerHTML =
  '<path xmlns="http://www.w3.org/2000/svg" d="M19 19l-4.64-4.64m-5.534 2.292A7.826 7.826 0 108.826 1a7.826 7.826 0 000 15.652z" stroke-linecap="round" stroke-linejoin="round" stroke="white"/>';

// Add style for elements that isn't visible yet
let style = document.createElement('style');
style.innerHTML = `
  .Search.Search--radiusDropdown.is-active .Search-icon {
    border-radius: 0 22px 0 0 !important;
  }
  .Search-clear {
    right: 44px !important;
  }
  `;
document.body.appendChild(style);

icon.addEventListener('click', () => {
  console.debug('<experiment> click searchbutton');
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
  input.dispatchEvent(enterkey);
});
