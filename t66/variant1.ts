(function run() {
  console.debug('<experiment> Wait for T66');
  cover.waitFor(
    '.T66',
    '.Main',
    (element) => {
      console.debug('<experiment> Remove T66');
      element.remove();
      run();
    },
    { init: true, disconnect: false }
  );
})();
