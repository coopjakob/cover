function init() {
  if (window.location.pathname.startsWith('/handla/')) {
    if (COOP.config.user == 'anonymous' || COOP.config.user == 'anonymousb2b') {
      return true;
    }
    return false;
  } else if (coopUserSettings.isAuthenticated == false) {
    return true;
  }
  return false;
}
