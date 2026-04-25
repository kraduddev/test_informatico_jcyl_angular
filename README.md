# Quiz JCyL — Técnico Superior de Informática

Web estática tipo **quiz/flashcard** y **visor de supuestos prácticos** para preparar las oposiciones de Técnico Superior de Informática de la Junta de Castilla y León (JCyL) y del Cuerpo Superior TIC de la Administración General del Estado (AGE). Sin dependencias externas, funciona en cualquier servidor estático.

---

## 🚀 Arrancar en local

Necesitas un servidor HTTP local (los módulos ES no funcionan abriendo el HTML directamente con `file://`).

### Opción 1 — Python (sin instalar nada extra)
```bash
cd /ruta/a/test-jcyl
python3 -m http.server 8080
# Abre → http://localhost:8080
```

### Opción 2 — Node.js `serve`
```bash
npx serve .
```

### Opción 3 — VS Code / Cursor / JetBrains
Usa el plugin **Live Server** o el servidor de desarrollo integrado de tu IDE.

---

## 📁 Estructura del proyecto

```
test-jcyl/
├── index.html                   ← SPA principal
├── README.md
├── dockerfile
├── nginx.conf
├── tests/
│   ├── index.json               ← Manifiesto de tests disponibles
│   ├── test-2024.json           ← Técnico Superior Informática — JCyL (oct. 2024)
│   └── test-age-2025.json       ← Cuerpo Superior TIC — AGE (feb. 2025)
├── supuestos/
│   └── categorias.json          ← Supuestos prácticos agrupados por categoría
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        ├── app.js               ← Punto de entrada, dashboard y navegación
        ├── manifest.js          ← Carga del manifiesto y banner de sesión en curso
        ├── quiz.js              ← Motor del quiz, aleatoriedad, penalización, persistencia
        ├── stats.js             ← Pantalla de estadísticas históricas
        └── supuestos.js         ← Carga y renderizado de supuestos prácticos
```

---

## 🗺️ Flujo de la aplicación

```
Dashboard
├── 📝 Tests
│   ├── Selección de test
│   ├── Configuración (temas, orden aleatorio)
│   ├── Quiz
│   │   ├── Responder opción  → retroalimentación inmediata + explicación
│   │   └── Dejar en blanco  → penalización -1/3 sobre la nota final
│   ├── Resultados
│   │   ├── Puntuación con penalización (correctas − incorrectas/3)
│   │   ├── Desglose por tema
│   │   └── Revisión de errores (preguntas falladas con respuesta correcta)
│   └── Estadísticas históricas
│
└── 📋 Supuestos Prácticos
    ├── 📂 Por Examen    → preguntas agrupadas por convocatoria/origen
    └── 🏷️ Por Categoría → preguntas agrupadas por área temática
```

---

## 🗂️ Tests disponibles

| Test | Convocatoria | Preguntas |
|---|---|---|
| Técnico Superior de Informática — JCyL | 26 oct. 2024 | 75 |
| Cuerpo Superior TIC — AGE | 14 feb. 2025 | 100 |

---

## ➕ Añadir un nuevo test

1. Coloca el fichero `.json` en la carpeta `tests/`. Debe tener esta estructura:

```json
{
  "examen": "Nombre del examen",
  "ejercicio": "Primer Ejercicio",
  "fecha": "dd de mes de yyyy",
  "preguntas": [
    {
      "numero": 1,
      "tema": "Bloque - Tema N: Nombre del tema",
      "enunciado": "Texto de la pregunta...",
      "opciones": {
        "a": "Opción A",
        "b": "Opción B",
        "c": "Opción C",
        "d": "Opción D"
      },
      "respuesta_correcta": "b",
      "explicación": "Justificación de la respuesta correcta."
    }
  ]
}
```

2. Registra el nuevo test en `tests/index.json`:

```json
[
  {
    "id": "test-2024",
    "nombre": "Técnico Superior de Informática — JCyL",
    "ejercicio": "Primer Ejercicio",
    "fecha": "26 de octubre de 2024",
    "fichero": "tests/test-2024.json"
  },
  {
    "id": "test-age-2025",
    "nombre": "Cuerpo Superior TIC — AGE",
    "ejercicio": "Primer Ejercicio",
    "fecha": "14 de febrero de 2025",
    "fichero": "tests/test-age-2025.json"
  }
]
```

¡Listo! El selector de la sección de Tests lo mostrará automáticamente.

---

## ➕ Añadir supuestos prácticos

Todo el contenido de supuestos reside en `supuestos/categorias.json`. La estructura es:

```json
{
  "categorias": [
    {
      "nombre": "Nombre de la categoría",
      "conceptos_core": ["Concepto 1", "Concepto 2"],
      "leyes_relacionadas": ["Ley Orgánica X", "Real Decreto Y"],
      "preguntas": [
        {
          "origen": "JCyL 2024",
          "enunciado": "Texto completo del supuesto...",
          "plantilla_solucion": "Estructura orientativa de respuesta..."
        }
      ]
    }
  ]
}
```

| Campo | Descripción |
|---|---|
| `nombre` | Nombre de la categoría temática (ej. *Bases de Datos*, *Seguridad*) |
| `conceptos_core` | Lista de conceptos clave que cubre la categoría |
| `leyes_relacionadas` | Normativa aplicable (leyes, reales decretos, directivas…) |
| `origen` | Identificador de la convocatoria (ej. `"JCyL 2024"`, `"AGE 2025"`) — se usa para agrupar en la vista *Por Examen* |
| `enunciado` | Texto completo del supuesto tal como aparece en el examen |
| `plantilla_solucion` | Guía de respuesta orientativa |

La vista **Por Examen** agrupa automáticamente todas las preguntas de todas las categorías por el campo `origen`, ordenadas cronológicamente.  
La vista **Por Categoría** muestra cada categoría con sus conceptos core, leyes y sus preguntas asociadas.

---

## ✨ Características

| Característica | Descripción |
|---|---|
| **Dashboard dual** | Acceso independiente a Tests y Supuestos Prácticos desde la pantalla de inicio |
| **Aleatoriedad total** | Las preguntas y sus opciones se barajan con Fisher-Yates en cada sesión |
| **Filtro por temas** | Practica solo los bloques temáticos que te interesen |
| **Retroalimentación inmediata** | Al responder se resalta la opción correcta/incorrecta y aparece la explicación |
| **Respuesta en blanco** | Opción "Dejar en blanco" en cada pregunta; penalización de −1/3 sobre la puntuación final |
| **Puntuación con penalización** | Nota = correctas − (incorrectas / 3); se muestra al terminar |
| **Revisión de errores** | Al finalizar el test se listan todas las preguntas falladas con su respuesta correcta |
| **Sesión en curso** | Si recargas la página, puedes retomar el test donde lo dejaste |
| **Historial de estadísticas** | KPIs globales + desglose de todas las sesiones anteriores por test |
| **Supuestos por examen** | Vista agrupada por convocatoria con acordeón por origen |
| **Supuestos por categoría** | Vista temática con conceptos core, leyes relacionadas y plantilla de respuesta |
| **Modo oscuro** | Se activa automáticamente según la preferencia del sistema |
| **Sin dependencias** | HTML + CSS + JavaScript puro. Funciona en cualquier servidor estático |

---

## 🐳 Despliegue con Docker (VPS)

### Construir y ejecutar localmente

```bash
# Construir la imagen
docker build -t quiz-jcyl:latest .

# Arrancar el contenedor (puerto 80 del host)
docker run -d --name quiz-jcyl -p 80:80 --restart unless-stopped quiz-jcyl:latest

# Ver logs
docker logs -f quiz-jcyl
```

### Publicar en un registry y desplegar en el VPS

```bash
# 1. Etiquetar y subir al registry (sustituye 'usuario' por tu usuario de Docker Hub / ghcr.io)
docker build -t usuario/quiz-jcyl:latest .
docker push usuario/quiz-jcyl:latest

# 2. En el VPS
ssh usuario@ip-del-vps
docker pull usuario/quiz-jcyl:latest
docker stop quiz-jcyl && docker rm quiz-jcyl   # si ya existía
docker run -d --name quiz-jcyl -p 80:80 --restart unless-stopped usuario/quiz-jcyl:latest
```

### Con dominio + HTTPS (Nginx Proxy Manager o Caddy en el VPS)

Si usas un proxy inverso delante (recomendado), expón el contenedor solo en localhost:

```bash
docker run -d --name quiz-jcyl -p 127.0.0.1:8080:80 --restart unless-stopped quiz-jcyl:latest
```

Luego configura el proxy para que reenvíe `https://tudominio.com` → `http://127.0.0.1:8080`.

---

## 🌐 Despliegue en producción

Al ser una web estática basta con copiar todos los ficheros a cualquier hosting:

- **GitHub Pages**: sube el repositorio y activa Pages desde `Settings → Pages`.
- **Netlify / Vercel**: arrastra la carpeta o conecta el repositorio. Build command: *(vacío)*, publish directory: `.`
- **Servidor propio**: copia los ficheros en la raíz del `DocumentRoot` de Apache/Nginx.

