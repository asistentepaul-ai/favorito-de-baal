// ═══════════════════════════════════════════════════════════════════
//  MARCADOR GLOBAL DE "EL FAVORITO DE BAAL" — Código para Google Apps Script
//  Guarda las puntuaciones en una hoja de cálculo de TU Google Drive.
// ═══════════════════════════════════════════════════════════════════
//
//  CÓMO INSTALARLO (5 minutos, gratis):
//
//  1. Ve a https://sheets.google.com y crea una hoja de cálculo nueva.
//     Ponle de nombre: "El Favorito de BAAL - Puntuaciones"
//     (quedará guardada en tu Google Drive, organizada con fecha/nombre/puntos)
//
//  2. En esa hoja: menú "Extensiones" → "Apps Script".
//     Borra el código de ejemplo y pega TODO este archivo.
//
//  3. Botón azul "Implementar" → "Nueva implementación" →
//     engranaje ⚙️ → tipo "Aplicación web":
//        - Ejecutar como: Tú (tu cuenta)
//        - Quién tiene acceso: Cualquier usuario
//     Pulsa "Implementar" y autoriza los permisos que te pida.
//
//  4. Copia la URL que te da (termina en /exec).
//
//  5. Abre bodega-pixelart.html, busca la constante LEADERBOARD_URL
//     (está arriba del todo, en los AJUSTES RÁPIDOS) y pega la URL:
//        const LEADERBOARD_URL = 'https://script.google.com/macros/s/..../exec';
//
//  ¡Listo! Al final de cada partida los jugadores podrán enviar su nombre
//  y puntuación, y verán el TOP 10 global.
//
// ═══════════════════════════════════════════════════════════════════

const SHEET_NAME = 'Puntuaciones';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Fecha', 'Nombre', 'Puntuación (€)']);
    sh.getRange('A1:C1').setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// Recibe una puntuación nueva desde el juego
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const name = String(d.name || 'Anónimo').slice(0, 20);
  const score = Math.max(0, Math.min(99999, Number(d.score) || 0));
  getSheet().appendRow([new Date(), name, score]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Devuelve el TOP 10 al juego
function doGet() {
  const rows = getSheet().getDataRange().getValues().slice(1);
  const top = rows
    .map(r => ({ name: r[1], score: r[2] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  return ContentService.createTextOutput(JSON.stringify(top))
    .setMimeType(ContentService.MimeType.JSON);
}
