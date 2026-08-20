import { analizar, dividir } from './subred.js';
import { generar, textoWifi } from './qr.js';
import { CHULETAS } from './chuletas.js';

const $ = (id) => document.getElementById(id);
const escapar = (texto) => String(texto).replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ------------------------------------------------------------- Pestañas

document.querySelectorAll('#pestanas button').forEach((boton) => {
  boton.addEventListener('click', () => {
    document.querySelectorAll('#pestanas button').forEach((b) => b.classList.remove('activa'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('activa'));
    boton.classList.add('activa');
    $('panel-' + boton.dataset.panel).classList.add('activa');
    localStorage.setItem('panel', boton.dataset.panel);
    window.scrollTo(0, 0);
  });
});

// ------------------------------------------------------------- Subredes

function pintarSubred() {
  const resultado = analizar($('cidr').value);
  const caja = $('resultado-subred');
  if (!resultado) {
    caja.innerHTML = '<div class="error">Escribe una dirección válida.</div>';
    $('resultado-dividir').innerHTML = '';
    return;
  }
  caja.innerHTML = '<dl>' + [
    ['Red', resultado.red + '/' + resultado.prefijo],
    ['Máscara', resultado.mascara],
    ['Comodín', resultado.comodin],
    ['Difusión', resultado.difusion],
    ['Primer equipo', resultado.primerEquipo],
    ['Último equipo', resultado.ultimoEquipo],
    ['Equipos', resultado.equipos.toLocaleString('es-ES')],
    ['Clase', resultado.clase],
    ['Tipo', resultado.privada ? 'privada (RFC 1918)' : 'pública'],
  ].map(([k, v]) => '<dt>' + k + '</dt><dd>' + escapar(v) + '</dd>').join('') + '</dl>';
  pintarDivision();
}

function pintarDivision() {
  const trozos = dividir($('cidr').value, Number($('dividir').value));
  const caja = $('resultado-dividir');
  if (!trozos.length) {
    caja.innerHTML = '<div class="ayuda">El prefijo tiene que ser mayor que el de la red.</div>';
    return;
  }
  caja.innerHTML = '<table><tr><th>Red</th><th>Rango útil</th><th>Difusión</th></tr>' +
    trozos.map((t) => '<tr><td>' + t.red + '/' + t.prefijo + '</td><td>' +
      t.primerEquipo + ' – ' + t.ultimoEquipo + '</td><td>' + t.difusion + '</td></tr>').join('') +
    '</table>' + (trozos.length === 256 ? '<div class="ayuda">Se muestran las 256 primeras.</div>' : '');
}

$('cidr').addEventListener('input', pintarSubred);
$('dividir').addEventListener('input', pintarDivision);

// ----------------------------------------------------------------- QR

/** Dibuja la matriz como SVG: se ve nítido a cualquier tamaño y se puede guardar. */
function svgDeQr(modulos) {
  const lado = modulos.length;
  const margen = 2;
  const total = lado + margen * 2;
  let camino = '';
  for (let f = 0; f < lado; f++) {
    for (let c = 0; c < lado; c++) {
      if (modulos[f][c]) camino += 'M' + (c + margen) + ' ' + (f + margen) + 'h1v1h-1z';
    }
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + total + ' ' + total +
    '" shape-rendering="crispEdges"><rect width="' + total + '" height="' + total +
    '" fill="#fff"/><path d="' + camino + '" fill="#000"/></svg>';
}

function pintarQr(caja, texto) {
  if (!texto) {
    caja.innerHTML = '';
    return;
  }
  try {
    caja.innerHTML = svgDeQr(generar(texto));
  } catch (error) {
    caja.innerHTML = '<div class="error">' + escapar(error.message) + '</div>';
  }
}

function pintarWifi() {
  const seguridad = $('seguridad').value;
  const ssid = $('ssid').value;
  if (!ssid) {
    $('qr-wifi').innerHTML = '<div class="ayuda">Escribe el nombre de la red.</div>';
    return;
  }
  pintarQr($('qr-wifi'), textoWifi(ssid, $('clave').value, seguridad, $('oculta').checked));
  ['ssid', 'clave'].forEach((id) => localStorage.setItem('wifi_' + id, $(id).value));
}

['ssid', 'clave', 'seguridad', 'oculta'].forEach((id) =>
  $(id).addEventListener('input', pintarWifi));
$('texto-libre').addEventListener('input', () => pintarQr($('qr-texto'), $('texto-libre').value));

$('descargar-qr').addEventListener('click', () => {
  const svg = $('qr-wifi').querySelector('svg');
  if (!svg) return;
  const enlace = document.createElement('a');
  enlace.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.outerHTML);
  enlace.download = 'wifi-' + ($('ssid').value || 'red').replace(/[^\w-]+/g, '-') + '.svg';
  enlace.click();
});

// ----------------------------------------------------------------- DNS

$('consultar-dns').addEventListener('click', async () => {
  const caja = $('resultado-dns');
  const nombre = $('dominio').value.trim();
  const tipo = $('tipo').value;
  if (!nombre) return;
  caja.innerHTML = '<div class="ayuda">Consultando...</div>';
  const comienzo = performance.now();
  try {
    const respuesta = await fetch(
      'https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(nombre) + '&type=' + tipo,
      { headers: { accept: 'application/dns-json' } }
    );
    const datos = await respuesta.json();
    const ms = Math.round(performance.now() - comienzo);
    const respuestas = datos.Answer || [];
    if (!respuestas.length) {
      caja.innerHTML = '<div class="error">Sin respuestas' +
        (datos.Status === 3 ? ': ese nombre no existe' : '') + '</div>';
      return;
    }
    caja.innerHTML = '<dl>' + respuestas.map((r) =>
      '<dt>' + escapar(r.name) + '</dt><dd>' + escapar(r.data) +
      ' <small>(TTL ' + Number(r.TTL) + ')</small></dd>').join('') +
      '</dl><div class="ayuda">' + ms + ' ms · resuelto por Cloudflare</div>';
  } catch (error) {
    caja.innerHTML = '<div class="error">No se pudo consultar: ' + escapar(error.message) + '</div>';
  }
});

// ----------------------------------------------------------------- Web

$('comprobar-web').addEventListener('click', async () => {
  const caja = $('resultado-web');
  let url = $('url').value.trim();
  if (!url || url === 'https://') return;
  if (!url.includes('://')) url = 'https://' + url;
  caja.innerHTML = '<div class="ayuda">Comprobando...</div>';
  const comienzo = performance.now();
  try {
    // "no-cors" devuelve una respuesta opaca: no se puede leer el código ni las
    // cabeceras, pero si no lanza es que algo ha contestado.
    await fetch(url, { mode: 'no-cors', cache: 'no-store' });
    const ms = Math.round(performance.now() - comienzo);
    caja.innerHTML = '<div class="bien">Contesta</div><div class="ayuda">' + ms +
      ' ms hasta la respuesta. El navegador no deja ver el código ni el certificado.</div>';
  } catch (error) {
    caja.innerHTML = '<div class="error">No contesta</div><div class="ayuda">' +
      'Puede ser que esté caída, que no resuelva el nombre o que el certificado no valga. ' +
      'Desde aquí no se puede distinguir.</div>';
  }
});

// ------------------------------------------------------------- Chuletas

function pintarChuletas(filtro = '') {
  const texto = filtro.trim().toLowerCase();
  $('lista-chuletas').innerHTML = CHULETAS.map(([grupo, lineas]) => {
    const visibles = lineas.filter(([comando, que]) =>
      !texto || (comando + ' ' + que).toLowerCase().includes(texto));
    if (!visibles.length) return '';
    return '<div class="grupo"><h3>' + escapar(grupo) + '</h3>' + visibles.map(([comando, que]) =>
      '<div class="chuleta" data-comando="' + escapar(comando) + '"><code>' + escapar(comando) +
      '</code><small>' + escapar(que) + '</small></div>').join('') + '</div>';
  }).join('') || '<div class="tarjeta ayuda">Nada que se parezca a eso.</div>';
}

$('buscar-chuleta').addEventListener('input', (e) => pintarChuletas(e.target.value));

$('lista-chuletas').addEventListener('click', (e) => {
  const fila = e.target.closest('.chuleta');
  if (!fila) return;
  navigator.clipboard?.writeText(fila.dataset.comando);
  fila.classList.add('copiada');
  setTimeout(() => fila.classList.remove('copiada'), 700);
});

// ---------------------------------------------------------------- Parte

['parte-cliente', 'parte-texto'].forEach((id) => {
  $(id).value = localStorage.getItem(id) || '';
  $(id).addEventListener('input', () => localStorage.setItem(id, $(id).value));
});

$('imprimir-parte').addEventListener('click', () => window.print());
$('borrar-parte').addEventListener('click', () => {
  if (!confirm('¿Borrar el parte?')) return;
  ['parte-cliente', 'parte-texto'].forEach((id) => {
    $(id).value = '';
    localStorage.removeItem(id);
  });
});

// --------------------------------------------------------------- Arranque

$('ssid').value = localStorage.getItem('wifi_ssid') || '';
$('clave').value = localStorage.getItem('wifi_clave') || '';

const guardada = localStorage.getItem('panel');
if (guardada) document.querySelector('#pestanas button[data-panel="' + guardada + '"]')?.click();

pintarSubred();
pintarWifi();
pintarChuletas();

function estado() {
  $('estado-conexion').textContent = navigator.onLine
    ? 'Funciona también sin cobertura'
    : 'Sin conexión: DNS y web no van, el resto sí';
}
window.addEventListener('online', estado);
window.addEventListener('offline', estado);
estado();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
