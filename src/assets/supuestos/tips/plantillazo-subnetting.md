# PLANTILLA MAESTRA PARA SUBNETTING

Cuando veas un problema de cálculo de subredes en el examen, redacta tu respuesta siguiendo exactamente estos 4 pasos (puedes escribirlos tal cual en la hoja del examen):

## **Paso 1: Cálculo del número de direcciones IP necesarias**

* *"Para dimensionar la subred, primero calculamos la necesidad real de direcciones IP: a los equipos iniciales se les suma el margen de crecimiento previsto. Al resultado siempre debemos sumarle **2 direcciones reservadas obligatorias** (Dirección de Red y Dirección de Broadcast), más la dirección de la **Puerta de Enlace (Gateway)** si no está incluida en los equipos."*

## **Paso 2: Determinación de los bits de host**

* *"Buscamos la potencia de 2 más pequeña que sea mayor o igual al número total de IPs calculadas en el Paso 1. Es decir, buscamos $2^n \ge Total\_IPs$, donde 'n' serán los bits destinados a hosts en la dirección IP."*

## **Paso 3: Cálculo de la máscara de subred**

* *"Como una dirección IPv4 tiene 32 bits, restamos los bits de host ('n') para obtener los bits de red. El resultado nos da la máscara en notación CIDR (/X). Para pasarla a formato decimal, restamos a 256 la cantidad de IPs calculadas en la potencia de 2."*

## **Paso 4: Desglose del direccionamiento**

* Detalla los siguientes 4 puntos siempre en este orden:
  * **Dirección de Red:** (La base desde la que partes).
  * **Puerta de Enlace (Gateway):** (Suele ser la Dirección de Red + 1).
  * **Rango de IPs de hosts (útiles):** (Desde el Gateway hasta el Broadcast - 1).
  * **Dirección de Broadcast:** (La última IP del bloque).

---

# APLICACIÓN PRÁCTICA (Basado en el examen de Salamanca 2023)

Vamos a aplicar la plantilla con los datos del examen de Salamanca: te piden asignar una subred por departamento a partir del rango privado `192.168.4.0/22`, sabiendo que cada departamento tiene **40 equipos** y una previsión de **crecimiento del 25%**.

Esta sería tu respuesta textual para sacar la máxima puntuación en menos de 5 minutos:

## **Paso 1: Cálculo del número de direcciones IP necesarias**

* *"Para dimensionar la subred, primero calculamos la necesidad real de direcciones IP: a los equipos iniciales se les suma el margen de crecimiento previsto. Al resultado siempre debemos sumarle **2 direcciones reservadas obligatorias** (Dirección de Red y Dirección de Broadcast), más la dirección de la **Puerta de Enlace (Gateway)** si no está incluida en los equipos."*

## **Paso 2: Determinación de los bits de host**

* *"Buscamos la potencia de 2 más pequeña que sea mayor o igual al número total de IPs calculadas en el Paso 1. Es decir, buscamos $2^n \ge Total\_IPs$, donde 'n' serán los bits destinados a hosts en la dirección IP."*

## **Paso 3: Cálculo de la máscara de subred**

* *"Como una dirección IPv4 tiene 32 bits, restamos los bits de host ('n') para obtener los bits de red. El resultado nos da la máscara en notación CIDR (/X). Para pasarla a formato decimal, restamos a 256 la cantidad de IPs calculadas en la potencia de 2."*

## **Paso 4: Desglose del direccionamiento**

* Detalla los siguientes 4 puntos siempre en este orden:
  * **Dirección de Red:** (La base desde la que partes).
  * **Puerta de Enlace (Gateway):** (Suele ser la Dirección de Red + 1).
  * **Rango de IPs de hosts (útiles):** (Desde el Gateway hasta el Broadcast - 1).
  * **Dirección de Broadcast:** (La última IP del bloque).

---

## APLICACIÓN PRÁCTICA (Basado en el examen de Salamanca 2023)

Vamos a aplicar la plantilla con los datos del examen de Salamanca: te piden asignar una subred por departamento a partir del rango privado `192.168.4.0/22`, sabiendo que cada departamento tiene **40 equipos** y una previsión de **crecimiento del 25%**.

Esta sería tu respuesta textual para sacar la máxima puntuación en menos de 5 minutos:

1. **Cálculo de IPs necesarias:** Partimos de 40 equipos por departamento. Aplicando un crecimiento del 25% (10 equipos más), necesitamos 50 IPs útiles para hosts. A esto hay que sumar la IP de Red y la IP de Broadcast. Total necesario: **52 direcciones IP**.
2. **Determinación de bits de host:** Buscamos la potencia de 2 inmediatamente superior a 52. Dado que $2^5 = 32$ (insuficiente) y $2^6 = 64$ (suficiente), determinamos que necesitamos **6 bits para los hosts**.
3. **Máscara de Subred:** Si de 32 bits totales destinamos 6 a hosts, nos quedan 26 bits para la red (32 - 6 = 26). La máscara es **/26**. Su representación decimal se obtiene de restar al máximo (256) nuestro bloque (64), lo que nos da 192. Por tanto, la máscara es **255.255.255.192**.
4. **Desglose de la Subred para el primer departamento:** A partir de la red base 192.168.4.0 suministrada, la asignación queda así:
    * **Dirección de Red:** 192.168.4.0
    * **Puerta de Enlace (Gateway):** 192.168.4.1 (asignando convencionalmente la primera IP útil).
    * **Rango de IPs de hosts útiles:** 192.168.4.2 hasta 192.168.4.62 (permitiendo los 50 equipos requeridos).
    * **Dirección de Broadcast:** 192.168.4.63.

*(Nota: Para el siguiente departamento, el siguiente bloque simplemente empezaría en 192.168.4.64 y se sumarían otros 64 números).*

---

Con este esquema evitas liarte en el examen haciendo números en sucio y le demuestras al Tribunal que conoces la metodología de principio a fin de forma matemática y estructurada.

# Plantillazo 2: Examen JCyL 2022 (Next Generation EU)

¡Vamos a por ello! Aplicar esta plantilla mecánica te dará muchísima seguridad, ya que el enunciado del examen de 2022 de la Junta de Castilla y León requiere que demuestres tu capacidad de analizar un plano y hacer los cálculos al vuelo.

Aquí tienes la resolución de la **pregunta 2.1 del examen de 2022** utilizando el "plantillazo" de 4 pasos:

---

## APLICACIÓN PRÁCTICA: Examen JCyL 2022 (Pregunta 2.1)

**Paso 1: Cálculo del número de direcciones IP necesarias**

* *"Para dimensionar la subred, primero calculamos la necesidad real contando los puestos descritos en el plano:*
  * *Planta Baja: 2 (Atención) + 6 (Consulta) + 2 (Despachos) + 1 (Multimedia Sala Juntas) + 1 (Impresora) = 12 dispositivos.*
  * *Primera Planta: 12 (en los 6 despachos dobles) + 1 (Impresora) = 13 dispositivos.*
  * *Total de puestos de red detectados: **25 dispositivos**.*
  * *A este número le sumamos **2 direcciones reservadas obligatorias** (Dirección de Red y Dirección de Broadcast), más la dirección de la **Puerta de Enlace (Gateway)**. El total mínimo estricto que necesitamos es de **28 direcciones IP**."*

**Paso 2: Determinación de los bits de host**

* *"Buscamos la potencia de 2 más pequeña que sea mayor o igual al total de IPs necesarias (28). Dado que $2^4 = 16$ (insuficiente) y $2^5 = 32$ (suficiente), determinamos que necesitamos **5 bits para los hosts**."*

**Paso 3: Cálculo de la máscara de subred**

* *"Para obtener la máscara de red, a los 32 bits totales de la dirección IPv4 le restamos los 5 bits de host calculados, lo que nos da **27 bits de red** (notación CIDR **/27**). Para pasarla a formato decimal, restamos a 256 la cantidad del bloque (32), resultando en 224. Por tanto, la **máscara de subred mínima** requerida es **255.255.255.224**."*

**Paso 4: Desglose del direccionamiento**

* *"Sabiendo que el bloque de direcciones va de 32 en 32, y partiendo de la dirección asignada en el enunciado (10.10.100.64), el desglose de la subred es el siguiente:*
  * **Dirección de Red:** 10.10.100.64
  * **Puerta de Enlace (Gateway):** 10.10.100.65
  * **Rango de IPs útiles (para los 25 puestos):** 10.10.100.66 hasta 10.10.100.94.
  * **Última IP disponible (Broadcast):** **10.10.100.95**.
  * **Número máximo de direcciones que componen la subred:** **32 direcciones** (de las cuales 30 son asignables a hosts)."

---

# 💡 El "toque de experto" para asegurar la máxima puntuación

Si te fijas en el enunciado, hay una pequeña trampa. Dice textualmente que *"el servicio telefónico del centro está implementado sobre tecnología Voz IP"*. En la práctica real, hay dos formas de montar esto:

1. El teléfono VoIP tiene un *switch* interno y el PC se conecta a él, compartiendo red. (Con nuestro cálculo de 32 IPs estaríamos perfectos).
2. El teléfono VoIP se conecta a una toma de pared independiente o requiere una IP propia en una VLAN de voz separada.

Para que el Tribunal vea que no se te escapa una, al terminar los 4 pasos yo añadiría esta breve frase:
> *"**Nota de diseño:** El cálculo de una máscara /27 asume que los terminales de Voz IP mencionados en el enunciado comparten infraestructura de red con los PC. Si el diseño exigiera direcciones IP independientes para los 16 teléfonos de los empleados, el requisito subiría a 41 dispositivos. En ese escenario, la máscara mínima pasaría a ser **/26** (255.255.255.192), permitiendo hasta 64 direcciones y situando la IP de broadcast en la 10.10.100.127."*

Con esta respuesta demuestras que sabes hacer el cálculo matemático perfecto para lo que te piden, pero que además tienes visión de arquitecto de sistemas reales.

¿Qué te parece? Si quieres podemos revisar el cálculo conceptual que pidieron para el diseño de Bases de Datos en ambos exámenes para terminar de rematar los patrones principales.
