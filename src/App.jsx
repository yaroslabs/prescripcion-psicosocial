import { useState } from 'react';
import FormDatos from './components/FormDatos.jsx';
import FormProfesional from './components/FormProfesional.jsx';
import SelectorDimensiones from './components/SelectorDimensiones.jsx';
import BotonGenerar from './components/BotonGenerar.jsx';
import ModoMasivo from './components/ModoMasivo.jsx';
import { generarMatriz } from './utils/generateDoc.js';
import { validarDatos } from './utils/validation.js';

const EMPRESA_INICIAL = {
  rutEmpresa: '',
  nombreEmpresa: '',
  nombreCT: '',
  tipoCalle: 'Avenida',
  calleCT: '',
  numeroCT: '',
  comunaCT: '',
  dotacionTotal: '',
  tipoMatriz: 'primera',
};

const PROFESIONAL_INICIAL = {
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  rut: '',
  email: '',
};

export default function App() {
  const [tab, setTab] = useState('individual');

  // Estado del modo individual — se preserva al cambiar de tab
  const [datosEmpresa, setDatosEmpresa] = useState(EMPRESA_INICIAL);
  const [datosProfesional, setDatosProfesional] = useState(PROFESIONAL_INICIAL);
  const [dimensionesSeleccionadas, setDimensionesSeleccionadas] = useState([]);
  const [politicaRPSL, setPoliticaRPSL] = useState('no');
  const [dimensionPolitica, setDimensionPolitica] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState({ error: '', exito: '' });

  const handleGenerar = async () => {
    setMensajes({ error: '', exito: '' });
    const errores = validarDatos(
      datosEmpresa,
      datosProfesional,
      dimensionesSeleccionadas,
      politicaRPSL,
      dimensionPolitica
    );
    if (errores.length > 0) {
      setMensajes({ error: errores.join('\n'), exito: '' });
      return;
    }
    setCargando(true);
    try {
      await generarMatriz({
        ...datosEmpresa,
        ...datosProfesional,
        dimensionesSeleccionadas,
        politicaRPSL,
        dimensionPolitica,
        nombrequienfirma: datosProfesional.nombre,
        apellidopatQF: datosProfesional.apellidoPaterno,
        apellidomatQF: datosProfesional.apellidoMaterno,
        rutQF: datosProfesional.rut,
        emailQF: datosProfesional.email,
      });
      setMensajes({ error: '', exito: 'Documento generado y descargado exitosamente.' });
    } catch (e) {
      setMensajes({ error: `Error al generar el documento: ${e.message}`, exito: '' });
    } finally {
      setCargando(false);
    }
  };

  const formularioCompleto =
    datosEmpresa.rutEmpresa &&
    datosEmpresa.nombreEmpresa &&
    datosEmpresa.nombreCT &&
    datosEmpresa.dotacionTotal &&
    datosProfesional.nombre &&
    datosProfesional.apellidoPaterno &&
    datosProfesional.rut &&
    datosProfesional.email &&
    dimensionesSeleccionadas.length > 0 &&
    (politicaRPSL === 'no' || (politicaRPSL === 'si' && dimensionPolitica));

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">MS</div>
          <div>
            <h1 className="header-title">Prescripción Psicosocial</h1>
            <p className="header-sub">Generador de Matrices de Diseño de Medidas de Intervención</p>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-btn${tab === 'individual' ? ' activo' : ''}`}
            onClick={() => setTab('individual')}
          >
            Matriz Individual
          </button>
          <button
            className={`tab-btn${tab === 'masivo' ? ' activo' : ''}`}
            onClick={() => setTab('masivo')}
          >
            Generación Masiva
          </button>
        </div>

        {/* Modo Individual */}
        {tab === 'individual' && (
          <>
            <section className="card">
              <h2 className="section-title">
                <span className="section-num">1</span> Datos del Centro de Trabajo
              </h2>
              <FormDatos datos={datosEmpresa} onChange={setDatosEmpresa} />
            </section>

            <section className="card">
              <h2 className="section-title">
                <span className="section-num">2</span> Datos del Profesional
              </h2>
              <FormProfesional datos={datosProfesional} onChange={setDatosProfesional} />
            </section>

            <section className="card">
              <h2 className="section-title">
                <span className="section-num">3</span> Dimensiones con Riesgo
              </h2>
              <SelectorDimensiones
                dimensionesSeleccionadas={dimensionesSeleccionadas}
                onDimensionesChange={setDimensionesSeleccionadas}
                politicaRPSL={politicaRPSL}
                onPoliticaChange={setPoliticaRPSL}
                dimensionPolitica={dimensionPolitica}
                onDimensionPoliticaChange={setDimensionPolitica}
              />
            </section>

            {mensajes.error && (
              <div className="alerta alerta-error">
                <strong>Por favor corrija los siguientes errores:</strong>
                <ul>
                  {mensajes.error.split('\n').map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {mensajes.exito && (
              <div className="alerta alerta-exito">{mensajes.exito}</div>
            )}

            <section className="card generar-section">
              <BotonGenerar
                onClick={handleGenerar}
                cargando={cargando}
                habilitado={formularioCompleto}
              />
            </section>
          </>
        )}

        {/* Modo Masivo */}
        {tab === 'masivo' && <ModoMasivo />}
      </main>

      <footer className="app-footer" />
    </div>
  );
}
