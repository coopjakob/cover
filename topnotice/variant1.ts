let wrapper = document.querySelector('.Main-container .Section .Grid');

let element = document.createElement('div');
element.classList.add('experiment', 't50', 'Grid-cell', 'u-sizeFull');
element.innerText =
  'Välj ett leveranssätt som passar dig - välj hemleverans eller hämta i butik.';
element.style.padding = '5px 10px';
element.style.border = '1px solid #005537';
element.style.borderTop = 'unset';
element.style.backgroundColor = 'white';
element.style.borderRadius = '0 0 6px 6px';
element.style.fontSize = '0.9em';
element.style.textAlign = 'center';
wrapper.prepend(element);

let style = document.createElement('style');
style.innerHTML = `
  @media only screen and (max-width: 1025px) {
    .js-childLayoutContainer.u-marginTmd {
      margin-top: 10px !important;
    }
  }
`;
wrapper.prepend(style);
