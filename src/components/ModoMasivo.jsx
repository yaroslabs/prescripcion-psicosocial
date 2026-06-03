import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import FormProfesional from './FormProfesional.jsx';
import { generarMatriz } from '../utils/generateDoc.js';

const SIGLAS = [
  { sigla: 'CT', id: 'carga_trabajo' },
  { sigla: 'EM', id: 'exigencias_emocionales' },
  { sigla: 'DP', id: 'desarrollo_profesional' },
  { sigla: 'RC', id: 'reconocimiento_claridad_rol' },
  { sigla: 'CR', id: 'conflicto_rol' },
  { sigla: 'QL', id: 'calidad_liderazgo' },
  { sigla: 'CM', id: 'companerismo' },
  { sigla: 'IT', id: 'inseguridad_condiciones' },
  { sigla: 'TV', id: 'equilibrio_trabajo_vida' },
  { sigla: 'CJ', id: 'confianza_justicia' },
  { sigla: 'VU', id: 'vulnerabilidad' },
  { sigla: 'VA', id: 'violencia_acoso' },
];

const DIM_NOMBRE = {
  carga_trabajo:              'Carga de Trabajo',
  exigencias_emocionales:     'Exig. Emocionales',
  desarrollo_profesional:     'Desarrollo Prof.',
  reconocimiento_claridad_rol:'Reconocimiento/Rol',
  conflicto_rol:              'Conflicto de Rol',
  calidad_liderazgo:          'Calidad Liderazgo',
  companerismo:               'Compañerismo',
  inseguridad_condiciones:    'Inseguridad Cond.',
  equilibrio_trabajo_vida:    'Equilibrio TV',
  confianza_justicia:         'Confianza/Justicia',
  vulnerabilidad:             'Vulnerabilidad',
  violencia_acoso:            'Violencia/Acoso',
};

const PROFESIONAL_INICIAL = {
  nombre: '', apellidoPaterno: '', apellidoMaterno: '', rut: '', email: '',
};

function fechaHoy() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function slug(str) {
  return String(str || '').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_').slice(0, 40);
}

function calcularDimensiones(row) {
  return SIGLAS
    .filter(({ sigla }) => {
      const alto  = parseFloat(row[`Alto ${sigla}`]  ?? 0) || 0;
      const medio = parseFloat(row[`Medio ${sigla}`] ?? 0) || 0;
      return alto >= 50 || medio >= 50;
    })
    .map(({ id }) => id);
}

function parsearExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb   = XLSX.read(e.target.result, { type: 'array' });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        resolve(rows);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export default function ModoMasivo() {
  const [profesional, setProfesional] = useState(PROFESIONAL_INICIAL);
  const [filas, setFilas]             = useState([]);
  const [progreso, setProgreso]       = useState(null);
  const [error, setError]             = useState('');
  const fileRef = useRef();

  const handleExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    try {
      const rows = await parsearExcel(file);
      setFilas(
        rows.map((row, i) => ({
          _n:                    i + 1,
          cuv:                   String(row['CUV']                         ?? ''),
          fechaEvaluacion:       String(row['Fecha Evaluación']            ?? ''),
          rutEmpresa:            String(row['Rut Empleador']               ?? ''),
          nombreEmpresa:         String(row['Razón Social ']               ?? ''),
          nombreCT:              String(row['Nombre Centro de Trabajo']    ?? ''),
          comunaCT:              String(row['Comuna']                      ?? ''),
          dotacionTotal:         String(row['N° Total Trabajadores CT']    ?? ''),
          calleCT:               String(row['Nombre Calle']                ?? ''),
          ot:                    String(row['Orden de Trabajo']              ?? ''),
          nivelRiesgoCT:         (() => {
            const v = Number(row['Nivel de Riesgo CT']);
            if (v === 3) return 'Riesgo Alto';
            if (v === 2) return 'Riesgo Medio';
            if (v === 1) return 'Riesgo Bajo';
            return 'Sin datos';
          })(),
          dimensionesSeleccionadas: calcularDimensiones(row),
        }))
      );
    } catch (err) {
      setError('Error al leer el archivo: ' + err.message);
    }
    e.target.value = '';
  };

  const handleGenerar = async () => {
    setError('');
    const zip   = new JSZip();
    const total = filas.length;
    const hoy   = fechaHoy();

    for (let i = 0; i < filas.length; i++) {
      setProgreso({ actual: i + 1, total });
      // Ceder el hilo para que React actualice la barra de progreso
      await new Promise((r) => setTimeout(r, 0));

      const fila = filas[i];
      const formData = {
        fechaDocumento:           hoy,
        nDocumento:               '1',
        rutEmpresa:               fila.rutEmpresa,
        nombreEmpresa:            fila.nombreEmpresa,
        nombreCT:                 fila.nombreCT,
        tipoCalle:                '',
        calleCT:                  fila.calleCT,
        numeroCT:                 '',
        comunaCT:                 fila.comunaCT,
        dotacionTotal:            fila.dotacionTotal,
        tipoMatriz:               'primera',
        dimensionesSeleccionadas: fila.dimensionesSeleccionadas,
        politicaRPSL:             'si',
        dimensionPolitica:        fila.dimensionesSeleccionadas[0] ?? '',
        nombrequienfirma:         profesional.nombre,
        apellidopatQF:            profesional.apellidoPaterno,
        apellidomatQF:            profesional.apellidoMaterno,
        rutQF:                    profesional.rut,
        emailQF:                  profesional.email,
      };

      try {
        const blob   = await generarMatriz(formData, { returnBlob: true });
        const anioEval = new Date(Math.round((Number(fila.fechaEvaluacion) - 25569) * 86400 * 1000)).getFullYear();
        const nombre = `Matriz_${slug(fila.nombreEmpresa)}_Centro_${slug(fila.nombreCT)}_CUV_${fila.cuv}_Evaluacion_${anioEval}_Riesgo_${slug(fila.nivelRiesgoCT)}${fila.ot ? `_OT_${fila.ot}` : ''}.docx`;
        zip.file(nombre, blob);
      } catch (err) {
        setError(`Error en fila ${i + 1} (${fila.nombreEmpresa}): ${err.message}`);
        setProgreso(null);
        return;
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `Matrices_${hoy.replace(/-/g, '_')}.zip`);
    setProgreso(null);
  };

  const porcentaje = progreso ? Math.round((progreso.actual / progreso.total) * 100) : 0;

  return (
    <div>
      <section className="card">
        <h2 className="section-title">
          <span className="section-num">1</span> Datos del Profesional
        </h2>
        <FormProfesional datos={profesional} onChange={setProfesional} />
      </section>

      <section className="card">
        <h2 className="section-title">
          <span className="section-num">2</span> Importar Excel
        </h2>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx"
          style={{ display: 'none' }}
          onChange={handleExcel}
        />
        <button className="btn btn-secondary" onClick={() => fileRef.current.click()}>
          Importar Excel (.xlsx)
        </button>
        {filas.length > 0 && (
          <p className="masivo-contador">{filas.length} filas cargadas</p>
        )}
      </section>

      {filas.length > 0 && (
        <section className="card">
          <h2 className="section-title">
            <span className="section-num">3</span> Vista Previa
          </h2>
          <div className="tabla-scroll">
            <table className="tabla-previa">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Razón Social</th>
                  <th>Nombre CT</th>
                  <th>CUV</th>
                  <th>Fecha Evaluación</th>
                  <th>Nivel de Riesgo CT</th>
                  <th>N° Dimensiones</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f._n}>
                    <td>{f._n}</td>
                    <td>{f.nombreEmpresa}</td>
                    <td>{f.nombreCT}</td>
                    <td>{f.cuv}</td>
                    <td>{f.fechaEvaluacion}</td>
                    <td>{f.nivelRiesgoCT}</td>
                    <td>
                      {f.dimensionesSeleccionadas.length === 0
                        ? <em className="sin-dim">Ninguna (&lt;50%)</em>
                        : `${f.dimensionesSeleccionadas.length} dimensiones`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {error && <div className="alerta alerta-error">{error}</div>}

      {filas.length > 0 && (
        <section className="card generar-section">
          {progreso ? (
            <div className="progreso-wrapper">
              <p className="progreso-texto">
                Generando {progreso.actual} de {progreso.total}...
              </p>
              <div className="barra-progreso">
                <div className="barra-progreso-inner" style={{ width: `${porcentaje}%` }} />
              </div>
              <p className="progreso-pct">{porcentaje}%</p>
            </div>
          ) : (
            <button className="btn-generar" onClick={handleGenerar}>
              Generar {filas.length} matrices
            </button>
          )}
        </section>
      )}
    </div>
  );
}
