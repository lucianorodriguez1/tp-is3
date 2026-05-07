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

  contadorMensajes.textContent = String(mensajes.length);
  const topUser = usuarioConMasMensajes(mensajes);
  console.log("Usuario con más mensajes:", topUser);
}

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
