// test/fechas-helper.test.js
import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calcularEdad } from '../src/helpers/fechas-helper.js';

describe('calcularEdad', () => {

    test('Caso 1: cumpleaños exactamente hoy → 24', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad(new Date(2000, 5, 15));
        assert.strictEqual(resultado, 24);
    });

    test('Caso 2: un día antes del cumpleaños (no cumplió todavía) → 23', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad(new Date(2000, 5, 16));
        assert.strictEqual(resultado, 23);
    });

    test('Caso 3: un día después del cumpleaños (ya cumplió) → 24', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad(new Date(2000, 5, 14));
        assert.strictEqual(resultado, 24);
    });

    test('Caso 4: fecha de nacimiento en el futuro → -6 (la función no valida esto)', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad(new Date(2030, 0, 1));
        assert.strictEqual(resultado, -6);
    });

    test('Caso 5: fecha inválida como string → NaN', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad('no-es-una-fecha');
        assert.ok(Number.isNaN(resultado));
    });

    test('Caso 6a: null como input → null', () => {
        const resultado = calcularEdad(null);
        assert.strictEqual(resultado, null);
    });

    test('Caso 6b: undefined como input → null', () => {
        const resultado = calcularEdad(undefined);
        assert.strictEqual(resultado, null);
    });

    test('Caso 7a: nacido 29/feb, hoy también 29/feb (año bisiesto) → 24', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 1, 29).getTime() });
        const resultado = calcularEdad(new Date(2000, 1, 29));
        assert.strictEqual(resultado, 24);
    });

    test('Caso 7b: nacido 29/feb, hoy 28/feb de año NO bisiesto → 22', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2023, 1, 28).getTime() });
        const resultado = calcularEdad(new Date(2000, 1, 29));
        assert.strictEqual(resultado, 22);
    });

    test('Caso 7c: nacido 29/feb, hoy 1/marzo de año NO bisiesto → 23', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2023, 2, 1).getTime() });
        const resultado = calcularEdad(new Date(2000, 1, 29));
        assert.strictEqual(resultado, 23);
    });

    test('Caso 8: rama mesDiff < 0 (nacido en mes posterior al actual) → 23', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 2, 10).getTime() });
        const resultado = calcularEdad(new Date(2000, 10, 20));
        assert.strictEqual(resultado, 23);
    });

    test('Caso 9: string vacío como input → null', () => {
        const resultado = calcularEdad('');
        assert.strictEqual(resultado, null);
    });

    test('Caso 10: objeto Date ya construido (no string) → 23', (t) => {
        t.mock.timers.enable({ apis: ['Date'], now: new Date(2024, 5, 15).getTime() });
        const resultado = calcularEdad(new Date(2000, 5, 20));
        assert.strictEqual(resultado, 23);
    });

});