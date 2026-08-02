export default function BotonGenerar({ onClick, cargando }) {
  return (
    <div>
      <button
        className={`btn-generar ${cargando ? 'cargando' : ''}`}
        onClick={onClick}
        disabled={cargando}
      >
        {cargando && <span className="spinner" />}
        {cargando ? 'Generando documento...' : 'GENERAR MATRIZ'}
      </button>
    </div>
  );
}
