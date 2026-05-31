const CLAVE_ALMACENAMIENTO_CHAT = "whatsup-chat-data";
const contadorMensajes = document.getElementById("messageCount");

const chatGuardado = sessionStorage.getItem(CLAVE_ALMACENAMIENTO_CHAT);

if (!chatGuardado) {
  window.location.href = "index.html";
} else {
  let mensajes;
  try {
    mensajes = JSON.parse(chatGuardado).map((mensaje) => ({
      ...mensaje,
      datetime: new Date(mensaje.datetime),
    }));
  } catch {
    sessionStorage.removeItem(CLAVE_ALMACENAMIENTO_CHAT);
    window.location.href = "index.html";
  }

  const topUser = usuarioConMasMensajes(mensajes);

  document.getElementById("personName").innerHTML =`<i class="bi bi-file-person"></i> ${topUser.author}`;
  document.getElementById("personMessages").innerHTML = `<i class="bi bi-chat-dots"></i> Mensajes enviados: ${topUser.count}`;

  const topHourRange = franjaHorariaConMayorActividad(mensajes);
  
  document.getElementById("hourRange").innerHTML = `<i class="bi bi-alarm"></i> ${topHourRange.range}`;
  document.getElementById("hourMessages").innerHTML = `<i class="bi bi-chat-dots"></i> Mensajes enviados: ${topHourRange.count}`;

  const topDay = diasConMayorCantidadDeMensajes(mensajes);
  
  document.getElementById("topDay").innerHTML = `<i class="bi bi-calendar-event"></i> ${topDay.day}`;
  document.getElementById("topDayMessages").innerHTML = `<i class="bi bi-chat-dots"></i> Mensajes enviados: ${topDay.count}`;

  emojiMasUsado(mensajes).then((topEmoji) => {
    if (!topEmoji) {
      document.getElementById("emojiTotal").innerHTML = `<i class="bi bi-emoji-sunglasses"></i> No se encontraron emojis.`;
      document.getElementById("emojiCount").innerHTML = "";
    } else {
      document.getElementById("emojiTotal").innerHTML = `<i class="bi bi-emoji-sunglasses"></i> Emoji mas usado: ${topEmoji.emoji}`;
      document.getElementById("emojiCount").innerHTML = `<i class="bi bi-123"></i> Veces usado: ${topEmoji.count}`;
    }
  });

  inicializarWordCloud(obtenerListaWordCloud(mensajes));

}

/*
WARNING:
    Si hay dos usuarios que se llaman igual pero con mayúsculas diferentes, se contarán como el mismo usuario, pero se mostrará el nombre con la capitalización original del primer mensaje que se encontró.

*/
function usuarioConMasMensajes(mensajes) {
  const counts = new Map();
  const original = new Map();
  for (const m of mensajes) {
    const raw = String(m.author || "Desconocido").trim();
    const key = raw.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
    if (!original.has(key)) original.set(key, raw);
  }
  let top = null;
  for (const [k, v] of counts) {
    if (!top || v > top.count) top = { author: original.get(k), count: v };
  }
  return top; // { author, count } o null si no hay mensajes
}

async function emojiMasUsado(mensajes, { normalizeSkinTone = true } = {}) {
  let re;
  try {
    // IMPORTANTE: emoji-regex en Unpkg exporta una función por defecto
    const mod = await import("https://unpkg.com/emoji-regex/index.mjs");
    // La función exportada debe ejecutarse para obtener la RegExp
    re = (mod.default || mod)();
  } catch (e) {
    //despues de testear se podría ELIMINAR
    console.warn("Usando fallback de Regex", e);
    re =
      /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
  }

  const counts = new Map();
  for (const m of mensajes) {
    const text = m.text || "";
    // Usamos match para asegurar que capturamos cada emoji individualmente
    const matches = text.match(re);
    if (!matches) continue;

    for (let e of matches) {
      if (normalizeSkinTone) {
        // Eliminamos modificadores de tono de piel y el selector de variación (FE0F)
        e = e.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "").replace(/\uFE0F/g, "");
      }
      if (!e) continue;
      counts.set(e, (counts.get(e) || 0) + 1);
    }
  }

  let top = null;
  for (const [emoji, cnt] of counts) {
    if (!top || cnt > top.count) {
      top = { emoji, count: cnt };
    }
  }
  return top;
}

function franjaHorariaConMayorActividad(mensajes) {
  const counts = new Map();

  for (const mensaje of mensajes) {
    const hora = mensaje.datetime.getHours();

    const horaInicio = hora.toString().padStart(2, "0");
    const horaFin = ((hora + 1) % 24).toString().padStart(2, "0");

    const franja = `${horaInicio}:00 - ${horaFin}:00`;

    counts.set(franja, (counts.get(franja) || 0) + 1);
  }

  let top = null;

  for (const [franja, cantidad] of counts) {
    if (!top || cantidad > top.count) {
      top = {
        range: franja,
        count: cantidad,
      };
    }
  }

  return top;
}

function diasConMayorCantidadDeMensajes(mensajes) {
  const counts = new Map();

  for (const mensaje of mensajes) {
    const fecha = mensaje.datetime.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    counts.set(fecha, (counts.get(fecha) || 0) + 1);
  }

  let top = null;

  for (const [dia, cantidad] of counts) {
    if (!top || cantidad > top.count) {
      top = {
        day: dia,
        count: cantidad,
      };
    }
  }

  return top;
}

function obtenerListaWordCloud(
  mensajes,
  { limite = 50, minimoLargo = 4 } = {}
) {
  const frecuencias = new Map();

  for (const mensaje of mensajes) {
    const palabras = normalizarTextoParaWordCloud(mensaje.text || "");

    for (const palabra of palabras) {
      if (palabra.length < minimoLargo) {
        continue;
      }
      frecuencias.set(palabra, (frecuencias.get(palabra) || 0) + 1);
    }
  }

  return [...frecuencias.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limite);
}

function normalizarTextoParaWordCloud(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/@\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function inicializarWordCloud(listaPalabras) {
  const contenedor = document.getElementById("wordCloud");

  if (!contenedor || typeof WordCloud !== "function") {
    return;
  }

  const lista = listaPalabras || [];

  if (lista.length === 0) return;

  const maxFrecuencia = lista[0][1];

  WordCloud(contenedor, {
    list: lista,
    gridSize: 16,
    weightFactor: function(frecuencia){
      const mintTam=12;
      const maxTam=80;
      return (frecuencia / maxFrecuencia) * (maxTam - mintTam) + mintTam;
    },
    drawOutOfBound: false,
    shrinkToFit: true,
    rotateRatio: 0.35,
    backgroundColor: "transparent",
    fontFamily: "'Segoe UI', rockwell, sans-serif",
    fontWeight:"600",
    color: function(word, weight){
      const colores =[
        "#4b865b",
        "#2c5236", 
        "#334139", 
        "#6b7a70"
      ];
      return colores[Math.floor(Math.random() * colores.length)];
    }
  });
}