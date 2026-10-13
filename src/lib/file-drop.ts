/** Browser-side eligibility only; applications must validate contents/server limits. */
export interface FileDropOptions {
  /** Native accept syntax: extensions, MIME types or MIME families, comma-separated. */
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  /** Bytes per file. Only checked after drop, never inferred during hover. */
  maxSize?: number;
  /** Reject zero-byte files. Defaults to true. */
  rejectEmpty?: boolean;
  /** Additional synchronous application checks, performed after drop. */
  validateFile?: (file: File) => string | undefined;
}
export type FileDropState = "idle" | "accepted" | "rejected" | "unknown" | "mixed";
export type FileDropRejectionCode = "format" | "count" | "size" | "empty" | "unreadable" | "custom";
export interface FileDropRejection { file: File | null; code: FileDropRejectionCode; message?: string }
export interface FileDropValidation { acceptedFiles: File[]; rejections: FileDropRejection[]; isValid: boolean }
export interface FileDragPreview { state: FileDropState; count?: number; reason?: "count" | "format" }

const MIME_BY_EXTENSION: Record<string, string> = {
  '.xls': 'application/vnd.ms-excel', '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.tif': 'image/tiff',
  '.tiff': 'image/tiff', '.webp': 'image/webp', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.avif': 'image/avif', '.bmp': 'image/bmp', '.pdf': 'application/pdf', '.csv': 'text/csv',
};
const tokens = (accept = '') => accept.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
const mimeMatches = (mime: string, token: string) => token === '*/*' || mime === token ||
  (token.endsWith('/*') && mime.startsWith(token.slice(0, -1)));
export const getFileDropLimit = (options: FileDropOptions = {}): number =>
  Math.min(options.multiple === false ? 1 : Infinity, options.maxFiles ?? Infinity);

/** Does not read files, filenames, sizes, entries or payloads in protected drag mode. */
export function previewFileDrag(
  items: readonly Pick<DataTransferItem, 'kind' | 'type'>[], options: FileDropOptions = {},
): FileDragPreview {
  const files = items.filter(i => i.kind === 'file');
  if (!files.length) return { state: items.length ? 'rejected' : 'unknown' };
  const count = files.length;
  if (count > getFileDropLimit(options)) return { state: 'rejected', count, reason: 'count' };
  const rules = tokens(options.accept);
  const matches = files.map(({ type }) => {
    const mime = type.toLowerCase();
    if (!mime || mime === 'application/octet-stream' || mime === 'application/zip') return 'unknown';
    if (!rules.length) return 'accepted';
    if (rules.some(t => mimeMatches(mime, t.startsWith('.') ? MIME_BY_EXTENSION[t] ?? '' : t))) return 'accepted';
    // Custom extensions cannot be inferred from MIME; defer until we have the name.
    if (rules.some(t => t.startsWith('.') && !MIME_BY_EXTENSION[t])) return 'unknown';
    return 'rejected';
  });
  if (matches.every(m => m === 'rejected')) return { state: 'rejected', count, reason: 'format' };
  if (matches.includes('rejected')) return { state: 'mixed', count, reason: 'format' };
  if (matches.includes('unknown')) return { state: 'unknown', count };
  return { state: 'accepted', count };
}

export function validateDroppedFiles(files: readonly File[], options: FileDropOptions = {}): FileDropValidation {
  const rejections: FileDropRejection[] = [];
  const acceptedFiles: File[] = [];
  if (!files.length) rejections.push({ file: null, code: 'unreadable' });
  if (files.length > getFileDropLimit(options)) {
    return { acceptedFiles: [], rejections: files.map(file => ({ file, code: 'count' as const })), isValid: false };
  }
  const rules = tokens(options.accept);
  for (const file of files) {
    const mime = file.type.toLowerCase();
    const extension = /\.[^.]+$/.exec(file.name.toLowerCase())?.[0] ?? '';
    const matches = !rules.length || rules.some(rule => rule.startsWith('.')
      ? file.name.toLowerCase().endsWith(rule)
      : mimeMatches(mime || MIME_BY_EXTENSION[extension] || '', rule));
    if (!matches) rejections.push({ file, code: 'format' });
    else if (options.maxSize !== undefined && file.size > options.maxSize) rejections.push({ file, code: 'size' });
    else if (options.rejectEmpty !== false && file.size === 0) rejections.push({ file, code: 'empty' });
    else {
      const message = options.validateFile?.(file);
      if (message) rejections.push({ file, code: 'custom', message });
      else acceptedFiles.push(file);
    }
  }
  return { acceptedFiles, rejections, isValid: rejections.length === 0 };
}

/** Centre of the visible portion, rather than the middle of a very long table. */
export function getVisibleDropCenter(rect: { top: number; bottom: number }, viewportHeight: number): number {
  const top = Math.max(0, rect.top);
  const bottom = Math.min(viewportHeight, rect.bottom);
  return bottom > top ? (top + bottom) / 2 - rect.top : (rect.bottom - rect.top) / 2;
}
