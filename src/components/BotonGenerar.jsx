export default function BotonGenerar({ onClick, cargando, habilitado }) {
  return (
    <div>
      <button
        className={`btn-generar ${cargando ? 'cargando' : ''}`}
        onClick={onClick}
        disabled={!habilitado || cargando}
      >
        {cargando && <span className="spinner" />}
        {cargando ? 'Generando documento...' : 'GENERAR MATRIZ'}
      </button>
      {!habilitado && !cargando && (
        <p className="btn-hint">
          Complete todos los campos obligatorios (*) y seleccione al menos una dimensión.
        </p>
      )}
    </div>
  );
}
