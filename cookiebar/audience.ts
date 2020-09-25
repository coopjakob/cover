function init() {
  const cookies = document.cookie.split('; ');

  if (window.location.pathname.startsWith('/handla/')) {
    if (!cookies.includes('cookie-notification=ACCEPTED')) {
      return true;
    }
    return false;
  } else if (!cookies.includes('AcceptedDisclaimer=true')) {
    return true;
  }
  return false;
}
