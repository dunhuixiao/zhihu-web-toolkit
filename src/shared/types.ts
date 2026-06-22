export interface HiddenTargetReport {
  selector: string;
  count: number;
  reason?: string;
  volatile: boolean;
  visibleCount: number;
}

export interface KeptItemReport {
  key: string | null;
  text: string;
  href: string;
}

export interface ToolkitReport {
  active: boolean;
  isZhihu: boolean;
  url: string;
  themeMode: "dark" | "light";
  headerFound: boolean;
  rebuiltHeaderFound: boolean;
  floatingControlsFound: boolean;
  wordBlockButtonFound: boolean;
  wordBlockPanelFound: boolean;
  wordBlockKeywordCount: number;
  wordBlockRemovedCount: number;
  hiddenTargets: HiddenTargetReport[];
  hiddenAds: HiddenTargetReport[];
  hiddenTopBanners: HiddenTargetReport[];
  keptItems: KeptItemReport[];
  missing: string[];
  ruapjkProxied: boolean;
  ruapjkMoved: boolean;
}

export interface DestroyOptions {
  silent?: boolean;
}

export interface ToolkitApi {
  apply: () => ToolkitReport;
  destroy: (options?: DestroyOptions) => void;
  report: () => ToolkitReport;
}
