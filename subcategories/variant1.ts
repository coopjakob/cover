function showSubcategories() {
  let sidebarNavItemExpanded = document.querySelectorAll(
    '.js-sidebarNavItem.is-expanded'
  );
  console.debug('sidebarNavItemExpanded:', sidebarNavItemExpanded);

  let experimentArea = document.createElement('div');
  experimentArea.classList.add('experiment', 't40', 'u-marginBsm');

  if (sidebarNavItemExpanded.length <= 2) {
    let inTopLevel = sidebarNavItemExpanded.length == 1;

    let headingTitle;
    if (inTopLevel) {
      headingTitle = sidebarNavItemExpanded[0].querySelectorAll(
        '.js-sidebarNavList .js-sectionSubLevel > .js-sidebarNavItem.has-children > .js-sectionHeader > a > .SidebarNav-headingTitle'
      );
    } else {
      headingTitle = sidebarNavItemExpanded[1].querySelectorAll(
        '.SidebarNav-subPanel > .js-sectionSubLevel > .js-sidebarNavItem > .js-sectionHeader > a > .SidebarNav-headingTitle'
      );
    }

    headingTitle.forEach((title) => {
      let link = document.createElement('a');
      link.classList.add(
        'js-link',
        'Link',
        'Link--green',
        'u-paddingAxsm',
        'u-marginRxxsm',
        'u-marginBxxsm',
        'u-bgWhite'
      );
      link.style.display = 'inline-block';
      link.setAttribute('href', title.parentElement.getAttribute('href'));
      link.textContent = title.textContent;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        title.parentElement.click();
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'Experiment',
          eventAction: 'subcategories-click',
          eventLabel: 'level ' + sidebarNavItemExpanded.length,
        });
      });
      experimentArea.append(link);
    });

    let productListParent = document.querySelector('.js-productList')
      .parentElement;
    productListParent.prepend(experimentArea);
  }
}

let steps = dataLayer.length;
let step;

while (steps > 0) {
  step = steps - 1;

  if (dataLayer[step].event === 'gtm.historyChange') {
    window.addEventListener('ga:productImpression', isMenuUpdated, {
      once: true,
    });
    break;
  }

  if (step === 0 || dataLayer[step].event === 'impression') {
    isMenuUpdated();
    break;
  }

  steps = steps - 1;
}

function isMenuUpdated() {
  console.debug('<experiment> check if menu is updated');

  let allExpanded = document.querySelectorAll('.js-sidebarNavItem.is-expanded');
  let lastExpanded = allExpanded[allExpanded.length - 1];
  let lastExpandedId = lastExpanded.dataset.id;
  let sectionHeader = lastExpanded.firstElementChild;
  let sectionPath = sectionHeader.firstElementChild.getAttribute('href');

  if (sectionPath == window.location.pathname) {
    console.debug('<experiment> menu updated, check if page is updated');
    showSubcategories();
  } else {
    console.debug('<experiment> old menu, try again');
    setTimeout(isMenuUpdated, 100);
  }
}
