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
- Normalización de nombres de usuario para evitar diferencias entre mayúsculas y minúsculas. 
- Visualización de errores durante la carga del archivo. 
- Redirección automática a la pantalla principal cuando no existen datos cargados para analizar. 

Actualmente, el sistema implementa las siguientes funcionalidades:
- Usuario con mayor cantidad de mensajes enviados. 
- Emoji más utilizado dentro del chat. 

Además, el proyecto se encuentra preparado para incorporar nuevas estadísticas y visualizaciones, como:
- Franja horaria con mayor actividad. 
- Días con mayor cantidad de mensajes. 
- Nube de palabras con las palabras más frecuentes. 

Finalmente, la interfaz fue diseñada utilizando `CSS Flexbox` para organizar los elementos de forma adaptable y mantener una presentación clara de la información. Para complementar el diseño, se utilizaron `Bootstrap Icons`, mejorando la experiencia visual del usuario.

## 👥 Integrantes

- Julián Castro
- Juan Diez
- Valentina Mohamed
- Luciano Rodriguez 
- Facundo Simonetta  

---

## 🚀 Funcionalidades

- 📂 Carga de archivo de chat exportado (.txt)
- 📊 Procesamiento automático de mensajes
- 📈 Visualización de estadísticas en un dashboard

### 📊 Métricas implementadas

- 👤 Usuario que más mensajes envió  
- 😂 Emoji más utilizado  
- ⏰ Franja horaria con mayor actividad  
- 📅 Días con mayor cantidad de mensajes  
- ☁️ Nube de palabras (Word Cloud)  

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

## ⚙️ Tecnologías utilizadas

- HTML
- CSS
- JavaScript

---

## ▶️ Cómo ejecutar el proyecto

1. Clonar el repositorio:

git clone <URL_DEL_REPO>

2. Abrir el archivo `index.html` en cualquier navegador moderno

No requiere instalación, servidor ni dependencias externas.

---

## 📄 Formato del archivo de entrada

El archivo debe ser un chat exportado de WhatsApp en formato `.txt`, por ejemplo:

[12/3/24, 14:32] Juan: Hola!\
[12/3/24, 14:33] María: Todo bien?

### Consideraciones

- Se soporta el formato estándar de exportación
- No se contemplan todos los formatos posibles
- Mensajes multimedia pueden ser ignorados o filtrados

---

## 📚 Decisiones técnicas

- Procesamiento 100% en cliente (sin backend)
- Lectura de archivos usando APIs del navegador (`FileReader`)
- Parseo mediante expresiones regulares
- Cálculo de métricas en memoria
- Visualización dinámica con manipulación del DOM

---

## 📁 Gestión del proyecto

- Uso de repositorio Git para control de versiones
- Commits descriptivos y atómicos
- Separación clara entre:
  - lógica (js)
  - presentación (html/css)
