/** Builds a CSV and downloads it, with formula injection neutralised. */
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const cell = (value: string | number) => {
    const text = String(value);
    const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const csv = rows.map((row) => row.map(cell).join(",")).join("\r\n");
  saveBlobUrl(
    URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" })),
    filename,
  );
}

function saveBlobUrl(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}

/** Saves an element as a PNG at twice its size. Loads the library on demand. */
export async function downloadElementPng(
  element: HTMLElement,
  filename: string,
) {
  const { domToPng } = await import("modern-screenshot");
  saveBlobUrl(await domToPng(element, { scale: 2 }), filename);
}

/** True if the text reached the clipboard. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Opens the device share sheet; false where the browser has none. */
export async function shareText(title: string, text: string) {
  if (!navigator.share) return false;
  try {
    await navigator.share({ title, text });
  } catch {
    // Closing the share sheet isn't a failure worth reporting.
  }
  return true;
}
