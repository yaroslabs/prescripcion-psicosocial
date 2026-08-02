// Los números de serie de Excel cuentan días desde 1899-12-30 (epoch 25569 = 1970-01-01 UTC)
export function excelSerialToDate(serial) {
  const utcDays = Math.floor(serial - 25569);
  return new Date(utcDays * 86400 * 1000);
}

/**
 * Formatea una fecha usando sus componentes UTC (para fechas ya parseadas
 * desde números de serie de Excel, que representan medianoche UTC del día).
 */
export function formatearFechaUTC(date, separador = '/') {
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${dd}${separador}${mm}${separador}${yyyy}`;
}

/**
 * Formatea una fecha usando sus componentes locales (para "hoy" y fechas
 * derivadas de "hoy", como la fecha del documento o la fecha de implementación).
 */
export function formatearFechaLocal(date, separador = '-') {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}${separador}${mm}${separador}${yyyy}`;
}

export function fechaHoy(separador = '-') {
  return formatearFechaLocal(new Date(), separador);
}

export function sumarAnios(date, n) {
  const resultado = new Date(date);
  resultado.setFullYear(resultado.getFullYear() + n);
  return resultado;
}

/** Formatea una fecha como 'YYYY-MM-DD' (formato de <input type="date">), en local. */
export function formatearFechaISO(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Parsea un string 'YYYY-MM-DD' como fecha local a medianoche (no UTC), para
 * evitar el corrimiento de día típico de `new Date('YYYY-MM-DD')` en zonas
 * horarias detrás de UTC.
 */
export function parsearFechaISOLocal(iso) {
  const [yyyy, mm, dd] = iso.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
}
