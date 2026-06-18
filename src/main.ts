import styleText from './styles/toolkit.css?inline';
import { debounce, injectStyle, onDomReady } from './core/dom';
import { syncNativeTokens } from './core/nativeTokens';
import { initBlocklist, debouncedApplyBlocklist } from './features/blocklist';
import { applyPageCleanup } from './features/layout';
import { initToolbar } from './features/toolbar';

const ZHMT_BOOTSTRAPPED = '__zhmtBootstrapped';
const VERSION = '0.0.5';

declare global {
  interface Window {
    [ZHMT_BOOTSTRAPPED]?: boolean;
  }
}

onDomReady(() => {
  if (window[ZHMT_BOOTSTRAPPED]) {
    return;
  }

  window[ZHMT_BOOTSTRAPPED] = true;
  document.documentElement.classList.add('zhmt-booting');
  console.info(`[zhmt] boot ${VERSION}`);

  try {
    syncNativeTokens();
    injectStyle(styleText);
    applyPageCleanup();
    initToolbar();

    void initBlocklist().catch((error) => {
      console.error('[zhmt] blocklist init failed', error);
    });

    const refreshPage = debounce(() => {
      syncNativeTokens();
      applyPageCleanup();
      initToolbar();
      debouncedApplyBlocklist();
    }, 500);

    [200, 800, 1800, 3600].forEach((delay) => {
      window.setTimeout(refreshPage, delay);
    });

    const observer = new MutationObserver((mutations) => {
      const hasUsefulMutation = mutations.some((mutation) => Array.from(mutation.addedNodes).some(isPageContentMutation));

      if (hasUsefulMutation) {
        refreshPage();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', refreshPage);
    window.addEventListener('resize', refreshPage, { passive: true });
    console.info('[zhmt] ready');
  } catch (error) {
    console.error('[zhmt] init failed', error);
  }
});

function isPageContentMutation(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }

  const element = node as HTMLElement;
  if (element.closest('#zh-tools-panel, .zh-copy-md-container, .zhmt-modal, .zhmt-toast, #zh-toast')) {
    return false;
  }

  return true;
}
