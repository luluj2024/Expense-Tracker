import { describe, it, expect } from "vitest";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

describe("User model validation & methods (unit)", () => {
  it("should fail when required fields are missing", () => {
    const doc = new User({});
    const err = doc.validateSync();
    expect(err).toBeTruthy();
    expect(err.errors.fullName).toBeTruthy();
    expect(err.errors.email).toBeTruthy();
    expect(err.errors.password).toBeTruthy();
  });

  it("should pass validation when required fields are provided", () => {
    const doc = new User({ fullName: "Alice", email: "a@b.com", password: "x" });
    const err = doc.validateSync();
    expect(err).toBeUndefined();
  });

  it("comparePassword returns true for correct password", async () => {
    const plain = "secret123";
    const hashed = await bcrypt.hash(plain, 10);
    const u = new User({ fullName: "Bob", email: "b@b.com", password: hashed });
    expect(await u.comparePassword(plain)).toBe(true);
  });

  it("comparePassword returns false for wrong password", async () => {
    const hashed = await bcrypt.hash("secret123", 10);
    const u = new User({ fullName: "Bob", email: "b@b.com", password: hashed });
    expect(await u.comparePassword("wrong")).toBe(false);
  });
});
