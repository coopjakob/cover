let isStoreSet = !!document.querySelector('.TimeslotPreview-info')?.textContent; // Only on handla
let isPhone = window.innerWidth < 600; // Design breakpoint

function pushEvent(action) {
  console.debug('<experiment> Event pushed to dataLayer', action);
  dataLayer.push({
    event: 'interaction',
    eventCategory: 'Experiment',
    eventAction: 'storefocus-' + action,
    eventLabel: '',
  });
}

function waitFor(selector, element, callback) {
  console.debug('<experiment> Wait for selector', selector);

  // If not an element
  if (!element.tagName) {
    element = document.querySelector(element);
  }

  let observer = new MutationObserver((mutations) => {
    console.debug('<experiment> Change detected in element', element);
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        console.debug('<experiment> Node added', node);
        if (!node.tagName) {
          console.debug('<experiment> Node is not an element');
          continue;
        }
        if (node.matches(selector)) {
          console.debug('<experiment> Selector matches', selector);
          observer.disconnect();
          console.debug('<experiment> callback', node);

          callback(node);
        } else if (node.querySelector(selector)) {
          console.debug('<experiment> Selector exist in node', selector);
          observer.disconnect();

          console.debug('<experiment> callback', node.querySelector(selector));
          callback(node.querySelector(selector));
        }
      }
    }
  });

  console.debug('<experiment> observing', element);
  observer.observe(element, {
    childList: true,
    subtree: true,
  });
}

waitFor('.Modal-overlay', '#portal', (element) => {
  if (!isPhone) {
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.height = '100%';
    overlay.style.width = '100%';
    overlay.style.background = 'black';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.opacity = '0.25';

    overlay.addEventListener('click', () => {
      pushEvent('overlayclick');
    });

    document.querySelector('#portal .Modal-container').prepend(overlay);
  }

  element.addEventListener('click', () => {
    pushEvent('blackclick');
  });
});

function centerModal() {
  let modal = document.querySelector('#portal .Modal.Modal--right.is-visible');

  modal.classList.add('u-hidden');

  modal.classList.remove('Modal--right');
  modal.classList.add('Modal--center');

  setTimeout(() => {
    modal.classList.remove('u-hidden');
  }, 500);
}

let imageLaptop = document.createElement('img');
imageLaptop.style.margin = '0 auto';
imageLaptop.style.display = 'block';
imageLaptop.style.height = '242px';
imageLaptop.src = 'https://www.coop.se/assets/icons/computer.svg';

function welcome() {
  let welcomeDiv = document.querySelector(
    '#portal .Modal-container > div:not(.overlay)'
  );

  // Add image
  welcomeDiv.querySelector('.FlyIn-scroll').prepend(imageLaptop);

  welcomeDiv.querySelector('.FlyIn-header .Heading').innerHTML =
    'Välkommen till<br>vår butik online!';
  welcomeDiv.querySelector('.FlyIn-scroll p').innerHTML =
    'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

  setTimeout(() => {
    welcomeDiv.querySelector('.FlyIn-scroll input').focus();
  }, 1000);

  // Remove "X"
  welcomeDiv.querySelector('.FlyIn-close').classList.add('u-hidden');

  // Remove "Eller, välj att söka efter en butik"
  welcomeDiv.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
    'none';

  // Remove "Logga in eller Skapa inloggning" and tooltip
  welcomeDiv.querySelector('.FlyIn-scroll > div:last-of-type').style.display =
    'none';

  setStyling(welcomeDiv);

  waitFor('.Heading--h2', welcomeDiv, () => {
    redesignDelivery();
  });

  // When completed all steps, close cart when shown
  waitFor('.Cart', welcomeDiv, () => {
    document.querySelector('.FlyIn-close')?.click();
  });
}

function setStyling(element) {
  console.debug('styling', element);

  element.style.height = 'auto';
  element.style.padding = '21px 10px 42px 10px';

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
}

function redesignDelivery() {
  if (!isPhone) {
    document
      .querySelector('#portal .Modal-container > div:not(.overlay)')
      .classList.add('u-heightAll');

    document.querySelector('#portal .Modal-container').style.padding = '20px';

    document.querySelector(
      '#portal .Modal-container > div:not(.overlay)'
    ).style.position = 'relative';
  }

  document.querySelector('.FlyIn-back').classList.remove('u-hidden');
  document.querySelector('.FlyIn-close').classList.add('u-hidden');

  document.querySelector('.FlyIn-back').addEventListener('click', () => {
    pushEvent('deliveryback');
  });
}

function redesignZip() {
  let imageSigns = document.createElement('img');
  imageSigns.style.margin = '0 auto';
  imageSigns.style.display = 'block';
  imageSigns.style.height = '233px';
  imageSigns.src =
    'https://res.cloudinary.com/coopjakob/image/upload/v1622715712/T55/postnum_ct5pko.svg';
  document.querySelector('.FlyIn-scroll').prepend(imageSigns);

  document.querySelector('.FlyIn-header .Heading').innerHTML = 'Ändra dina val';
  document.querySelector('.FlyIn-scroll p').innerHTML =
    'Fyll i ditt postnummer för att få se rätt sortiment och leveransalternativ för dig.';

  document.querySelector('.FlyIn-scroll input').focus();

  // Remove "Eller, välj att söka efter en butik"
  document.querySelector('.FlyIn-scroll > p:nth-of-type(2)').style.display =
    'none';
  // Remove tooltip
  document.querySelector('.FlyIn-scroll > div:last-of-type').style.display =
    'none';
  // Remove "Tidigare adresser"
  waitFor('.List', '.FlyIn-scroll', () => {
    document.querySelector('.FlyIn-scroll h4').style.display = 'none';
    document.querySelector('.FlyIn-scroll ul').style.display = 'none';
  });

  // When you've entered a zip code
  waitFor('.Cart', '#portal .Modal-container > div:not(.overlay)', () => {
    document.querySelector('.FlyIn-close')?.click();
  });

  document.querySelector('.FlyIn-scroll').classList.add('is-redesign');
}

function newCart() {
  let questionbox = document.createElement('div');

  questionbox.classList.add(
    'u-flex',
    'u-flexDirectionColumn',
    'u-bgWhite',
    'u-sizeFull',
    'u-sm-size540'
  );

  if (isPhone) {
    questionbox.classList.add('u-heightAll');
  }

  questionbox.style.position = 'absolute';

  questionbox.append(imageLaptop);

  let h2 = document.createElement('h2');
  h2.innerText = 'Dina senaste val';
  h2.style.marginBottom = '0';
  questionbox.append(h2);

  let p = document.createElement('p');

  const deliveryData = {
    postalcode: document.querySelector('[data-test=changePostalCode]')
      ?.textContent,
    storename: document.querySelector('[data-test=pickupStoreLink]')
      ?.textContent,
  };

  if (deliveryData.postalcode) {
    p.innerHTML = `<strong>Hemleverans</strong> till <strong>${deliveryData.postalcode}<strong>`;
  } else {
    p.innerHTML = `<strong>Hämtas</strong> på <strong>${deliveryData.storename}</strong>`;
  }

  p.querySelectorAll('strong').forEach((element) => {
    element.style.color = '#008844';
  });

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
    closebutton.classList.add('u-sizeFull');
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
    changebutton.classList.add('u-sizeFull');
  } else {
    changebutton.style.width = '280px';
  }
  changebutton.style.margin = '0 auto';

  changebutton.innerText = 'Nej, jag vill ändra mina val';

  let containerDiv = document.querySelector(
    '#portal .Modal-container > div:not(.overlay)'
  );

  changebutton.addEventListener('click', () => {
    dataLayer.push({
      event: 'interaction',
      eventCategory: 'Experiment',
      eventAction: 'storefocus-change',
      eventLabel: '',
    });

    if (!isPhone) {
      document
        .querySelector('#portal .Modal-container > div:not(.overlay)')
        .classList.add('u-heightAll');
    }

    document
      .querySelector('[data-test=cncheader-chagedeliverymethodbutton]')
      ?.click();
    questionbox.remove();

    containerDiv.classList.add('u-flex');
    containerDiv.classList.remove('u-hidden');

    setStyling(
      document.querySelector('#portal .Modal-container > div:not(.overlay)')
    );

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
      '<svg role="img"><svg id="pointer-left" viewBox="0 0 12 14"><path d="M12.3 6.9H-.2m5 5l-5-5 5-5"></path></svg></svg>';
    containerDiv.prepend(back);

    back.addEventListener('click', (event) => {
      pushEvent('zipback');
      newCart();
    });

    waitFor(
      '.Heading--h2',
      '#portal .Modal-container > div:not(.overlay)',
      () => {
        redesignDelivery();
      }
    );

    if (!document.querySelector('.FlyIn-scroll.is-redesign')) {
      redesignZip();
    }
  });
  questionbox.append(changebutton);

  containerDiv.classList.remove('u-flex');
  containerDiv.classList.add('u-hidden');

  questionbox.style.textAlign = 'center';
  setStyling(questionbox);

  console.debug('<experiment> Append questionbox', questionbox);
  document.querySelector('#portal .Modal-container').append(questionbox);
}

if (isStoreSet) {
  console.debug('<experiment> Open cart');
  document.querySelector('.CartButton').click();

  centerModal();
  waitFor('.Cart-header', '#portal', () => {
    pushEvent('newCart');
    newCart();
  });
} else {
  // WHILE TESTING: Trigger on local machine:
  // document.querySelector('.CartButton').click();

  // centerModal();
  waitFor('.FlyIn-header', '#portal', () => {
    pushEvent('welcome');
    welcome();
  });
}
