(() => {
  const enabled = () => window.THERMOREL_FEATURES?.heatFlash === true;

  document.addEventListener('thermorel:round-result', event => {
    if (!enabled() || !event.detail?.accurate) return;

    const flash = document.createElement('div');
    flash.className = 'heat-flash';
    flash.setAttribute('aria-hidden', 'true');
    flash.textContent = event.detail.combo > 1 ? `HEAT ×${event.detail.combo}` : event.detail.label;
    document.body.append(flash);
    requestAnimationFrame(() => flash.classList.add('is-visible'));
    setTimeout(() => flash.remove(), 760);
  });
})();
