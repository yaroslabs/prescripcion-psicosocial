import { useRef, useState } from 'react';
import { DIMENSIONES } from '../utils/medidas.js';
import { crearSnapshotDesdeOficial } from '../utils/defaultMedidasSource.js';
import {
  leerMedidasPersonalizadas,
  guardarMedidasPersonalizadas,
  borrarMedidasPersonalizadas,
} from '../utils/medidasPersonalizadasStorage.js';
import { exportarMedidasAExcel, importarMedidasDesdeExcel } from '../utils/medidasExcel.js';
import { sumarAnios, formatearFechaISO } from '../utils/fechas.js';

const POLITICA_KEY = '__politica__';

export default function EditorMedidas({ onClose }) {
  const [snapshot, setSnapshot] = useState(
    () => leerMedidasPersonalizadas() ?? crearSnapshotDesdeOficial()
  );
  const [dimensionActiva, setDimensionActiva] = useState(DIMENSIONES[0].id);
  const [mensaje, setMensaje] = useState(null);
  const fileRef = useRef();

  const medidasActivas = snapshot.medidasPorDimension[dimensionActiva] ?? [];
  const fechaImplementacionPorDefecto = formatearFechaISO(sumarAnios(new Date(), 1));
  const fechaImplementacionActiva = snapshot.fechasImplementacion?.[dimensionActiva] ?? fechaImplementacionPorDefecto;

  function actualizarMedidas(nuevaLista) {
    setSnapshot((prev) => ({
      ...prev,
      medidasPorDimension: { ...prev.medidasPorDimension, [dimensionActiva]: nuevaLista },
    }));
  }

  function handleEditarFechaImplementacion(iso) {
    setSnapshot((prev) => ({
      ...prev,
      fechasImplementacion: { ...(prev.fechasImplementacion ?? {}), [dimensionActiva]: iso },
    }));
  }

  function handleEditar(index, texto) {
    actualizarMedidas(medidasActivas.map((m, i) => (i === index ? { ...m, medida: texto } : m)));
  }

  function handleAgregar() {
    const nombreDimension = DIMENSIONES.find((d) => d.id === dimensionActiva)?.nombre ?? '';
    actualizarMedidas([...medidasActivas, { dimension: nombreDimension, medida: '' }]);
  }

  function handleEliminar(index) {
    if (!window.confirm('¿Eliminar esta medida?')) return;
    actualizarMedidas(medidasActivas.filter((_, i) => i !== index));
  }

  function handleMover(index, delta) {
    const destino = index + delta;
    if (destino < 0 || destino >= medidasActivas.length) return;
    const nuevas = [...medidasActivas];
    [nuevas[index], nuevas[destino]] = [nuevas[destino], nuevas[index]];
    actualizarMedidas(nuevas);
  }

  function handleEditarPolitica(texto) {
    setSnapshot((prev) => ({ ...prev, politicaRPSL: { ...prev.politicaRPSL, medida: texto } }));
  }

  function handleGuardar() {
    guardarMedidasPersonalizadas(snapshot);
    onClose();
  }

  function handleRestaurar() {
    if (!window.confirm('¿Restaurar el catálogo oficial? Se perderá toda personalización guardada.')) return;
    borrarMedidasPersonalizadas();
    onClose();
  }

  function handleExportar() {
    exportarMedidasAExcel(snapshot);
  }

  function handleImportarClick() {
    fileRef.current?.click();
  }

  async function handleArchivoSeleccionado(e) {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const { snapshot: nuevoSnapshot, advertencias } = await importarMedidasDesdeExcel(file, snapshot);
      setSnapshot(nuevoSnapshot);
      const sufijoAdvertencias = advertencias.length ? ` Advertencias: ${advertencias.join(' ')}` : '';
      setMensaje({
        tipo: 'exito',
        texto: `Se importaron las medidas del archivo. Revisa los cambios y presiona "Guardar cambios" para aplicarlos.${sufijoAdvertencias}`,
      });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Ajustar medidas">
      <div className="modal-editor">
        <div className="modal-header">
          <h2>Ajustar medidas</h2>
          <button className="modal-cerrar" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {mensaje && (
          <div className={`alerta ${mensaje.tipo === 'error' ? 'alerta-error' : 'alerta-exito'} editor-alerta`}>
            {mensaje.texto}
          </div>
        )}

        <div className="modal-body">
          <div className="editor-dimensiones-lista">
            {DIMENSIONES.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`editor-dim-btn${d.id === dimensionActiva ? ' activo' : ''}`}
                onClick={() => setDimensionActiva(d.id)}
              >
                {d.nombre}
              </button>
            ))}
            <button
              type="button"
              className={`editor-dim-btn${dimensionActiva === POLITICA_KEY ? ' activo' : ''}`}
              onClick={() => setDimensionActiva(POLITICA_KEY)}
            >
              Política RPSL
            </button>
          </div>

          <div className="editor-medidas-panel">
            {dimensionActiva === POLITICA_KEY ? (
              <div className="editor-medida-item">
                <textarea
                  value={snapshot.politicaRPSL.medida}
                  onChange={(e) => handleEditarPolitica(e.target.value)}
                  rows={3}
                />
              </div>
            ) : (
              <>
                <div className="form-group editor-fecha-implementacion">
                  <label>Fecha de implementación</label>
                  <input
                    type="date"
                    value={fechaImplementacionActiva}
                    onChange={(e) => handleEditarFechaImplementacion(e.target.value)}
                  />
                </div>
                {medidasActivas.length === 0 && (
                  <p className="editor-vacio">No hay medidas en esta dimensión.</p>
                )}
                {medidasActivas.map((m, i) => (
                  <div key={i} className="editor-medida-item">
                    <textarea
                      value={m.medida}
                      onChange={(e) => handleEditar(i, e.target.value)}
                      rows={2}
                    />
                    <div className="editor-medida-acciones">
                      <button type="button" onClick={() => handleMover(i, -1)} disabled={i === 0} aria-label="Subir">↑</button>
                      <button type="button" onClick={() => handleMover(i, 1)} disabled={i === medidasActivas.length - 1} aria-label="Bajar">↓</button>
                      <button type="button" onClick={() => handleEliminar(i)} aria-label="Eliminar">🗑</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="editor-agregar-btn" onClick={handleAgregar}>
                  + Agregar medida
                </button>
              </>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-footer-izquierda">
            <button type="button" className="btn btn-secondary" onClick={handleExportar}>
              Exportar a Excel
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleImportarClick}>
              Importar desde Excel
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={handleArchivoSeleccionado}
            />
            <button type="button" className="btn btn-secondary" onClick={handleRestaurar}>
              Restaurar catálogo oficial
            </button>
          </div>
          <div className="modal-footer-derecha">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="button" className="btn btn-primary" onClick={handleGuardar}>Guardar cambios</button>
          </div>
        </div>
      </div>
    </div>
  );
}
