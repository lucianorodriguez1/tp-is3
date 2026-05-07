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

  //despues de testear ELIMINAR
  const topUser = usuarioConMasMensajes(mensajes);
  //despues de testear ELIMINAR
  console.log("Usuario con más mensajes:", topUser);

  //despues de testear ELIMINAR
  emojiMasUsado(mensajes).then((topEmoji) => {
    console.log("Emoji más usado:", topEmoji);
  });
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
