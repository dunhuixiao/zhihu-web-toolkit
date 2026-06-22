export interface ToolkitState {
  applied: boolean;
  originalHeader: Element | null;
  rebuiltHeader: HTMLElement | null;
  floatingControls: HTMLElement | null;
  wordBlocker: { destroy: () => void } | null;
  headerObserver: MutationObserver | null;
  geometryRestorers: Array<() => void>;
  cleanupCallbacks: Array<() => void>;
  missing: string[];
}

export function createToolkitState(): ToolkitState {
  return {
    applied: false,
    originalHeader: null,
    rebuiltHeader: null,
    floatingControls: null,
    wordBlocker: null,
    headerObserver: null,
    geometryRestorers: [],
    cleanupCallbacks: [],
    missing: [],
  };
}
