# Plantillazo IA y Blockchain

Aquí tienes las propuestas de preguntas y sus resoluciones adaptadas a los escenarios de los exámenes de 2024 y 2022. Están redactadas para ir directas al grano, utilizando la terminología exacta de los **Temas 51 (Inteligencia Artificial)** y **66 (Blockchain y Smart Contracts)**, y pensadas para que puedas escribirlas manualmente en menos de 5 minutos (unas 80-100 palabras por respuesta).

## ESCENARIO 1: Examen 2024 (Gestión de Drones en Castilla y León)

**Pregunta de Inteligencia Artificial (Tema 51)**
* **Enunciado:** La CMTD recibe un gran volumen de documentación gráfica de los drones. Proponga una solución basada en Inteligencia Artificial para automatizar el análisis de estas imágenes y detectar posibles plagas agrícolas o conatos de incendio, indicando qué tecnología específica aplicaría.
* **Resolución (Plantillazo 5 min):** 
Se propone implementar un modelo de **Deep Learning** (Aprendizaje Profundo), concretamente una Red Neuronal Convolucional (CNN) especializada en **Visión Artificial**. El sistema se entrenará previamente con un histórico de imágenes etiquetadas de cultivos sanos, enfermos y zonas forestales. Al recibir la nueva documentación gráfica del dron, el modelo realizará una inferencia automática para identificar patrones de plagas o humo, alertando proactivamente a los inspectores. Esto transforma el procesamiento manual del dato en un sistema de alerta temprana eficiente.

**Pregunta de Blockchain (Tema 66)**
* **Enunciado:** Para garantizar la absoluta inmutabilidad y auditoría de los planes de vuelo y los informes GML entregados por los operadores, se plantea usar tecnología Blockchain. Describa cómo se integraría y qué papel jugarían los "Smart Contracts" en este proceso.
* **Resolución (Plantillazo 5 min):** 
Se registrará un *hash* criptográfico de cada plan de vuelo y de su correspondiente informe GML en una red **Blockchain permisionada** (ej. Hyperledger). Esto garantiza la trazabilidad e inmutabilidad, impidiendo que un operador altere las coordenadas a posteriori. Además, se desplegará un **Smart Contract** (contrato autoejecutable) programado para cruzar automáticamente las coordenadas autorizadas con las ejecutadas. Si el dron se desvía del área permitida, el Smart Contract registrará automáticamente una infracción inmutable en la cadena de bloques.

---

## ESCENARIO 2: Examen 2022 (Gestión de Fondos Next Generation EU)

**Pregunta de Inteligencia Artificial (Tema 51)**
* **Enunciado:** Dado el elevado número de proyectos y beneficiarios, proponga la aplicación de técnicas de Inteligencia Artificial para prevenir el fraude o la duplicidad en la concesión de estos fondos europeos, identificando el enfoque técnico adecuado.
* **Resolución (Plantillazo 5 min):**
Se aplicarán técnicas de **Machine Learning** (Aprendizaje Automático), utilizando algoritmos de detección de anomalías o clasificación supervisada. El modelo se entrenará con el histórico de subvenciones, perfiles de empresas e importes adjudicados para identificar patrones de riesgo (ej. empresas pantalla o presupuestos anómalos). Al registrar un nuevo proyecto o beneficiario, la IA evaluará los datos en tiempo real y asignará un *scoring* de riesgo predictivo, levantando una alerta a la oficina de seguimiento antes de autorizar el pago.

**Pregunta de Blockchain (Tema 66)**
* **Enunciado:** Europa exige una trazabilidad estricta y transparente de los préstamos y transferencias entregadas a los beneficiarios de los proyectos. Explique cómo aplicaría la tecnología Blockchain y los Smart Contracts para automatizar y asegurar el flujo de estos fondos.
* **Resolución (Plantillazo 5 min):**
Se creará un registro distribuido en **Blockchain** donde cada concesión de fondos quedará grabada como un bloque inmutable, asegurando la trazabilidad transparente desde el instrumento europeo hasta el beneficiario final. Para la gestión de pagos, se programarán **Smart Contracts**. Estos contratos inteligentes custodiarán los fondos y se ejecutarán automáticamente para liberar el dinero (transferencia o préstamo) única y exclusivamente cuando el sistema certifique que el beneficiario ha cumplido con la fecha de finalización o los hitos del proyecto prefijados.

***

## **Consejo extra para memorizar:** 
* Para **IA**, tu comodín siempre será: *Deep Learning/Visión Artificial* si hay que analizar imágenes o documentos, y *Machine Learning/Scoring predictivo* si hay que detectar fraudes o analizar bases de datos.
* Para **Blockchain**, tu comodín será: *Hash/Inmutabilidad* para proteger registros o logs, y *Smart Contracts* para automatizar sanciones o pagos sin intervención humana. 

