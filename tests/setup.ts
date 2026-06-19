import { beforeEach, vi } from "vitest";

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  delete document.documentElement.dataset.theme;
  delete (window as { __zhihuWebToolkit?: unknown }).__zhihuWebToolkit;
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
