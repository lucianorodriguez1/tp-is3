const CLAVE_ALMACENAMIENTO_CHAT = 'whatsup-chat-data';
const contadorMensajes = document.getElementById('messageCount');

const chatGuardado = sessionStorage.getItem(CLAVE_ALMACENAMIENTO_CHAT);

if (!chatGuardado) {
  window.location.href = 'index.html';
} else {
  const mensajes = JSON.parse(chatGuardado).map((mensaje) => ({
    ...mensaje,
    datetime: new Date(mensaje.datetime),
  }));

  contadorMensajes.textContent = String(mensajes.length);
}
