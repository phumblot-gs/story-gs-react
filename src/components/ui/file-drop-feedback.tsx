import { CirclePlus, CircleX, CircleHelp, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslationSafe } from '@/contexts/TranslationContext';
import type { TranslationMap } from '@/utils/translations';
import { getFileDropLimit, type FileDropOptions, type FileDragPreview, type FileDropValidation } from '@/lib/file-drop';
import { Spinner } from './spinner';

export interface FileDropFeedbackProps {
  preview: FileDragPreview;
  options?: FileDropOptions;
  destination?: string;
  className?: string;
  language?: string;
  translations?: Partial<TranslationMap>;
}
export function FileDropFeedback({ preview, options, destination, className, language, translations }: FileDropFeedbackProps) {
  const { t } = useTranslationSafe(translations, language);
  if (preview.state === 'idle') return null;
  const Icon = { accepted: CirclePlus, rejected: CircleX, unknown: CircleHelp, mixed: TriangleAlert }[preview.state];
  const detail = preview.reason === 'count' ? t('fileDrop.count', { limit: getFileDropLimit(options) })
    : preview.reason === 'format' && options?.accept ? t('fileDrop.formats', { accept: options.accept })
    : t('fileDrop.checkAfterDrop');
  return (
    <div data-file-drop-feedback data-state={preview.state} className={cn('gs-file-drop-feedback', className)} role="status" aria-live="polite" aria-atomic="true">
      <div className="gs-file-drop-content">
      <Icon size={24} aria-hidden="true" />
      <span className="font-medium text-base">{t(`fileDrop.${preview.state}`)}</span>
      <span className="text-sm">{detail}</span>
      {destination && <span className="text-sm">{t('fileDrop.destination', { destination })}</span>}
      </div>
    </div>
  );
}

export interface FileDropResultProps extends Pick<FileDropFeedbackProps, 'options' | 'language' | 'translations'> {
  validation: FileDropValidation | null;
  busy: boolean;
  failed: boolean;
}
export function FileDropResult({ validation, busy, failed, options, language, translations }: FileDropResultProps) {
  const { t } = useTranslationSafe(translations, language);
  if (busy) return <div className="flex items-center gap-2 p-3 text-sm" role="status"><Spinner decorative />{t('fileDrop.busy')}</div>;
  if (failed) return <div className="p-3 text-sm text-red-strong" role="alert">{t('fileDrop.failed')}</div>;
  if (!validation || validation.isValid) return null;
  const first = validation.rejections[0];
  const name = first.file?.name ?? '';
  const message = first.code === 'custom' ? first.message : first.code === 'count'
    ? t('fileDrop.count', { limit: getFileDropLimit(options) }) : first.code === 'unreadable'
    ? t('fileDrop.unreadable') : t(`fileDrop.${first.code}Error`, { name, limit: options?.maxSize ?? '' });
  return <div className="flex items-start gap-2 p-3 text-sm text-red-strong" role="alert"><CircleX size={16} className="shrink-0 mt-0.5" aria-hidden="true" /><span>{message} {t('fileDrop.noPartial')}</span></div>;
}
