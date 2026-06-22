export const WORD_BLOCK_STORAGE_KEY = "zhihu_web_toolkit_word_block_keywords";

export function loadWordBlockKeywords(): string[] {
  try {
    const saved = window.localStorage.getItem(WORD_BLOCK_STORAGE_KEY);
    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return uniqueKeywords(parsed.filter((item): item is string => typeof item === "string"));
  } catch (error) {
    console.warn("[zhihu-web-toolkit] Failed to load word block keywords.", error);
    return [];
  }
}

export function saveWordBlockKeywords(keywords: readonly string[]): void {
  window.localStorage.setItem(WORD_BLOCK_STORAGE_KEY, JSON.stringify(uniqueKeywords(keywords)));
}

export function parseKeywordInput(input: string, existing: readonly string[] = []): string[] {
  const known = new Set(existing);

  return input
    .split(/[,，/]/)
    .map((word) => normalizeKeyword(word))
    .filter((word) => word.length > 0 && !known.has(word))
    .filter((word, index, words) => words.indexOf(word) === index);
}

function uniqueKeywords(keywords: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const keyword of keywords) {
    const normalized = normalizeKeyword(keyword);
    if (!normalized || seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    result.push(normalized);
  }

  return result;
}

function normalizeKeyword(keyword: string): string {
  return keyword.replace(/\s+/g, "").trim();
}
