const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const label = document.getElementById('upload');

// Mostrar archivo seleccionado
function mostrarArchivo(file) {
  if (!file) return;

  if (!file.name.endsWith('.txt')) {
    fileInfo.innerHTML = `
      <i class="bi bi-x-circle" style="color: red;"></i>
      <div><span>Solo se aceptan archivos <strong>.txt</strong></span></div>
    `;
    return;
  }

  fileInfo.innerHTML = `
    <i class="bi bi-file-text" style="color: green;"></i>
    <div>
      <span><strong>${file.name}</strong></span>
      <span style="font-size: 0.8em; color: gray;">${(file.size / 1024).toFixed(1)} KB</span>
    </div>
  `;
  label.classList.add('archivo-seleccionado');
}

// Click normal (seleccionar archivo)
fileInput.addEventListener('change', () => {
  mostrarArchivo(fileInput.files[0]);
});

// Drag & Drop
label.addEventListener('dragover', (e) => {
  e.preventDefault();
  label.classList.add('dragging');
});

label.addEventListener('dragleave', () => {
  label.classList.remove('dragging');
});

label.addEventListener('drop', (e) => {
  e.preventDefault();
  label.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  mostrarArchivo(file);
});