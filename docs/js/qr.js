// Generador de códigos QR (modo byte, corrección M, versiones 1 a 10).
//
// Escrito a mano en vez de traer una librería porque la app tiene que funcionar
// sin conexión: todo lo que use se guarda en el caché, y cuanto menos haya que
// guardar, mejor. Es la misma decisión que con SNMP en la app de Android.
//
// Lo comprueba `test/qr.test.js`, que genera el código y lo vuelve a leer con un
// lector de QR de verdad.

// Cuántos bytes de datos y cuántos de corrección lleva cada versión en nivel M.
// [bytes de datos totales, bytes de corrección por bloque, [bloques cortos, bloques largos]]
const VERSIONES = {
  1: { datos: 16, ec: 10, bloques: [1, 0] },
  2: { datos: 28, ec: 16, bloques: [1, 0] },
  3: { datos: 44, ec: 26, bloques: [1, 0] },
  4: { datos: 64, ec: 18, bloques: [2, 0] },
  5: { datos: 86, ec: 24, bloques: [2, 0] },
  6: { datos: 108, ec: 16, bloques: [4, 0] },
  7: { datos: 124, ec: 18, bloques: [4, 0] },
  8: { datos: 154, ec: 22, bloques: [2, 2] },
  9: { datos: 182, ec: 22, bloques: [3, 2] },
  10: { datos: 216, ec: 26, bloques: [4, 1] },
};

// Centros de los patrones de alineación de cada versión.
const ALINEACION = {
  1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
  6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
};

// --- Aritmética en GF(256), la que necesita Reed-Solomon ---

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(function tablas() {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d; // polinomio del estándar
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
})();

function multiplicar(a, b) {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

function polinomioGenerador(grado) {
  let poli = [1];
  for (let i = 0; i < grado; i++) {
    const nuevo = new Array(poli.length + 1).fill(0);
    for (let j = 0; j < poli.length; j++) {
      nuevo[j] ^= poli[j];
      nuevo[j + 1] ^= multiplicar(poli[j], EXP[i]);
    }
    poli = nuevo;
  }
  return poli;
}

function correccion(datos, cuantos) {
  const generador = polinomioGenerador(cuantos);
  const resto = new Array(datos.length + cuantos).fill(0);
  for (let i = 0; i < datos.length; i++) resto[i] = datos[i];
  for (let i = 0; i < datos.length; i++) {
    const factor = resto[i];
    if (factor === 0) continue;
    for (let j = 0; j < generador.length; j++) {
      resto[i + j] ^= multiplicar(generador[j], factor);
    }
  }
  return resto.slice(datos.length);
}

// --- Datos ---

function aBytes(texto) {
  return Array.from(new TextEncoder().encode(texto));
}

function versionPara(largoBytes) {
  for (let v = 1; v <= 10; v++) {
    const cabecera = 4 + (v <= 9 ? 8 : 16);
    if (VERSIONES[v].datos * 8 >= cabecera + largoBytes * 8) return v;
  }
  return null;
}

function bitsDeDatos(bytes, version) {
  const bits = [];
  const meter = (valor, cuantos) => {
    for (let i = cuantos - 1; i >= 0; i--) bits.push((valor >> i) & 1);
  };
  meter(0b0100, 4); // modo byte
  meter(bytes.length, version <= 9 ? 8 : 16);
  bytes.forEach((b) => meter(b, 8));

  const capacidad = VERSIONES[version].datos * 8;
  // Terminador: hasta cuatro ceros, y luego se completa el byte.
  for (let i = 0; i < 4 && bits.length < capacidad; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const relleno = [0xec, 0x11];
  let indice = 0;
  while (bits.length < capacidad) {
    meter(relleno[indice++ % 2], 8);
  }

  const salida = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    salida.push(byte);
  }
  return salida;
}

/** Reparte en bloques, calcula la corrección y lo intercala como manda el estándar. */
function bloques(datos, version) {
  const { ec, bloques: [cortos, largos] } = VERSIONES[version];
  const total = cortos + largos;
  const porBloqueCorto = Math.floor(datos.length / total);
  const trozos = [];
  let posicion = 0;

  for (let i = 0; i < total; i++) {
    const tamano = i < cortos ? porBloqueCorto : porBloqueCorto + 1;
    const trozo = datos.slice(posicion, posicion + tamano);
    posicion += tamano;
    trozos.push({ datos: trozo, ec: correccion(trozo, ec) });
  }

  const salida = [];
  const maxDatos = Math.max(...trozos.map((t) => t.datos.length));
  for (let i = 0; i < maxDatos; i++) {
    trozos.forEach((t) => {
      if (i < t.datos.length) salida.push(t.datos[i]);
    });
  }
  for (let i = 0; i < ec; i++) {
    trozos.forEach((t) => salida.push(t.ec[i]));
  }
  return salida;
}

// --- Dibujo de la matriz ---

function nuevaMatriz(lado) {
  return {
    lado,
    modulos: Array.from({ length: lado }, () => new Array(lado).fill(null)),
    reservado: Array.from({ length: lado }, () => new Array(lado).fill(false)),
  };
}

function poner(m, fila, columna, valor, reservar = true) {
  m.modulos[fila][columna] = valor;
  if (reservar) m.reservado[fila][columna] = true;
}

function patronesFijos(m) {
  const lado = m.lado;
  const buscador = (fila, columna) => {
    for (let f = -1; f <= 7; f++) {
      for (let c = -1; c <= 7; c++) {
        const ff = fila + f;
        const cc = columna + c;
        if (ff < 0 || cc < 0 || ff >= lado || cc >= lado) continue;
        const dentro = f >= 0 && f <= 6 && c >= 0 && c <= 6;
        const anillo = dentro && (f === 0 || f === 6 || c === 0 || c === 6);
        const centro = dentro && f >= 2 && f <= 4 && c >= 2 && c <= 4;
        poner(m, ff, cc, anillo || centro ? 1 : 0);
      }
    }
  };
  buscador(0, 0);
  buscador(0, lado - 7);
  buscador(lado - 7, 0);

  for (let i = 8; i < lado - 8; i++) {
    const valor = i % 2 === 0 ? 1 : 0;
    poner(m, 6, i, valor);
    poner(m, i, 6, valor);
  }

  const centros = ALINEACION[(lado - 17) / 4];
  centros.forEach((fila) => {
    centros.forEach((columna) => {
      // No van encima de los buscadores.
      if ((fila <= 8 && columna <= 8) ||
          (fila <= 8 && columna >= lado - 9) ||
          (fila >= lado - 9 && columna <= 8)) return;
      for (let f = -2; f <= 2; f++) {
        for (let c = -2; c <= 2; c++) {
          const borde = Math.max(Math.abs(f), Math.abs(c));
          poner(m, fila + f, columna + c, borde === 1 ? 0 : 1);
        }
      }
    });
  });

  // De la versión 7 en adelante hay dos bloques que dicen qué versión es, con
  // su propia corrección de errores. Sin ellos el lector cuenta mal los módulos
  // de datos y no descifra nada.
  const version = (lado - 17) / 4;
  if (version >= 7) {
    let resto = version;
    for (let i = 0; i < 12; i++) {
      resto = (resto << 1) ^ ((resto >> 11) * 0x1f25);
    }
    const bits = (version << 12) | (resto & 0xfff);
    for (let i = 0; i < 18; i++) {
      const bit = (bits >> i) & 1;
      const a = lado - 11 + (i % 3);
      const b = Math.floor(i / 3);
      poner(m, b, a, bit);
      poner(m, a, b, bit);
    }
  }

  // Módulo siempre oscuro.
  poner(m, lado - 8, 8, 1);

  // Sitio reservado para la información de formato.
  for (let i = 0; i < 9; i++) {
    if (m.modulos[8][i] === null) poner(m, 8, i, 0);
    if (m.modulos[i][8] === null) poner(m, i, 8, 0);
  }
  for (let i = 0; i < 8; i++) {
    if (m.modulos[8][lado - 1 - i] === null) poner(m, 8, lado - 1 - i, 0);
    if (m.modulos[lado - 1 - i][8] === null) poner(m, lado - 1 - i, 8, 0);
  }
}

function colocarDatos(m, bytes) {
  const lado = m.lado;
  let bit = 0;
  const siguiente = () => {
    if (bit >= bytes.length * 8) return 0;
    const valor = (bytes[bit >> 3] >> (7 - (bit % 8))) & 1;
    bit++;
    return valor;
  };

  let arriba = true;
  for (let columna = lado - 1; columna > 0; columna -= 2) {
    if (columna === 6) columna--; // la columna de sincronismo se salta
    for (let paso = 0; paso < lado; paso++) {
      const fila = arriba ? lado - 1 - paso : paso;
      for (const c of [columna, columna - 1]) {
        if (m.reservado[fila][c]) continue;
        poner(m, fila, c, siguiente(), false);
      }
    }
    arriba = !arriba;
  }
}

function mascara(numero, fila, columna) {
  switch (numero) {
    case 0: return (fila + columna) % 2 === 0;
    case 1: return fila % 2 === 0;
    case 2: return columna % 3 === 0;
    case 3: return (fila + columna) % 3 === 0;
    case 4: return (Math.floor(fila / 2) + Math.floor(columna / 3)) % 2 === 0;
    case 5: return ((fila * columna) % 2) + ((fila * columna) % 3) === 0;
    case 6: return (((fila * columna) % 2) + ((fila * columna) % 3)) % 2 === 0;
    default: return (((fila + columna) % 2) + ((fila * columna) % 3)) % 2 === 0;
  }
}

/** Información de formato: nivel M (00) y máscara, con su BCH de 15 bits. */
function bitsDeFormato(numeroMascara) {
  const datos = (0b00 << 3) | numeroMascara;
  let resto = datos << 10;
  for (let i = 14; i >= 10; i--) {
    if ((resto >> i) & 1) resto ^= 0b10100110111 << (i - 10);
  }
  return ((datos << 10) | resto) ^ 0b101010000010010;
}

function escribirFormato(m, numeroMascara) {
  const bits = bitsDeFormato(numeroMascara);
  const lado = m.lado;
  const leer = (i) => (bits >> i) & 1;

  // Primera copia: los seis primeros bits bajan por la columna 8, y del noveno
  // en adelante se van hacia la izquierda por la fila 8.
  for (let i = 0; i <= 5; i++) poner(m, i, 8, leer(i));
  poner(m, 7, 8, leer(6));
  poner(m, 8, 8, leer(7));
  poner(m, 8, 7, leer(8));
  for (let i = 9; i <= 14; i++) poner(m, 8, 14 - i, leer(i));

  // Segunda copia: por la fila 8 desde la derecha, y por la columna 8 desde
  // abajo.
  for (let i = 0; i <= 7; i++) poner(m, 8, lado - 1 - i, leer(i));
  for (let i = 8; i <= 14; i++) poner(m, lado - 15 + i, 8, leer(i));
}

/** Penalización del estándar, para elegir la máscara que mejor se lee. */
function penalizacion(modulos) {
  const lado = modulos.length;
  let total = 0;

  const seguidas = (obtener) => {
    for (let a = 0; a < lado; a++) {
      let racha = 1;
      for (let b = 1; b < lado; b++) {
        if (obtener(a, b) === obtener(a, b - 1)) {
          racha++;
        } else {
          if (racha >= 5) total += racha - 2;
          racha = 1;
        }
      }
      if (racha >= 5) total += racha - 2;
    }
  };
  seguidas((f, c) => modulos[f][c]);
  seguidas((c, f) => modulos[f][c]);

  for (let f = 0; f < lado - 1; f++) {
    for (let c = 0; c < lado - 1; c++) {
      const v = modulos[f][c];
      if (v === modulos[f][c + 1] && v === modulos[f + 1][c] && v === modulos[f + 1][c + 1]) {
        total += 3;
      }
    }
  }

  let oscuros = 0;
  modulos.forEach((fila) => fila.forEach((v) => { if (v) oscuros++; }));
  const porcentaje = (oscuros * 100) / (lado * lado);
  total += Math.floor(Math.abs(porcentaje - 50) / 5) * 10;
  return total;
}

/**
 * Devuelve la matriz de módulos (true = oscuro) del texto dado.
 * Lanza si el texto no cabe en la versión 10.
 */
export function generar(texto) {
  const bytes = aBytes(texto);
  const version = versionPara(bytes.length);
  if (!version) throw new Error('el texto es demasiado largo para un QR de esta app');

  const codificado = bloques(bitsDeDatos(bytes, version), version);
  const lado = 17 + version * 4;

  let mejor = null;
  for (let numeroMascara = 0; numeroMascara < 8; numeroMascara++) {
    const m = nuevaMatriz(lado);
    patronesFijos(m);
    colocarDatos(m, codificado);
    for (let f = 0; f < lado; f++) {
      for (let c = 0; c < lado; c++) {
        if (!m.reservado[f][c] && mascara(numeroMascara, f, c)) {
          m.modulos[f][c] ^= 1;
        }
      }
    }
    escribirFormato(m, numeroMascara);
    const puntos = penalizacion(m.modulos);
    if (!mejor || puntos < mejor.puntos) mejor = { puntos, modulos: m.modulos };
  }
  return mejor.modulos.map((fila) => fila.map((v) => v === 1));
}

/** Contenido de un QR de wifi, en el formato que leen Android e iOS. */
export function textoWifi(ssid, clave, seguridad = 'WPA', oculta = false) {
  const escapar = (valor) => String(valor).replace(/([\\;,:"])/g, '\\$1');
  let salida = 'WIFI:T:' + seguridad + ';S:' + escapar(ssid) + ';';
  if (seguridad !== 'nopass') salida += 'P:' + escapar(clave) + ';';
  if (oculta) salida += 'H:true;';
  return salida + ';';
}
