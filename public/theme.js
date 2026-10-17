// Applies the saved theme before the first paint so the page never flashes
// in the wrong colors. Kept as a tiny external file so the app can be served
// with a Content-Security-Policy that forbids inline scripts.
try {
  var theme = localStorage.getItem('bodydo.theme') || localStorage.getItem('homebody.theme');
  if (theme === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    document.documentElement.dataset.theme = 'dark';
  }
} catch (e) {
  document.documentElement.dataset.theme = 'dark';
}
