# Plantillazo RTO/RPO

Vamos a resolver paso a paso la pregunta 2.4 del examen de 2022 aplicando la teoría a los datos exactos que proporcionó el Tribunal.

Primero, extraemos los datos clave del enunciado para nuestro cálculo:
*   **Horario de trabajo:** Lunes a viernes de 9:00h a 15:00h (6 horas de actividad al día).
*   **Volumen de trabajo:** 32 transacciones por minuto.
*   **Valor económico:** 7,00 € por cada transacción.
*   **Pérdida máxima admisible (Sistema caído):** 13.500 €.
*   **Pérdida máxima admisible (Datos perdidos):** 80.000 €.

## Paso 1: Cálculo del impacto económico por tiempo
Antes de calcular los objetivos, necesitamos saber cuánto dinero genera (o deja de generar) el sistema por cada unidad de tiempo:
*   **Coste por minuto:** 32 transacciones/minuto × 7 €/transacción = **224 € de pérdida cada minuto** que el sistema no funciona.
*   **Coste por hora:** 224 €/minuto × 60 minutos = **13.440 € de pérdida por hora**.

## Paso 2: Determinación del RTO (Recovery Time Objective)
El RTO nos indica el tiempo máximo que podemos tardar en levantar el sistema tras un desastre. Se calcula dividiendo la pérdida máxima admisible por falta de **disponibilidad del sistema** entre el coste por unidad de tiempo:
*   **Cálculo:** 13.500 € (pérdida máxima de sistema) / 224 € por minuto.
*   **Resultado RTO:** 60,26 minutos (prácticamente **1 hora**).
*   **Explicación:** El plan de continuidad debe garantizar que el sistema vuelva a estar operativo en un máximo de 1 hora. Si tardamos más, las pérdidas económicas superarán el umbral máximo de 13.500 € establecido por la organización.

## Paso 3: Determinación del RPO (Recovery Point Objective)
El RPO nos indica la cantidad máxima de datos que podemos permitirnos perder (medido en tiempo) en caso de desastre. Se calcula utilizando la pérdida máxima admisible por falta de **disponibilidad de los datos**:
*   **Cálculo:** 80.000 € (pérdida máxima de datos) / 13.440 € por hora.
*   **Resultado RPO:** 5,95 horas (prácticamente **6 horas**).
*   **Explicación:** La organización puede tolerar perder un máximo de 6 horas de transacciones introducidas en el sistema. Teniendo en cuenta que la jornada laboral es exactamente de 6 horas (de 9:00h a 15:00h), esto significa que en el peor de los casos se puede perder un día completo de trabajo, pero nunca más de eso.

## Paso 4: Explicación de las acciones a tomar
Para responder a la segunda parte de la pregunta ("explique las acciones a tomar"), debes enlazar estos resultados con tu estrategia técnica:
1.  **Para cumplir el RTO (1 hora):** Dado que el tiempo de recuperación exigido es muy estricto, no bastará con restaurar desde cintas. La acción a tomar será disponer de un sistema en **Alta Disponibilidad** (clúster activo-activo o activo-pasivo) o un centro de respaldo (CPD secundario o infraestructura en la nube) que permita conmutar el servicio en menos de una hora.
2.  **Para cumplir el RPO (6 horas):** Las políticas de copias de seguridad tradicionales nocturnas son suficientes si solo trabajamos por la mañana, pero la acción recomendada para curarse en salud sería realizar un *backup* incremental o un *snapshot* al menos una vez a mitad de la jornada (ej. a las 12:00h) y otro al finalizar (15:00h), garantizando así que nunca se perderán más de 3 horas de datos, cumpliendo holgadamente el RPO exigido de 6 horas.

---

# Plantillazo RTO / RPO

Vamos a resolver paso a paso la pregunta 2.4 del examen de 2022 aplicando la teoría a los datos exactos que proporcionó el Tribunal.

Primero, extraemos los datos clave del enunciado para nuestro cálculo:
*   **Horario de trabajo:** Lunes a viernes de 9:00h a 15:00h (6 horas de actividad al día).
*   **Volumen de trabajo:** 32 transacciones por minuto.
*   **Valor económico:** 7,00 € por cada transacción.
*   **Pérdida máxima admisible (Sistema caído):** 13.500 €.
*   **Pérdida máxima admisible (Datos perdidos):** 80.000 €.

## Paso 1: Cálculo del impacto económico por tiempo
Antes de calcular los objetivos, necesitamos saber cuánto dinero genera (o deja de generar) el sistema por cada unidad de tiempo:
*   **Coste por minuto:** 32 transacciones/minuto × 7 €/transacción = **224 € de pérdida cada minuto** que el sistema no funciona.
*   **Coste por hora:** 224 €/minuto × 60 minutos = **13.440 € de pérdida por hora**.

## Paso 2: Determinación del RTO (Recovery Time Objective)
El RTO nos indica el tiempo máximo que podemos tardar en levantar el sistema tras un desastre. Se calcula dividiendo la pérdida máxima admisible por falta de **disponibilidad del sistema** entre el coste por unidad de tiempo:
*   **Cálculo:** 13.500 € (pérdida máxima de sistema) / 224 € por minuto.
*   **Resultado RTO:** 60,26 minutos (prácticamente **1 hora**).
*   **Explicación:** El plan de continuidad debe garantizar que el sistema vuelva a estar operativo en un máximo de 1 hora. Si tardamos más, las pérdidas económicas superarán el umbral máximo de 13.500 € establecido por la organización.

## Paso 3: Determinación del RPO (Recovery Point Objective)
El RPO nos indica la cantidad máxima de datos que podemos permitirnos perder (medido en tiempo) en caso de desastre. Se calcula utilizando la pérdida máxima admisible por falta de **disponibilidad de los datos**:
*   **Cálculo:** 80.000 € (pérdida máxima de datos) / 13.440 € por hora.
*   **Resultado RPO:** 5,95 horas (prácticamente **6 horas**).
*   **Explicación:** La organización puede tolerar perder un máximo de 6 horas de transacciones introducidas en el sistema. Teniendo en cuenta que la jornada laboral es exactamente de 6 horas (de 9:00h a 15:00h), esto significa que en el peor de los casos se puede perder un día completo de trabajo, pero nunca más de eso.

## Paso 4: Explicación de las acciones a tomar
Para responder a la segunda parte de la pregunta ("explique las acciones a tomar"), debes enlazar estos resultados con tu estrategia técnica:
1.  **Para cumplir el RTO (1 hora):** Dado que el tiempo de recuperación exigido es muy estricto, no bastará con restaurar desde cintas. La acción a tomar será disponer de un sistema en **Alta Disponibilidad** (clúster activo-activo o activo-pasivo) o un centro de respaldo (CPD secundario o infraestructura en la nube) que permita conmutar el servicio en menos de una hora.
2.  **Para cumplir el RPO (6 horas):** Las políticas de copias de seguridad tradicionales nocturnas son suficientes si solo trabajamos por la mañana, pero la acción recomendada para curarse en salud sería realizar un *backup* incremental o un *snapshot* al menos una vez a mitad de la jornada (ej. a las 12:00h) y otro al finalizar (15:00h), garantizando así que nunca se perderán más de 3 horas de datos, cumpliendo holgadamente el RPO exigido de 6 horas.

---

# Plantillazo Storage Tiering

Vamos a aplicar la teoría de **Arquitecturas de almacenamiento** (correspondiente al Tema 21 del Bloque II) para resolver paso a paso la Pregunta 9 del examen de 2024.

Este tipo de problemas evalúa tu conocimiento sobre **ILM (Gestión del Ciclo de Vida de la Información)** y el diseño de **Storage Tiering (Almacenamiento por niveles)**. 

## Paso 1: Extracción de datos y cálculo de capacidades
Lo primero que el Tribunal quiere ver es que sabes calcular los volúmenes de datos en función del tiempo. El enunciado nos da un ritmo de crecimiento de **1 TB al mes**.

*   **Total de almacenamiento necesario (5 años):** 5 años × 12 meses = 60 meses. A razón de 1 TB/mes, el sistema albergará un total de **60 TB** de información al finalizar su ciclo de vida.
*   **Volumen de acceso frecuente:** Se corresponde con la información del último mes. Es decir, **1 TB**.
*   **Volumen de acceso esporádico:** Abarca "los últimos 6 meses". Si descontamos el primer mes (que es de acceso frecuente), nos quedan 5 meses de datos con acceso esporádico. Esto supone **5 TB**.
*   **Volumen de archivo (sin apenas accesos):** Abarca desde el mes 7 hasta completar los 5 años (60 meses). Son 54 meses en total, lo que supone **54 TB** de datos que requieren retención a largo plazo.

*(Nota para el examen: Es muy recomendable que indiques que a estos volúmenes netos habrá que aplicarles un margen de seguridad del 20-30% para evitar el llenado al 100% y contemplar la tolerancia a fallos mediante RAID).*

## Paso 2: Diseño del Sistema (Plantilla de Storage Tiering)
Una vez calculados los volúmenes, procedemos a asignar cada bloque a su tecnología de almacenamiento ideal para optimizar el coste y el rendimiento:

**1. Nivel 1 (Tier 1 - Almacenamiento Caliente):**
*   **Propósito:** Albergar el **1 TB** del último mes que requiere acceso frecuente.
*   **Solución técnica:** Implementar una cabina de almacenamiento de alto rendimiento en red (SAN) equipada con discos de estado sólido **SSD o NVMe**. 
*   **Justificación:** Garantiza la máxima velocidad de lectura/escritura (altos IOPS) para que los trabajadores de la CMTD no sufran latencia al trabajar con las imágenes recién subidas.

**2. Nivel 2 (Tier 2 - Almacenamiento Templado):**
*   **Propósito:** Albergar los **5 TB** de los meses 2 a 6 que tienen accesos esporádicos.
*   **Solución técnica:** Utilizar discos mecánicos de alta capacidad y coste intermedio (**HDD SAS o SATA Enterprise**) gestionados mediante un sistema NAS o integrados en la misma cabina SAN en un *pool* secundario con configuración RAID 5 o RAID 6.
*   **Justificación:** Al no requerir accesos constantes, se prima abaratar el coste por Gigabyte sin llegar a perder la disponibilidad inmediata de los archivos.

**3. Nivel 3 (Tier 3 - Almacenamiento Frío o Archivo):**
*   **Propósito:** Albergar los **54 TB** históricos para cumplir con la obligación legal de conservación máxima de 5 años.
*   **Solución técnica:** Implementar una **librería de cintas magnéticas (ej. LTO-8 o LTO-9)** automatizada, o bien derivar los datos a un **Almacenamiento de Objetos en la Nube** (S3 en modalidad *Glacier* / *Cold Archive*).
*   **Justificación:** Es la solución más económica para almacenar grandes volúmenes de datos que raramente se van a consultar. Consumen mucha menos energía, lo que es vital para la eficiencia del CPD.

## Paso 3: El "toque de experto" (Para asegurar el 10 en la pregunta)
Para cerrar la pregunta de forma brillante, debes mencionar cómo se moverán los datos de un nivel a otro. 

Añade este párrafo como conclusión: 
*"Para orquestar este sistema, propondría implementar un software de **Automated Storage Tiering (AST)**. Este sistema se encargará de mover de forma automática y transparente los ficheros desde el Tier 1 hacia el Tier 2, y posteriormente al Tier 3, a medida que los metadatos indiquen que la fecha de creación del archivo va superando el mes y los seis meses de antigüedad. Además, al tratarse de documentación gráfica (imágenes), el uso de técnicas de **deduplicación** no sería tan eficiente como el de algoritmos de **compresión** para ahorrar espacio en los niveles 2 y 3."*

