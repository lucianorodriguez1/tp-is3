const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const label = document.getElementById('upload');
const CHAT_STORAGE_KEY = 'whatsup-chat-text';

function mostrarErrorFormato(message) {
  fileInfo.innerHTML = `
    <i class="bi bi-x-circle" style="color: red;"></i>
    <div><span>${message}</span></div>
  `;
  label.classList.remove('archivo-seleccionado');
  sessionStorage.removeItem(CHAT_STORAGE_KEY);
}

function mostrarArchivoValido(file) {
  fileInfo.innerHTML = `
    <i class="bi bi-file-text" style="color: green;"></i>
    <div>
      <span><strong>${file.name}</strong></span>
      <span style="font-size: 0.8em; color: gray;">${(file.size / 1024).toFixed(1)} KB</span>
    </div>
  `;
  label.classList.add('archivo-seleccionado');
}

function validarFechaHora(dateText, timeText, meridiemText) {
  const [dayText, monthText, yearText] = dateText.split('/');
  const [hourText, minuteText] = timeText.split(':');

  const day = Number(dayText);
  const month = Number(monthText);
  const rawYear = Number(yearText);
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  const minutes = Number(minuteText);
  let hours = Number(hourText);

  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year) ||
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return false;
  }

  const normalizedMeridiem = meridiemText.toLowerCase().replace(/\./g, '').replace(/\s/g, '');

  if (normalizedMeridiem) {
    if (hours < 1 || hours > 12) {
      return false;
    }

    if (normalizedMeridiem === 'pm' && hours < 12) {
      hours += 12;
    } else if (normalizedMeridiem === 'am' && hours === 12) {
      hours = 0;
    } else if (normalizedMeridiem !== 'am' && normalizedMeridiem !== 'pm') {
      return false;
    }
  } else if (hours < 0 || hours > 23) {
    return false;
  }

  if (month < 1 || month > 12 || minutes < 0 || minutes > 59) {
    return false;
  }

  const date = new Date(year, month - 1, day, hours, minutes);

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes
  );
}

function validarFormatoWhatsApp(content) {
  const normalizedContent = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lines = normalizedContent.split('\n');
  const startPattern = /^(?:\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s([apAP]\.?\s?m\.?))?\]\s|(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s([apAP]\.?\s?m\.?))?\s-\s)([^:]+):\s([\s\S]*)$/;

  let foundMessage = false;
  let currentMessageOpen = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      continue;
    }

    const match = line.match(startPattern);

    if (match) {
      const dateText = match[1] || match[4];
      const timeText = match[2] || match[5];
      const meridiemText = (match[3] || match[6] || '').trim();
      const author = match[7].trim();

      if (!author || !validarFechaHora(dateText, timeText, meridiemText)) {
        return false;
      }

      foundMessage = true;
      currentMessageOpen = true;
      continue;
    }

    if (!currentMessageOpen) {
      return false;
    }
  }

  return foundMessage;
}

function leerArchivoComoTexto(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));

    reader.readAsText(file, 'utf-8');
  });
}

async function procesarArchivo(file) {
  if (!file) {
    return;
  }

  if (!file.name.toLowerCase().endsWith('.txt')) {
    mostrarErrorFormato('Solo se aceptan archivos <strong>.txt</strong>');
    return;
  }

  fileInfo.innerHTML = `
    <i class="bi bi-hourglass-split" style="color: #075e54;"></i>
    <div><span>Procesando archivo...</span></div>
  `;

  try {
    const content = await leerArchivoComoTexto(file);

    if (!validarFormatoWhatsApp(content)) {
      mostrarErrorFormato('El archivo no tiene un formato valido de chat de WhatsApp.');
      return;
    }

    sessionStorage.setItem(CHAT_STORAGE_KEY, content);
    mostrarArchivoValido(file);
  } catch (error) {
    mostrarErrorFormato('No se pudo leer el archivo.');
  }
}

fileInput.addEventListener('change', () => {
  procesarArchivo(fileInput.files[0]);
});

label.addEventListener('dragover', (event) => {
  event.preventDefault();
  label.classList.add('dragging');
});

label.addEventListener('dragleave', () => {
  label.classList.remove('dragging');
});

label.addEventListener('drop', (event) => {
  event.preventDefault();
  label.classList.remove('dragging');
  procesarArchivo(event.dataTransfer.files[0]);
});
