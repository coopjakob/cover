// Leta efter ".Notice.Notice--info.Notice--animated.Notice--center.is-visible"
// Default store notice ribbon

// body > main > div.js-childLayoutContainer.u-marginTmd > div > div.Main-container.Main-container--full.Main-container--padding > div.Section.Section--margin > div > div.Grid-cell.Grid-cell--grownWidth > div > div > div >

// div

// .Notice.Notice--info.Notice--animated.Notice--center.is-visible

// body > main > div.Bar.Bar--extendedHeader.Bar--global.Bar--green.js-globalSearchBar.js-fixedLayout.u-noPrint > div > div > div > section > div.Bar-dropdown.u-sizeFull > div > div.mixinScroll > div:nth-child(1) >

// div
// .Notice.Notice--info.Notice--animated.Notice--center.is-visible

(() => {
  // Notice Notice--info Notice--animated Notice--center u-marginBmd is-visible
  const selector = '.Notice.Notice--info.Notice--animated.Notice--center';
  const content = 'Nu visas varor för: Hemleverans i StockholmÄndra';
  const element = document.querySelector(selector);

  const hasCorrectContent = (element) => {
    if (element?.textContent == content) {
      return true;
    }
    return false;
  };

  const addIdentifierClasses = (element) => {
    element.classList.add('Experiment', 'T35', 'variant1-delete');
  };

  if (hasCorrectContent(element)) {
    addIdentifierClasses(element);
  } else {
    waitFor(selector, '.Main', (element) => {
      if (hasCorrectContent(element)) {
        addIdentifierClasses(element);
      }
    });
  }

  // Kolla om texten är;
  // $0.innerText
  // "Nu visas varor för: Hemleverans i Stockholm"

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

            console.debug(
              '<experiment> callback',
              node.querySelector(selector)
            );
            callback(node.querySelector(selector)); //duplicate
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
})();
