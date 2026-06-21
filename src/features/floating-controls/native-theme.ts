import type { ThemeMode } from "./floating-controls";

const REACT_CONTAINER_KEY_PREFIX = "__reactContainer$";
const REACT_FIBER_KEY_PREFIX = "__reactFiber$";
const MAX_REACT_FIBERS_TO_SCAN = 2000;

type ReactFiber = {
  child?: ReactFiber | null;
  current?: ReactFiber | null;
  memoizedProps?: {
    value?: unknown;
  } | null;
  return?: ReactFiber | null;
  sibling?: ReactFiber | null;
  tag?: number;
};

type NativeThemeSetter = (isDarkMode: boolean) => void;

export function switchNativeThemeWithoutReload(mode: ThemeMode): boolean {
  const setNativeTheme = findNativeThemeSetter();
  if (!setNativeTheme) {
    return false;
  }

  try {
    setNativeTheme(mode === "dark");
    return true;
  } catch (error) {
    console.warn("[zhihu-web-toolkit] Failed to switch Zhihu theme without reload.", error);
    return false;
  }
}

function findNativeThemeSetter(): NativeThemeSetter | null {
  const root = document.getElementById("root");
  if (!root) {
    return null;
  }

  for (const fiber of findReactRoots(root)) {
    const setter = findThemeSetterInFiber(fiber);
    if (setter) {
      return setter;
    }
  }

  return null;
}

function findReactRoots(element: HTMLElement): ReactFiber[] {
  const record = element as HTMLElement & Record<string, unknown>;
  const roots: ReactFiber[] = [];

  for (const key of Object.getOwnPropertyNames(record)) {
    if (!key.startsWith(REACT_CONTAINER_KEY_PREFIX) && !key.startsWith(REACT_FIBER_KEY_PREFIX)) {
      continue;
    }

    const fiber = normalizeReactFiber(record[key]);
    if (fiber) {
      roots.push(fiber);
    }
  }

  return roots;
}

function normalizeReactFiber(value: unknown): ReactFiber | null {
  if (!isRecord(value)) {
    return null;
  }

  if (isReactFiber(value.current)) {
    return value.current;
  }

  return isReactFiber(value) ? value : null;
}

function isReactFiber(value: unknown): value is ReactFiber {
  return isRecord(value) && ("tag" in value || "child" in value || "sibling" in value);
}

function findThemeSetterInFiber(root: ReactFiber): NativeThemeSetter | null {
  const stack: ReactFiber[] = [root];
  const seen = new Set<ReactFiber>();
  let scanned = 0;

  while (stack.length > 0 && scanned < MAX_REACT_FIBERS_TO_SCAN) {
    const fiber = stack.pop();
    if (!fiber || seen.has(fiber)) {
      continue;
    }

    seen.add(fiber);
    scanned += 1;

    const value = fiber.memoizedProps?.value;
    if (typeof value === "function" && isThemeSetterProvider(fiber)) {
      return value as NativeThemeSetter;
    }

    if (fiber.sibling) {
      stack.push(fiber.sibling);
    }
    if (fiber.child) {
      stack.push(fiber.child);
    }
  }

  return null;
}

function isThemeSetterProvider(fiber: ReactFiber): boolean {
  const themeProviderValue = fiber.return?.memoizedProps?.value;
  const userAgentProviderValue = fiber.return?.return?.memoizedProps?.value;

  return typeof themeProviderValue === "boolean" && isZhihuUserAgent(userAgentProviderValue);
}

function isZhihuUserAgent(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    ("Zhihu" in value || "ZhihuHybrid" in value) &&
    "Mobile" in value &&
    ("Wechat" in value || "MQQBrowser" in value || "QQ" in value)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
