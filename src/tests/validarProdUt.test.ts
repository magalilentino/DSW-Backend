import test from "node:test";
import assert from "node:assert";

import { validarRegistrarProdUt } from "../producto-utilizado/validarRegistrarProdUt.js";

test("debería devolver error si no viene idAtSer", () => {

  const resultado = validarRegistrarProdUt(undefined, []);

  assert.strictEqual(
    resultado,
    "ID de Servicio-Atención (idAtSer) es requerido."
  );
});

test("debería devolver error si idAtSer no es válido", () => {

  const resultado = validarRegistrarProdUt("abc", []);

  assert.strictEqual(
    resultado,
    "ID de Servicio-Atención no válido."
  );
});

test("debería devolver error si prodMars no es un array", () => {

  const resultado = validarRegistrarProdUt("1", "hola");

  assert.strictEqual(
    resultado,
    "El formato de la lista de productos es incorrecto."
  );
});

test("debería devolver null si los datos son válidos", () => {

  const resultado = validarRegistrarProdUt("1", []);

  assert.strictEqual(resultado, null);
});

// assert.strictEqual(valorReal, valorEsperado) ¿el valor obtenido es EXACTAMENTE igual al esperado? 
// strict porque tambien compara tipo de dato 