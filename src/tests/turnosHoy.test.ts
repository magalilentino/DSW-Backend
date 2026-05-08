import test from "node:test";
import assert from "node:assert";
import { validarUsuarioLogueado } from "../atencion/validarTurnosHoy.js";

test("turnosHoy - debería devolver 401 si no hay usuario logueado", () => {
  const resultado = validarUsuarioLogueado(undefined);

  assert.strictEqual(resultado.valido, false);
  if (!resultado.valido) {
    assert.strictEqual(resultado.status, 401);
    assert.strictEqual(resultado.message, "No se encontró el peluquero logueado");
  }
});

test("turnosHoy - debería devolver 401 si user existe pero no tiene id", () => {
  const resultado = validarUsuarioLogueado({ id: 0, type: "peluquero", nombre: "Juan" });

  assert.strictEqual(resultado.valido, false);
  if (!resultado.valido) {
    assert.strictEqual(resultado.status, 401);
    assert.strictEqual(resultado.message, "No se encontró el peluquero logueado");
  }
});

test("turnosHoy - debería ser válido si el usuario tiene id", () => {
  const resultado = validarUsuarioLogueado({ id: 5, type: "peluquero", nombre: "Juan" });

  assert.strictEqual(resultado.valido, true);
});