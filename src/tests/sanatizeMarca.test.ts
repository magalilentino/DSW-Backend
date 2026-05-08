import test from "node:test";
import assert from "node:assert";

import { sanitizeMarcaInput } from "../marca/sanitizeMarcaInput.js";

test("sanitizeMarcaInput debería crear sanitizedInput correctamente", () => {
  
  const req: any = {
    body: {
      nombre: "Loreal",
    },
  };

  const res: any = {};

  let nextCalled = false;

  const next = () => {
    nextCalled = true;
  };

  sanitizeMarcaInput(req, res, next);

  assert.deepEqual(req.body.sanitizedInput, {
    nombre: "Loreal",
  });

  assert.equal(nextCalled, true);
});

// pnpm test para correrlo