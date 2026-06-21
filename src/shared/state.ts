import type { MovedItem } from "./types";

export interface ToolkitState {
  applied: boolean;
  originalHeader: Element | null;
  rebuiltHeader: HTMLElement | null;
  floatingControls: HTMLElement | null;
  headerObserver: MutationObserver | null;
  movedItems: MovedItem[];
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
    headerObserver: null,
    movedItems: [],
    geometryRestorers: [],
    cleanupCallbacks: [],
    missing: [],
  };
}
