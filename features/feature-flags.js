/*
  New extras start here. Set enabled:false to remove an extra immediately.
  Set beta:true to hide it from regular players; testers can add ?beta=1 to the URL.
*/
window.THERMOREL_FEATURES = Object.assign({
  heatFlash: { enabled: true, beta: false },
  resultSummary: { enabled: true, beta: false },
  calmVisuals: { enabled: true, beta: false }
}, window.THERMOREL_FEATURES);
window.thermorelFeature = name => {
  const feature = window.THERMOREL_FEATURES?.[name];
  if (feature === true) return true;
  if (!feature || feature.enabled === false) return false;
  return !feature.beta || new URLSearchParams(location.search).get('beta') === '1';
};
