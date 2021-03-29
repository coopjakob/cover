const element = document.querySelector('[data-test=mobileCategoryTrigger]');

if (element) {
  run();
} else {
  const wrapper = document.querySelector('#ecommerceHeader');

  const observer = new MutationObserver((mutationsList) => {
    console.debug('<experiment> change detected');
    for (const mutation of mutationsList) {
      console.debug('<experiment> mutation', mutation);

      if (
        mutation.addedNodes.length > 0 &&
        mutation.addedNodes[0].querySelector(
          '[data-test=mobileCategoryTrigger]'
        )
      ) {
        console.debug('<experiment> run change');
        run();

        observer.disconnect();
      }
    }
  });

  console.debug('<experiment> observing search results');
  observer.observe(wrapper, {
    attributes: false,
    childList: true,
  });
}

function run() {
  let sidebarTriggerBarIcon = document.querySelector(
    '.js-sidebarTrigger .Bar-icon'
  );

  if (sidebarTriggerBarIcon) {
    sidebarTriggerBarIcon.style.width = '18px';
    sidebarTriggerBarIcon.style.height = '18px';
    sidebarTriggerBarIcon.innerHTML =
      '<path stroke="#005537" stroke-linecap="round" stroke-linejoin="round" d="M5.5 15.5h11M5.5 9.5h11M5.5 3.5h11"/><circle cx="1.5" cy="15.5" r="1" fill="#005537"/><circle cx="1.5" cy="9.5" r="1" fill="#005537"/><circle cx="1.5" cy="3.5" r="1" fill="#005537"/>';
  }
}
