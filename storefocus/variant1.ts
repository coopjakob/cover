let itemsInCart = document.querySelector('.CartButton .Badge')?.textContent;

if (itemsInCart === '0') {
  console.debug('0 in cart');

  window.addEventListener(
    'ga:modifyCart',
    () => {
      console.debug('ga:modifyCart');
      // dataLayer.push({
      //   event: 'optimize.activate.storefocus'
      // });
      run();
    },
    {
      once: true,
    }
  );
}

let modalContainer;
function run() {
  document.querySelector('.CartButton').click();

  let modal = document.querySelector('#portal .Modal.Modal--right');
  console.debug('Check for modal:', modal);

  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');

  modalContainer = document.querySelector('#portal .Modal-container');
  console.debug('<experiment> observing Modal-container', modalContainer);
  modalContainerObserver.observe(modalContainer, {
    childList: true,
    subtree: true,
  });
}

// document.querySelector('.Modal-container').style.padding = '2em';

function containClassInNodes(nodes, containClass) {
  let foundNode = false;
  for (const node of nodes) {
    if (node.childNodes) {
      console.debug('<experiment> child exist');
      foundNode = containClassInNodes(node.childNodes, containClass);
    }
    console.debug('<experiment> node', node);
    if (!node.tagName) continue;
    if (node.classList.contains(containClass)) {
      console.debug('<experiment> see', containClass);
      foundNode = node;
      break;
    }
  }
  return foundNode;
}

let modalContainerObserver = new MutationObserver((mutations) => {
  console.debug('<experiment> change detected');
  for (const { addedNodes } of mutations) {
    console.debug('<experiment> added node', addedNodes);
    if (containClassInNodes(addedNodes, 'Cart-header')) {
      console.debug('<experiment> Cart-header exist');
      modalContainerObserver.disconnect();
      getVariables();
    }
  }
});

let deliverymethod;
let postalcode;
let storename;

function getVariables() {
  deliverymethod = document.querySelector(
    '[data-test=cncheader-changedeliverymethod]'
  )?.textContent;

  postalcode = document.querySelector('[data-test=changePostalCode]')
    ?.textContent;

  storename = document.querySelector('[data-test=pickupStoreLink]')
    ?.textContent;

  createBox();
}

function createBox() {
  let questionbox = document.createElement('div');

  questionbox.classList.add(
    'u-flex',
    'u-flexDirectionColumn',
    // 'u-heightAll',
    'u-bgWhite',
    'u-sizeFull',
    'u-sm-size540'
  );

  questionbox.style.position = 'absolute';

  questionbox.innerText = `Ditt val från tidigare köp är ${deliverymethod}`;

  let okbutton = document.createElement('button');
  okbutton.innerText = 'Jag vill ändra';
  okbutton.addEventListener('click', () => {
    document
      .querySelector('[data-test=cncheader-chagedeliverymethodbutton]')
      .click();
    questionbox.remove();

    // TODO: Is flex needed?
    containerDiv.classList.add('u-flex');
    containerDiv.classList.remove('u-hidden');
  });
  questionbox.append(okbutton);

  let cancelbutton = document.createElement('button');
  cancelbutton.innerText = 'Fortsätt handla';
  cancelbutton.addEventListener('click', () => {
    document.querySelector('.FlyIn-close').click();
    questionbox.remove();
  });
  questionbox.append(cancelbutton);

  // let modalcontainer = document.querySelector('.Modal-container');
  let containerDiv = modalContainer.querySelector('div');
  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');

  // TODO: Remove close buttons and close on click on black

  modalContainer.prepend(questionbox);
}
