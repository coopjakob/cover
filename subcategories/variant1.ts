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

isMenuUpdated();

function isMenuUpdated() {
  console.debug('<experiment> check if menu is updated');

  let allExpanded = document.querySelectorAll('.js-sidebarNavItem.is-expanded');
  let lastExpanded = allExpanded[allExpanded.length - 1];
  let lastExpandedId = lastExpanded.dataset.id;
  let sectionHeader = lastExpanded.firstElementChild;
  let sectionPath = sectionHeader.firstElementChild.getAttribute('href');

  if (sectionPath == window.location.pathname) {
    console.debug('<experiment> menu updated, check if page is updated');
    isPageUpdated(lastExpandedId);
  } else {
    console.debug('<experiment> old menu, try again');
    setTimeout(isMenuUpdated, 100);
  }
}

function isPageUpdated(to) {
  console.debug('<experiment> check if page is updated');
  let page = document.querySelector('.js-page');
  let pageSectionId = page.dataset.sectionId;

  if (pageSectionId == to) {
    console.debug('<experiment> page updated, show subcategories');
    showSubcategories();
  } else {
    console.debug('<experiment> old page, try again');
    setTimeout(() => {
      isPageUpdated(to);
    }, 100);
  }
}
