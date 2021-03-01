function() {
  var cookies = document.cookie.split('; ');
  var queries = new URLSearchParams(location.search);

  if (cookies.includes('abtest=true') || queries.get('abtest') == 'true') {
    return true;
  }

  return false;
}