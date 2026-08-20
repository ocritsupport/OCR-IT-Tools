// Calculadora de subredes: la misma que la de Android (`SubnetCalc.kt`),
// traducida. Es puro cálculo, así que funciona sin conexión y sin permisos.

export function aEntero(ip) {
  const partes = String(ip).trim().split('.');
  if (partes.length !== 4) return null;
  let valor = 0;
  for (const parte of partes) {
    if (!/^\d{1,3}$/.test(parte)) return null;
    const octeto = Number(parte);
    if (octeto > 255) return null;
    valor = valor * 256 + octeto;
  }
  return valor;
}

export function aTexto(valor) {
  const v = valor >>> 0;
  return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255].join('.');
}

export function mascaraDe(prefijo) {
  if (prefijo <= 0) return 0;
  if (prefijo >= 32) return 0xffffffff;
  return (0xffffffff << (32 - prefijo)) >>> 0;
}

export function prefijoDe(mascara) {
  const valor = aEntero(mascara);
  if (valor === null) return null;
  // Una máscara válida son unos seguidos de ceros, sin mezclas.
  let unos = 0;
  for (let i = 31; i >= 0; i--) {
    if ((valor >>> i) & 1) unos++;
    else break;
  }
  return mascaraDe(unos) === valor ? unos : null;
}

export function esPrivada(valor) {
  const a = (valor >>> 24) & 255;
  const b = (valor >>> 16) & 255;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 169 && b === 254) return true;   // enlace local: no hay DHCP
  return false;
}

/** Acepta "192.168.1.10/24" y "192.168.1.10 255.255.255.0". */
export function analizar(entrada) {
  const limpia = String(entrada || '').trim();
  let ip = limpia;
  let prefijo = 32;

  if (limpia.includes('/')) {
    const [texto, sufijo] = limpia.split('/');
    const p = Number(sufijo);
    if (!Number.isInteger(p) || p < 0 || p > 32) return null;
    ip = texto;
    prefijo = p;
  } else if (/\s/.test(limpia)) {
    const partes = limpia.split(/\s+/);
    if (partes.length !== 2) return null;
    const p = prefijoDe(partes[1]);
    if (p === null) return null;
    ip = partes[0];
    prefijo = p;
  }

  const valor = aEntero(ip);
  if (valor === null) return null;

  const mascara = mascaraDe(prefijo);
  const red = (valor & mascara) >>> 0;
  const difusion = (red | (~mascara >>> 0)) >>> 0;
  const hayRango = prefijo <= 30;

  return {
    direccion: aTexto(valor),
    prefijo,
    mascara: aTexto(mascara),
    comodin: aTexto(~mascara >>> 0),
    red: aTexto(red),
    difusion: aTexto(difusion),
    primerEquipo: aTexto(hayRango ? red + 1 : red),
    ultimoEquipo: aTexto(hayRango ? difusion - 1 : difusion),
    equipos: prefijo >= 31 ? 0 : Math.pow(2, 32 - prefijo) - 2,
    privada: esPrivada(valor),
    clase: claseDe(valor),
  };
}

function claseDe(valor) {
  const a = (valor >>> 24) & 255;
  if (a < 128) return 'A';
  if (a < 192) return 'B';
  if (a < 224) return 'C';
  if (a < 240) return 'D (multidifusión)';
  return 'E (reservada)';
}

/** Divide una red en subredes del prefijo pedido. */
export function dividir(entrada, nuevoPrefijo) {
  const base = analizar(entrada);
  if (!base || nuevoPrefijo < base.prefijo || nuevoPrefijo > 32) return [];
  const salto = Math.pow(2, 32 - nuevoPrefijo);
  const cuantas = Math.pow(2, nuevoPrefijo - base.prefijo);
  const salida = [];
  let actual = aEntero(base.red);
  for (let i = 0; i < Math.min(cuantas, 256); i++) {
    salida.push(analizar(aTexto(actual) + '/' + nuevoPrefijo));
    actual += salto;
  }
  return salida;
}
