document.addEventListener('DOMContentLoaded', function() {
  const googleTranslateBtn = document.getElementById('googleTranslateBtn');

  if (googleTranslateBtn) {
    googleTranslateBtn.addEventListener('click', function() {
      const current = window.location.href;
      const translateUrl = 'https://translate.google.com/translate?sl=auto&tl=es&u=' + encodeURIComponent(current);

      window.open(translateUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
