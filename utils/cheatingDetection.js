export const detectCheating = (event) => {
  return event.includes('tab') || event.includes('face') || event.includes('blur');
};
