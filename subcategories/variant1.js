var experimentArea = document.createElement('div');
experimentArea.classList.add('experiment', 'u-marginBmd');
var sidebarNavItemExpanded = document.querySelectorAll('.js-sidebarNavItem.has-children.is-expanded');
var inTopLevel = sidebarNavItemExpanded.length == 1;
var headingTitle;

if (inTopLevel) {
  headingTitle = sidebarNavItemExpanded[0].querySelectorAll('.js-sectionSubLevel .SidebarNav-headingTitle');
} else {
  headingTitle = sidebarNavItemExpanded[1].querySelectorAll('.SidebarNav-subPanel .SidebarNav-headingTitle');
}

headingTitle.forEach(function (title) {
  var link = document.createElement('a');
  link.classList.add('js-asyncLink', 'js-link', 'Link', 'Link--green', 'u-paddingAxsm', 'u-marginRsm', 'u-marginVxxsm', 'u-bgWhite');
  link.style.display = 'inline-block';
  link.setAttribute('href', title.parentElement.getAttribute('href'));
  link.textContent = title.textContent;
  link.addEventListener('click', function (event) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Experiment',
      eventAction: 'subcategories-click',
      eventLabel: 'level ' + sidebarNavItemExpanded.length + 1,
      transport: 'beacon'
    });
  });
  experimentArea.append(link);
});
var productListParent = document.querySelector('.js-productList').parentElement;
productListParent.prepend(experimentArea);