import { beforeEach, vi } from "vitest";
import { resetNativeThemeReloader } from "../src/features/floating-controls/floating-controls";

beforeEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  delete document.documentElement.dataset.theme;
  delete (window as { __zhihuWebToolkit?: unknown }).__zhihuWebToolkit;
  resetNativeThemeReloader();
  window.history.replaceState({}, "", "/");
  vi.restoreAllMocks();
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});
