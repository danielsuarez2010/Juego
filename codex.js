/**
 * GITFUNK CODEX & STUDY MODE
 * Interactive Knowledge Base & Trivia Quiz covering the 14 Frontend/Git/GitHub questions.
 * Includes detailed study cards, randomized answer distributions, educational hints,
 * and comprehensive explanations.
 */

const CODEX_DATA = [
  {
    id: 1,
    category: "git-github",
    title: "1. ¿Qué es GitHub y su función?",
    shortDesc: "Plataforma en línea para alojar, administrar y colaborar en proyectos con Git.",
    content: `
      <h3>🐙 1. ¿Qué es GitHub y cuál es su función en el desarrollo de software?</h3>
      <p><strong>GitHub</strong> es una plataforma en línea basada en la nube que permite alojar, administrar y compartir proyectos de software. Utiliza <strong>Git</strong> como sistema de control de versiones subyacente y facilita que los desarrolladores guarden los cambios realizados en un proyecto, trabajen en equipo y consulten el historial de modificaciones.</p>
      
      <div class="codex-highlight-box">
        <strong>Funciones clave en el desarrollo de software:</strong>
        <ul style="margin-left: 20px; margin-top: 8px;">
          <li>Almacenar el código fuente de forma segura y accesible desde cualquier lugar.</li>
          <li>Colaborar con otros programadores en tiempo real mediante ramas y revisiones.</li>
          <li>Revisar cambios, auditar quién modificó qué y solucionar errores (Issues).</li>
          <li>Publicar sitios web estáticos mediante <em>GitHub Pages</em>.</li>
        </ul>
      </div>
    `,
    quiz: {
      question: "¿Cuál es la función principal de GitHub en el desarrollo de software?",
      hint: "Piensa en un servicio en la nube donde los equipos pueden almacenar sus repositorios Git y colaborar.",
      options: [
        "Compilar código C++ automáticamente en el sistema operativo",
        "Alojar repositorios Git en la nube y facilitar el trabajo colaborativo en equipo",
        "Diseñar interfaces gráficas en Photoshop sin programar",
        "Reemplazar completamente al lenguaje JavaScript en la web"
      ],
      correct: 1,
      explanation: "GitHub es una plataforma en la nube que aloja repositorios Git, facilitando el control de versiones, el respaldo y el trabajo en equipo."
    }
  },
  {
    id: 2,
    category: "git-github",
    title: "2. Diferencia entre Git y GitHub",
    shortDesc: "Git es la herramienta local de versiones; GitHub es la plataforma en la nube.",
    content: `
      <h3>⚖️ 2. ¿Cuál es la diferencia entre Git y GitHub?</h3>
      <p>Aunque a menudo se mencionan juntos, cumplen roles distintos y complementarios:</p>
      
      <table class="codex-table">
        <thead>
          <tr>
            <th>Característica</th>
            <th>Git 💻</th>
            <th>GitHub 🌐</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tipo</strong></td>
            <td>Software / Herramienta de control de versiones</td>
            <td>Plataforma / Servicio web en la nube</td>
          </tr>
          <tr>
            <td><strong>Instalación</strong></td>
            <td>Se instala localmente en tu computadora</td>
            <td>Se accede a través del navegador web o API</td>
          </tr>
          <tr>
            <td><strong>Conexión a Internet</strong></td>
            <td>No requiere internet para crear commits y ramas</td>
            <td>Requiere internet para sincronizar repositorios</td>
          </tr>
          <tr>
            <td><strong>Propósito</strong></td>
            <td>Registrar el historial de cambios en los archivos</td>
            <td>Alojar repositorios remotos y colaborar en equipo</td>
          </tr>
        </tbody>
      </table>
    `,
    quiz: {
      question: "¿Cuál es la diferencia fundamental entre Git y GitHub?",
      hint: "Uno se ejecuta en tu terminal local sin internet y el otro es un servicio web en línea.",
      options: [
        "Git es un lenguaje de programación y GitHub es un editor de texto",
        "Git solo funciona en Windows y GitHub solo funciona en Linux",
        "Git es el software local de control de versiones y GitHub es el servicio web en la nube",
        "No hay ninguna diferencia, son exactamente el mismo programa"
      ],
      correct: 2,
      explanation: "Git es el sistema de control de versiones que corre en tu máquina local, mientras que GitHub es el servicio en línea que aloja dichos repositorios."
    }
  },
  {
    id: 3,
    category: "git-github",
    title: "3. ¿Qué es un Repositorio?",
    shortDesc: "El contenedor de archivos y del historial de cambios de un proyecto.",
    content: `
      <h3>📁 3. ¿Qué es un repositorio y cómo se utiliza en GitHub?</h3>
      <p>Un <strong>repositorio</strong> (o <em>repo</em>) es una carpeta o espacio virtual donde se almacenan todos los archivos de un proyecto junto con el historial completo de sus modificaciones.</p>
      
      <div class="codex-highlight-box">
        <strong>Tipos de repositorios:</strong>
        <ul style="margin-left: 20px; margin-top: 8px;">
          <li><strong>Público:</strong> Cualquier persona en internet puede ver el código fuente y clonarlo (ideal para código abierto y portafolio).</li>
          <li><strong>Privado:</strong> El acceso está restringido únicamente a ti y a los colaboradores que autorices explícitamente.</li>
        </ul>
      </div>
      <p>En GitHub, un repositorio almacena código fuente, imágenes, documentación (como el archivo <code>README.md</code>) y permite rastrear quién hizo cada cambio y en qué fecha.</p>
    `,
    quiz: {
      question: "¿Qué elementos contiene un repositorio en GitHub?",
      hint: "Es el contenedor central de todo el proyecto: código, imágenes, documentación e historial.",
      options: [
        "Archivos del proyecto, código fuente, documentación y todo el historial de cambios",
        "Únicamente imágenes comprimidas sin código",
        "Solamente la memoria RAM del servidor",
        "Un archivo ejecutable que borra el historial"
      ],
      correct: 0,
      explanation: "Un repositorio almacena todos los archivos del proyecto junto con el historial completo de commits y modificaciones."
    }
  },
  {
    id: 4,
    category: "git-github",
    title: "4. Commits, Branches, Merge y Pull Requests",
    shortDesc: "Los 4 pilares fundamentales del flujo de trabajo con Git.",
    content: `
      <h3>🌿 4. ¿Qué son los Commits, Branches, Merge y Pull Requests?</h3>
      <p>Estos cuatro conceptos constituyen el ciclo de vida del código en Git y GitHub:</p>
      
      <ul style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
        <li><strong>Commit:</strong> Es una fotografía o registro permanente de uno o varios cambios en el proyecto. Cada commit incluye un mensaje descriptivo y un identificador único (hash).</li>
        <li><strong>Branch (Rama):</strong> Una línea de desarrollo independiente que permite trabajar en nuevas funcionalidades sin alterar la rama principal (<code>main</code>).</li>
        <li><strong>Merge:</strong> El proceso mediante el cual se combinan e integran los cambios de una rama secundaria hacia otra rama.</li>
        <li><strong>Pull Request (PR):</strong> Una solicitud formal en GitHub para revisar, discutir y fusionar los cambios de una rama antes de hacer el merge definitivo.</li>
      </ul>
    `,
    quiz: {
      question: "¿Qué es un Pull Request (PR) en GitHub?",
      hint: "Es una petición para que otros colaboradores revisen tus cambios antes de unirlos a la rama principal.",
      options: [
        "Un comando para formatear el disco duro de la computadora",
        "Una función para apagar el servidor web de forma remota",
        "Un archivo de configuración de contraseñas de usuario",
        "Una solicitud para revisar y fusionar los cambios de una rama antes de integrarlos"
      ],
      correct: 3,
      explanation: "El Pull Request permite a los miembros del equipo revisar, comentar y validar el código antes de unirlo a la rama principal."
    }
  },
  {
    id: 5,
    category: "git-github",
    title: "5. Trabajo Colaborativo en GitHub",
    shortDesc: "Clonar, crear ramas, commits, Pull Requests y resolución de Issues.",
    content: `
      <h3>🤝 5. ¿Cómo se puede utilizar GitHub para trabajar colaborativamente?</h3>
      <p>GitHub permite que equipos multidisciplinarios trabajen en paralelo sin pisarse el código:</p>
      
      <ol style="margin-left: 20px; line-height: 1.8;">
        <li><strong>Clonar (Clone):</strong> Cada integrante descarga una copia idéntica del repositorio a su computadora local.</li>
        <li><strong>Crear Ramas (Feature Branches):</strong> Cada desarrollador crea una rama para su tarea específica (ej: <code>feat-menu-login</code>).</li>
        <li><strong>Hacer Commits:</strong> Guardan sus avances con mensajes claros y descriptivos.</li>
        <li><strong>Crear Pull Request:</strong> Suben la rama y abren un PR para que los compañeros revisen la calidad del código.</li>
        <li><strong>Merge:</strong> Tras ser aprobado, se fusiona a la rama principal.</li>
        <li><strong>Issues y Projects:</strong> Se utilizan para reportar bugs, sugerir mejoras y asignar tareas estilo tablero Kanban.</li>
      </ol>
    `,
    quiz: {
      question: "¿Cuál es el flujo de trabajo recomendado para colaborar ordenadamente en GitHub?",
      hint: "Comienza descargando el proyecto, creando una rama propia y solicitando revisión al terminar.",
      options: [
        "Editar todos directamente en la rama main sin avisar a nadie",
        "Clonar repo -> Crear rama -> Hacer commits -> Abrir Pull Request -> Revisar y Merge",
        "Borrar el repositorio y volverlo a subir desde cero cada día",
        "Enviar los archivos comprimidos en formato .zip por correo electrónico"
      ],
      correct: 1,
      explanation: "El flujo estándar basado en ramas y Pull Requests asegura que el código sea revisado y probado antes de integrarse."
    }
  },
  {
    id: 6,
    category: "git-github",
    title: "6. Ventajas de GitHub",
    shortDesc: "Portafolio, aprendizaje de versiones, código abierto y GitHub Pages.",
    content: `
      <h3>🌟 6. ¿Qué ventajas ofrece GitHub para estudiantes y desarrolladores?</h3>
      
      <div class="codex-highlight-box">
        <strong>Beneficios destacados:</strong>
        <ul style="margin-left: 20px; margin-top: 8px; line-height: 1.7;">
          <li><strong>Portafolio Profesional:</strong> Tu perfil de GitHub sirve como currículum vivo demostrando tus proyectos reales a reclutadores.</li>
          <li><strong>Práctica de Control de Versiones:</strong> Facilita dominar el estándar de la industria desde la etapa estudiantil.</li>
          <li><strong>Respaldo en la Nube:</strong> Seguridad total contra pérdida de datos locales en tu computadora.</li>
          <li><strong>Comunidad Open Source:</strong> Posibilidad de aprender de proyectos globales y contribuir a ellos.</li>
          <li><strong>Publicación Gratuita:</strong> Despliegue de páginas web estáticas con un solo clic mediante GitHub Pages.</li>
        </ul>
      </div>
    `,
    quiz: {
      question: "¿Por qué es muy valioso GitHub para un estudiante o programador junior?",
      hint: "Permite mostrar tu código al mundo como carta de presentación ante empresas de tecnología.",
      options: [
        "Sirve como portafolio profesional, permite colaborar en equipo y practicar control de versiones real",
        "Porque regala computadoras y hardware físico a todos los registrados",
        "Porque elimina por completo la necesidad de aprender a programar",
        "Porque sustituye a los profesores y exámenes académicos"
      ],
      correct: 0,
      explanation: "GitHub te permite construir un portafolio visible con proyectos reales y dominar el flujo de trabajo profesional."
    }
  },
  {
    id: 7,
    category: "frontend",
    title: "7. JavaScript en el Frontend",
    shortDesc: "El lenguaje que da vida, dinamismo e interactividad a la web.",
    content: `
      <h3>⚡ 7. ¿Qué es JavaScript y qué función cumple en el desarrollo frontend?</h3>
      <p><strong>JavaScript</strong> es el lenguaje de programación estándar que se ejecuta en el navegador web para agregar comportamiento dinámico e interactividad.</p>
      
      <div class="codex-highlight-box">
        <strong>Funciones principales en el Frontend:</strong>
        <ul style="margin-left: 20px; margin-top: 8px; line-height: 1.7;">
          <li>Responder a eventos del usuario (clics, pulsaciones de teclas, gestos táctiles).</li>
          <li>Manipular el DOM (modificar textos, colores, animar elementos en tiempo real).</li>
          <li>Validar formularios antes de enviar datos.</li>
          <li>Consumir APIs y realizar peticiones asíncronas (AJAX / Fetch) sin recargar la página.</li>
          <li>Crear videojuegos de navegador (¡como este juego de ritmo!).</li>
        </ul>
      </div>
      <p>Junto con <strong>HTML</strong> (estructura) y <strong>CSS</strong> (diseño visual), JavaScript forma la tríada fundamental de la web moderna.</p>
    `,
    quiz: {
      question: "¿Cuál es la función principal de JavaScript en una página web?",
      hint: "HTML estructura, CSS da estilo... y JavaScript se encarga del movimiento, clicks y respuestas en tiempo real.",
      options: [
        "Definir únicamente el color de fondo estático del sitio web",
        "Crear las tablas de bases de datos relacionales en servidores remotos",
        "Aportar interactividad, responder a eventos y dotar de lógica dinámica a la interfaz",
        "Configurar los cables de fibra óptica de la red física"
      ],
      correct: 2,
      explanation: "JavaScript es el encargado de la interactividad, manejo de eventos y dinamismo en el navegador."
    }
  },
  {
    id: 8,
    category: "frontend",
    title: "8. ¿Qué es un Framework de JS?",
    shortDesc: "Conjunto de herramientas y reglas que estandarizan el desarrollo web.",
    content: `
      <h3>🏗️ 8. ¿Qué es un framework de JavaScript?</h3>
      <p>Un <strong>framework de JavaScript</strong> es un conjunto de herramientas, librerías, estructuras y convenciones de diseño preestablecidas que facilitan la creación de aplicaciones web escalables y organizadas.</p>
      
      <p>En lugar de escribir todo el código desde cero con JavaScript puro (Vanilla JS), un framework proporciona una arquitectura basada en componentes, manejo automático del estado y herramientas de enrutamiento.</p>
      
      <div class="codex-highlight-box">
        <em>Nota técnica:</em> <strong>React</strong> se define como una biblioteca enfocada en la vista, mientras que <strong>Angular</strong>, <strong>Vue</strong> y <strong>Svelte</strong> ofrecen soluciones de framework más completas.
      </div>
    `,
    quiz: {
      question: "¿Qué ventaja clave proporciona utilizar un framework de JavaScript?",
      hint: "Aporta patrones de diseño, componentes reutilizables y hace el proyecto más fácil de escalar.",
      options: [
        "Hace que el navegador web sea innecesario para los usuarios",
        "Ofrece una estructura organizada, componentes reutilizables y facilita el mantenimiento",
        "Convierte automáticamente cualquier computadora en un superordenador",
        "Bloquea la ejecución de etiquetas HTML en el navegador"
      ],
      correct: 1,
      explanation: "Los frameworks brindan orden, patrones de arquitectura por componentes y reutilización de código."
    }
  },
  {
    id: 9,
    category: "frontend",
    title: "9. Principales Tecnologías Frontend",
    shortDesc: "React, Angular, Vue, Svelte, Next.js, Astro y la tríada HTML/CSS/JS.",
    content: `
      <h3>🚀 9. ¿Cuáles son las principales tecnologías utilizadas actualmente en frontend?</h3>
      <p>El ecosistema frontend actual se compone de:</p>
      
      <ul style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
        <li><strong>Tríada Fundamental:</strong> HTML (Estructura), CSS (Estilo) y JavaScript (Comportamiento).</li>
        <li><strong>Frameworks y Bibliotecas SPA:</strong> React, Angular, Vue.js y Svelte.</li>
        <li><strong>Meta-Frameworks Modernos:</strong> Next.js (React), Nuxt (Vue), Astro (sitios ultra rápidos) y SolidJS.</li>
      </ul>
    `,
    quiz: {
      question: "¿Cuáles son las 4 tecnologías/frameworks SPA líderes en el desarrollo Frontend actual?",
      hint: "Entre ellas están la biblioteca creada por Meta, el framework de Google, la creación de Evan You y el compilador de Rich Harris.",
      options: [
        "Photoshop, Illustrator, Premiere y After Effects",
        "Windows, macOS, Ubuntu y Android",
        "React, Angular, Vue.js y Svelte",
        "Git, GitHub, GitLab y Bitbucket"
      ],
      correct: 2,
      explanation: "React, Angular, Vue y Svelte dominan el desarrollo de interfaces de usuario interactivas y SPAs."
    }
  },
  {
    id: 10,
    category: "frontend",
    title: "10. Características: React, Angular, Vue, Svelte",
    shortDesc: "Detalle a fondo de cada uno de los 4 gigantes del frontend.",
    content: `
      <h3>🔍 10. Características de React, Angular, Vue.js y Svelte</h3>
      
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="codex-highlight-box" style="border-left-color: #38bdf8;">
          <strong>⚛️ React (Meta):</strong> Biblioteca basada en componentes declarativos, sintaxis JSX, Virtual DOM y el ecosistema más gigantesco de paquetes y librerías auxiliares.
        </div>
        
        <div class="codex-highlight-box" style="border-left-color: #f43f5e;">
          <strong>🔴 Angular (Google):</strong> Framework robusto y completo para nivel empresarial, escrito en TypeScript, incluye routing, inyección de dependencias y formularios reactivos de fábrica.
        </div>
        
        <div class="codex-highlight-box" style="border-left-color: #10b981;">
          <strong>🟢 Vue.js (Evan You):</strong> Framework progresivo con curva de aprendizaje muy suave, Single File Components (<code>.vue</code>) y excelente reactividad nativa.
        </div>
        
        <div class="codex-highlight-box" style="border-left-color: #f59e0b;">
          <strong>🔥 Svelte (Rich Harris):</strong> Compilador que traslada el trabajo al tiempo de compilación, generando código JS ultra optimizado sin sobrecarga de Virtual DOM en el navegador.
        </div>
      </div>
    `,
    quiz: {
      question: "¿Qué característica técnica hace único a Svelte frente a React o Vue?",
      hint: "No utiliza un Virtual DOM en tiempo de ejecución en el navegador, sino que compila a JavaScript puro.",
      options: [
        "Funciona como un compilador que no requiere un runtime pesado de Virtual DOM en el navegador",
        "Solo permite escribir código en lenguaje ensamblador para microchips",
        "Prohíbe la creación de componentes reutilizables en los archivos",
        "Solo funciona para sitios web que no utilizan estilos CSS"
      ],
      correct: 0,
      explanation: "Svelte traslada el trabajo a la etapa de compilación previa, produciendo código vanilla JavaScript superoptimizado y ultraligero."
    }
  },
  {
    id: 11,
    category: "frontend",
    title: "11. Tabla Comparativa de Frameworks",
    shortDesc: "Comparación directa de tipo, lenguaje y característica destacada.",
    content: `
      <h3>📊 11. Diferencias entre React, Angular, Vue.js y Svelte</h3>
      <p>A continuación se resume la comparativa directa entre las cuatro tecnologías:</p>
      
      <table class="codex-table">
        <thead>
          <tr>
            <th>Tecnología</th>
            <th>Tipo</th>
            <th>Lenguaje Principal</th>
            <th>Característica Destacada</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>React ⚛️</strong></td>
            <td>Biblioteca</td>
            <td>JavaScript / JSX</td>
            <td>Componentes y amplio ecosistema</td>
          </tr>
          <tr>
            <td><strong>Angular 🔴</strong></td>
            <td>Framework</td>
            <td>TypeScript</td>
            <td>Solución estructurada y completa</td>
          </tr>
          <tr>
            <td><strong>Vue.js 🟢</strong></td>
            <td>Framework</td>
            <td>JavaScript / HTML</td>
            <td>Flexibilidad y facilidad de integración</td>
          </tr>
          <tr>
            <td><strong>Svelte 🔥</strong></td>
            <td>Framework / Compilador</td>
            <td>JavaScript / TypeScript</td>
            <td>Compilación para generar JS optimizado</td>
          </tr>
        </tbody>
      </table>
    `,
    quiz: {
      question: "¿Cuál es el lenguaje tipado principal utilizado por Angular de forma nativa?",
      hint: "Es un superconjunto tipado de JavaScript desarrollado por Microsoft.",
      options: [
        "Python",
        "PHP",
        "TypeScript",
        "Ruby on Rails"
      ],
      correct: 2,
      explanation: "Angular está desarrollado y diseñado para utilizar TypeScript como lenguaje principal de desarrollo con tipado estático fuerte."
    }
  },
  {
    id: 12,
    category: "frontend",
    title: "12. Ventajas y Desventajas",
    shortDesc: "Pros y contras para elegir la mejor herramienta según el proyecto.",
    content: `
      <h3>⚖️ 12. Ventajas y Desventajas de cada Tecnología</h3>
      
      <table class="codex-table">
        <thead>
          <tr>
            <th>Tecnología</th>
            <th>Ventajas 🟢</th>
            <th>Desventajas 🔴</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>React</strong></td>
            <td>Gran comunidad, alta demanda laboral y abundancia de recursos.</td>
            <td>Requiere elegir librerías externas para routing o estado global.</td>
          </tr>
          <tr>
            <td><strong>Angular</strong></td>
            <td>Todo incluido de fábrica, ideal para equipos grandes y banca.</td>
            <td>Curva de aprendizaje más pronunciada debido a su complejidad.</td>
          </tr>
          <tr>
            <td><strong>Vue.js</strong></td>
            <td>Sintaxis intuitiva, documentación excelente y adopción gradual.</td>
            <td>Menor cantidad de ofertas laborales en comparación con React.</td>
          </tr>
          <tr>
            <td><strong>Svelte</strong></td>
            <td>Rendimiento supremo, paquetes minúsculos y sintaxis limpia.</td>
            <td>Ecosistema y comunidad más reducidos que los tres anteriores.</td>
          </tr>
        </tbody>
      </table>
    `,
    quiz: {
      question: "¿Cuál es una ventaja sobresaliente de Angular en proyectos de nivel empresarial?",
      hint: "Incluye routing, clientes HTTP, formularios reactivos y validaciones integradas de fábrica.",
      options: [
        "Que no requiere escribir ninguna línea de código",
        "Es una solución muy completa, estructurada y estandarizada con herramientas oficiales",
        "Que sus archivos comprimidos pesan menos de 10 bytes",
        "Que solo funciona cuando la computadora no tiene conexión a internet"
      ],
      correct: 1,
      explanation: "Angular incluye routing, clientes HTTP, formularios y validaciones de fábrica, lo que garantiza consistencia en equipos grandes."
    }
  },
  {
    id: 13,
    category: "deployment",
    title: "13. Publicar en GitHub Pages",
    shortDesc: "Guía paso a paso para desplegar tu juego o web gratis en internet.",
    content: `
      <h3>🚀 13. ¿Cómo se puede publicar un proyecto frontend en GitHub Pages?</h3>
      <p><strong>GitHub Pages</strong> es el servicio de alojamiento estático gratuito de GitHub. El procedimiento estándar es:</p>
      
      <div class="codex-highlight-box">
        <strong>Paso a Paso:</strong>
        <ol style="margin-left: 20px; line-height: 1.8; margin-top: 8px;">
          <li>Crear un repositorio en GitHub (ej: <code>mi-juego-ritmo</code>).</li>
          <li>Subir el código frontend (archivos <code>index.html</code>, carpetas <code>css/</code> y <code>js/</code>).</li>
          <li>Ir a la pestaña <strong>Settings</strong> del repositorio.</li>
          <li>En la barra lateral izquierda, hacer clic en <strong>Pages</strong>.</li>
          <li>En <em>Build and deployment > Branch</em>, seleccionar la rama <code>main</code> (carpeta <code>/ (root)</code>) y hacer clic en <strong>Save</strong>.</li>
          <li>¡Listo! En unos segundos GitHub te proporcionará la URL pública (ej: <code>https://tu-usuario.github.io/mi-juego-ritmo/</code>).</li>
        </ol>
      </div>
      <p><em>Nota:</em> En proyectos basados en React o Svelte con Vite, primero se ejecuta <code>npm run build</code> y se publica la carpeta resultante <code>dist</code> o se usa una GitHub Action.</p>
    `,
    quiz: {
      question: "¿Dónde se activa GitHub Pages dentro de tu repositorio en GitHub?",
      hint: "Debes ir a la pestaña de ajustes del repositorio y buscar la opción de despliegue web.",
      options: [
        "En la pestaña de 'Pull Requests' eliminando el código",
        "En el archivo de licencias de Windows del sistema operativo",
        "En la papelera de reciclaje de la computadora",
        "En la pestaña 'Settings' > sección 'Pages' seleccionando la rama 'main'"
      ],
      correct: 3,
      explanation: "En GitHub se activa navegando a Settings > Pages y seleccionando la rama principal que contiene los archivos web."
    }
  },
  {
    id: 14,
    category: "git-github",
    title: "14. Relación: Git + GitHub + Frameworks",
    shortDesc: "Cómo se complementan para formar el ecosistema del desarrollo web.",
    content: `
      <h3>🌐 14. ¿Cómo se relacionan GitHub, Git y los Frameworks Frontend?</h3>
      <p>Las tres tecnologías cumplen roles especializados, sinérgicos y complementarios:</p>
      
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="codex-highlight-box" style="border-left-color: #10b981;">
          <strong>1. Frameworks Frontend (React / Vue / Svelte / JS):</strong> Construyen la aplicación visual, gestionan la interfaz de usuario y procesan la interacción del usuario.
        </div>
        <div class="codex-highlight-box" style="border-left-color: #38bdf8;">
          <strong>2. Git (Local):</strong> Rastrea y gestiona cada versión, cambio de código, corrección de bugs y experimentación en ramas.
        </div>
        <div class="codex-highlight-box" style="border-left-color: #8b5cf6;">
          <strong>3. GitHub (Remoto y Colaboración):</strong> Respalda el repositorio en la nube, coordina el trabajo en equipo con Pull Requests y despliega el sitio web al mundo mediante GitHub Pages.
        </div>
      </div>
    `,
    quiz: {
      question: "¿Cuál es el resumen de la relación entre Git, GitHub y los Frameworks Frontend?",
      hint: "Uno construye la UI, otro controla las versiones en local y el tercero hospeda y colabora en la nube.",
      options: [
        "Los frameworks construyen la app, Git controla sus versiones y GitHub facilita la colaboración y el despliegue",
        "Git destruye el código, GitHub lo vende y los frameworks lo ocultan",
        "Son tres nombres diferentes para el mismo lenguaje de programación",
        "Ninguno tiene relación con el desarrollo web"
      ],
      correct: 0,
      explanation: "Los tres pilares se complementan perfectamente: construcción de la app, control de versiones local y colaboración/despliegue en la nube."
    }
  }
];

window.CODEX_DATA = CODEX_DATA;
