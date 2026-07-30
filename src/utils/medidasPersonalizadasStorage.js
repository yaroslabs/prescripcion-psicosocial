const STORAGE_KEY = 'medidasPersonalizadas';

function esFormatoValido(data) {
  return (
    !!data &&
    typeof data === 'object' &&
    !!data.medidasPorDimension &&
    typeof data.medidasPorDimension === 'object' &&
    !!data.politicaRPSL &&
    typeof data.politicaRPSL.medida === 'string' &&
    typeof data.politicaRPSL.dimension === 'string'
  );
}

/**
 * Lee las medidas personalizadas guardadas en localStorage.
 * Devuelve null si no hay nada guardado o si el contenido no tiene el formato esperado
 * (localStorage corrupto o modificado a mano no debe romper la app).
 */
export function leerMedidasPersonalizadas() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    return esFormatoValido(data) ? data : null;
  } catch {
    return null;
  }
}

export function guardarMedidasPersonalizadas(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function borrarMedidasPersonalizadas() {
  localStorage.removeItem(STORAGE_KEY);
}
