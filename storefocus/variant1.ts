let itemsInCart = document.querySelector('.CartButton .Badge')?.textContent;

let isStoreSet = !!document.querySelector('.TimeslotPreview-info')?.textContent;

if (itemsInCart === '0') {
  console.debug('0 in cart');

  if (isStoreSet) {
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
  } else {
    let portalObserver = new MutationObserver((mutations) => {
      console.debug('<experiment> portal change detected');
      for (const { addedNodes } of mutations) {
        console.debug('<experiment> added node', addedNodes);
        if (containClassInNodes(addedNodes, 'FlyIn-header')) {
          console.debug('<experiment> FlyIn-header exist');
          portalObserver.disconnect();
          run();
        }
      }
    });

    portalObserver.observe(document.getElementById('portal'), {
      childList: true,
      subtree: true,
    });
  }
}

// window.addEventListener('ga:emptyCart', () => {
//   console.debug('ga:emptyCart');
//   run();
// });

// window.addEventListener('ga:deliveryInfo', () => {
//   console.debug('ga:deliveryInfo');
//   run();
// });

// window.addEventListener('ga:existingCartAddToCart', () => {
//   console.debug('ga:existingCartAddToCart');
//   run();
// });

let modalContainer;
function run() {
  console.debug('run');

  if (isStoreSet) {
    waitForModal();
  } else {
    centerModal();
    remake();
  }
}

function centerModal() {
  let modal = document.querySelector('#portal .Modal.Modal--right');

  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');
}

function waitForModal() {
  document.querySelector('.CartButton').click();
  centerModal();

  modalContainer = document.querySelector('#portal .Modal-container');
  console.debug('modalContainer', modalContainer);

  let modalContainerObserver = new MutationObserver((mutations) => {
    console.debug('<experiment> modal change detected');
    for (const { addedNodes } of mutations) {
      console.debug('<experiment> added node', addedNodes);

      if (containClassInNodes(addedNodes, 'Cart-header')) {
        console.debug('<experiment> Cart-header exist');
        modalContainerObserver.disconnect();
        getVariables();
      }
    }
  });

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

let isLoggedIn = coopUserSettings.isAuthenticated;

function remake() {
  // Bild

  document.querySelector('.FlyIn-header .Heading').innerHTML =
    'Välkommen till<br>vår butik online!';

  document.querySelector('.FlyIn-scroll p').innerHTML =
    'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

  document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
    'none';

  document.querySelector('.FlyIn-scroll > div:last-of-type').style.display =
    'none';

  setStyling(document.querySelector('#portal .Modal-container > div'));
}

function setStyling(element) {
  element.style.height = '587px'; // will stick until next view TODO: Remove before change
  element.style.borderRadius = '20px';
  element.style.padding = '30px 0 68px 0';
  let h2 = element.querySelector('h2');
  if (h2) {
    h2.style.fontSize = '34px';
    h2.style.fontFamily = 'Coop New';
  }

  element.classList.remove('u-heightAll');
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

  setStyling(questionbox);

  questionbox.style.position = 'absolute';

  // let modalcontainer = document.querySelector('.Modal-container');
  let containerDiv = modalContainer.querySelector('div');

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

    setStyling(document.querySelector('#portal .Modal-container > div'));

    document.querySelector('.FlyIn-header .Heading').innerHTML =
      'Ändra dina val';

    document.querySelector('.FlyIn-scroll p').innerHTML =
      'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

    document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
      'none';

    waitFor('List', '.FlyIn-scroll', () => {
    document.querySelector('.FlyIn-scroll h4').style.display = 'none';
    document.querySelector('.FlyIn-scroll ul').style.display = 'none';
  });
  });
  questionbox.append(okbutton);

  let cancelbutton = document.createElement('button');
  cancelbutton.innerText = 'Fortsätt handla';
  cancelbutton.addEventListener('click', () => {
    document.querySelector('.FlyIn-close').click();
    questionbox.remove();
  });
  questionbox.append(cancelbutton);

  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');

  // TODO: Remove close buttons and close on click on black

  modalContainer.prepend(questionbox);
}

function waitFor(className, element, callback) {
  console.debug('Wait for className', className);

  if (!element) {
    element = 'body';
  }

  if (!element.tagName) {
    element = document.querySelector(element);
  }

  let observer = new MutationObserver((mutations) => {
    console.debug('<experiment> modal change detected');
    for (const { addedNodes } of mutations) {
      console.debug('<experiment> added node', addedNodes);

      if (containClassInNodes(addedNodes, className)) {
        console.debug('<experiment> className exist, callback');
        observer.disconnect();
        callback();
      }
    }
  });

  console.debug('<experiment> observing', element);
  observer.observe(element, {
    childList: true,
    subtree: true,
  });
}
