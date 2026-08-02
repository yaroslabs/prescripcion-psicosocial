import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import templateUrl from '../assets/plantilla.docx?url';
import { sumarAnios, formatearFechaLocal, parsearFechaISOLocal } from './fechas.js';

/**
 * @param {object} formData
 * @param {{dimensionId: string, dimensionNombre: string, medida: string, origen: string}[]} resolvedMedidas
 * @param {{
 *   returnBlob?: boolean,
 *   preguntasPorDimension?: Record<string, string>,
 *   riesgoPorDimension?: Record<string, {alto: string, medio: string}>,
 *   explicacionesPorDimension?: Record<string, string>,
 *   fechaImplementacionPorDimension?: Record<string, string>,
 *   responsableMonitoreo?: string,
 *   dptoResponsable?: string,
 *   representanteEmpresa?: {nombre?: string, apellidoPaterno?: string, apellidoMaterno?: string, rut?: string, email?: string},
 * }} [options]
 */
export async function generarMatriz(formData, resolvedMedidas, options = {}) {
  const {
    returnBlob = false,
    preguntasPorDimension = {},
    riesgoPorDimension = {},
    explicacionesPorDimension = {},
    fechaImplementacionPorDimension = {},
    responsableMonitoreo = '',
    dptoResponsable = '',
    representanteEmpresa = {},
  } = options;

  // Por defecto, 1 año después de la fecha en que se genera el documento;
  // se puede sobrescribir por dimensión desde "Ajustar medidas".
  const fechaImplementacionDefault = formatearFechaLocal(sumarAnios(new Date(), 1));
  function resolverFechaImplementacion(dimensionId) {
    const iso = fechaImplementacionPorDimension[dimensionId];
    return iso ? formatearFechaLocal(parsearFechaISOLocal(iso)) : fechaImplementacionDefault;
  }

  const medidas = resolvedMedidas.map((r, i) => ({
    FolioMedida:           i + 1,
    DimensionMedida:       r.dimensionNombre,
    medidaprescrita:       r.medida,
    porcentajeriesgomedio: riesgoPorDimension[r.dimensionId]?.medio ?? '',
    porcentajeriesgoalto:  riesgoPorDimension[r.dimensionId]?.alto ?? '',
    preguntasmayorpuntaje: preguntasPorDimension[r.dimensionId] ?? '',
    'explicación':         explicacionesPorDimension[r.dimensionId] ?? '',
    'Fechaimplementación': resolverFechaImplementacion(r.dimensionId),
  }));

  const response = await fetch(templateUrl);
  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);

  // paragraphLoop: true es el equivalente free de ParagraphLoopModule
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  doc.render({
    FechaDocumento: formData.fechaDocumento ?? '',
    NDocumento:     formData.nDocumento     ?? '',
    RutEmpresa:     formData.rutEmpresa     ?? '',
    NombreEmpresa:  formData.nombreEmpresa  ?? '',
    NombreCT:       formData.nombreCT       ?? '',
    TipocalleCT:    formData.tipoCalle      ?? '',
    CalleCT:        formData.calleCT        ?? '',
    NumeroCT:       formData.numeroCT       ?? '',
    ComunaCT:       formData.comunaCT       ?? '',
    DotacionCT:     formData.dotacionTotal  ?? '',
    nombrequienfirma: formData.nombrequienfirma ?? '',
    apellidopatQF:    formData.apellidopatQF    ?? '',
    apellidomatQF:    formData.apellidomatQF    ?? '',
    rutQF:            formData.rutQF            ?? '',
    emailQF:          formData.emailQF          ?? '',
    ResponsableMonitoreo: responsableMonitoreo ?? '',
    DptoResponsable:      dptoResponsable      ?? '',
    Nombrfirmaempresa: representanteEmpresa.nombre           ?? '',
    apatQFempresa:     representanteEmpresa.apellidoPaterno  ?? '',
    amatQFempresa:     representanteEmpresa.apellidoMaterno  ?? '',
    RutQFempresa:      representanteEmpresa.rut              ?? '',
    emailQFempresa:    representanteEmpresa.email            ?? '',
    medidas,
  });

  // Insertar salto de página solo entre tablas del loop de medidas
  const PAGE_BREAK = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
  const MARKER = 'PRESCRIPCIÓN DE MEDIDAS';
  let xml = doc.getZip().files['word/document.xml'].asText();

  // Extraer todas las tablas como bloques completos <w:tbl>...</w:tbl>
  const tableRegex = /<w:tbl[\s\S]*?<\/w:tbl>/g;
  const allTables = [...xml.matchAll(tableRegex)];

  // Índices (en allTables) de las tablas que pertenecen al loop de medidas
  const loopIndices = allTables
    .map((m, i) => (m[0].includes(MARKER) ? i : -1))
    .filter((i) => i !== -1);

  // Insertar PAGE_BREAK después de cada tabla del loop excepto la última del grupo
  // Recorre de atrás hacia adelante para no invalidar los índices de match
  for (let k = loopIndices.length - 2; k >= 0; k--) {
    const tableMatch = allTables[loopIndices[k]];
    const insertAt = tableMatch.index + tableMatch[0].length;
    xml = xml.slice(0, insertAt) + PAGE_BREAK + xml.slice(insertAt);
  }

  doc.getZip().file('word/document.xml', xml);

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });

  if (returnBlob) return blob;

  const empresa = (formData.nombreEmpresa || 'Empresa')
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_')
    .slice(0, 40);
  const fecha = (formData.fechaDocumento || new Date().toISOString().slice(0, 10)).replace(/[-/]/g, '_');

  saveAs(blob, `Matriz_${empresa}_${fecha}.docx`);
}
