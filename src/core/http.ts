export async function requestText(url: string): Promise<string> {
  if (typeof GM_xmlhttpRequest === 'function') {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: (response) => resolve(String(response.responseText || response.response || '')),
        onerror: () => reject(new Error(`Failed to request ${url}`)),
        ontimeout: () => reject(new Error(`Timed out requesting ${url}`)),
      });
    });
  }

  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Failed to request ${url}: ${response.status}`);
  }

  return response.text();
}
