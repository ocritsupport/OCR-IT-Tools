<p align="center">
  <img src="logo.png" alt="OCR IT Tools" width="180">
</p>

<h1 align="center">OCR IT Tools</h1>

<p align="center">
  Caja de herramientas de red para Android, para trabajo de campo de soporte informático.<br>
  Todo lo que antes obligaba a saltar entre media docena de aplicaciones, en una sola.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-1.4.0-0BBBC5" alt="versión">
  <img src="https://img.shields.io/badge/Android-8.0%2B-006B78" alt="Android 8.0+">
  <img src="https://img.shields.io/badge/herramientas-19-D29371" alt="19 herramientas">
</p>

---

## Libreta de campo en el navegador

Para lo que se hace de pie en casa de un cliente —calcular una subred, dar la clave de la
wifi con un QR, mirar un DNS o consultar una chuleta— hay una web que se instala en la
pantalla de inicio y funciona sin cobertura:

**https://ocritsupport.github.io/OCR-IT-Tools/**

En el iPhone: abrirla en Safari → compartir → *Añadir a pantalla de inicio*. No sustituye a
la app: un navegador no puede hacer ping, escanear la red ni hablar SNMP o SSH.

## Descarga

El instalador está en la sección **[Releases](../../releases)**: descarga el `.apk` en el
teléfono y ábrelo. Android pedirá permiso para instalar desde el navegador o el gestor de
archivos la primera vez (*Instalar aplicaciones desconocidas*).

### Comprobar que el instalador es auténtico

Todas las versiones van firmadas con la misma clave de OCR IT Support. Su huella es:

```
SHA-256  0F:13:BA:80:AA:07:E4:04:50:2A:04:55:6A:16:A7:73:49:C9:44:58:2C:A5:AA:E0:11:B2:1E:A6:D1:6A:42:23
```

Cada publicación incluye además el `SHA-256` del propio fichero en sus notas.

## Las 19 herramientas

| Herramienta | Qué hace |
|---|---|
| **Diagnóstico** | Recorre la cadena entera (IP, router, internet, portal cautivo, DNS, latencia, wifi) y dice **cuál es el eslabón que falla** |
| **Escáner de red** | Descubre los equipos: IP, nombre, MAC, fabricante, puertos y tipo. Guarda histórico y compara con la visita anterior |
| **Ping** | Ping continuo con pérdida, media y jitter, y gráfica de los últimos envíos |
| **Vigilar equipo** | Comprueba un host en segundo plano y **avisa cuando se cae o cuando vuelve** |
| **Traceroute** | Ruta salto a salto, con tres sondas por salto y resolución inversa de nombres |
| **Escáner de puertos** | Por perfiles (Windows/AD, impresoras, NAS, bases de datos, 1-1024…) y con lectura de banner |
| **Test de velocidad** | Bajada, subida, latencia y jitter, con cuatro conexiones en paralelo |
| **SSH** | Terminal con teclas de control, servidores guardados y chuletas de comandos |
| **Túnel SSH** | Llegar a la web de un equipo que solo se ve desde dentro de la red del cliente |
| **Telnet / TCP** | Consola Telnet y modo crudo para hablar directamente con un puerto |
| **Ficheros** | Cliente tipo WinSCP: SFTP, SCP, FTP, FTPS y SMB |
| **Wi-Fi cercanas** | Redes al alcance, canales, saturación y **canal recomendado** |
| **Mi red** | Wi-Fi (SSID, canal, banda, señal), direccionamiento, DNS, MTU, IP pública y operador |
| **SNMP** | Switches, impresoras (tóner y páginas) y SAI, en v1 y v2c |
| **DNS y WHOIS** | Consultas por tipo (A, MX, TXT, PTR, SRV…) contra el servidor que elijas |
| **Wake-on-LAN** | Encendido remoto de equipos, con lista guardada |
| **HTTP y TLS** | Código de respuesta, cabeceras, redirecciones y caducidad del certificado |
| **Calculadora IP** | Máscaras, red, broadcast, rango útil y división en subredes |
| **Código QR** | La clave de la wifi para el cliente sin dictarla, y QR de cualquier texto |

## Inventario: qué ha cambiado desde la última visita

Cada escaneo se guarda. Al volver a un cliente, el histórico dice **qué equipos son
nuevos, cuáles ya no responden y a cuál le ha cambiado la IP, el nombre o los puertos
abiertos**. La comparación va por dirección MAC, no por IP, porque con DHCP la IP cambia
sola sin que el equipo sea otro.

A cada equipo se le puede poner nombre propio («PC recepción»), que aparece a partir de
entonces en la lista y en los informes.

## Informes para el cliente

Casi todas las herramientas generan un informe con un toque: pide el nombre del cliente y
produce

- un **PDF** con cabecera, fecha, tablas y numeración de páginas,
- un **texto plano** para pegar en un parte o en un chat, o
- un **CSV** listo para el Excel en español,

y lo envía por Telegram, correo, WhatsApp, Drive o lo que haya instalado en el teléfono.

## Seguridad

- **Lo que guardas está cifrado**: servidores, contraseñas, comunidades SNMP, equipos de
  Wake-on-LAN y etiquetas se cifran con una clave del almacén de claves de Android, que no
  se puede extraer del teléfono. Se puede pedir además huella o PIN al abrir la app.
- **Copia de seguridad** cifrada con una contraseña tuya, para llevarte todo a otro móvil.
- **SSH, SFTP, SCP y túneles** memorizan la clave del servidor en la primera conexión. Si
  luego no coincide, se corta **antes de enviar la contraseña**.
- **HTTPS y FTPS** se validan contra las CA del sistema; si el certificado es autofirmado
  (lo normal en routers y NAS) se continúa, pero avisando en pantalla.

## Actualizaciones

Al abrir la aplicación se comprueba si hay una versión más reciente publicada aquí. Si la
hay, aparece un aviso en la pantalla de inicio con los cambios y se instala desde la
propia aplicación. La consulta no envía ningún dato.

## Permisos y privacidad

| Permiso | Para qué |
|---|---|
| Internet y estado de la red | Todas las herramientas |
| Información de Wi-Fi | SSID, canal, señal, banda y redes cercanas |
| Ubicación | Android la exige para poder ver el nombre de la red conectada y las redes cercanas. **No se usa para nada más ni se guarda** |
| Notificaciones y servicio en primer plano | Solo para la vigilancia de un equipo, mientras esté activa |
| Instalar aplicaciones | Para la actualización desde la propia app |

Los servidores, contraseñas y equipos guardados **se quedan en el teléfono**, cifrados, y
están excluidos de la copia de seguridad en la nube. No hay servidor propio ni telemetría:
las únicas salidas a internet son el test de velocidad y la consulta de IP pública
(Cloudflare), las consultas DNS al servidor que elijas y el WHOIS.

## Requisitos

- Android 8.0 o superior.
- Para el escáner de red, estar conectado a la red que se quiere analizar.

## Aviso de uso

Escanear equipos y puertos solo está justificado en redes propias o de clientes que te
han contratado. Hacerlo contra terceros puede ser ilegal.

---

<p align="center">
  <sub>OCR IT Support · aplicación de uso interno</sub>
</p>
