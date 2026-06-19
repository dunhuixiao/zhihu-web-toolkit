import type { MovedItem } from "./types";

export interface ToolkitState {
  applied: boolean;
  originalHeader: Element | null;
  rebuiltHeader: HTMLElement | null;
  floatingControls: HTMLElement | null;
  movedItems: MovedItem[];
  missing: string[];
}

export function createToolkitState(): ToolkitState {
  return {
    applied: false,
    originalHeader: null,
    rebuiltHeader: null,
    floatingControls: null,
    movedItems: [],
    missing: [],
  };
}
