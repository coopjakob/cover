function showSubcategories() {
  var sidebarNavItemExpanded = document.querySelectorAll('.js-sidebarNavItem.is-expanded');
  console.debug('sidebarNavItemExpanded:', sidebarNavItemExpanded);
  var experimentArea = document.createElement('div');
  experimentArea.classList.add('experiment', 'u-marginBsm');

  if (sidebarNavItemExpanded.length <= 2) {
    var inTopLevel = sidebarNavItemExpanded.length == 1;
    var headingTitle;

    if (inTopLevel) {
      headingTitle = sidebarNavItemExpanded[0].querySelectorAll('.js-sectionSubLevel .SidebarNav-headingTitle');
    } else {
      headingTitle = sidebarNavItemExpanded[1].querySelectorAll('.SidebarNav-subPanel .SidebarNav-headingTitle');
    }

    headingTitle.forEach(function (title) {
      var link = document.createElement('a');
      link.classList.add('js-asyncLink', 'js-link', 'Link', 'Link--green', 'u-paddingAxsm', 'u-marginRxxsm', 'u-marginBxxsm', 'u-bgWhite');
      link.style.display = 'inline-block';
      link.setAttribute('href', title.parentElement.getAttribute('href'));
      link.textContent = title.textContent;
      link.addEventListener('click', function (event) {
        dataLayer.push({
          event: 'interaction',
          eventCategory: 'Experiment',
          eventAction: 'subcategories-click',
          eventLabel: 'level ' + sidebarNavItemExpanded.length
        });
      });
      experimentArea.append(link);
    });
    var productListParent = document.querySelector('.js-productList').parentElement;
    productListParent.prepend(experimentArea);
  }
}

function isMenuUpdated() {
  console.debug('<experiment> check if menu is updated');
  var allExpanded = document.querySelectorAll('.js-sidebarNavItem.is-expanded');
  var lastExpanded = allExpanded[allExpanded.length - 1];
  var sectionHeader = lastExpanded.firstElementChild;
  var sectionPath = sectionHeader.firstElementChild.getAttribute('href');

  if (sectionPath == window.location.pathname) {
    console.debug('<experiment> menu updated, show subcategories');
    showSubcategories();
  } else {
    console.debug('<experiment> old menu, try again');
    setTimeout(isMenuUpdated, 100);
  }
}

isMenuUpdated();