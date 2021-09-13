t61();

document.addEventListener('cover.ready T61', () => {
  t61();
});

function t61() {
  // Create element
  const scrollToTop = document.createElement('div');
  scrollToTop.classList.add('scrollToTop', 'Experiment', 'T61');
  scrollToTop.innerHTML =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L12 20M12 4L5 11M12 4L19 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const experimentStyle = document.createElement('style');
  experimentStyle.innerHTML = `
    .T61 {
      position: fixed;
      bottom: 10px;
      right: 20px;
      background-color: #005537;
      border-radius: 50%;
      height: 75px;
      width: 75px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 4;
      cursor: pointer;
    }
    `;

  scrollToTop.appendChild(experimentStyle);
  document.body.append(scrollToTop);

  // Add click function
  scrollToTop.addEventListener('click', (event) => {
    scrollToTop.remove(); // animation?
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Remove observer if user scroll back to top
  const header = document.querySelector('header');
  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // remove button when header is visible
        scrollToTop.remove();
        observer.unobserve(header);
      }
    });
  });
  observer.observe(header);

  // Remove when page unload
  window.addEventListener('popstate', function (event) {
    scrollToTop.remove();
    observer.unobserve(header);
  });
  window.addEventListener('ga:virtualPageView', () => {
    scrollToTop.remove();
    observer.unobserve(header);
  });
}
