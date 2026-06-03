import { DIMENSIONES } from '../utils/medidas.js';

export default function SelectorDimensiones({
  dimensionesSeleccionadas,
  onDimensionesChange,
  politicaRPSL,
  onPoliticaChange,
  dimensionPolitica,
  onDimensionPoliticaChange,
}) {
  const toggleDimension = (id) => {
    if (dimensionesSeleccionadas.includes(id)) {
      const nuevas = dimensionesSeleccionadas.filter((d) => d !== id);
      onDimensionesChange(nuevas);
      if (dimensionPolitica === id) onDimensionPoliticaChange('');
    } else {
      onDimensionesChange([...dimensionesSeleccionadas, id]);
    }
  };

  const handlePoliticaChange = (valor) => {
    onPoliticaChange(valor);
    if (valor === 'no') onDimensionPoliticaChange('');
  };

  const handleDimPoliticaChange = (id) => {
    onDimensionPoliticaChange(id);
    if (!dimensionesSeleccionadas.includes(id)) {
      onDimensionesChange([...dimensionesSeleccionadas, id]);
    }
  };

  return (
    <div>
      {/* Política RPSL */}
      <div className="politica-section">
        <div className="politica-title">Política de Riesgo Psicosocial Laboral (RPSL)</div>
        <div className="politica-row">
          <label className="radio-option">
            <input
              type="radio"
              name="politicaRPSL"
              value="no"
              checked={politicaRPSL === 'no'}
              onChange={() => handlePoliticaChange('no')}
            />
            No incluir Política RPSL
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="politicaRPSL"
              value="si"
              checked={politicaRPSL === 'si'}
              onChange={() => handlePoliticaChange('si')}
            />
            Sí, incluir Política RPSL
          </label>
        </div>

        {politicaRPSL === 'si' && (
          <div className="politica-select-row">
            <label>Asociarla a la dimensión:</label>
            <select
              value={dimensionPolitica}
              onChange={(e) => handleDimPoliticaChange(e.target.value)}
            >
              <option value="">— Seleccionar dimensión —</option>
              {DIMENSIONES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Dimensiones */}
      <div className="contador-dimensiones">
        Dimensiones seleccionadas:{' '}
        <strong>{dimensionesSeleccionadas.length}</strong> de {DIMENSIONES.length}
      </div>
      <div className="dimensiones-grid">
        {DIMENSIONES.map((dim) => {
          const seleccionada = dimensionesSeleccionadas.includes(dim.id);
          return (
            <div
              key={dim.id}
              className={`dimension-item ${seleccionada ? 'seleccionada' : ''}`}
              onClick={() => toggleDimension(dim.id)}
            >
              <input
                type="checkbox"
                checked={seleccionada}
                onChange={() => toggleDimension(dim.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{dim.nombre}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
