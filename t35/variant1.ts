(function run() {
  console.debug('<experiment> Wait for T35');
  cover.waitFor(
    '.T35',
    '.Main',
    (element) => {
      console.debug('<experiment> Remove T35');
      element.remove();
      run();
    },
    { init: true, disconnect: false }
  );
})();
