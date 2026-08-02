const STORAGE_KEY = 'explicacionesPorDimension';

function esFormatoValido(data) {
  return !!data && typeof data === 'object' && !Array.isArray(data);
}

/**
 * Lee las explicaciones por dimensión guardadas en localStorage.
 * Devuelve {} si no hay nada guardado o si el contenido no tiene el formato
 * esperado (localStorage corrupto o modificado a mano no debe romper la app).
 */
export function leerExplicaciones() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return {};
  }
  if (!raw) return {};

  try {
    const data = JSON.parse(raw);
    return esFormatoValido(data) ? data : {};
  } catch {
    return {};
  }
}

export function guardarExplicaciones(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function borrarExplicaciones() {
  localStorage.removeItem(STORAGE_KEY);
}
