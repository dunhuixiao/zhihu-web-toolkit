import {
  FLOATING_BUTTON_ACTIVE_CLASS,
  FLOATING_CONTROLS_ID,
} from "../../shared/constants";

export function buildFloatingControlsCss(): string {
  return `
#${FLOATING_CONTROLS_ID} {
  position: fixed !important;
  bottom: 30px !important;
  right: 30px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  z-index: 999999 !important;
  transition: opacity 0.3s !important;
}

@keyframes zhihu-web-toolkit-toolbar-pop {
  from {
    opacity: 0;
    transform: scale(0.4) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

#${FLOATING_CONTROLS_ID} .zhihu-web-toolkit-square-button {
  width: 38px !important;
  height: 38px !important;
  min-width: 38px !important;
  min-height: 38px !important;
  background-color: var(--GBK99A, #fff) !important;
  border: 1px solid var(--GBL01A, #1772f6) !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--GBL01A, #1772f6) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  padding: 0 !important;
  margin: 0 !important;
  animation: zhihu-web-toolkit-toolbar-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both !important;
}

#${FLOATING_CONTROLS_ID} .zhihu-web-toolkit-square-button:hover,
#${FLOATING_CONTROLS_ID} .zhihu-web-toolkit-square-button.${FLOATING_BUTTON_ACTIVE_CLASS} {
  background-color: var(--GBL01A, #1772f6) !important;
  color: var(--GBK99A, #fff) !important;
}

#${FLOATING_CONTROLS_ID} .zhihu-web-toolkit-square-button svg {
  fill: currentColor !important;
  width: 20px !important;
  height: 20px !important;
  flex: 0 0 20px !important;
}
`;
}
