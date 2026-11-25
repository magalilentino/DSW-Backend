import "reflect-metadata";  
import "dotenv/config";     
import test, { after } from "node:test";
import assert from "node:assert";
import request from "supertest";

import app from "../app.js";
import { orm } from "../shared/orm.js";

after(async () => {
  await orm.close(true);
});

test("GET /api/marca debería devolver 200", async () => {
  const response = await request(app).get("/api/marca");
  assert.strictEqual(response.status, 200);
});

// pnpm run test:integration para correrlo 