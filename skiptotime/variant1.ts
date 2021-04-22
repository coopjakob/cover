function checkAllSlotsEmpty() {
  let nextday = document.querySelector('.Timeslots-daySwitch--nextDay');
  console.debug('nextday', nextday);

  let skeleton = document.querySelector('.TimeslotCell--skeleton');
  console.debug('skeleton', skeleton);

  if (nextday && !skeleton) {
    console.debug('check');
    let timeslots = document.querySelectorAll('.TimeslotCell');
    let emptyTimeslots = 0;

    for (const timeslot of timeslots) {
      if (timeslot.textContent.includes('Fullbokad')) {
        emptyTimeslots++;
      }
    }

    if (timeslots.length == emptyTimeslots) {
      console.debug('go');
      document.querySelector('.Timeslots-daySwitch--nextDay').click();
      checkAllSlotsEmpty();
    } else {
      console.debug('stop');
    }
  } else if (document.querySelector('#portal .Modal')) {
    console.debug('wait');
    setTimeout(() => {
      checkAllSlotsEmpty();
    }, 100);
  }
}

checkAllSlotsEmpty();
