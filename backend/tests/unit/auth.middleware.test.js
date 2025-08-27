// Use ESM in test files; works fine even if app is CommonJS.

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as auth from "../../middleware/authMiddleware.js"; 
const { protect } = auth;

vi.mock("jsonwebtoken", () => {
  return {
    default: { verify: vi.fn() }, 
    verify: vi.fn(),
  };
});

vi.mock("../../models/User.js", () => {
  return {
    default: {
      findById: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ _id: "u1", email: "a@b.com" }),
      })),
    },
  };
});

const jwt = await import("jsonwebtoken");
const User = (await import("../../models/User.js")).default;

function makeRes() {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware.protect (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should 401 when no token is provided", async () => {
    const req = { headers: {} };
    const res = makeRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should 401 when token verification fails", async () => {
    (jwt.default.verify || jwt.verify).mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = { headers: { authorization: "Bearer badtoken" } };
    const res = makeRes();
    const next = vi.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token failed" });
    expect(next).not.toHaveBeenCalled();
  });


});
