import { describe, expect, it, vi } from 'vitest';
import { getVisibleDropCenter, previewFileDrag, validateDroppedFiles } from '@/lib/file-drop';
const item = (type: string) => ({ kind: 'file', type });
const excel = { accept: '.xlsx,.xls', multiple: false };
const file = (name: string, type = '', size = 8) => new File([new Uint8Array(size)], name, { type });

describe('protected-mode drag preview', () => {
  it('recognises Excel without reading a payload', () => {
    const getAsFile = vi.fn(() => { throw new Error('Protected mode'); });
    const protectedItem = { ...item('application/vnd.ms-excel'), getAsFile };
    expect(previewFileDrag([protectedItem], excel).state).toBe('accepted');
    expect(getAsFile).not.toHaveBeenCalled();
  });
  it.each(['', 'application/octet-stream', 'application/zip'])('defers unavailable/generic type %s', type => {
    expect(previewFileDrag([item(type)], excel).state).toBe('unknown');
  });
  it('rejects a known incompatible format', () => {
    expect(previewFileDrag([item('application/pdf')], excel).state).toBe('rejected');
  });
  it('never promises compatibility for an unrecognised extension rule', () => {
    expect(previewFileDrag([item('application/pdf')], { accept: '.gs-custom' }).state).toBe('unknown');
  });
  it('defers when the browser hides the item list', () => expect(previewFileDrag([], excel).state).toBe('unknown'));
  it('rejects text, even when there is no file rule', () => expect(previewFileDrag([{ kind: 'string', type: 'text/plain' }]).state).toBe('rejected'));
  it('rejects two Excel files in the single-file zone', () => expect(previewFileDrag([item('application/vnd.ms-excel'), item('application/vnd.ms-excel')], excel).reason).toBe('count'));
  it('recognises a mixed image/PDF batch', () => expect(previewFileDrag([item('image/png'), item('application/pdf')], { accept: 'image/*' }).state).toBe('mixed'));
  it('keeps a partly unknown batch neutral', () => expect(previewFileDrag([item('image/png'), item('')], { accept: 'image/*' }).state).toBe('unknown'));
});
describe('post-drop eligibility', () => {
  it('checks the extension even if the hover MIME looked compatible', () => {
    expect(validateDroppedFiles([file('wrong.pdf', 'application/vnd.ms-excel')], excel).isValid).toBe(false);
  });
  it('accepts case-insensitive extensions without a MIME type', () => expect(validateDroppedFiles([file('CATALOGUE.XLSX')], excel).isValid).toBe(true));
  it('reports both eligible and rejected files, but rejects the complete batch', () => {
    const result = validateDroppedFiles([file('one.png'), file('bad.pdf')], { accept: '.png' });
    expect(result.isValid).toBe(false);
    expect(result.acceptedFiles.map(f => f.name)).toEqual(['one.png']);
    expect(result.rejections[0].code).toBe('format');
  });
  it('checks the tighter count constraint', () => expect(validateDroppedFiles([file('1.png'), file('2.png')], { multiple: false, maxFiles: 5 }).rejections[0].code).toBe('count'));
  it('checks size after drop, not during hover', () => {
    expect(previewFileDrag([item('image/png')], { maxSize: 1 }).state).toBe('accepted');
    expect(validateDroppedFiles([file('1.png')], { maxSize: 1 }).rejections[0].code).toBe('size');
  });
  it('accepts the size limit boundary', () => expect(validateDroppedFiles([file('1.png', '', 8)], { maxSize: 8 }).isValid).toBe(true));
  it('rejects empty files unless explicitly allowed', () => {
    expect(validateDroppedFiles([file('empty.xlsx', '', 0)], excel).rejections[0].code).toBe('empty');
    expect(validateDroppedFiles([file('empty.xlsx', '', 0)], { rejectEmpty: false }).isValid).toBe(true);
  });
  it('rejects an unreadable/empty drop', () => expect(validateDroppedFiles([]).rejections[0].code).toBe('unreadable'));
  it('supports MIME families and extension fallback', () => expect(validateDroppedFiles([file('one.png')], { accept: 'image/*' }).isValid).toBe(true));
  it('runs application checks after basic eligibility', () => expect(validateDroppedFiles([file('one.xlsx')], { ...excel, validateFile: () => 'Protected workbook' }).rejections[0].message).toBe('Protected workbook'));
});

describe('feedback placement in long lists', () => {
  it('keeps the message in the visible portion instead of below the viewport', () => {
    expect(getVisibleDropCenter({ top: 200, bottom: 4000 }, 800)).toBe(300);
    expect(getVisibleDropCenter({ top: -1000, bottom: 3000 }, 800)).toBe(1400);
  });
  it('centres short, fully visible zones', () => expect(getVisibleDropCenter({ top: 200, bottom: 400 }, 800)).toBe(100));
});
