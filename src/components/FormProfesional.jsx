export default function FormProfesional({ datos, onChange }) {
  const set = (campo) => (e) => onChange({ ...datos, [campo]: e.target.value });

  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Nombre(s) <span className="req">*</span></label>
        <input
          type="text"
          value={datos.nombre}
          onChange={set('nombre')}
          placeholder="Nombre(s) del profesional"
        />
      </div>
      <div className="form-group">
        <label>Apellido Paterno <span className="req">*</span></label>
        <input
          type="text"
          value={datos.apellidoPaterno}
          onChange={set('apellidoPaterno')}
          placeholder="Apellido paterno"
        />
      </div>
      <div className="form-group">
        <label>Apellido Materno</label>
        <input
          type="text"
          value={datos.apellidoMaterno}
          onChange={set('apellidoMaterno')}
          placeholder="Apellido materno"
        />
      </div>
      <div className="form-group">
        <label>RUT <span className="req">*</span></label>
        <input
          type="text"
          value={datos.rut}
          onChange={set('rut')}
          placeholder="Ej: 12.345.678-9"
        />
      </div>
      <div className="form-group full">
        <label>Email <span className="req">*</span></label>
        <input
          type="email"
          value={datos.email}
          onChange={set('email')}
          placeholder="correo@ejemplo.cl"
        />
      </div>
    </div>
  );
}
