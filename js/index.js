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
