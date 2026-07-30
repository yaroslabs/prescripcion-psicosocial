import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { COL_ID, COL_NOMBRE, COL_MEDIDA, snapshotAFilas, filasAaSnapshot } from './medidasExcelFormato.js';

function fechaISO() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Descarga la instantánea de medidas actual como un archivo Excel.
 */
export function exportarMedidasAExcel(snapshot, nombreArchivo) {
  const filas = snapshotAFilas(snapshot);

  const hoja = XLSX.utils.json_to_sheet(filas, { header: [COL_ID, COL_NOMBRE, COL_MEDIDA] });
  hoja['!cols'] = [{ wch: 26 }, { wch: 34 }, { wch: 90 }];
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Medidas');

  const buffer = XLSX.write(libro, { type: 'array', bookType: 'xlsx' });
  saveAs(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    nombreArchivo ?? `biblioteca_medidas_${fechaISO()}.xlsx`
  );
}

function leerFilasDeArchivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(ws, { defval: '' }));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Lee un archivo Excel (File del input del navegador) y lo convierte en una
 * instantánea de medidas lista para usar en el editor.
 */
export async function importarMedidasDesdeExcel(file, snapshotActual) {
  const filas = await leerFilasDeArchivo(file);
  return filasAaSnapshot(filas, snapshotActual);
}
