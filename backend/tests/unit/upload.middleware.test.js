import { describe, it, expect, vi } from "vitest";
import { fileFilter } from "../../middleware/uploadMiddleware.js";

describe("upload fileFilter (unit)", () => {
  it("should accept image/jpeg", () => {
    const cb = vi.fn();
    fileFilter({}, { mimetype: "image/jpeg" }, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("should accept image/png", () => {
    const cb = vi.fn();
    fileFilter({}, { mimetype: "image/png" }, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("should accept image/jpg", () => {
    const cb = vi.fn();
    fileFilter({}, { mimetype: "image/jpg" }, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("should reject non-image types (e.g. application/pdf)", () => {
    const cb = vi.fn();
    fileFilter({}, { mimetype: "application/pdf" }, cb);
    const [err, accepted] = cb.mock.calls[0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("Only .jpeg .jpg and .png formats are allowed");
    expect(accepted).toBe(false);
  });
});
