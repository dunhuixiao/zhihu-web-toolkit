export function findSearchControl(header: Element): Element | null {
  const input =
    header.querySelector("input[type='search']") ||
    header.querySelector("input[placeholder*='搜索']") ||
    header.querySelector("input[aria-label*='搜索']") ||
    header.querySelector(".SearchBar input");

  if (!input) {
    return null;
  }

  return input.closest("form") || input.closest(".SearchBar") || input.closest("[role='search']") || input;
}

function findSearchInput(root: Element | null): HTMLInputElement | HTMLTextAreaElement | null {
  if (!root) {
    return null;
  }

  if (root instanceof HTMLInputElement || root instanceof HTMLTextAreaElement) {
    return root;
  }

  return root.querySelector("input,textarea");
}

function findSearchForm(root: Element | null): HTMLFormElement | null {
  if (!root) {
    return null;
  }

  if (root instanceof HTMLFormElement) {
    return root;
  }

  return root.querySelector("form") || findSearchInput(root)?.closest("form") || null;
}

function setNativeInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const prototype = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");

  if (descriptor?.set) {
    descriptor.set.call(input, value);
  } else {
    input.value = value;
  }

  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function submitNativeSearch(nativeSearch: Element, query: string): void {
  const nativeInput = findSearchInput(nativeSearch);
  if (nativeInput) {
    setNativeInputValue(nativeInput, query);
  }

  const nativeForm = findSearchForm(nativeSearch);
  if (nativeForm) {
    if (typeof nativeForm.requestSubmit === "function") {
      nativeForm.requestSubmit();
      return;
    }

    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    if (nativeForm.dispatchEvent(submitEvent) && typeof nativeForm.submit === "function") {
      nativeForm.submit();
    }
    return;
  }

  const trimmedQuery = query.trim();
  if (trimmedQuery) {
    window.location.href = `/search?type=content&q=${encodeURIComponent(trimmedQuery)}`;
  }
}

export function proxySearch(proxy: HTMLElement, nativeSearch: Element): void {
  const submit = (event?: Event) => {
    event?.preventDefault();
    const proxyInput = findSearchInput(proxy);
    submitNativeSearch(nativeSearch, proxyInput?.value || "");
  };

  const proxyForm = findSearchForm(proxy);
  if (proxyForm) {
    proxyForm.addEventListener("submit", submit);
  } else {
    proxy.addEventListener("submit", submit);
  }

  const proxyInput = findSearchInput(proxy);
  proxyInput?.addEventListener("keydown", (event) => {
    if (event instanceof KeyboardEvent && event.key === "Enter") {
      submit(event);
    }
  });

  proxy.querySelectorAll("button,input[type='submit'],input[type='button']").forEach((element) => {
    element.addEventListener("click", (event) => submit(event));
  });
}
