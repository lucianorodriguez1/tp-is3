# 🧪 Análisis Estadístico de Chats de WhatsApp

## 🎯 Descripción

Aplicación web que permite analizar un chat grupal de WhatsApp exportado y generar visualizaciones con estadísticas relevantes sobre la interacción entre los participantes.

La solución se ejecuta completamente en el frontend (JavaScript), sin necesidad de backend, procesando el archivo directamente en el navegador.

---

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
