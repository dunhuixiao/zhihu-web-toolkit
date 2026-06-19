(function () {
  "use strict";

  var GLOBAL_KEY = "__zhihuWebToolkit";
  var STYLE_ID = "zhihu-web-toolkit-style";
  var HEADER_ATTR = "data-zhihu-web-toolkit-header";
  var ORIGINAL_HIDDEN_CLASS = "zhihu-web-toolkit-original-header-hidden";

  var previous = window[GLOBAL_KEY];
  if (previous && typeof previous.destroy === "function") {
    previous.destroy({ silent: true });
  }

  var HIDE_SELECTORS = [
    "div.Card.CreatorEntrance.GlobalSideBar-creator.CreatorEntrance-link.CreatorEntrance-Link--smallIcon",
    "div.KfeCollection-CreateSaltCard",
    "div.css-ga65ow",
    "div.css-1qyytj7",
    "div.css-1g41cri",
    "div.Card.css-173vipd",
    "footer",
    "div.WriteArea.Card.css-1x8qqvf",
  ];

  var TOP_BANNER_SELECTORS = [
    "header.AppHeader:not([" + HEADER_ATTR + "='true'])",
    ".AppHeader:not([" + HEADER_ATTR + "='true'])",
  ];

  var HEADER_ITEMS = [
    {
      key: "home",
      label: "知乎主页",
      fallbackHref: "https://www.zhihu.com/",
      find: function (header) {
        return (
          header.querySelector("a.AppHeader-logo") ||
          header.querySelector("a[aria-label*='知乎']") ||
          header.querySelector("a[title*='知乎']") ||
          toTightControl(header.querySelector("svg[class*='Logo'], svg[class*='logo']"), header)
        );
      },
    },
    {
      key: "follow",
      label: "关注",
      fallbackHref: "https://www.zhihu.com/following",
      find: function (header) {
        return findHeaderControl(header, {
          texts: ["关注"],
          hrefParts: ["/following", "/follow"],
        });
      },
    },
    {
      key: "recommend",
      label: "推荐",
      fallbackHref: "https://www.zhihu.com/",
      find: function (header) {
        return findHeaderControl(header, {
          texts: ["推荐"],
          hrefParts: ["/recommend"],
        });
      },
    },
    {
      key: "hot",
      label: "热榜",
      fallbackHref: "https://www.zhihu.com/hot",
      find: function (header) {
        return findHeaderControl(header, {
          texts: ["热榜"],
          hrefParts: ["/hot"],
        });
      },
    },
  ];

  var ACTION_ITEMS = [
    {
      key: "messages",
      label: "消息",
      fallbackHref: "https://www.zhihu.com/notifications",
      find: function (header) {
        return findHeaderControl(header, {
          texts: ["消息", "通知"],
          ariaParts: ["消息", "通知"],
          classParts: ["Messages", "Notification"],
          hrefParts: ["/notifications", "/messages"],
        });
      },
    },
    {
      key: "inbox",
      label: "私信",
      fallbackHref: "https://www.zhihu.com/inbox",
      find: function (header) {
        return findHeaderControl(header, {
          texts: ["私信"],
          ariaParts: ["私信"],
          classParts: ["Inbox"],
          hrefParts: ["/inbox"],
        });
      },
    },
    {
      key: "profile",
      label: "个人信息",
      find: function (header) {
        var profile =
          header.querySelector(".AppHeader-profile") ||
          header.querySelector("[class*='Profile']") ||
          header.querySelector("[aria-label*='个人']") ||
          header.querySelector("[aria-label*='头像']") ||
          header.querySelector("img.Avatar");

        return toTightControl(profile, header);
      },
    },
  ];

  var state = {
    applied: false,
    originalHeader: null,
    rebuiltHeader: null,
    movedItems: [],
    missing: [],
  };

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, "").trim();
  }

  function readText(element) {
    if (!element) {
      return "";
    }

    return normalizeText(element.innerText || element.textContent || "");
  }

  function readMetaText(element) {
    if (!element) {
      return "";
    }

    return normalizeText(
      [
        element.getAttribute("aria-label"),
        element.getAttribute("title"),
        element.getAttribute("alt"),
        element.getAttribute("placeholder"),
        readText(element),
      ].join(" ")
    );
  }

  function includesAny(value, parts) {
    var text = String(value || "");
    return (parts || []).some(function (part) {
      return text.indexOf(part) !== -1;
    });
  }

  function isZhihuHost() {
    return /(^|\.)zhihu\.com$/i.test(location.hostname);
  }

  function getHref(element) {
    if (!element) {
      return "";
    }

    return element.getAttribute("href") || element.href || "";
  }

  function toTightControl(element, header) {
    if (!element || !header.contains(element)) {
      return null;
    }

    return (
      element.closest("a,button,[role='button']") ||
      element.closest(".AppHeader-profile") ||
      element
    );
  }

  function findHeaderControl(header, options) {
    var candidates = Array.prototype.slice.call(
      header.querySelectorAll("a,button,[role='button'],[aria-label],[title]")
    );

    for (var i = 0; i < candidates.length; i += 1) {
      var candidate = candidates[i];
      var text = readText(candidate);
      var meta = readMetaText(candidate);
      var href = getHref(candidate);
      var className = String(candidate.className || "");

      if ((options.texts || []).indexOf(text) !== -1) {
        return toTightControl(candidate, header);
      }

      if (includesAny(meta, options.ariaParts)) {
        return toTightControl(candidate, header);
      }

      if (includesAny(className, options.classParts)) {
        return toTightControl(candidate, header);
      }

      if (includesAny(href, options.hrefParts)) {
        return toTightControl(candidate, header);
      }
    }

    return null;
  }

  function findSearchControl(header) {
    var input =
      header.querySelector("input[type='search']") ||
      header.querySelector("input[placeholder*='搜索']") ||
      header.querySelector("input[aria-label*='搜索']") ||
      header.querySelector(".SearchBar input");

    if (!input) {
      return null;
    }

    return (
      input.closest("form") ||
      input.closest(".SearchBar") ||
      input.closest("[role='search']") ||
      input
    );
  }

  function findOriginalHeader() {
    return (
      document.querySelector("header.AppHeader") ||
      document.querySelector(".AppHeader") ||
      document.querySelector("header")
    );
  }

  function isInsideMovedNode(node) {
    return state.movedItems.some(function (item) {
      return item.node && item.node.contains(node);
    });
  }

  function moveInto(node, destination, key, label) {
    if (!node || !destination || isInsideMovedNode(node)) {
      return false;
    }

    var placeholder = document.createComment("zhihu-web-toolkit:" + key);
    if (node.parentNode) {
      node.parentNode.insertBefore(placeholder, node);
    }

    node.setAttribute("data-zhihu-web-toolkit-item", key);
    if (label && !node.getAttribute("aria-label") && !readText(node)) {
      node.setAttribute("aria-label", label);
    }
    if (label && !node.getAttribute("title")) {
      node.setAttribute("title", label);
    }

    destination.appendChild(node);
    state.movedItems.push({
      key: key,
      node: node,
      placeholder: placeholder,
    });

    return true;
  }

  function createFallbackLink(item) {
    if (!item.fallbackHref) {
      return null;
    }

    var link = document.createElement("a");
    link.href = item.fallbackHref;
    link.textContent = item.label;
    link.title = item.label;
    link.setAttribute("aria-label", item.label);
    link.setAttribute("data-zhihu-web-toolkit-item", item.key);
    link.setAttribute("data-zhihu-web-toolkit-fallback", "true");
    return link;
  }

  function appendItem(header, destination, item) {
    var node = item.find(header);
    if (node && moveInto(node, destination, item.key, item.label)) {
      return;
    }

    var fallback = createFallbackLink(item);
    if (fallback) {
      destination.appendChild(fallback);
      state.missing.push(item.key + ":fallback");
      return;
    }

    state.missing.push(item.key);
  }

  function createHeaderShell() {
    var header = document.createElement("header");
    header.className = "zhihu-web-toolkit-header";
    header.setAttribute(HEADER_ATTR, "true");

    var inner = document.createElement("div");
    inner.className = "zhihu-web-toolkit-inner";

    var nav = document.createElement("nav");
    nav.className = "zhihu-web-toolkit-nav";
    nav.setAttribute("aria-label", "知乎主导航");

    var search = document.createElement("div");
    search.className = "zhihu-web-toolkit-search";

    var actions = document.createElement("div");
    actions.className = "zhihu-web-toolkit-actions";

    inner.appendChild(nav);
    inner.appendChild(search);
    inner.appendChild(actions);
    header.appendChild(inner);

    return {
      header: header,
      nav: nav,
      search: search,
      actions: actions,
    };
  }

  function moveExtraHeaderControls(originalHeader, destination) {
    var ruapjk =
      (originalHeader && originalHeader.querySelector(".css-ruapjk")) ||
      document.querySelector(".css-ruapjk");

    if (ruapjk) {
      moveInto(ruapjk, destination, "ruapjk", "顶部按钮");
    } else {
      state.missing.push("ruapjk");
    }
  }

  function injectStyle() {
    var oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle) {
      oldStyle.remove();
    }

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      HIDE_SELECTORS.concat(TOP_BANNER_SELECTORS).join(",\n") +
      " {\n" +
      "  display: none !important;\n" +
      "  visibility: hidden !important;\n" +
      "  pointer-events: none !important;\n" +
      "}\n" +
      "." +
      ORIGINAL_HIDDEN_CLASS +
      " {\n" +
      "  display: none !important;\n" +
      "}\n" +
      "header[" +
      HEADER_ATTR +
      "='true'],\n" +
      "html body .AppHeader,\n" +
      "html body header.AppHeader,\n" +
      "html body .AppHeader.is-fixed,\n" +
      "html body .AppHeader.Sticky,\n" +
      "html body .Sticky.AppHeader {\n" +
      "  position: static !important;\n" +
      "  top: auto !important;\n" +
      "  transform: none !important;\n" +
      "}\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] {\n" +
      "  width: 100% !important;\n" +
      "  z-index: auto !important;\n" +
      "  background: #fff !important;\n" +
      "  border-bottom: 1px solid #ebebeb !important;\n" +
      "  box-shadow: none !important;\n" +
      "}\n" +
      ".zhihu-web-toolkit-inner {\n" +
      "  box-sizing: border-box !important;\n" +
      "  min-height: 52px !important;\n" +
      "  max-width: 1120px !important;\n" +
      "  margin: 0 auto !important;\n" +
      "  padding: 0 16px !important;\n" +
      "  display: flex !important;\n" +
      "  align-items: center !important;\n" +
      "  gap: 14px !important;\n" +
      "}\n" +
      ".zhihu-web-toolkit-nav,\n" +
      ".zhihu-web-toolkit-actions {\n" +
      "  display: flex !important;\n" +
      "  align-items: center !important;\n" +
      "  gap: 8px !important;\n" +
      "  flex: 0 0 auto !important;\n" +
      "}\n" +
      ".zhihu-web-toolkit-search {\n" +
      "  display: flex !important;\n" +
      "  align-items: center !important;\n" +
      "  flex: 1 1 320px !important;\n" +
      "  min-width: 180px !important;\n" +
      "  max-width: 480px !important;\n" +
      "}\n" +
      ".zhihu-web-toolkit-search > *,\n" +
      ".zhihu-web-toolkit-search form,\n" +
      ".zhihu-web-toolkit-search .SearchBar {\n" +
      "  width: 100% !important;\n" +
      "  max-width: 100% !important;\n" +
      "}\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] a,\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] button,\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] [role='button'] {\n" +
      "  flex-shrink: 0 !important;\n" +
      "}\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] [data-zhihu-web-toolkit-fallback='true'] {\n" +
      "  color: #121212 !important;\n" +
      "  display: inline-flex !important;\n" +
      "  align-items: center !important;\n" +
      "  height: 32px !important;\n" +
      "  padding: 0 8px !important;\n" +
      "  text-decoration: none !important;\n" +
      "  font-size: 15px !important;\n" +
      "}\n" +
      "header[" +
      HEADER_ATTR +
      "='true'] .css-ruapjk {\n" +
      "  display: inline-flex !important;\n" +
      "  visibility: visible !important;\n" +
      "  pointer-events: auto !important;\n" +
      "  flex-shrink: 0 !important;\n" +
      "}\n" +
      "@media (max-width: 760px) {\n" +
      "  .zhihu-web-toolkit-inner {\n" +
      "    flex-wrap: wrap !important;\n" +
      "    padding: 8px 12px !important;\n" +
      "    gap: 8px !important;\n" +
      "  }\n" +
      "  .zhihu-web-toolkit-search {\n" +
      "    order: 3 !important;\n" +
      "    flex-basis: 100% !important;\n" +
      "    max-width: none !important;\n" +
      "  }\n" +
      "}\n";

    document.head.appendChild(style);
  }

  function clearFixedPosition(element) {
    if (!element || !element.style) {
      return;
    }

    element.style.setProperty("position", "static", "important");
    element.style.setProperty("top", "auto", "important");
    element.style.setProperty("transform", "none", "important");
  }

  function clearHeaderContainerPosition(element) {
    var parent = element && element.parentElement;
    if (!parent || parent === document.body || parent === document.documentElement) {
      return;
    }

    var style = getComputedStyle(parent);
    if (style.position === "fixed" || style.position === "sticky") {
      parent.setAttribute("data-zhihu-web-toolkit-container", "true");
      clearFixedPosition(parent);
    }
  }

  function apply() {
    if (state.applied) {
      destroy({ silent: true });
    }

    state.missing = [];

    if (!isZhihuHost()) {
      console.info("[zhihu-web-toolkit] Not a zhihu.com page. No changes applied.");
      return report();
    }

    var originalHeader = findOriginalHeader();
    if (!originalHeader) {
      console.warn("[zhihu-web-toolkit] No Zhihu header found. No changes applied.");
      return report();
    }

    var shell = createHeaderShell();
    var searchNode = findSearchControl(originalHeader);

    state.originalHeader = originalHeader;
    state.rebuiltHeader = shell.header;
    state.movedItems = [];

    HEADER_ITEMS.forEach(function (item) {
      appendItem(originalHeader, shell.nav, item);
    });

    if (searchNode) {
      moveInto(searchNode, shell.search, "search", "搜索");
    } else {
      state.missing.push("search");
    }

    ACTION_ITEMS.forEach(function (item) {
      appendItem(originalHeader, shell.actions, item);
    });

    moveExtraHeaderControls(originalHeader, shell.actions);

    injectStyle();

    originalHeader.classList.add(ORIGINAL_HIDDEN_CLASS);
    clearFixedPosition(originalHeader);
    clearFixedPosition(shell.header);

    if (originalHeader.parentNode) {
      originalHeader.parentNode.insertBefore(shell.header, originalHeader.nextSibling);
    } else {
      document.body.insertBefore(shell.header, document.body.firstChild);
    }

    clearHeaderContainerPosition(shell.header);

    state.applied = true;

    var currentReport = report();
    console.info("[zhihu-web-toolkit] Applied.", currentReport);
    return currentReport;
  }

  function destroy(options) {
    var silent = options && options.silent;

    for (var i = state.movedItems.length - 1; i >= 0; i -= 1) {
      var item = state.movedItems[i];
      var placeholder = item.placeholder;
      var node = item.node;

      if (node) {
        node.removeAttribute("data-zhihu-web-toolkit-item");
      }

      if (placeholder && placeholder.parentNode && node) {
        placeholder.parentNode.insertBefore(node, placeholder);
        placeholder.parentNode.removeChild(placeholder);
      } else if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.removeChild(placeholder);
      }
    }

    if (state.originalHeader) {
      state.originalHeader.classList.remove(ORIGINAL_HIDDEN_CLASS);
    }

    if (state.rebuiltHeader && state.rebuiltHeader.parentNode) {
      state.rebuiltHeader.parentNode.removeChild(state.rebuiltHeader);
    }

    var style = document.getElementById(STYLE_ID);
    if (style) {
      style.remove();
    }

    state.applied = false;
    state.originalHeader = null;
    state.rebuiltHeader = null;
    state.movedItems = [];
    state.missing = [];

    if (!silent) {
      console.info("[zhihu-web-toolkit] Destroyed.");
    }
  }

  function report() {
    return {
      active: state.applied,
      isZhihu: isZhihuHost(),
      url: location.href,
      headerFound: Boolean(state.originalHeader || findOriginalHeader()),
      rebuiltHeaderFound: Boolean(document.querySelector("header[" + HEADER_ATTR + "='true']")),
      hiddenTargets: HIDE_SELECTORS.map(function (selector) {
        return {
          selector: selector,
          count: document.querySelectorAll(selector).length,
          visibleCount: Array.prototype.slice
            .call(document.querySelectorAll(selector))
            .filter(function (element) {
              var style = getComputedStyle(element);
              return style.display !== "none" && style.visibility !== "hidden";
            }).length,
        };
      }),
      hiddenTopBanners: TOP_BANNER_SELECTORS.map(function (selector) {
        return {
          selector: selector,
          count: document.querySelectorAll(selector).length,
          visibleCount: Array.prototype.slice
            .call(document.querySelectorAll(selector))
            .filter(function (element) {
              var style = getComputedStyle(element);
              return style.display !== "none" && style.visibility !== "hidden";
            }).length,
        };
      }),
      keptItems: Array.prototype.slice
        .call(document.querySelectorAll("header[" + HEADER_ATTR + "='true'] [data-zhihu-web-toolkit-item]"))
        .map(function (element) {
          return {
            key: element.getAttribute("data-zhihu-web-toolkit-item"),
            text: readText(element),
            href: getHref(element),
          };
        }),
      missing: state.missing.slice(),
    };
  }

  window[GLOBAL_KEY] = {
    apply: apply,
    destroy: destroy,
    report: report,
  };

  apply();
})();
