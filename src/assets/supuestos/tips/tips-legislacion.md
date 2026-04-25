# Tips para aplicar legislación

Vincular tus respuestas técnicas con la legislación vigente es una estrategia excelente. El Tribunal valora muchísimo a los opositores que no solo saben "tirar código" o "configurar redes", sino que entienden que **toda infraestructura TIC del sector público está supeditada al marco legal español**.

Basándonos en tu temario oficial, aquí tienes cómo puedes "inyectar" referencias legislativas específicas en las preguntas de los tres exámenes que estamos manejando:

## 1. Examen JCyL 2024 (Gestión de Drones)

* **Preguntas 1, 2 y 3 (Diseño del Sistema y Diagramas):**
  * *Legislación:* **Ley 39/2015** (Procedimiento Administrativo Común) y **Real Decreto 4/2010 (Esquema Nacional de Interoperabilidad - ENI)**.
  * *Cómo enlazarlo:* Al diseñar las interacciones con AESA, justifica que tu arquitectura se basa en la **Ley 39/2015** para la integración con registros electrónicos y utiliza el **ENI** (Norma Técnica de Interoperabilidad de Protocolos de intermediación de datos) para no pedirle al ciudadano datos que ya obran en poder de la Administración (el registro de AESA).
* **Pregunta 4 (Movilidad de Inspectores):**
  * *Legislación:* **Real Decreto 311/2022 (Esquema Nacional de Seguridad - ENS)** .
  * *Cómo enlazarlo:* Al dibujar la red, añade que las conexiones de los dispositivos móviles de los inspectores utilizarán redes privadas virtuales (VPN) en estricto cumplimiento con las medidas de protección de las comunicaciones y dispositivos portátiles exigidas por el **ENS**.
* **Pregunta 5 (Riesgos y Categoría de Seguridad):**
  * *Legislación:* **RD 311/2022 (ENS)** y **Ley Orgánica 3/2018 (LOPDGDD)** .
  * *Cómo enlazarlo:* Además de justificar las 5 dimensiones del ENS para dar la categoría al sistema, menciona que al tratar datos de personas físicas (NIF, domicilio) el análisis de riesgos debe alinearse también con las exigencias del **RGPD** y la **LOPDGDD** para garantizar la privacidad desde el diseño.
* **Pregunta 8 (Solución criptográfica para envíos gráficos):**
  * *Legislación:* **Ley 6/2020** (Servicios electrónicos de confianza) y Reglamento europeo **eIDAS** .
  * *Cómo enlazarlo:* Para garantizar el no repudio y la autoría del emisor de las imágenes, indica que la solución aplicará firma electrónica avanzada o cualificada amparada en la **Ley 6/2020**, asegurando la plena validez jurídica del envío.
* **Pregunta 9 (Sistema de almacenamiento y retención 5 años):**
  * *Legislación:* **LOPDGDD** y la Norma Técnica del **ENI** de Política de Gestión de Documentos Electrónicos.
  * *Cómo enlazarlo:* Al diseñar el "Tier 3" (Archivo), menciona que la purga a los 5 años cumple con el "Principio de limitación del plazo de conservación" del **RGPD/LOPDGDD** y con las directrices de archivo electrónico del **ENI**.

## 2. Examen JCyL 2022 (Fondos Next Generation EU)

* **Pregunta 1.5 (Seguridad en Java/JDBC frente a SQL Injection):**
  * *Legislación:* **RD 311/2022 (ENS)** .
  * *Cómo enlazarlo:* Justifica que el uso de consultas parametrizadas (`PreparedStatement` en Java) da cumplimiento a las medidas de "Protección de las aplicaciones" y "Desarrollo Seguro" contempladas en el anexo II del **ENS**.
* **Pregunta 2.2 (Acceso remoto para teletrabajadores):**
  * *Legislación:* **RD 311/2022 (ENS)** .
  * *Cómo enlazarlo:* Indica que el diseño de la VPN y el uso de un doble factor de autenticación (2FA) se implementa para cumplir con los requisitos específicos del **ENS** para entornos de teletrabajo y puestos de trabajo fuera de las instalaciones.
* **Pregunta 2.3, 2.4 y 2.5 (Continuidad de Negocio, RTO/RPO y Backups):**
  * *Legislación:* **RD 311/2022 (ENS)** y **LOPDGDD** .
  * *Cómo enlazarlo:* Inicia tu respuesta indicando que "El cálculo del RTO y RPO, así como la estrategia de copias de seguridad (Backup 3-2-1), dan cumplimiento preceptivo a la dimensión de *Disponibilidad* exigida tanto por el **ENS** en sus medidas de Continuidad del Servicio, como por el artículo 32 del RGPD/LOPDGDD respecto a la resiliencia de los sistemas".

## 3. Examen Ayuntamiento Salamanca 2023 (Portal del Proveedor e IA)

* **Ejercicio 2a (Casos de Uso de la Sede Electrónica):**
  * *Legislación:* **Ley 39/2015** (Procedimientos Administrativos), **Ley 25/2013** (Factura Electrónica).
  * *Cómo enlazarlo:* En el módulo de Identificación, menciona que el acceso cumple con los sistemas reconocidos en la **Ley 39/2015** (integración con Cl@ve). Para el módulo de facturación, indica que el sistema se debe adaptar al formato *Facturae* establecido en la **Ley 25/2013** de impulso de la factura electrónica.
* **Ejercicio 2c y 2d (Arquitectura, Vulnerabilidades y ENS):**
  * *Legislación:* **RD 311/2022 (ENS)** .
  * *Cómo enlazarlo:* Piden explícitamente aplicar el ENS. Menciónalo no solo en la teoría, sino en la práctica: "La medida de mitigación del Firewall de Aplicación Web (WAF) y las auditorías OWASP se proponen en cumplimiento de las medidas de protección perimetral e inspección del código del **ENS**".
* **Ejercicio 2e (Tecnologías Emergentes - IA):**
  * *Legislación:* **Ley 40/2015** (Régimen Jurídico del Sector Público).
  * *Cómo enlazarlo:* Al proponer IA para automatizar validaciones de proveedores, matiza que el sistema deberá registrarse como una "Actuación Administrativa Automatizada" tal y como requiere el artículo 41 de la **Ley 40/2015**, garantizando que el algoritmo sea auditable.

## **💡 El truco para el examen manual:**

No hace falta que expliques la ley entera. Basta con que comiences tus párrafos de resolución técnica con fórmulas de este estilo:
> *"A nivel técnico, implementaremos un clúster activo-pasivo, lo cual permite dar cumplimiento a las exigencias de disponibilidad estipuladas en el Esquema Nacional de Seguridad (RD 311/2022)..."*
Esto te llevará unos pocos segundos escribirlo a mano y causará un impacto muy positivo en el Tribunal, posicionándote no solo como informático, sino como Funcionario Público.
