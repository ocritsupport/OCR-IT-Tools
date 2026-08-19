# Historial de versiones

## 1.3.0 — 19/08/2026

- **Firma definitiva**: la app pasa a firmarse con la clave propia de OCR IT Support
  (RSA 4096, válida hasta 2053), con los esquemas v2 y v3 de Android. A partir de aquí
  todas las actualizaciones se instalan encima sin desinstalar.
- Quien tuviera instalada la 1.2.1 o anterior **tiene que desinstalarla primero**: Android
  no deja sustituir una app por otra firmada con distinta clave.

## 1.2.1 — 19/08/2026

- Logotipo oficial de OCR IT Tools como icono de la aplicación.
- Paleta de la aplicación tomada de los colores del propio logotipo: teal del disco,
  cian de los trazos de circuito y cobre del engranaje.

## 1.2.0 — 19/08/2026

- **Tema claro y oscuro**, elegible desde el botón de brillo de la pantalla de inicio:
  «Como el sistema», «Claro» u «Oscuro». La elección se guarda.
- Los distintivos de color se oscurecen automáticamente en tema claro para que se lean
  sobre fondo blanco.
- La terminal de SSH y Telnet se mantiene oscura en ambos temas.

## 1.1.0 — 19/08/2026

- **Gestor de ficheros** tipo WinSCP: SFTP, FTP, FTPS y SMB, con navegación, descarga,
  subida, renombrado, borrado y creación de carpetas. Servidores guardados.
- **Informes** desde el escáner de red, el ping, el traceroute, los puertos, la
  velocidad, el DNS/WHOIS, la comprobación web y la información de red: PDF con cabecera
  y tablas, o texto plano, con el nombre del cliente y envío por Telegram, correo o
  cualquier aplicación del teléfono.

## 1.0.0 — 19/08/2026

Primera versión, probada en teléfono real.

- Escáner de red, ping, traceroute, escáner de puertos, test de velocidad, SSH,
  Telnet/TCP, información de red, DNS y WHOIS, Wake-on-LAN, comprobador HTTP/TLS y
  calculadora de subredes.
- Base de fabricantes del IEEE incorporada (unos 40.000 prefijos) para identificar los
  equipos por su MAC sin conexión a internet.
