import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import { response } from "express";

describe("Auth API Integration Tests", () => {
  it("Should return 200 if login credentials are wrong", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "icke-existerande@test.com", password: "fel-losenord" });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("Should return 400 if trying to register en email that already exists", async () => {
    await request(app).post("/api/auth/register-candidate").send({
      username: "Manau",
      email: "alreadyexists@test.com",
      password: "password123",
    });

    const response = await request(app)
      .post("/api/auth/register-candidate")
      .send({
        username: "Gustav",
        email: "alreadyexists@test.com",
        password: "gustav-password",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
