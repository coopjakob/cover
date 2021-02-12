let experimentArea = document.createElement('div');
experimentArea.classList.add('experiment', 'u-marginBsm');

let sidebarNavItemExpanded = document.querySelectorAll(
  '.js-sidebarNavItem.is-expanded'
);

if (sidebarNavItemExpanded.length <= 2) {
  let inTopLevel = sidebarNavItemExpanded.length == 1;

  let headingTitle;
  if (inTopLevel) {
    headingTitle = sidebarNavItemExpanded[0].querySelectorAll(
      '.js-sectionSubLevel .SidebarNav-headingTitle'
    );
  } else {
    headingTitle = sidebarNavItemExpanded[1].querySelectorAll(
      '.SidebarNav-subPanel .SidebarNav-headingTitle'
    );
  }

  headingTitle.forEach((title) => {
    let link = document.createElement('a');
    link.classList.add(
      'js-asyncLink',
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
