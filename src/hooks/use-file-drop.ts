import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { INTERNAL_DRAG_TYPE, isExternalFileDrag } from '@/lib/file-browser-drag';
import { getVisibleDropCenter, previewFileDrag, validateDroppedFiles, type FileDropOptions, type FileDragPreview, type FileDropValidation } from '@/lib/file-drop';

interface UseFileDropOptions {
  options?: FileDropOptions;
  disabled?: boolean;
  /** Preserve event-based directory imports in legacy FileBrowser integrations. */
  validateDrop?: boolean;
  resetKey?: unknown;
  onFilesDrop?: (files: File[], event?: React.DragEvent<HTMLDivElement>) => void | Promise<void>;
  onRejected?: (validation: FileDropValidation) => void;
  onError?: (error: unknown) => void;
}

export function useFileDrop({ options, disabled = false, validateDrop = true, resetKey,
  onFilesDrop, onRejected, onError }: UseFileDropOptions) {
  const [preview, setPreview] = useState<FileDragPreview>({ state: 'idle' });
  const [validation, setValidation] = useState<FileDropValidation | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const counter = useRef(0);
  const pending = useRef(false);
  const generation = useRef(0);
  const resetHover = useCallback(() => { counter.current = 0; setPreview({ state: 'idle' }); }, []);
  const reset = useCallback(() => {
    generation.current++;
    pending.current = false;
    resetHover(); setValidation(null); setBusy(false); setFailed(false);
  }, [resetHover]);
  useEffect(() => { reset(); }, [resetKey, disabled, reset]);
  useEffect(() => () => { generation.current++; }, []);
  useEffect(() => {
    if (preview.state === 'idle') return;
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') resetHover(); };
    window.addEventListener('dragend', resetHover);
    window.addEventListener('blur', resetHover);
    window.addEventListener('keydown', escape);
    return () => {
      window.removeEventListener('dragend', resetHover);
      window.removeEventListener('blur', resetHover);
      window.removeEventListener('keydown', escape);
    };
  }, [preview.state, resetHover]);

  const external = (e: React.DragEvent<HTMLDivElement>) =>
    isExternalFileDrag(e.dataTransfer?.types) && !Array.from(e.dataTransfer?.types ?? []).includes(INTERNAL_DRAG_TYPE);
  const updatePreview = (e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--gs-file-drop-content-top', `${getVisibleDropCenter(rect, window.innerHeight)}px`);
    const next = previewFileDrag(Array.from(e.dataTransfer.items ?? []), options);
    setPreview(prev => prev.state === next.state && prev.count === next.count && prev.reason === next.reason ? prev : next);
    return next;
  };
  const submit = async (files: File[], event?: React.DragEvent<HTMLDivElement>) => {
    if (disabled || pending.current) return;
    resetHover(); setFailed(false);
    let result: FileDropValidation;
    try {
      result = validateDrop ? validateDroppedFiles(files, options)
        : { acceptedFiles: files, rejections: [], isValid: true };
    } catch (error) { setFailed(true); onError?.(error); return; }
    // Some browsers exclude directories/unreadable items from FileList. Do not silently import the remainder.
    const advertisedCount = event ? Array.from(event.dataTransfer.items ?? []).filter(i => i.kind === 'file').length : 0;
    if (validateDrop && advertisedCount > files.length) {
      result.rejections.push({ file: null, code: 'unreadable' }); result.isValid = false;
    }
    setValidation(result);
    if (!result.isValid) { onRejected?.(result); return; }
    if (!onFilesDrop) return;
    pending.current = true;
    let waiting = false;
    const request = generation.current;
    try {
      // For picker selection, the consumer only needs files, not a synthetic drag event.
      const work = onFilesDrop(files, event);
      if (work && typeof work.then === 'function') { waiting = true; setBusy(true); await work; }
    } catch (error) {
      if (request === generation.current) { setFailed(true); onError?.(error); }
    } finally {
      if (request === generation.current) { pending.current = false; if (waiting) setBusy(false); }
    }
  };
  const handlers = {
    onDragEnter: (e: React.DragEvent<HTMLDivElement>) => {
      if (!external(e)) return;
      e.preventDefault(); e.stopPropagation();
      if (disabled || pending.current) return;
      counter.current++; setValidation(null); setFailed(false); updatePreview(e);
    },
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      if (!external(e)) return;
      e.preventDefault(); e.stopPropagation();
      if (disabled || pending.current) { e.dataTransfer.dropEffect = 'none'; return; }
      const next = updatePreview(e);
      e.dataTransfer.dropEffect = next.state === 'rejected' ? 'none' : 'copy';
    },
    onDragLeave: (e: React.DragEvent<HTMLDivElement>) => {
      if (!external(e)) return;
      e.preventDefault(); e.stopPropagation();
      counter.current = Math.max(0, counter.current - 1);
      if (counter.current === 0) resetHover();
    },
    onDrop: (e: React.DragEvent<HTMLDivElement>) => {
      if (!external(e)) return;
      e.preventDefault(); e.stopPropagation();
      void submit(Array.from(e.dataTransfer.files ?? []), e);
    },
  };
  return { preview, validation, busy, failed, handlers, reset, submit };
}
