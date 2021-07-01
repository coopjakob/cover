(function run() {
  cover.waitFor(
    '.T32',
    '#portal',
    (element) => {
      element.remove();
      run();
    },
    { init: true, disconnect: false }
  );
})();
