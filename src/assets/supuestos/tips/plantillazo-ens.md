# Plantillazo ENS y PCB

## PLANTILLA 1: Plan de Continuidad de Negocio (PCN) y Cálculo de RTO/RPO
Esta plantilla es ideal para responder a preguntas como la 2.3 y 2.4 del examen de 2022. 

### **1. Fases del Plan de Continuidad de Negocio (PCN):**
Si te piden enumerar y explicar las fases, utiliza esta estructura estándar:
*   **Fase 1 - Análisis de Impacto en el Negocio (BIA):** Identificación de los procesos críticos del sistema y evaluación del impacto (financiero, legal, de reputación) que supondría su interrupción a lo largo del tiempo.
*   **Fase 2 - Evaluación de Riesgos (Risk Assessment):** Identificación de las amenazas que podrían provocar la interrupción de los servicios críticos y la probabilidad de que ocurran.
*   **Fase 3 - Estrategia de Continuidad:** Definición de los tiempos y puntos de recuperación objetivo (**RTO** y **RPO**) y selección de las estrategias técnicas (ej. copias de seguridad, centros de respaldo) para cumplirlos.
*   **Fase 4 - Desarrollo e Implantación del Plan:** Redacción de los procedimientos operativos de respuesta ante incidentes, planes de contingencia y recuperación.
*   **Fase 5 - Pruebas, Concienciación y Mantenimiento:** Realización de simulacros periódicos, formación del personal involucrado y actualización del plan ante cambios tecnológicos u organizativos.

### **2. Justificación y Cálculo de RTO y RPO:**
Cuando te den datos de impacto económico (como en el examen de 2022, donde indicaban 32 transacciones/minuto a 7€ cada una y pérdidas máximas admisibles), redacta así tu respuesta:
*   **RTO (Recovery Time Objective):** *"El RTO es el tiempo máximo que el sistema puede estar indisponible antes de que el impacto sea inaceptable para la organización. Para calcularlo, evalúo la pérdida de tasas máxima por falta de disponibilidad del sistema frente a los ingresos generados por minuto/hora."* (Aquí harías la división matemática con los datos del enunciado).
*   **RPO (Recovery Point Objective):** *"El RPO es la cantidad máxima tolerable de pérdida de datos, medida en tiempo (ej. los datos de las últimas X horas). Se calcula basándose en la pérdida máxima admisible por falta de disponibilidad de datos dividida entre el coste o volumen de transacciones por unidad de tiempo."* 

---

## PLANTILLA 2: Esquema Nacional de Seguridad (ENS) y Análisis de Riesgos
Esta plantilla te servirá para estructurar la respuesta a preguntas como la 5a y 5b del examen de 2024.

### **1. Determinación de la Categoría de Seguridad del Sistema:**
Para justificar la categoría, debes enumerar siempre las cinco dimensiones del ENS y evaluarlas según el enunciado:
*   *"Para determinar la categoría del sistema según el ENS, debemos evaluar el impacto (Bajo, Medio o Alto) que tendría un incidente de seguridad sobre las siguientes 5 dimensiones en base a la información gestionada:"*
    1.  **Disponibilidad:** (Ej. ¿Se requiere el sistema 24/7? Si es crítico, el impacto es Alto).
    2.  **Autenticidad:** (Ej. Garantizar que los usuarios/operadores son quienes dicen ser).
    3.  **Integridad:** (Ej. Proteger los datos contra modificaciones no autorizadas).
    4.  **Confidencialidad:** (Ej. Si se manejan datos personales o sensibles, el impacto será Medio o Alto).
    5.  **Trazabilidad:** (Ej. Rastrear quién hace qué en el sistema).
*   **Conclusión de la regla de oro:** *"Siguiendo la normativa del ENS, la categoría de seguridad final del sistema será igual a la máxima categoría obtenida en cualquiera de las cinco dimensiones valoradas previamente (por ejemplo, si la Confidencialidad es Alta, la categoría global del sistema será ALTA)."*

### **2. Análisis de un Riesgo y Medida de Contingencia (Basado en MAGERIT):**
Si te piden elaborar el análisis de un riesgo, estructura la respuesta en 4 pasos claros:
*   **Activo:** (Identifica qué se va a dañar. Ej: Base de datos de inspecciones de drones o el Centro de Procesamiento de Datos).
*   **Amenaza:** (Qué puede pasar. Ej: Ataque de Ransomware, caída del suministro eléctrico, o inyección SQL).
*   **Impacto / Riesgo:** (Consecuencia para la organización. Ej: Pérdida temporal de la disponibilidad del servicio y posible compromiso de la confidencialidad, lo que paralizaría las inspecciones).
*   **Medida de Contingencia / Salvaguarda:** (Cómo se soluciona. Ej: Restauración desde las copias de seguridad inmutables (Tier 3), activación de un centro de respaldo secundario (CPD de contingencia), o implementación de un Firewall de Aplicaciones Web - WAF).
