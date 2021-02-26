var sidebarTriggerBarIcon = document.querySelector('.js-sidebarTrigger .Bar-icon');

if (sidebarTriggerBarIcon) {
  sidebarTriggerBarIcon.style.width = '18px';
  sidebarTriggerBarIcon.style.height = '18px';
  sidebarTriggerBarIcon.innerHTML = "\n    <line x1=\"5.5\" y1=\"15.5\" x2=\"16.5\" y2=\"15.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    <line x1=\"5.5\" y1=\"9.5\" x2=\"16.5\" y2=\"9.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    <line x1=\"5.5\" y1=\"3.5\" x2=\"16.5\" y2=\"3.5\" stroke=\"#005537\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    <circle cx=\"1.5\" cy=\"15.5\" r=\"1\" fill=\"#005537\"/>\n    <circle cx=\"1.5\" cy=\"9.5\" r=\"1\" fill=\"#005537\"/>\n    <circle cx=\"1.5\" cy=\"3.5\" r=\"1\" fill=\"#005537\"/>\n  ";
}