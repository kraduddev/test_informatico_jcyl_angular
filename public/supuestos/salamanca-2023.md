## EJERCICIO 1: INFRAESTRUCTURA Y REDES

### [cite_start]a) Cableado Estructurado (Norma EN 50173) [cite: 96]
* **Topología:** Jerárquica en estrella. [cite_start]Dado que se busca reducir repartidores, instalaremos un **Repartidor de Edificio (BD)** en la planta baja que actúe también como **Repartidor de Planta (FD)** de dicha planta, y un FD en cada una de las otras 3 plantas[cite: 95].
* **Cálculo de tomas:** Superficie por planta: $25m \times 40m = 1000 m^2$. A 2 puntos/$10 m^2$, resultan **200 tomas por planta** (800 total).
* **Subsistemas:**
    * **Horizontal:** Cable de par trenzado Categoría 6A o superior para soportar 10Gbps.
    * [cite_start]**Vertical (Backbone):** Fibra óptica multimultimodo (OM4) entre el BD y los FD para garantizar ancho de banda y evitar interferencias[cite: 95].
* [cite_start]**Interconexión:** Enlace de fibra monomodo (OS2) desde el BD hacia el anillo de fibra municipal o Red SARA[cite: 48].

### b) Elementos Activos
* **Necesidades:** 40 equipos + 25% crecimiento = **50 puertos por planta**.
* **Propuesta:**
    * **Planta 0 (Core):** 1 Switch de Core modular de Nivel 3 para gestionar el routing inter-VLAN.
    * **Plantas 1-3 (Acceso):** 2 Switches de 48 puertos en "stack" (apilados) por planta para minimizar costes y simplificar gestión.
    * [cite_start]**Características:** Puertos Gigabit Ethernet con soporte **PoE+ (802.3at)** para alimentar los teléfonos IP sin fuentes externas[cite: 95].

### [cite_start]c) Direccionamiento IP [cite: 93]
Rango: **192.168.4.0/22** (Máscara: 255.255.252.0). Dividimos en 4 subredes /24 (una por planta/departamento):

| Subred (Planta) | Rango de IPs (Hosts) | Máscara | Puerta de Enlace |
| :--- | :--- | :--- | :--- |
| Planta 0 | 192.168.4.1 - 192.168.4.254 | /24 | 192.168.4.1 |
| Planta 1 | 192.168.5.1 - 192.168.5.254 | /24 | 192.168.5.1 |
| Planta 2 | 192.168.6.1 - 192.168.6.254 | /24 | 192.168.6.1 |
| Planta 3 | 192.168.7.1 - 192.168.7.254 | /24 | 192.168.7.1 |

### [cite_start]d) VLANs [cite: 107]
[cite_start]Se implementarán VLANs etiquetadas bajo el estándar **802.1Q**[cite: 118].
* **VLAN de Datos:** Una por planta para segmentar el tráfico de difusión y mejorar el rendimiento.
* **VLAN de Voz:** Priorizada mediante QoS para asegurar la calidad de las llamadas de telefonía IP.
* **Justificación:** Seguridad (aislamiento entre departamentos) y optimización del tráfico.

### e) Análisis de Tráfico (Figura 1)
* [cite_start]**Descripción:** Se observa un proceso de **resolución DNS iterativa/recursiva**[cite: 76, 89].
    * [cite_start]**Trama 4:** El host `20.1.0.30` pregunta a su servidor local `20.1.0.10` por la IP de `www.cisco.com`[cite: 74, 75, 77].
    * [cite_start]**Tramas 5-10:** El servidor local consulta a servidores raíz, de TLD (.com) y autoritativos de Cisco hasta obtener la respuesta[cite: 80, 84, 92, 100].
    * [cite_start]**Trama 11:** El servidor local responde al host con las IPs finales (30.1.0.10)[cite: 111].
* [cite_start]**Encapsulación:** Los datos DNS (Aplicación) se encapsulan en un segmento UDP (puerto 53), este en un paquete IP (Red) y finalmente en una trama Ethernet con etiqueta 802.1Q (Enlace)[cite: 112, 118, 128, 135].

---

## EJERCICIO 2: PORTAL WEB DEL PROVEEDOR

### [cite_start]a) Casos de Uso [cite: 114]
1.  **CU-01 Consultar Facturas:** El proveedor visualiza el estado (pagada/pendiente) de sus facturas tras autenticarse.
2.  **CU-02 Descargar Certificado Contable:** Generación de documentos en PDF con sello electrónico.
3.  [cite_start]**Interacciones Externas:** Conexión con **Cl@ve** para identificación [cite: 31] [cite_start]y con el **Punto General de Entrada de Facturas Electrónicas (FACe)** para la recepción de facturas[cite: 61].

### [cite_start]b) Modelo de Dominio [cite: 117]
* **Proveedor:** CIF (id), Razón Social, Email.
* **Contrato:** Número_Expediente, Objeto, Importe, Fecha_Firma.
* **Factura:** Numero_Factura, Fecha_Emisión, Importe_Total, Estado.
* **Documento:** Tipo, Hash, Fecha_Generación.
* *Relación:* Un Proveedor puede tener N Contratos, y cada Contrato tiene N Facturas asociadas.

### [cite_start]c) Arquitectura [cite: 122]
* [cite_start]**Lógica:** Multicapa (Presentación en Angular/React, Aplicación en Microservicios Java/Python, Datos en PostgreSQL/Oracle)[cite: 122, 127, 130, 151].
* **Física:** Híbrida. [cite_start]La Sede (Cloud) actúa como front-end seguro, comunicándose mediante una **VPN/Red SARA** con el Data Center propio (Back-end contable)[cite: 48, 108].
* [cite_start]**ENS:** Clasificación de sistema **Categoría Media** debido a la importancia de la integridad y disponibilidad de datos contables[cite: 152].

### [cite_start]d) Seguridad [cite: 153, 158]
1.  [cite_start]**Uso de HTTPS (TLS 1.3):** Cifrado de las comunicaciones extremo a extremo[cite: 107].
2.  [cite_start]**Autenticación Multifactor (MFA):** Certificados electrónicos o Cl@ve[cite: 31, 105].
3.  [cite_start]**Validación y Saneamiento de Entradas:** Para evitar ataques de Inyección SQL y XSS[cite: 131].
4.  **Auditoría de Accesos:** Registro (logs) inalterable de cada acceso y descarga de documentos.
5.  [cite_start]**Cortafuegos de Aplicación Web (WAF):** Para proteger la sede electrónica frente a ataques comunes[cite: 107].

### [cite_start]e) Tecnologías Emergentes [cite: 136]
1.  [cite_start]**Inteligencia Artificial (NLP/OCR):** Extracción automática de datos de facturas escaneadas para reducir errores de registro[cite: 137].
2.  [cite_start]**Chatbot de Asistencia:** Basado en un **LLM** para resolver dudas de los proveedores sobre la tramitación de expedientes 24/7[cite: 137].