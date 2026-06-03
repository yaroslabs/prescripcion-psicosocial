export default function FormDatos({ datos, onChange }) {
  const set = (campo) => (e) => onChange({ ...datos, [campo]: e.target.value });

  return (
    <div>
      <div className="form-grid">
        <div className="form-group">
          <label>RUT Empresa <span className="req">*</span></label>
          <input
            type="text"
            value={datos.rutEmpresa}
            onChange={set('rutEmpresa')}
            placeholder="Ej: 76.123.456-7"
          />
        </div>
        <div className="form-group">
          <label>Razón Social <span className="req">*</span></label>
          <input
            type="text"
            value={datos.nombreEmpresa}
            onChange={set('nombreEmpresa')}
            placeholder="Nombre de la empresa"
          />
        </div>
        <div className="form-group full">
          <label>Nombre del Centro de Trabajo <span className="req">*</span></label>
          <input
            type="text"
            value={datos.nombreCT}
            onChange={set('nombreCT')}
            placeholder="Nombre del centro de trabajo"
          />
        </div>

        <div className="form-group full">
          <label>Dirección del Centro de Trabajo</label>
          <div className="direccion-row">
            <select value={datos.tipoCalle} onChange={set('tipoCalle')}>
              <option value="Avenida">Avenida</option>
              <option value="Calle">Calle</option>
              <option value="Pasaje">Pasaje</option>
              <option value="Caminoo">Camino</option>
              <option value="Ruta">Ruta</option>
              <option value="Población">Población</option>
              <option value="Villa">Villa</option>
            </select>
            <input
              type="text"
              value={datos.calleCT}
              onChange={set('calleCT')}
              placeholder="Nombre de la calle"
            />
            <input
              type="text"
              value={datos.numeroCT}
              onChange={set('numeroCT')}
              placeholder="Número"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Comuna</label>
          <input
            type="text"
            value={datos.comunaCT}
            onChange={set('comunaCT')}
            placeholder="Ej: Santiago"
          />
        </div>
        <div className="form-group">
          <label>Dotación Total <span className="req">*</span></label>
          <input
            type="number"
            value={datos.dotacionTotal}
            onChange={set('dotacionTotal')}
            placeholder="N° de trabajadores"
            min="1"
          />
        </div>

        <div className="form-group full">
          <label>Tipo de Matriz</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="tipoMatriz"
                value="primera"
                checked={datos.tipoMatriz === 'primera'}
                onChange={set('tipoMatriz')}
              />
              Primera aplicación (N° Documento: 1)
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="tipoMatriz"
                value="segunda"
                checked={datos.tipoMatriz === 'segunda'}
                onChange={set('tipoMatriz')}
              />
              Segunda aplicación / Reevaluación (N° Documento: 2)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
