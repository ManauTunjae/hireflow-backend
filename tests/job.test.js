import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/server.js";
import User from "../src/models/User.js";
import jwt from "jsonwebtoken";

describe("Job API Integration Tests", () => {
  let testUserId;
  let token;

  beforeAll(async () => {
    let user = await User.findOne({ email: "testadmin@test.com" });
    if (!user) {
      user = await User.create({
        username: "TestAdmin",
        email: "testadmin@test.com",
        passwordHash: "password123",
        role: "recruiter",
      });
    }
    testUserId = user._id;

    token = jwt.sign({ id: testUserId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  });

  it("Should create a new job successfully", async () => {
    const newJob = {
      title: "Frontend Developer",
      description: "Junior Frontend Dev use React",
      company: "Hire Flow AB",
      location: "Stockholm Sweden",
      status: "open",
      createdBy: testUserId,
      salary: "40000 - 50000 sek",
      requirements: ["React", "Node.js"],
    };
    const response = await request(app)
      .post("/api/jobs")
      .set("Authorization", `Bearer ${token}`)
      .send(newJob);

      console.log("Det här skickar backenden tillbaka:", response.body);

    expect(response.statusCode).toBe(201);
  });
});
