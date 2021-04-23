// från varukorg:

// event: "interaction"
// eventAction: "Slider - Varukorg - Överblick"
// eventCallback: undefined
// eventCategory: "Ecommerce"
// eventLabel: "Gå till byte av leveranstid"
// gtm.uniqueEventId: 206
// loginStatus: "Inloggad ej medlem"

// från checkout:

// event: "interaction"
// eventAction: "Checkout - Leverans - Hemleverans"
// eventCallback: undefined
// eventCategory: "Ecommerce"
// eventLabel: "Leveranstid - Lägg till"
// gtm.uniqueEventId: 492
// loginStatus: "Inloggad ej medlem"

// se fler tider, i flödet efter man angett postnummeer:

// event: "interaction"
// eventAction: "Slider - Välj leveranssätt"
// eventCallback: undefined
// eventCategory: "Ecommerce"
// eventLabel: "Se fler tider"
// gtm.uniqueEventId: 303
// loginStatus: "Inloggad ej medlem"

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
      console.debug('optimize.activate.skiptotime');
      dataLayer.push({
        event: 'optimize.activate.skiptotime',
      });
    } else {
      console.debug('stop');
    }
  } else if (document.querySelector('#portal .Modal')) {
    console.debug('wait');
    setTimeout(() => {
      checkAllSlotsEmpty();
    }, 200);
  }
}

checkAllSlotsEmpty();
