import React, { useId, useMemo, useRef } from 'react';
import { FileUp, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, type ButtonVariant, type ButtonSize } from './button';
import { BgProvider } from '@/components/layout/BgContext';
import { FileDropFeedback, FileDropResult } from './file-drop-feedback';
import { useFileDrop } from '@/hooks/use-file-drop';
import { useTranslationSafe } from '@/contexts/TranslationContext';
import type { TranslationMap } from '@/utils/translations';
import type { FileDropOptions, FileDropValidation } from '@/lib/file-drop';

export interface FileDropZoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'onDragEnter' | 'onDragOver' | 'onDragLeave' | 'onDropCapture' | 'onDragEnterCapture' | 'onDragOverCapture' | 'onDragLeaveCapture'> {
  /** Overlay preserves the child surface and reveals feedback only during external file drags. */
  mode?: 'standalone' | 'overlay';
  options?: FileDropOptions;
  disabled?: boolean;
  /** Clear transient drop state when the destination changes, without remounting children. */
  resetKey?: unknown;
  /** Defaults to true. Disable only for legacy event-based imports that handle directories themselves. */
  validateDrop?: boolean;
  label?: string;
  description?: string;
  /** Label of the file-picker button and its accessible input. */
  chooseButtonLabel?: string;
  /** GS Button variant. Defaults to normal. */
  chooseButtonVariant?: ButtonVariant;
  /** GS Button size. Defaults to medium. */
  chooseButtonSize?: ButtonSize;
  destination?: string;
  language?: string;
  translations?: Partial<TranslationMap>;
  /** Receives eligible batches by default. The optional event is available for native drops, not picker selection. */
  onFilesDrop: (files: File[], event?: React.DragEvent<HTMLDivElement>) => void | Promise<void>;
  onDropRejected?: (validation: FileDropValidation) => void;
  onDropError?: (error: unknown) => void;
}
export function FileDropZone({ mode = 'standalone', options, disabled, resetKey, validateDrop = true, label, description, chooseButtonLabel, chooseButtonVariant = 'normal', chooseButtonSize = 'medium', destination, language, translations,
  onFilesDrop, onDropRejected, onDropError, children, className, ...props }: FileDropZoneProps) {
  const { t } = useTranslationSafe(translations, language);
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const dropResetKey = useMemo(() => ({ mode, destinationKey: resetKey }), [mode, resetKey]);
  const drop = useFileDrop({ options, disabled, validateDrop, resetKey: dropResetKey, onFilesDrop, onRejected: onDropRejected, onError: onDropError });
  const overlay = mode === 'overlay';
  // Capture gives the wrapper ownership of external files even when a child
  // has its own drop handlers. Internal row drags pass through unchanged.
  const handlers = overlay ? {
    onDragEnterCapture: drop.handlers.onDragEnter,
    onDragOverCapture: drop.handlers.onDragOver,
    onDragLeaveCapture: drop.handlers.onDragLeave,
    onDropCapture: drop.handlers.onDrop,
  } : drop.handlers;
  const result = <FileDropResult {...drop} options={options} language={language} translations={translations} />;
  const surface = (
    <div {...props} data-bg={overlay ? undefined : "white"} data-mode={mode} className={cn('gs-file-drop-zone', className)} {...handlers} data-disabled={disabled || undefined} aria-disabled={!overlay && disabled || undefined} aria-busy={drop.busy}>
      {overlay ? <>
        {children}
        <FileDropFeedback preview={drop.preview} options={options} destination={destination} language={language} translations={translations} />
        {(drop.busy || drop.failed || (drop.validation && !drop.validation.isValid)) && <div className="gs-file-drop-overlay-result">{result}</div>}
      </> : <>
        <div className="relative min-h-[220px]">
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
            {children ?? <><FileUp size={24} aria-hidden="true" /><span className="font-medium">{label ?? t('fileDrop.prompt')}</span></>}
            <Button type="button" variant={chooseButtonVariant} size={chooseButtonSize} disabled={disabled || drop.busy} onClick={() => { if (input.current) { input.current.value = ''; input.current.click(); } }} aria-describedby={description || options?.accept ? id : undefined}>
              <Plus size={16} aria-hidden="true" />{chooseButtonLabel ?? t('fileDrop.choose')}
            </Button>
            {(description || options?.accept) && <span id={id} className="text-sm text-grey-strongest">{description ?? t('fileDrop.formats', { accept: options?.accept ?? '' })}</span>}
          </div>
          <FileDropFeedback preview={drop.preview} options={options} destination={destination} language={language} translations={translations} />
        </div>
        <input ref={input} type="file" accept={options?.accept} multiple={options?.multiple !== false && options?.maxFiles !== 1} disabled={disabled || drop.busy} hidden aria-label={chooseButtonLabel ?? t('fileDrop.choose')} onChange={e => { const files = Array.from(e.target.files ?? []); if (files.length) void drop.submit(files); }} />
        {result}
      </>}
    </div>
  );
  return overlay ? surface : <BgProvider value="white">{surface}</BgProvider>;
}
