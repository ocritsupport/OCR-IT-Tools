# Historial de versiones

## 1.4.0 — 19/08/2026

- **Lo guardado deja de estar en claro**: servidores, contraseñas, comunidades SNMP,
  equipos de Wake-on-LAN y etiquetas se cifran con una clave del almacén de claves de
  Android, que no se puede extraer del teléfono. Lo anterior se migra solo.
- **Bloqueo de la app** con huella, cara o PIN, y **copia de seguridad cifrada** con
  contraseña propia para llevarse los servidores a otro móvil. Restaurar solo añade lo que
  falta, no borra.
- **Diagnóstico**: recorre dirección IP, router, salida a internet, portal cautivo, DNS,
  latencia, wifi y MTU y dice cuál es el eslabón roto. Distingue el DNS del router roto de
  la falta de línea.
- **Histórico de escaneos**: cada escaneo se guarda y se compara con el anterior de la
  misma red (nuevos, ausentes y cambios de IP, nombre o puertos), comparando por MAC.
- **Etiquetas de equipos** por MAC, que salen en la lista y en los informes.
- **Vigilar equipo**: comprueba un host en segundo plano y avisa por notificación cuando
  se cae o cuando vuelve.
- **SNMP v1/v2c**: sistema, interfaces de un switch, nivel de tóner y páginas de una
  impresora, estado de un SAI, y OID sueltos.
- **Wi-Fi cercanas**: canal, banda, seguridad y señal de cada red, reparto por canal y
  canal recomendado en 2,4 GHz.
- **Túnel SSH** (redirección de puertos) para llegar a lo que solo se ve desde dentro.
- **Código QR de la wifi** para dársela al cliente sin dictarla.
- **Informes en CSV** además de PDF y texto, y **chuletas de comandos** en la terminal.
- Desde el escáner se abre el escritorio remoto de un equipo con el 3389 abierto.
- Nueva pantalla de **Ajustes** (aspecto, seguridad, copia y equipos etiquetados).

## 1.3.1 — 19/08/2026

- **SCP** en el gestor de ficheros, para equipos con SSH pero sin subsistema SFTP
  (switches, aparatos empotrados, servidores endurecidos).
- **Aviso de versión nueva**: al abrir la app se consulta si hay una publicación más
  reciente y, si la hay, se puede descargar e instalar desde la propia aplicación.
- **Verificación de la clave del servidor SSH y SFTP**: la primera conexión memoriza la
  clave del equipo y muestra su huella; si en una conexión posterior no coincide, se
  corta antes de enviar la contraseña. Protege de que alguien suplante un servidor en la
  red de un cliente.
- Los certificados TLS se validan primero de forma normal en el comprobador web y en
  FTPS; solo si no los firma una CA conocida se sigue adelante, avisándolo en pantalla,
  en lugar de aceptarlos siempre a ciegas.

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
