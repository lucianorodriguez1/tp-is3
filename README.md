# 🧪 Análisis Estadístico de Chats de WhatsApp

## 🎯 Descripción del sistema

WhatsUp es una aplicación web desarrollada para analizar chats grupales exportados de WhatsApp en formato `.txt`. El sistema permite cargar un archivo de conversación y procesar la información contenida para obtener estadísticas relevantes sobre la interacción entre los participantes mediante una interfaz simple e intuitiva. 

El proyecto fue desarrollado utilizando `HTML`, `CSS` y `JavaScript`, permitiendo que la aplicación funcione directamente desde el navegador. La estructura se divide en archivos separados para la interfaz (`index.html` y `analisis.html`), los estilos (`index.css` y `analisis.css`) y la lógica principal (`index.js` y `analisis.js`), facilitando la organización y mantenimiento del código. 

El funcionamiento de la aplicación comienza en la pantalla principal (`index.html`), donde el usuario puede cargar un chat exportado de WhatsApp mediante selección manual o arrastrándolo al área indicada. Una vez validado y procesado el archivo, los datos obtenidos se almacenan temporalmente utilizando `sessionStorage`, permitiendo mostrar posteriormente los resultados en la pantalla de análisis (`analisis.html`) sin necesidad de volver a cargar el chat. 

La lógica principal se encuentra implementada en `JavaScript`. El procesamiento del chat incluye:
- Lectura del archivo `.txt`. 
- Validación del formato del archivo exportado. 
- Limpieza y separación de mensajes por fecha, autor y contenido. 
- Manejo de mensajes multilínea. 
- Generación de estadísticas a partir de los mensajes procesados.
- Visualización de errores durante la carga del archivo. 
- Redirección automática a la pantalla principal cuando no existen datos cargados para analizar. 

Actualmente, el sistema implementa las siguientes métricas:
- Usuario con mayor cantidad de mensajes enviados. 
- Emoji más utilizado dentro del chat. 

Además, el proyecto se encuentra preparado para incorporar nuevas estadísticas y visualizaciones, como:
- Franja horaria con mayor actividad. 
- Días con mayor cantidad de mensajes. 
- Nube de palabras con las palabras más frecuentes. 

Finalmente, la interfaz fue diseñada utilizando `CSS Flexbox` para organizar los elementos de forma adaptable y mantener una presentación clara de la información. Para complementar el diseño, se utilizaron `Bootstrap Icons`, mejorando la experiencia visual del usuario.

--- 

## 🧠 Procesamiento del chat

El sistema:

1. Lee el archivo exportado de WhatsApp (.txt)
2. Parsea cada línea para extraer:
   - Fecha y hora
   - Usuario
   - Mensaje
3. Limpia y normaliza los datos
4. Calcula estadísticas agregadas
5. Genera visualizaciones dinámicas en el navegador

---

## 👥 Integrantes

- Julián Castro (Desarrollador)
- Juan Diez (Desarrollador)
- Valentina Mohamed (Desarrollador) 
- Luciano Rodriguez (Desarrollador) 
- Facundo Simonetta (Tester)


---

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:

git clone <URL_DEL_REPO>

2. Abrir el archivo `index.html`.
---

## 📚 Decisiones técnicas tomadas

Durante el desarrollo del proyecto se tomaron distintas decisiones técnicas y de organización con el objetivo de simplificar el procesamiento del chat y mantener una estructura ordenada del sistema. 

Una de las decisiones principales fue desarrollar la aplicación completamente del lado del cliente. Se optó por una arquitectura `frontend-only`, lo que permitió evitar dependencias con servidores externos y simplificar la ejecución desde el navegador. La lectura de archivos se implementó mediante la API `FileReader`, facilitando el procesamiento de archivos `.txt` directamente desde la aplicación sin necesidad de programas externos. 

También se utilizó `sessionStorage` para almacenar temporalmente los mensajes procesados. De esta forma, los datos pueden compartirse entre páginas sin requerir bases de datos ni un backend adicional. 

El archivo exportado de WhatsApp se procesa mediante expresiones regulares, permitiendo reconocer automáticamente fechas, horarios, autores y contenido de los mensajes. 

Además, se decidió validar el formato del archivo para reducir errores durante el análisis. Si el archivo no cumple con el formato esperado, el sistema informa el problema al usuario e impide continuar con el procesamiento. 

Para calcular el usuario con mayor cantidad de mensajes enviados se implementó una estructura basada en `Map`, permitiendo realizar el conteo de mensajes de manera eficiente. Asimismo, se normalizaron los nombres de usuario utilizando minúsculas para evitar diferencias por capitalización. 

En el análisis de emojis se incorporó la librería `emoji-regex` importada desde `CDN`, ya que permite detectar emojis de forma más precisa que una expresión regular manual. También se normalizaron tonos de piel y variaciones visuales para evitar contabilizar un mismo emoji como elementos diferentes. 

Los resultados obtenidos se muestran dinámicamente en pantalla mediante la manipulación del contenido `HTML` utilizando `JavaScript`. 

Por último, se realizaron pruebas unitarias con `Jest` para verificar el comportamiento de las funciones principales del sistema. Estas pruebas permitieron validar el conteo de mensajes por usuario, la detección del emoji más utilizado, el manejo de autores vacíos, los mensajes multilínea y la validación de fechas y formatos inválidos. También se realizaron pruebas directamente sobre la aplicación para comprobar el flujo completo de uso, incluyendo la carga de archivos con formato incorrecto, archivos `.txt` que no cumplen con el formato de WhatsApp y chats válidos con resultados esperados.

Para ampliar el análisis temporal del grupo, se optó por aprovechar el objeto nativo `Date` de JavaScript para calcular la franja horaria y la fecha exacta con mayor actividad. Agrupar los resultados utilizando `toLocaleDateString` permitió obtener salidas legibles y estandarizadas de acuerdo a la región (es-AR), evitando depender de librerías externas de manejo de fechas (como Moment.js o Date-fns).

En cuanto a la nube de palabras (Word Cloud), el mayor desafío técnico residía en la limpieza previa del texto. Se decidió implementar una cadena de normalización propia mediante expresiones regulares y el método `.normalize("NFD")` que se encarga de eliminar tildes, símbolos, enlaces y etiquetas. Se definió un umbral de longitud mínima (4 caracteres) que actúa como un filtro natural de "stop words" y caracteres irrelevantes, mejorando significativamente los resultados. La renderización visual de esta métrica fue delegada a la librería externa `WordCloud`, priorizando su escalado (`weightFactor`) con relación directa a la palabra de mayor frecuencia para garantizar coherencia en la nube construida.

---

## 🏗️ Arquitectura del Sistema

El sistema implementa una arquitectura **Frontend-only**, sin backend ni base de datos, estructurada en los siguientes módulos:

- **Estructura de Archivos**:
  - `index.html` / `analisis.html`: Vistas principales.
  - `css/index.css` / `css/analisis.css`: Hojas de estilo dedicadas.
  - `js/index.js`: Responsable de la lectura de archivos (File API), validación y el proceso de parseo del `.txt`.
  - `js/analisis.js`: Responsable de recuperar los datos, ejecutar los algoritmos de análisis (estadísticas) y renderizar los resultados en el DOM.

- **Flujo de Datos (Data Flow)**:
  1. El archivo se carga vía el input de `index.html`.
  2. `index.js` lee el contenido de texto mediante `FileReader`.
  3. El motor de procesamiento transforma el texto plano en un arreglo de objetos JSON en memoria.
  4. Los datos son serializados y almacenados en el navegador mediante `sessionStorage` (con la clave `whatsup-chat-data`).
  5. Se dispara una redirección a `analisis.html`.
  6. `analisis.js` recupera la cadena JSON del `sessionStorage`, regenera los objetos (conversión de fechas a instacias de `Date`), ejecuta cálculos y alimenta la interfaz gráfica.

- **Modelo de Datos Interno**:
  Cada mensaje procesado sigue la siguiente estructura de objeto:
  ```json
  {
    "datetime": "2023-10-05T14:30:00.000Z",
    "author": "Nombre del Usuario",
    "text": "Contenido del mensaje"
  }
  ```

---

## 💻 Documentación del Código

Los módulos de la aplicación están diseñados con funciones especializadas para la separación de responsabilidades:

### Parseo del Archivo (`index.js`)
- `parsearChatWhatsApp(contenido)`: Función principal del ciclo de lectura. Itera sobre las líneas del archivo aplicando múltiples Expresiones Regulares (`patronMarcaTiempo` y `patronMensajeConAutor`) para identificar remates de Timestamp, autores y contenido. Gestiona automáticamente los mensajes multilínea concatenando texto extra al mensaje anterior si no se detecta una nueva marca de fecha.
- `parsearFechaHoraChat(...)`: Utilidad para convertir los distintos formatos de visualización (12 hs am/pm vs 24 hs, formatos de fecha variados) en un objeto de Date unificado de JavaScript. Verifica exhaustivamente la validez semántica de las fechas resultantes para descartar formatos no soportados.

### Procesamiento y Estadísticas (`analisis.js`)
- `usuarioConMasMensajes(mensajes)`: Itera el arreglo de mensajes alimentando un Hash Map (`Map`) que lleva la cuenta de frecuencia por usuario (`counts`). Internamente gestiona la diferencia de capitalización (se normaliza en minúscula para agrupar bajo la clave `key = raw.toLowerCase()`) pero mantiene el estado de capitalización original en `original.get(key)`. Retorna `{ author, count }`.
- `emojiMasUsado(mensajes)`: 
  - Utiliza `import()` dinámico para cargar la librería dependiente `emoji-regex/index.mjs` vía Unpkg CDN. Implementa a su vez un bloque `catch` con un fallback Regex hardcodeado por si falla el proveedor de red.
  - El escaneo cuenta ocurrencias en un Map tras limpiar la codificación de la string: elimina los modificadores de tonos de piel (`[\u{1F3FB}-\u{1F3FF}]`) y los selectores ocultos de variación (`\uFE0F`) para asegurar un conteo íntegro del mismo caracter semántico independientemente de su variable visual. Retorna el objeto `{ emoji, count }`.
- `franjaHorariaConMayorActividad(mensajes)`: Extrae la hora de la propiedad `datetime` de cada mensaje utilizando `.getHours()` y agrupa las interacciones en bloques de una hora (ej. `14:00 - 15:00`). Utiliza un diccionario `Map` para llevar el conteo iterativo y determinar el rango horario de mayor tráfico en el grupo.
- `diasConMayorCantidadDeMensajes(mensajes)`: Emplea la función nativa `toLocaleDateString('es-AR')` para formatear el `datetime` de cada mensaje en una cadena de texto representativa del día exacto (incluyendo día de la semana, número, mes y año). Cuenta las frecuencias valiéndose de un `Map` para encontrar la fecha de mayor actividad.
- `obtenerListaWordCloud(mensajes)` y `normalizarTextoParaWordCloud(texto)`: Procesan el contenido de los mensajes aplicando una normalización estricta: conversión a minúsculas, eliminación de signos diacríticos (acentos) mediante la forma `NFD`, y uso de RegEx para limpiar enlaces (URLs), menciones y caracteres que no sean letras o números. Retorna las palabras con una longitud mínima predefinida (4 letras) que se utilizan para mapear frecuencias.
- `inicializarWordCloud(listaPalabras)`: Toma las frecuencias procesadas y configura dinámicamente el canvas valiédose de la librería `wordcloud2.js`. Se aplica un dimensionamiento dinámico (`weightFactor`) que escala el tamaño de palabra basándose en el elemento más frecuente (`maxFrecuencia`) y asigna una paleta de colores temáticos aleatorios.

