const STORAGE_KEY = 'representanteEmpresa';
const CAMPOS = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'rut', 'email'];
const VACIO = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', rut: '', email: '' };

function esFormatoValido(data) {
  return !!data && typeof data === 'object' && CAMPOS.every((k) => typeof data[k] === 'string');
}

/**
 * Lee los datos del representante de empresa guardados en localStorage.
 * Devuelve valores vacíos si no hay nada guardado o si el contenido no
 * tiene el formato esperado.
 */
export function leerRepresentanteEmpresa() {
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

export function guardarRepresentanteEmpresa(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function borrarRepresentanteEmpresa() {
  localStorage.removeItem(STORAGE_KEY);
}
