import test from "node:test";
import assert from "node:assert";

import { validarNombreDuplicado } from "../servicio/validarServicio.js";

test("validarNombreDuplicado - debería devolver error si el servicio ya existe", () => {
  const servicioFalso = { nombreServicio: "Corte" }; // simula lo que devolvería el ORM

  const resultado = validarNombreDuplicado("Corte", servicioFalso);

  assert.strictEqual(resultado.valido, false);
  if (!resultado.valido) {
    assert.strictEqual(resultado.status, 409);
    assert.strictEqual(resultado.message, "Ya existe un servicio con ese nombre.");
  }
});

test("validarNombreDuplicado - debería ser válido si no existe el servicio", () => {
  const resultado = validarNombreDuplicado("Corte", null); 

  assert.strictEqual(resultado.valido, true);
});