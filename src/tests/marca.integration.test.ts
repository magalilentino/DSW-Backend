import "reflect-metadata";  
import "dotenv/config";     
import test from "node:test";
import assert from "node:assert";
import request from "supertest";

import app from "../app.js";

test("GET /api/marca debería devolver 200", async () => {
  const response = await request(app).get("/api/marca");
  assert.strictEqual(response.status, 200);
});

// pnpm run test:integration para correrlo 