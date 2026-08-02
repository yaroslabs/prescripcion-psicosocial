const STORAGE_KEY = 'responsablesMonitoreo';
const VACIO = { responsableMonitoreo: '', dptoResponsable: '' };

function esFormatoValido(data) {
  return (
    !!data &&
    typeof data === 'object' &&
    typeof data.responsableMonitoreo === 'string' &&
    typeof data.dptoResponsable === 'string'
  );
}

/**
 * Lee el responsable de monitoreo y el departamento responsable guardados en
 * localStorage. Devuelve valores vacíos si no hay nada guardado o si el
 * contenido no tiene el formato esperado.
 */
export function leerResponsables() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return { ...VACIO };
  }
  if (!raw) return { ...VACIO };

  try {
    const data = JSON.parse(raw);
    return esFormatoValido(data) ? data : { ...VACIO };
  } catch {
    return { ...VACIO };
  }
}

export function guardarResponsables(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function borrarResponsables() {
  localStorage.removeItem(STORAGE_KEY);
}
