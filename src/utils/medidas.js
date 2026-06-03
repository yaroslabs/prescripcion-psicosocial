export const DIMENSIONES = [
  { id: 'carga_trabajo',               nombre: 'Carga de Trabajo' },
  { id: 'desarrollo_profesional',      nombre: 'Desarrollo Profesional' },
  { id: 'exigencias_emocionales',      nombre: 'Exigencias Emocionales' },
  { id: 'reconocimiento_claridad_rol', nombre: 'Reconocimiento y Claridad de Rol' },
  { id: 'conflicto_rol',               nombre: 'Conflicto de Rol' },
  { id: 'calidad_liderazgo',           nombre: 'Calidad del Liderazgo' },
  { id: 'companerismo',                nombre: 'Compañerismo' },
  { id: 'inseguridad_condiciones',     nombre: 'Inseguridad en las Condiciones de Trabajo' },
  { id: 'equilibrio_trabajo_vida',     nombre: 'Equilibrio Trabajo-Vida Privada' },
  { id: 'confianza_justicia',          nombre: 'Confianza y Justicia Organizacional' },
  { id: 'vulnerabilidad',              nombre: 'Vulnerabilidad' },
  { id: 'violencia_acoso',             nombre: 'Violencia y Acoso' },
];

export const MEDIDAS_POR_DIMENSION = {
  carga_trabajo: [
    { dimension: 'Carga de Trabajo', medida: 'Distribuir las cargas de trabajo de manera equitativa entre las personas trabajadoras y de acuerdo con el perfil de cargo (asignación justa y participativa de tareas)' },
    { dimension: 'Carga de Trabajo', medida: 'Planificar las metas y objetivos informando con anticipación a las personas trabajadoras' },
    { dimension: 'Carga de Trabajo', medida: 'Asegurar la entrega de capacitaciones y conocimientos adecuados a las personas para que puedan desarrollar su trabajo en los tiempos asignados.' },
    { dimension: 'Carga de Trabajo', medida: 'Planificar y difundir la adecuada duración y frecuencia de las pausas y el tiempo de descanso de acuerdo con la carga de trabajo.' },
  ],

  desarrollo_profesional: [
    { dimension: 'Desarrollo Profesional', medida: 'Realizar capacitaciones periódicas sobre todo en aquellos aspectos críticos de las funciones de los equipos de trabajo.' },
    { dimension: 'Desarrollo Profesional', medida: 'Distribuir las capacitaciones con un criterio que sea equitativo, público y accesible para todos (evitar los favoritismos).' },
  ],

  exigencias_emocionales: [
    { dimension: 'Exigencias Emocionales', medida: 'Capacitación periódica en el manejo de las emociones propias ante situaciones de exigencia emocional de los usuarios, clientes, alumnos, etc.' },
    { dimension: 'Exigencias Emocionales', medida: 'Implementar tiempos de descanso especiales para algunas tareas de alta exigencia emocional en particular y disposición de espacios adecuados para realizar estas pausas.' },
    { dimension: 'Exigencias Emocionales', medida: 'Entrenar a las jefaturas de los equipos que se exponen a situaciones de alta demanda emocional para que puedan orientar, apoyar y acompañar a sus equipos.' },
  ],

  reconocimiento_claridad_rol: [
    { dimension: 'Reconocimiento y Claridad de Rol', medida: 'Desarrollar un programa de reconocimiento laboral para las personas trabajadoras.' },
    { dimension: 'Reconocimiento y Claridad de Rol', medida: 'Revisar, con participación de las personas trabajadoras, descriptores de cargo y actualizarlos al menos cada dos años.' },
    { dimension: 'Reconocimiento y Claridad de Rol', medida: 'Establecer y socializar pautas precisas de evaluación de desempeño.' },
    { dimension: 'Reconocimiento y Claridad de Rol', medida: 'Capacitar a las jefaturas en el reconocimiento del buen trabajo realizado por sus equipos y que esto sea parte de su gestión permanente.' },
  ],

  conflicto_rol: [
    { dimension: 'Conflicto de Rol', medida: 'Establecer definiciones claras de los roles y responsabilidades en el trabajo con conocimiento de la jefatura y la persona trabajadora.' },
    { dimension: 'Conflicto de Rol', medida: 'Contar con un organigrama de la organización detallado y que éste sea debidamente difundido a toda la organización.' },
  ],

  calidad_liderazgo: [
    { dimension: 'Calidad del Liderazgo', medida: 'Capacitar a las jefaturas de la entidad empleadora en un estilo de liderazgo que considere el bienestar y la seguridad psicológica de las personas trabajadoras, evaluando su impacto en las personas.' },
    { dimension: 'Calidad del Liderazgo', medida: 'Entrenar a las jefaturas de los equipos para que puedan orientar, apoyar y acompañar a sus equipos en el desempeño de sus tareas.' },
  ],

  companerismo: [
    { dimension: 'Compañerismo', medida: 'Fomentar explícitamente la comunicación constante entre los miembros de un equipo de trabajo y entre los equipos de trabajo.' },
    { dimension: 'Compañerismo', medida: 'Organizar breves encuentros periódicos para potenciar el compañerismo y el sentido de pertenencia al equipo.' },
  ],

  inseguridad_condiciones: [
    { dimension: 'Inseguridad en las Condiciones de Trabajo', medida: 'Generar una instancia de reunión donde se expliquen cambios ya sea de la Entidad Empleadora, el centro de trabajo o el puesto de trabajo, con claridad y la suficiente anticipación.' },
    { dimension: 'Inseguridad en las Condiciones de Trabajo', medida: 'Disponer de una planificación para reemplazos, horas o turnos extraordinarios.' },
  ],

  equilibrio_trabajo_vida: [
    { dimension: 'Equilibrio Trabajo-Vida Privada', medida: 'Capacitar a las jefaturas en temáticas de Conciliación de trabajo y vida privada' },
    { dimension: 'Equilibrio Trabajo-Vida Privada', medida: 'Respetar horarios, días de descanso y periodo de vacaciones.' },
    { dimension: 'Equilibrio Trabajo-Vida Privada', medida: 'Respetar 12 horas continuas de desconexión telemática (celular, computador)' },
  ],

  confianza_justicia: [
    { dimension: 'Confianza y Justicia Organizacional', medida: 'Respetar los acuerdos alcanzados en los distintos ámbitos de la relación laboral, tanto empleadores como personas trabajadoras' },
    { dimension: 'Confianza y Justicia Organizacional', medida: 'Difundir normas claras sobre no discriminación, trato justo, y justicia organizacional.' },
    { dimension: 'Confianza y Justicia Organizacional', medida: 'Desarrollar canales de comunicación interna con temas relevantes para el trabajo y para el bienestar de las personas trabajadoras.' },
  ],

  vulnerabilidad: [
    { dimension: 'Vulnerabilidad', medida: 'Establecer de manera consensuada un manual de buenas prácticas o buen comportamiento organizacional.' },
    { dimension: 'Vulnerabilidad', medida: 'Realizar actividades y capacitaciones de buen trato entre las personas trabajadoras.' },
    { dimension: 'Vulnerabilidad', medida: 'Consensuar normas de respeto a las personas.' },
  ],

  violencia_acoso: [
    { dimension: 'Violencia y Acoso', medida: 'Establecer y difundir una política de cero tolerancia para todos los incidentes de violencia o acoso en el trabajo.' },
    { dimension: 'Violencia y Acoso', medida: 'Actualizar la sección de gestión preventiva del Protocolo de Prevención de Acoso Sexual, Acoso Laboral y Violencia en el Trabajo en base a los riesgos detectados en la evaluación de Riesgo Psicosocial.' },
    { dimension: 'Violencia y Acoso', medida: 'Difundir la actualización del Protocolo de Prevención de Acoso Sexual, Acoso Laboral y Violencia en el Trabajo en base a los riesgos diagnosticados' },
  ],
};

export const POLITICA_RPSL = {
  dimension: 'Política de Prevención de Riesgos Psicosociales Laborales (RPSL)',
  medida: 'Diseñar y difundir una Politica de gestión de los riesgos psicosociales en el Trabajo.',
};
