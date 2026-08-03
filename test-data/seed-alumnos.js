// Script de seed para pruebas de performance.
// Inserta 10.000 alumnos de prueba en la tabla `alumnos`, reutilizando el
// mismo Pool singleton de DbPg (no abre conexiones nuevas por inserción).
// Se ejecuta UNA VEZ, manualmente, con `node test-data/seed-alumnos.js`.
// No toca server.js, controllers, ni ningún archivo de producción.


import 'dotenv/config';
import db from '../src/repositories/db-pg.js';

const TOTAL_ALUMNOS = 10000;
const TAMANIO_LOTE = 500;

// Marcador para poder borrar estos datos después sin tocar datos reales.
// Todos los apellidos de prueba llevan este valor exacto.
const MARCADOR_SEED = 'SeedDataPerformanceTest';

const NOMBRES = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía', 'Martín', 'Valentina'];

function generarFechaNacimientoAleatoria() {
    const anio = 1995 + Math.floor(Math.random() * 15); // entre 1995 y 2009
    const mes = Math.floor(Math.random() * 12);
    const dia = 1 + Math.floor(Math.random() * 28);
    return new Date(anio, mes, dia);
}

function generarAlumno(indice, idsCursos) {
    return {
        nombre: NOMBRES[indice % NOMBRES.length] + indice,
        apellido: MARCADOR_SEED,
        id_curso: idsCursos[indice % idsCursos.length],
        fecha_nacimiento: generarFechaNacimientoAleatoria(),
        hace_deportes: indice % 2
    };
}

async function obtenerIdsCursosExistentes() {
    const cursos = await db.queryAll('SELECT id FROM cursos');
    if (!cursos || cursos.length === 0) {
        throw new Error('No hay cursos en la tabla `cursos`. Necesitás al menos 1 curso existente para repartir id_curso entre los alumnos de prueba.');
    }
    return cursos.map(c => c.id);
}

function construirInsertDeLote(lote) {
    const columnas = ['nombre', 'apellido', 'id_curso', 'fecha_nacimiento', 'hace_deportes'];
    const values = [];
    const filasSql = lote.map((alumno, i) => {
        const base = i * columnas.length;
        values.push(alumno.nombre, alumno.apellido, alumno.id_curso, alumno.fecha_nacimiento, alumno.hace_deportes);
        const placeholders = columnas.map((_, j) => `$${base + j + 1}`).join(', ');
        return `(${placeholders})`;
    }).join(', ');

    const sql = `INSERT INTO alumnos (${columnas.join(', ')}) VALUES ${filasSql}`;
    return { sql, values };
}

async function seedAlumnos() {
    console.log(`Buscando cursos existentes para repartir id_curso...`);
    const idsCursos = await obtenerIdsCursosExistentes();
    console.log(`Se encontraron ${idsCursos.length} cursos. Insertando ${TOTAL_ALUMNOS} alumnos en lotes de ${TAMANIO_LOTE}...`);

    const pool = db.getDBPool();
    const cantidadLotes = Math.ceil(TOTAL_ALUMNOS / TAMANIO_LOTE);

    for (let loteActual = 0; loteActual < cantidadLotes; loteActual++) {
        const inicio = loteActual * TAMANIO_LOTE;
        const fin = Math.min(inicio + TAMANIO_LOTE, TOTAL_ALUMNOS);
        const lote = [];

        for (let i = inicio; i < fin; i++) {
            lote.push(generarAlumno(i, idsCursos));
        }

        const { sql, values } = construirInsertDeLote(lote);

        try {
            await pool.query(sql, values);
            console.log(`Lote ${loteActual + 1}/${cantidadLotes} insertado (${lote.length} alumnos).`);
        } catch (error) {
            console.error(`Error en el lote ${loteActual + 1}:`, error.message);
            throw error;
        }
    }

    console.log(`\n✅ Listo: se insertaron ${TOTAL_ALUMNOS} alumnos de prueba.`);
    console.log(`   Marcador usado en apellido: "${MARCADOR_SEED}"`);
}

seedAlumnos()
    .catch((error) => {
        console.error('El seed falló:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await db.getDBPool().end();
    });