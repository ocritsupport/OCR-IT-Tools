<p align="center">
  <img src="logo.png" alt="OCR IT Tools" width="180">
</p>

<h1 align="center">OCR IT Tools</h1>

<p align="center">
  Caja de herramientas de red para Android, para trabajo de campo de soporte informático.<br>
  Todo lo que antes obligaba a saltar entre cinco aplicaciones, en una sola.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/versión-1.3.0-0BBBC5" alt="versión">
  <img src="https://img.shields.io/badge/Android-8.0%2B-006B78" alt="Android 8.0+">
  <img src="https://img.shields.io/badge/tamaño-15.5%20MB-D29371" alt="tamaño">
</p>

---

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

## Las 13 herramientas

| Herramienta | Qué hace |
|---|---|
| **Escáner de red** | Descubre los equipos de la red: IP, nombre, MAC, fabricante, puertos abiertos y tipo de dispositivo |
| **Ping** | Ping continuo con pérdida, media y jitter, y gráfica de los últimos envíos |
| **Traceroute** | Ruta salto a salto, con tres sondas por salto y resolución inversa de nombres |
| **Escáner de puertos** | Por perfiles (Windows/AD, impresoras, NAS, bases de datos, 1-1024…) y con lectura de banner |
| **Test de velocidad** | Bajada, subida, latencia y jitter, con cuatro conexiones en paralelo |
| **SSH** | Terminal con teclas de control (TAB, Ctrl+C, flechas) y servidores guardados |
| **Telnet / TCP** | Consola Telnet y modo crudo para hablar directamente con un puerto |
| **Ficheros** | Cliente tipo WinSCP: SFTP, FTP, FTPS y SMB, con descargas, subidas, renombrado y carpetas |
| **Mi red** | Wi-Fi (SSID, canal, banda, señal), direccionamiento, DNS, MTU, IP pública y operador |
| **DNS y WHOIS** | Consultas por tipo (A, MX, TXT, PTR, SRV…) contra el servidor que elijas |
| **Wake-on-LAN** | Encendido remoto de equipos, con lista guardada |
| **HTTP y TLS** | Código de respuesta, cabeceras, redirecciones y caducidad del certificado |
| **Calculadora IP** | Máscaras, red, broadcast, rango útil y división en subredes |

## Informes para el cliente

El escáner de red, el ping, el traceroute, los puertos, la velocidad, el DNS y la
comprobación web generan un informe con un toque: pide el nombre del cliente y produce

- un **PDF** con cabecera, fecha, tablas y numeración de páginas, o
- un **texto plano** para pegar en un parte o en un chat,

y lo envía por Telegram, correo, WhatsApp, Drive o lo que haya instalado en el teléfono.
También se puede guardar donde se quiera.

## Gestor de ficheros

| Protocolo | Para qué |
|---|---|
| **SFTP** | Servidores Linux, NAS, routers con SSH |
| **FTP / FTPS** | Servidores clásicos; el FTPS acepta certificados autofirmados |
| **SMB2 / SMB3** | Carpetas compartidas de Windows y de NAS |

> **AFP no está**: Apple lo dejó obsoleto y macOS y los NAS actuales comparten por SMB.

Las descargas y subidas usan el selector de documentos de Android, así que la aplicación
**no pide ningún permiso de almacenamiento** y puedes guardar en Descargas, en la tarjeta
o en Drive indistintamente.

## Aspecto

Tema **claro y oscuro**, elegible desde el botón de brillo de la pantalla de inicio
(«Como el sistema», «Claro» u «Oscuro»). La paleta está tomada del propio logotipo.

## Permisos y privacidad

| Permiso | Para qué |
|---|---|
| Internet y estado de la red | Todas las herramientas |
| Información de Wi-Fi | SSID, canal, señal y banda |
| Ubicación | Android la exige para poder mostrar el nombre de la red Wi-Fi conectada. **No se usa para nada más ni se guarda** |

Los servidores, contraseñas y equipos guardados **se quedan en el teléfono**, en el
almacenamiento privado de la aplicación, y están excluidos de la copia de seguridad en la
nube. No hay servidor propio ni telemetría: las únicas salidas a internet son el test de
velocidad y la consulta de IP pública (Cloudflare), las consultas DNS al servidor que
elijas y el WHOIS.

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
