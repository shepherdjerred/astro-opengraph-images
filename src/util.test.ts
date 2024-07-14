import { expect, test } from "vitest";
import { getFilePath } from "./util.js";

test("getFilePath index", () => {
  const result = getFilePath({ dir: "", page: "index" });
  expect(result).toBe("index.html");
});

test("getFilePath 404", () => {
  const result = getFilePath({ dir: "", page: "404" });
  expect(result).toBe("index.html");
});

test("getFilePath blog", () => {
  const result = getFilePath({ dir: "", page: "blog" });
  expect(result).toBe("blog/index.html");
});
