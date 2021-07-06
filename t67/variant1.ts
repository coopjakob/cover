(function run() {
  cover.waitFor(
    '.T67',
    '#portal',
    (element) => {
      element.remove();
      run();
    },
    { init: true, disconnect: false }
  );
})();
