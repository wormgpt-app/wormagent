import { describe, expect, test } from "bun:test"
import { normalizeBasePath, stripBasePath, withBasePath } from "./base-path"

describe("normalizeBasePath", () => {
  test("is empty at the root", () => {
    expect(normalizeBasePath(undefined)).toBe("")
    expect(normalizeBasePath("/")).toBe("")
    expect(normalizeBasePath("")).toBe("")
  })

  test("has a leading slash and no trailing slash", () => {
    expect(normalizeBasePath("/wormagent/")).toBe("/wormagent")
    expect(normalizeBasePath("wormagent")).toBe("/wormagent")
    expect(normalizeBasePath("//a/b//")).toBe("/a/b")
  })
})

describe("withBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(withBasePath("/new-session?x=1", "")).toBe("/new-session?x=1")
  })

  test("prefixes paths with the base", () => {
    expect(withBasePath("/", "/wormagent")).toBe("/wormagent/")
    expect(withBasePath("/server/a/session/b#m", "/wormagent")).toBe("/wormagent/server/a/session/b#m")
  })
})

describe("stripBasePath", () => {
  test("leaves paths alone at the root", () => {
    expect(stripBasePath("/new-session", "")).toBe("/new-session")
  })

  test("removes the base", () => {
    expect(stripBasePath("/wormagent", "/wormagent")).toBe("/")
    expect(stripBasePath("/wormagent/", "/wormagent")).toBe("/")
    expect(stripBasePath("/wormagent?draftId=1", "/wormagent")).toBe("/?draftId=1")
    expect(stripBasePath("/wormagent/new-session#top", "/wormagent")).toBe("/new-session#top")
  })

  test("keeps paths outside the base", () => {
    expect(stripBasePath("/wormagent-other/x", "/wormagent")).toBe("/wormagent-other/x")
    expect(stripBasePath("/elsewhere", "/wormagent")).toBe("/elsewhere")
  })

  test("round-trips with withBasePath", () => {
    for (const path of ["/", "/new-session", "/server/a/session/b?q=1#h"])
      expect(stripBasePath(withBasePath(path, "/wormagent"), "/wormagent")).toBe(path)
  })
})
