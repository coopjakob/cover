let isStoreSet = !!document.querySelector('.TimeslotPreview-info')?.textContent;
let isPhone = window.innerWidth < 600;
let modalContainer;

if (isStoreSet) {
  run();
} else {
  if (document.getElementById('portal')) {
    run();
  } else {
    let portalObserver = new MutationObserver((mutations) => {
      portalObserver.disconnect();
      run();
    });

    portalObserver.observe(document.getElementById('portal'), {
      childList: true,
      subtree: false,
    });
  }
}

function run() {
  console.debug('run');

  if (isStoreSet) {
    waitForModal();
  } else {
    centerModal();
    waitFor('FlyIn-header', '#portal', () => {
      remake();
    });
  }
}

function centerModal() {
  if (!isPhone) {
    let modal = document.querySelector('#portal .Modal.Modal--right');

    modal.classList.add('u-hidden');
    modal.classList.remove('Modal--right');
    modal.classList.add('Modal--center');

    setTimeout(() => {
      modal.classList.remove('u-hidden');
    }, 500);

    document
      .querySelector('#portal .Modal-overlay')
      .addEventListener('click', (event) => {
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'Experiment',
          eventAction: 'storefocus-blackclick',
          eventLabel: '',
        });
      });
  }
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
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'storefocus-welcome',
    eventLabel: '',
  });

  // document.querySelector('.FlyIn-back').classList.add('u-hidden');
  document.querySelector('.FlyIn-close').classList.add('u-hidden');

  document.querySelector('.FlyIn-scroll').prepend(imageLaptop);

  document.querySelector('.FlyIn-header .Heading').innerHTML =
    'Välkommen till<br>vår butik online!';

  document.querySelector('.FlyIn-scroll p').innerHTML =
    'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

  setTimeout(() => {
    document.querySelector('.FlyIn-scroll input').focus();
  }, 1000);

  document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
    'none';

  document.querySelector('.FlyIn-scroll > div:last-of-type').style.display =
    'none';

  setStyling(document.querySelector('#portal .Modal-container > div'));

  waitFor('Heading--h2', '#portal .Modal-container > div', () => {
    setDeliveryStyle();
  });

  // when you've entered a zip code
  waitFor('Cart', '#portal .Modal-container > div', () => {
    document.querySelector('.FlyIn-close')?.click();
  });
}

function setStyling(element) {
  element.style.height = 'auto';
  element.style.padding = '21px 15px 42px 15px';

  if (!isPhone) {
    element.style.position = 'relative';
    element.style.borderRadius = '20px';
    element.classList.remove('u-heightAll');
  }

  let h2 = element.querySelector('h2');
  if (h2) {
    h2.style.fontSize = '34px';
    h2.style.fontFamily = 'CoopNew-Black, sans-serif';
  }

  element.querySelectorAll('strong').forEach((element) => {
    element.style.color = '#008844';
  });
}

function setDeliveryStyle() {
  if (!isPhone) {
    document
      .querySelector('#portal .Modal-container > div')
      .classList.add('u-heightAll');

    document.querySelector('#portal .Modal-container').style.padding = '20px';

    document.querySelector('#portal .Modal-container > div').style.position =
      'relative';
  }

  // TODO: Try which one is the one needed
  document.querySelector('.FlyIn-back').classList.remove('u-hidden');
  document.querySelector('.FlyIn-close').classList.add('u-hidden');

  document.querySelector('.FlyIn-back').addEventListener('click', () => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-back',
      eventLabel: '',
    });
  });
}

let imageLaptop = document.createElement('img');
imageLaptop.style.margin = '0 auto';
imageLaptop.style.display = 'block';
imageLaptop.style.height = '242px';
imageLaptop.src = 'https://www.coop.se/assets/icons/computer.svg';

let imageSigns = document.createElement('img');
imageSigns.style.margin = '0 auto';
imageSigns.style.display = 'block';
imageSigns.style.height = '233px';
imageSigns.src = 'https://www.coop.se/assets/icons/Tray.svg';

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

  if (isPhone) {
    questionbox.classList.add('u-heightAll');
  }

  questionbox.style.position = 'absolute';

  // let modalcontainer = document.querySelector('.Modal-container');
  let containerDiv = modalContainer.querySelector('div');

  questionbox.append(imageLaptop);

  let h2 = document.createElement('h2');
  h2.innerText = 'Dina senaste val';
  h2.style.marginBottom = '0';
  questionbox.append(h2);

  let p = document.createElement('p');
  if (postalcode) {
    p.innerHTML = `<strong>${deliverymethod}</strong> till <strong>${postalcode}<strong>`;
  } else {
    p.innerHTML = `<strong>${deliverymethod}</strong> på <strong>${storename}</strong>`;
  }
  questionbox.append(p);

  let question = document.createElement('p');
  question.innerText = 'Stämmer dina val fortfarande?';
  questionbox.append(question);

  let closebutton = document.createElement('button');
  closebutton.classList.add(
    'Button',
    'Button--green',
    'Button--radius',
    'u-marginBsm'
  );

  if (isPhone) {
    closebutton.style.width = '100%';
  } else {
    closebutton.style.width = '280px';
  }
  closebutton.style.margin = '0 auto';

  closebutton.innerText = 'Ja, fortsätt handla';
  closebutton.addEventListener('click', () => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-close',
      eventLabel: '',
    });
    document.querySelector('.FlyIn-close').classList.remove('u-hidden');
    document.querySelector('.FlyIn-close').click();
    questionbox.remove();
  });
  questionbox.append(closebutton);

  let changebutton = document.createElement('button');
  changebutton.classList.add(
    'Button',
    'Button--transparentGreen',
    'Button--radius'
  );

  if (isPhone) {
    changebutton.style.width = '100%';
  } else {
    changebutton.style.width = '280px';
  }
  changebutton.style.margin = '0 auto';

  changebutton.innerText = 'Nej, jag vill ändra mina val';
  changebutton.addEventListener('click', () => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-change',
      eventLabel: '',
    });

    if (!isPhone) {
      document
        .querySelector('#portal .Modal-container > div')
        .classList.add('u-heightAll');
    }

    document
      .querySelector('[data-test=cncheader-chagedeliverymethodbutton]')
      .click();
    questionbox.remove();

    // TODO: Is flex needed?
    containerDiv.classList.add('u-flex');
    containerDiv.classList.remove('u-hidden');

    setStyling(document.querySelector('#portal .Modal-container > div'));

    document.querySelector('.FlyIn-back').classList.add('u-hidden');

    document.querySelector('.FlyIn-close').addEventListener('click', () => {
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'storefocus-x',
        eventLabel: '',
      });
    });

    let back = document.createElement('button');
    back.classList.add('FlyIn-back');
    back.innerHTML =
      '<svg role="img"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/assets/build/sprite.svg?v=210608.1232#pointer-left"><title>Tillbaka</title></use></svg>';
    containerDiv.prepend(back);

    back.addEventListener('click', (event) => {
      createBox();
      dataLayer.push({
        event: 'interaction',
        eventCategory: 'Experiment',
        eventAction: 'storefocus-back',
        eventLabel: '',
      });
    });

    waitFor('Heading--h2', '#portal .Modal-container > div', () => {
      setDeliveryStyle();
    });

    document.querySelector('.FlyIn-scroll').prepend(imageSigns);

    document.querySelector('.FlyIn-header .Heading').innerHTML =
      'Ändra dina val';

    document.querySelector('.FlyIn-scroll p').innerHTML =
      'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

    document.querySelector('.FlyIn-scroll input').focus();

    // remove "Eller, välj att söka efter en butik"
    document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
      'none';

    // remove tooltip
    document.querySelector('.FlyIn-scroll > div:last-of-type').style.display =
      'none';

    // Remove "Tidigare adresser"
    waitFor('List', '.FlyIn-scroll', () => {
      document.querySelector('.FlyIn-scroll h4').style.display = 'none';
      document.querySelector('.FlyIn-scroll ul').style.display = 'none';
    });

    // when you've entered a zip code
    waitFor('Cart', '#portal .Modal-container > div', () => {
      document.querySelector('.FlyIn-close')?.click();
    });
  });
  questionbox.append(changebutton);

  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');

  // TODO: Remove close buttons and close on click on black

  questionbox.style.textAlign = 'center';
  setStyling(questionbox);

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
