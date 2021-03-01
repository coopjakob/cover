var start = 0;
document.querySelectorAll(".js-add").forEach((element) => {
  setTimeout(() => {
    element.click();
  }, start);
  start += 50;
});
