// Test de INTEGRACIÓN, no unitario: requiere una conexión real a PostgreSQL
// (la misma base configurada en .env / db-config.js). No se mockea la base
// de datos — este test ejercita el flujo completo controller → service →
// repository → DbPg → Postgres.

import { test, describe } from 'node:test';
import assert from 'node:assert';
import supertest from 'supertest';
import app from '../src/app.js';

describe('CursosController - integración', () => {

    test('GET /api/cursos responde 200 y devuelve un array', async () => {
        const response = await supertest(app).get('/api/cursos');

        assert.strictEqual(response.status, 200);
        assert.ok(Array.isArray(response.body));
    });

    test('GET /api/cursos/999999 (id inexistente) responde 404', async () => {
        const response = await supertest(app).get('/api/cursos/999999');

        assert.strictEqual(response.status, 404);
    });

});