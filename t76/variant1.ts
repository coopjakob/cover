T76();

document.addEventListener('cover.ready T76', (event) => {
  T76();
});

function T76() {
  const element = document.querySelector('.Experiment.T76');
  const heading = element.querySelector('.Heading');
  const p = element.querySelector('p');

  element.classList.add('u-paddingTxxlg');

  const imageLaptop = document.createElement('img');
  imageLaptop.style.margin = '0 auto';
  imageLaptop.style.display = 'block';
  imageLaptop.style.height = '242px';
  imageLaptop.src = 'https://www.coop.se/assets/icons/computer.svg';
  element.prepend(imageLaptop);

  heading.style.fontSize = '45px';
  heading.style.lineHeight = '1em';
  heading.style.fontFamily = 'CoopNew-Black, sans-serif';
  heading.innerHTML = 'Vårt utbud<br>i ditt område';

  p.classList.remove(
    'u-textSmall',
    'u-md-textMedium',
    'u-paddingH',
    'u-marginTz'
  );
  p.classList.add('u-paddingHxxlg');
  p.style.fontSize = '22px';
  p.textContent =
    'Sortiment och leveransalternativ kan variera beroende på område. Ange ditt postnummer för att se ditt utbud.';

  // Remove "Eller, välj att söka efter en butik"
  element.querySelector('p:nth-of-type(2)').style.display = 'none';

  // Remove "Logga in eller Skapa inloggning" and tooltip
  element.lastChild.style.display = 'none';
}
