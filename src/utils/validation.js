export function validarDatos(
  datosEmpresa,
  datosProfesional,
  dimensionesSeleccionadas,
  politicaRPSL,
  dimensionPolitica
) {
  const errores = [];

  // Empresa
  if (!datosEmpresa.rutEmpresa?.trim())
    errores.push('RUT de empresa es obligatorio.');
  if (!datosEmpresa.nombreEmpresa?.trim())
    errores.push('Razón Social de la empresa es obligatoria.');
  if (!datosEmpresa.nombreCT?.trim())
    errores.push('Nombre del Centro de Trabajo es obligatorio.');
  if (!datosEmpresa.dotacionTotal || Number(datosEmpresa.dotacionTotal) < 1)
    errores.push('Dotación Total debe ser un número mayor a 0.');

  // Profesional
  if (!datosProfesional.nombre?.trim())
    errores.push('Nombre del profesional es obligatorio.');
  if (!datosProfesional.apellidoPaterno?.trim())
    errores.push('Apellido Paterno del profesional es obligatorio.');
  if (!datosProfesional.rut?.trim())
    errores.push('RUT del profesional es obligatorio.');
  if (!datosProfesional.email?.trim())
    errores.push('Email del profesional es obligatorio.');

  // Dimensiones
  if (dimensionesSeleccionadas.length === 0)
    errores.push('Debe seleccionar al menos una dimensión psicosocial.');

  // Política RPSL
  if (politicaRPSL === 'si' && !dimensionPolitica)
    errores.push('Debe seleccionar la dimensión a la que se asociará la Política RPSL.');

  return errores;
}
