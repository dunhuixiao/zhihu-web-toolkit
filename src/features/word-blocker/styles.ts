export function buildWordBlockerCss(): string {
  return `
#zhihu-web-toolkit-word-block-panel {
  position: fixed !important;
  right: 78px !important;
  bottom: 30px !important;
  z-index: 999998 !important;
  width: min(320px, calc(100vw - 32px)) !important;
  max-height: min(520px, calc(100vh - 64px)) !important;
  display: none !important;
  flex-direction: column !important;
  overflow: hidden !important;
  background: var(--GBK99A, #fff) !important;
  border: 1px solid var(--GBK10A, #ebebeb) !important;
  border-radius: 8px !important;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18) !important;
  color: var(--GBK04A, #121212) !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
  color-scheme: light !important;
}

#zhihu-web-toolkit-word-block-panel[data-open='true'] {
  display: flex !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel {
  background: var(--GBK99A, #1a1a1a) !important;
  border-color: var(--GBK20A, #2e2e2e) !important;
  color: var(--GBK04A, #f6f6f6) !important;
  color-scheme: dark !important;
}

#zhihu-web-toolkit-word-block-panel *,
#zhihu-web-toolkit-word-block-panel *::before,
#zhihu-web-toolkit-word-block-panel *::after {
  box-sizing: border-box !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-header {
  padding: 14px !important;
  border-bottom: 1px solid var(--GBK10A, #ebebeb) !important;
  background: var(--GBK99A, #fff) !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-header {
  border-bottom-color: var(--GBK20A, #2e2e2e) !important;
  background: var(--GBK99A, #1a1a1a) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-title-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  margin-bottom: 12px !important;
}

#zhihu-web-toolkit-word-block-panel h3 {
  margin: 0 !important;
  color: inherit !important;
  font-size: 15px !important;
  line-height: 22px !important;
  font-weight: 600 !important;
  letter-spacing: 0 !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-close {
  width: 28px !important;
  height: 28px !important;
  min-width: 28px !important;
  border: 1px solid transparent !important;
  border-radius: 4px !important;
  background: transparent !important;
  color: var(--GBK07A, #8590a6) !important;
  cursor: pointer !important;
  font-size: 20px !important;
  line-height: 24px !important;
  padding: 0 !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-close:hover {
  background: var(--GBK10A, #ebebeb) !important;
  color: inherit !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-input-row {
  display: flex !important;
  gap: 8px !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-input {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  height: 34px !important;
  padding: 0 10px !important;
  border: 1px solid var(--GBK10A, #d9d9d9) !important;
  border-radius: 4px !important;
  outline: none !important;
  color: inherit !important;
  background: var(--GBK99A, #fff) !important;
  font-size: 14px !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-input {
  background: var(--GBK99A, #1a1a1a) !important;
  border-color: var(--GBK20A, #2e2e2e) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-input:focus {
  border-color: var(--GBL01A, #1772f6) !important;
  box-shadow: 0 0 0 2px rgba(23, 114, 246, 0.15) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-add,
#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-delete,
#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-confirm,
#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-cancel {
  height: 34px !important;
  border: 0 !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-size: 13px !important;
  line-height: 18px !important;
  white-space: nowrap !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-add {
  flex: 0 0 auto !important;
  padding: 0 14px !important;
  background: var(--GBL01A, #1772f6) !important;
  color: var(--GBK99A, #fff) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-list {
  flex: 1 1 auto !important;
  min-height: 64px !important;
  max-height: 340px !important;
  overflow-y: auto !important;
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-item {
  min-height: 42px !important;
  padding: 8px 14px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  border-bottom: 1px solid var(--GBK10A, #ebebeb) !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-item {
  border-bottom-color: var(--GBK20A, #2e2e2e) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-keyword {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  color: inherit !important;
  font-size: 14px !important;
  line-height: 20px !important;
  overflow-wrap: anywhere !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-delete,
#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-confirm {
  flex: 0 0 auto !important;
  padding: 0 10px !important;
  background: #ff4d4f !important;
  color: #fff !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-cancel {
  flex: 0 0 auto !important;
  padding: 0 10px !important;
  background: var(--GBK10A, #ebebeb) !important;
  color: var(--GBK04A, #121212) !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-cancel {
  background: var(--GBK20A, #2e2e2e) !important;
  color: var(--GBK04A, #f6f6f6) !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-confirm-row {
  flex: 0 0 auto !important;
  display: flex !important;
  gap: 6px !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-empty {
  padding: 20px 14px !important;
  color: var(--GBK07A, #8590a6) !important;
  font-size: 13px !important;
  text-align: center !important;
}

#zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-footer {
  flex: 0 0 auto !important;
  padding: 10px 14px !important;
  color: var(--GBK07A, #8590a6) !important;
  border-top: 1px solid var(--GBK10A, #ebebeb) !important;
  font-size: 12px !important;
  line-height: 18px !important;
  text-align: center !important;
}

html[data-theme='dark'] #zhihu-web-toolkit-word-block-panel .zhihu-web-toolkit-word-block-footer {
  border-top-color: var(--GBK20A, #2e2e2e) !important;
}

@media (max-width: 520px) {
  #zhihu-web-toolkit-word-block-panel {
    right: 16px !important;
    bottom: 84px !important;
  }
}
`;
}
