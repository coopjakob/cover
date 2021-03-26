function checkAllSlotsEmpty() {
  console.debug('check');
  let timeslots = document.querySelectorAll('.TimeslotCell');
  let emptyTimeslots = 0;

  for (const timeslot of timeslots) {
    if (!timeslot.classList.contains('is-available')) {
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
}

checkAllSlotsEmpty();
