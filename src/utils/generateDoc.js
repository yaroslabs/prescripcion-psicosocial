import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import templateUrl from '../assets/plantilla.docx?url';

/**
 * @param {object} formData
 * @param {{dimensionId: string, dimensionNombre: string, medida: string, origen: string}[]} resolvedMedidas
 * @param {{returnBlob?: boolean}} [options]
 */
export async function generarMatriz(formData, resolvedMedidas, { returnBlob = false } = {}) {
  const medidas = resolvedMedidas.map((r, i) => ({
    FolioMedida:           i + 1,
    DimensionMedida:       r.dimensionNombre,
    medidaprescrita:       r.medida,
    porcentajeriesgomedio: '',
    porcentajeriesgoalto:  '',
    preguntasmayorpuntaje: '',
    'explicación':         '',
    'Fechaimplementación': '',
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
