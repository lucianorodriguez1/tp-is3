const entradaArchivo = document.getElementById('fileInput');
const infoArchivo = document.getElementById('fileInfo');
const zonaCarga = document.getElementById('upload');
const botonAnalizar = document.getElementById('analyzeButton');
const CLAVE_ALMACENAMIENTO_CHAT = 'whatsup-chat-data';

function mostrarErrorFormato(mensaje) {
  infoArchivo.innerHTML = `
    <i class="bi bi-x-circle" style="color: red;"></i>
    <div><span>${mensaje}</span></div>
  `;
  zonaCarga.classList.remove('archivo-seleccionado');
  botonAnalizar.disabled = true;
  sessionStorage.removeItem(CLAVE_ALMACENAMIENTO_CHAT);
}

function mostrarArchivoValido(archivo) {
  infoArchivo.innerHTML = `
    <i class="bi bi-file-text" style="color: green;"></i>
    <div>
      <span style="display: block;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
                font-size: 1rem;"
                ><strong>${archivo.name}</strong></span>
      <span style="font-size: 0.8em; color: gray;">${(archivo.size / 1024).toFixed(1)} KB</span>
    </div>
  `;
  zonaCarga.classList.add('archivo-seleccionado');
  botonAnalizar.disabled = false;
}

function parsearFechaHoraChat(textoFecha, textoHora, textoMeridiem) {
  const [textoDia, textoMes, textoAnio] = textoFecha.split('/');
  const [textoHoraNumero, textoMinuto] = textoHora.split(':');

  const dia = Number(textoDia);
  const mes = Number(textoMes);
  const anioCrudo = Number(textoAnio);
  const anio = anioCrudo < 100 ? 2000 + anioCrudo : anioCrudo;
  const minutos = Number(textoMinuto);
  let horas = Number(textoHoraNumero);

  if (
    !Number.isInteger(dia) ||
    !Number.isInteger(mes) ||
    !Number.isInteger(anio) ||
    !Number.isInteger(horas) ||
    !Number.isInteger(minutos)
  ) {
    throw new Error('Fecha invalida en el chat.');
  }

  const meridiemNormalizado = textoMeridiem.toLowerCase().replace(/\./g, '').replace(/\s/g, '');

  if (meridiemNormalizado) {
    if (horas < 1 || horas > 12) {
      throw new Error('Fecha invalida en el chat.');
    }

    if (meridiemNormalizado === 'pm' && horas < 12) {
      horas += 12;
    } else if (meridiemNormalizado === 'am' && horas === 12) {
      horas = 0;
    } else if (meridiemNormalizado !== 'am' && meridiemNormalizado !== 'pm') {
      throw new Error('Fecha invalida en el chat.');
    }
  } else if (horas < 0 || horas > 23) {
    throw new Error('Fecha invalida en el chat.');
  }

  if (mes < 1 || mes > 12 || minutos < 0 || minutos > 59) {
    throw new Error('Fecha invalida en el chat.');
  }

  const fecha = new Date(anio, mes - 1, dia, horas, minutos);

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.getFullYear() !== anio ||
    fecha.getMonth() !== mes - 1 ||
    fecha.getDate() !== dia ||
    fecha.getHours() !== horas ||
    fecha.getMinutes() !== minutos
  ) {
    throw new Error('Fecha invalida en el chat.');
  }

  return fecha;
}

function parsearChatWhatsApp(contenido) {
  const contenidoNormalizado = contenido.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const lineas = contenidoNormalizado.split('\n');
  const mensajes = [];
  const patronMarcaTiempo = /^(?:\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s([apAP]\.?\s?m\.?))?\]\s|(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2})(?:\s([apAP]\.?\s?m\.?))?\s-\s)([\s\S]*)$/;
  const patronMensajeConAutor = /^([^:]+):\s([\s\S]*)$/;

  let mensajeActual = null;

  for (const lineaCruda of lineas) {
    const linea = lineaCruda.trimEnd();

    if (!linea.trim()) {
      if (mensajeActual) {
        mensajeActual.text += '\n';
      }
      continue;
    }

    const coincidencia = linea.match(patronMarcaTiempo);

    if (coincidencia) {
      const textoFecha = coincidencia[1] || coincidencia[4];
      const textoHora = coincidencia[2] || coincidencia[5];
      const textoMeridiem = (coincidencia[3] || coincidencia[6] || '').trim();
      const contenidoMensaje = coincidencia[7].trim();

      if (mensajeActual) {
        mensajes.push(mensajeActual);
      }

      const coincidenciaMensajeConAutor = contenidoMensaje.match(patronMensajeConAutor);

      if (!coincidenciaMensajeConAutor) {
        parsearFechaHoraChat(textoFecha, textoHora, textoMeridiem);
        mensajeActual = null;
        continue;
      }

      const autor = coincidenciaMensajeConAutor[1].trim();
      const texto = coincidenciaMensajeConAutor[2].trim();

      if (!autor) {
        throw new Error('No se pudo reconocer el formato del chat.');
      }

      mensajeActual = {
        datetime: parsearFechaHoraChat(textoFecha, textoHora, textoMeridiem).toISOString(),
        author: autor,
        text: texto,
      };
      continue;
    }

    if (!mensajeActual) {
      throw new Error('No se pudo reconocer el formato del chat.');
    }

    mensajeActual.text += `\n${linea}`;
  }

  if (mensajeActual) {
    mensajes.push(mensajeActual);
  }

  if (!mensajes.length) {
    throw new Error('No se pudo reconocer el formato del chat.');
  }

  return mensajes;
}

function leerArchivoComoTexto(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));

    lector.readAsText(archivo, 'utf-8');
  });
}

async function procesarArchivo(archivo) {
  if (!archivo) {
    return;
  }

  if (!archivo.name.toLowerCase().endsWith('.txt')) {
    mostrarErrorFormato('Solo se aceptan archivos <strong>.txt</strong>');
    return;
  }

  infoArchivo.innerHTML = `
    <i class="bi bi-hourglass-split" style="color: #075e54;"></i>
    <div><span>Procesando archivo...</span></div>
  `;

  try {
    const contenido = await leerArchivoComoTexto(archivo);
    const mensajesParseados = parsearChatWhatsApp(contenido);
    sessionStorage.setItem(CLAVE_ALMACENAMIENTO_CHAT, JSON.stringify(mensajesParseados));
    mostrarArchivoValido(archivo);
  } catch (error) {
    mostrarErrorFormato('El archivo no tiene un formato valido de chat de WhatsApp.');
  }
}

entradaArchivo.addEventListener('change', () => {
  procesarArchivo(entradaArchivo.files[0]);
});

zonaCarga.addEventListener('dragover', (evento) => {
  evento.preventDefault();
  zonaCarga.classList.add('dragging');
});

zonaCarga.addEventListener('dragleave', () => {
  zonaCarga.classList.remove('dragging');
});

zonaCarga.addEventListener('drop', (evento) => {
  evento.preventDefault();
  zonaCarga.classList.remove('dragging');
  procesarArchivo(evento.dataTransfer.files[0]);
});

botonAnalizar.addEventListener('click', () => {
  if (sessionStorage.getItem(CLAVE_ALMACENAMIENTO_CHAT)) {
    window.location.href = 'analisis.html';
  }
});
