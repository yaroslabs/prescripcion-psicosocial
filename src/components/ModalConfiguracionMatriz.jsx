import { useState } from 'react';
import { DIMENSIONES } from '../utils/medidas.js';
import FormProfesional from './FormProfesional.jsx';
import {
  leerExplicaciones,
  guardarExplicaciones,
  borrarExplicaciones,
} from '../utils/explicacionesStorage.js';
import {
  leerResponsables,
  guardarResponsables,
  borrarResponsables,
} from '../utils/responsablesStorage.js';
import {
  leerRepresentanteEmpresa,
  guardarRepresentanteEmpresa,
  borrarRepresentanteEmpresa,
} from '../utils/representanteEmpresaStorage.js';

const MAX_CARACTERES_EXPLICACION = 250;
const REPRESENTANTE_VACIO = { nombre: '', apellidoPaterno: '', apellidoMaterno: '', rut: '', email: '' };

const SECCIONES = [
  { id: 'explicaciones', nombre: 'Explicaciones por dimensión' },
  { id: 'responsables', nombre: 'Responsables de monitoreo' },
  { id: 'representante', nombre: 'Representante de empresa' },
];

export default function ModalConfiguracionMatriz({ onClose }) {
  const [seccionActiva, setSeccionActiva] = useState(SECCIONES[0].id);
  const [explicaciones, setExplicaciones] = useState(() => leerExplicaciones());
  const [dimensionExplicacion, setDimensionExplicacion] = useState(DIMENSIONES[0].id);
  const [responsables, setResponsables] = useState(() => leerResponsables());
  const [representanteEmpresa, setRepresentanteEmpresa] = useState(() => leerRepresentanteEmpresa());
  const [mensaje, setMensaje] = useState(null);

  function handleEditarExplicacion(texto) {
    setExplicaciones((prev) => ({ ...prev, [dimensionExplicacion]: texto }));
  }

  function handleReiniciarExplicaciones() {
    if (!window.confirm('¿Borrar todas las explicaciones ingresadas? Esta acción no se puede deshacer.')) return;
    borrarExplicaciones();
    setExplicaciones({});
    setMensaje({ tipo: 'exito', texto: 'Explicaciones reiniciadas.' });
  }

  function handleEditarResponsable(campo, valor) {
    setResponsables((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleBorrarResponsables() {
    if (!window.confirm('¿Borrar el responsable de monitoreo y el departamento responsable?')) return;
    borrarResponsables();
    setResponsables({ responsableMonitoreo: '', dptoResponsable: '' });
    setMensaje({ tipo: 'exito', texto: 'Responsables de monitoreo borrados.' });
  }

  function handleBorrarRepresentante() {
    if (!window.confirm('¿Borrar los datos del representante de empresa?')) return;
    borrarRepresentanteEmpresa();
    setRepresentanteEmpresa({ ...REPRESENTANTE_VACIO });
    setMensaje({ tipo: 'exito', texto: 'Representante de empresa borrado.' });
  }

  function handleGuardar() {
    guardarExplicaciones(explicaciones);
    guardarResponsables(responsables);
    guardarRepresentanteEmpresa(representanteEmpresa);
    onClose();
  }

  const textoActual = explicaciones[dimensionExplicacion] ?? '';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Configuración de la matriz">
      <div className="modal-editor">
        <div className="modal-header">
          <h2>Configuración de la Matriz</h2>
          <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {mensaje && (
          <div className={`alerta ${mensaje.tipo === 'error' ? 'alerta-error' : 'alerta-exito'} editor-alerta`}>
            {mensaje.texto}
          </div>
        )}

        <div className="modal-body">
          <div className="editor-dimensiones-lista">
            {SECCIONES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`editor-dim-btn${s.id === seccionActiva ? ' activo' : ''}`}
                onClick={() => setSeccionActiva(s.id)}
              >
                {s.nombre}
              </button>
            ))}
          </div>

          <div className="editor-medidas-panel">
            {seccionActiva === 'explicaciones' && (
              <>
                <div className="form-group">
                  <label>Dimensión</label>
                  <select
                    value={dimensionExplicacion}
                    onChange={(e) => setDimensionExplicacion(e.target.value)}
                  >
                    {DIMENSIONES.map((d) => (
                      <option key={d.id} value={d.id}>{d.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="editor-medida-item">
                  <textarea
                    value={textoActual}
                    onChange={(e) => handleEditarExplicacion(e.target.value)}
                    maxLength={MAX_CARACTERES_EXPLICACION}
                    rows={5}
                  />
                </div>
                <p className="editor-vacio">{textoActual.length} / {MAX_CARACTERES_EXPLICACION} caracteres</p>
                <button type="button" className="editor-agregar-btn" onClick={handleReiniciarExplicaciones}>
                  Reiniciar explicaciones
                </button>
              </>
            )}

            {seccionActiva === 'responsables' && (
              <>
                <div className="form-group">
                  <label>Responsable de Monitoreo CDA</label>
                  <input
                    type="text"
                    value={responsables.responsableMonitoreo}
                    onChange={(e) => handleEditarResponsable('responsableMonitoreo', e.target.value)}
                    placeholder="Nombre del responsable"
                  />
                </div>
                <div className="form-group">
                  <label>Departamento Responsable</label>
                  <input
                    type="text"
                    value={responsables.dptoResponsable}
                    onChange={(e) => handleEditarResponsable('dptoResponsable', e.target.value)}
                    placeholder="Departamento"
                  />
                </div>
                <button type="button" className="editor-agregar-btn" onClick={handleBorrarResponsables}>
                  Borrar responsables
                </button>
              </>
            )}

            {seccionActiva === 'representante' && (
              <>
                <FormProfesional datos={representanteEmpresa} onChange={setRepresentanteEmpresa} />
                <button type="button" className="editor-agregar-btn" onClick={handleBorrarRepresentante}>
                  Borrar representante de empresa
                </button>
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-izquierda" />
          <div className="modal-footer-derecha">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleGuardar}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}
