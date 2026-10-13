import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { FileDropZone } from '@/components/ui/file-drop-zone';
import { FileBrowser } from '@/components/ui/file-browser';
import { INTERNAL_DRAG_TYPE } from '@/lib/file-browser-drag';
const excel = { accept: '.xls,.xlsx', multiple: false };
const dt = (types: string[] = ['Files'], items: {kind: string; type: string}[] = [], files: File[] = []) => ({ types, items, files, dropEffect: 'none' });
const image = () => new File(['image'], 'one.png', { type: 'image/png' });
afterEach(cleanup);
const zone = () => document.querySelector('.gs-file-drop-zone')!;

describe('FileDropZone', () => {
  it('shows acceptance, rejection and unknown feedback without shifting its children', () => {
    render(<FileDropZone options={excel} onFilesDrop={vi.fn()} language="fr" />);
    const button = screen.getByRole('button');
    const transfer = dt(['Files'], [{ kind: 'file', type: 'application/vnd.ms-excel' }]);
    fireEvent.dragEnter(zone(), { dataTransfer: transfer });
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'accepted');
    const drag = new Event('dragover', { bubbles: true, cancelable: true });
    Object.defineProperty(drag, 'dataTransfer', { value: transfer });
    fireEvent(zone(), drag);
    expect(transfer.dropEffect).toBe('copy');
    fireEvent.dragOver(zone(), { dataTransfer: dt() });
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'unknown');
    const bad = dt(['Files'], [{ kind: 'file', type: 'application/pdf' }]);
    const invalidDrag = new Event('dragover', { bubbles: true, cancelable: true });
    Object.defineProperty(invalidDrag, 'dataTransfer', { value: bad });
    fireEvent(zone(), invalidDrag);
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'rejected');
    expect(bad.dropEffect).toBe('none');
    expect(screen.getByRole('button')).toBe(button);
  });
  it('does not flicker when entering and leaving a child, and clamps extra leaves', () => {
    render(<FileDropZone onFilesDrop={vi.fn()} />);
    fireEvent.dragLeave(zone(), { dataTransfer: dt() });
    fireEvent.dragEnter(zone(), { dataTransfer: dt() });
    fireEvent.dragEnter(screen.getByRole('button'), { dataTransfer: dt() });
    fireEvent.dragLeave(screen.getByRole('button'), { dataTransfer: dt() });
    expect(screen.getByRole('status')).toBeVisible();
    fireEvent.dragLeave(zone(), { dataTransfer: dt() });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
  it('clears the hover on Escape and window blur', () => {
    render(<FileDropZone onFilesDrop={vi.fn()} />);
    fireEvent.dragEnter(zone(), { dataTransfer: dt() });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.dragEnter(zone(), { dataTransfer: dt() });
    fireEvent.blur(window);
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('does not partially forward a mixed batch', () => {
    const onFilesDrop = vi.fn(), onDropRejected = vi.fn();
    render(<FileDropZone options={{ accept: '.png' }} onFilesDrop={onFilesDrop} onDropRejected={onDropRejected} />);
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image(), new File(['pdf'], 'bad.pdf')]) });
    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(onDropRejected).toHaveBeenCalledOnce();
    expect(screen.getByRole('alert')).toHaveTextContent('bad.pdf');
  });
  it('blocks unreadable items omitted from FileList', () => {
    const onFilesDrop = vi.fn();
    render(<FileDropZone onFilesDrop={onFilesDrop} />);
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [{ kind: 'file', type: '' }, { kind: 'file', type: 'image/png' }], [image()]) });
    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('uses the same checks for the picker and lets a file be selected again', () => {
    const onFilesDrop = vi.fn();
    render(<FileDropZone options={excel} onFilesDrop={onFilesDrop} />);
    const input = document.querySelector('input')!;
    const valid = new File(['excel'], 'catalogue.xlsx');
    fireEvent.change(input, { target: { files: [valid] } });
    fireEvent.change(input, { target: { files: [valid] } });
    expect(onFilesDrop).toHaveBeenCalledTimes(2);
  });
  it('handles pending uploads, duplicate deposits and errors', async () => {
    let reject!: (error: Error) => void;
    const onFilesDrop = vi.fn(() => new Promise<void>((_, no) => { reject = no; }));
    const onDropError = vi.fn();
    render(<FileDropZone onFilesDrop={onFilesDrop} onDropError={onDropError} />);
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image()]) });
    expect(screen.getByRole('button')).toBeDisabled();
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFilesDrop).toHaveBeenCalledOnce();
    await act(async () => reject(new Error('network')));
    expect(screen.getByRole('button')).not.toBeDisabled();
    expect(screen.getByRole('alert')).toBeVisible();
    expect(onDropError).toHaveBeenCalledOnce();
  });
  it('reports a throwing application validator without forwarding files', async () => {
    const onFilesDrop = vi.fn();
    render(<FileDropZone options={{ validateFile: () => { throw new Error('invalid'); } }} onFilesDrop={onFilesDrop} />);
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('blocks disabled zones and ignores internal row drags even if Files is also present', () => {
    const onFilesDrop = vi.fn();
    const { rerender } = render(<FileDropZone disabled onFilesDrop={onFilesDrop} />);
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFilesDrop).not.toHaveBeenCalled();
    rerender(<FileDropZone onFilesDrop={onFilesDrop} />);
    fireEvent.dragEnter(zone(), { dataTransfer: dt(['Files', INTERNAL_DRAG_TYPE]) });
    fireEvent.drop(zone(), { dataTransfer: dt(['Files', INTERNAL_DRAG_TYPE], [], [image()]) });
    expect(screen.queryByRole('status')).toBeNull();
    expect(onFilesDrop).not.toHaveBeenCalled();
  });
});
describe('FileBrowser external drop integration', () => {
  it('keeps feedback inside the table area and preserves navigation', () => {
    render(<FileBrowser files={[]} currentPath="/EXPORT GS" onFilesDrop={vi.fn()} fileDropOptions={{ accept: 'image/*' }} language="fr" />);
    const target = document.querySelector('[data-file-drop-target]')!;
    fireEvent.dragEnter(target, { dataTransfer: dt(['Files'], [{ kind: 'file', type: 'image/png' }]) });
    expect(target).toContainElement(screen.getByRole('status'));
    expect(screen.getByText('EXPORT GS', { selector: '[aria-current]' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Destination : EXPORT GS');
  });
  it('rejects invalid files before the legacy callback when options are supplied', () => {
    const onFileDrop = vi.fn();
    render(<FileBrowser files={[]} currentPath="/" onFileDrop={onFileDrop} fileDropOptions={excel} />);
    fireEvent.drop(document.querySelector('[data-file-drop-target]')!, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFileDrop).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('prefers onFilesDrop, so defining both callbacks cannot import twice', () => {
    const onFileDrop = vi.fn(), onFilesDrop = vi.fn();
    render(<FileBrowser files={[]} currentPath="/" onFileDrop={onFileDrop} onFilesDrop={onFilesDrop} />);
    fireEvent.drop(document.querySelector('[data-file-drop-target]')!, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFilesDrop).toHaveBeenCalledOnce();
    expect(onFileDrop).not.toHaveBeenCalled();
  });
  it('forwards the native event for legacy directory imports without enforcing new rules', () => {
    const onFileDrop = vi.fn();
    render(<FileBrowser files={[]} currentPath="/" onFileDrop={onFileDrop} />);
    const target = document.querySelector('[data-file-drop-target]')!;
    const transfer = dt(['Files'], [{ kind: 'file', type: '' }], []);
    const event = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', { value: transfer });
    fireEvent(target, event);
    expect(onFileDrop).toHaveBeenCalledOnce();
    expect(onFileDrop.mock.calls[0][0].nativeEvent).toBe(event);
    expect(onFileDrop.mock.calls[0][0].dataTransfer).toBe(transfer);
    expect(screen.queryByRole('alert')).toBeNull();
  });
  it('handles pending legacy imports and rejection within the list without duplicate callbacks', async () => {
    let reject!: (error: Error) => void;
    const onFileDrop = vi.fn(() => new Promise<void>((_, no) => { reject = no; }));
    const onFileDropError = vi.fn();
    render(<FileBrowser files={[]} currentPath="/" onFileDrop={onFileDrop} onFileDropError={onFileDropError} />);
    const target = document.querySelector('[data-file-drop-target]')!;
    fireEvent.drop(target, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(target).toHaveAttribute('aria-busy', 'true');
    expect(target).toContainElement(screen.getByRole('status'));
    fireEvent.drop(target, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFileDrop).toHaveBeenCalledOnce();
    await act(async () => reject(new Error('network')));
    expect(target).toContainElement(screen.getByRole('alert'));
    expect(onFileDropError).toHaveBeenCalledOnce();
    expect(target).toHaveAttribute('aria-busy', 'false');
  });
  it('keeps imports disabled without a handler and excludes the breadcrumb from the target', () => {
    const onFilesDrop = vi.fn();
    const { rerender } = render(<FileBrowser files={[]} currentPath="/EXPORT GS" language="fr" />);
    const target = document.querySelector('[data-file-drop-target]')!;
    fireEvent.dragEnter(target, { dataTransfer: dt() });
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<FileBrowser files={[]} currentPath="/EXPORT GS" language="fr" onFilesDrop={onFilesDrop} />);
    const breadcrumb = screen.getByText('EXPORT GS', { selector: '[aria-current]' });
    fireEvent.dragEnter(breadcrumb, { dataTransfer: dt() });
    fireEvent.drop(breadcrumb, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(onFilesDrop).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('clears stale feedback on folder navigation', async () => {
    const props = { files: [], onFilesDrop: vi.fn() };
    const { rerender } = render(<FileBrowser {...props} currentPath="/one" />);
    const table = document.querySelector('table');
    const focusTarget = document.querySelector('[tabindex="0"]') as HTMLElement;
    focusTarget.focus();
    fireEvent.dragEnter(document.querySelector('[data-file-drop-target]')!, { dataTransfer: dt() });
    rerender(<FileBrowser {...props} currentPath="/two" />);
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
    expect(document.querySelector('table')).toBe(table);
    expect(document.activeElement).toBe(focusTarget);
  });
});


describe('FileDropZone overlay', () => {
  it('preserves interactive children and does not render a standalone picker', () => {
    const click = vi.fn();
    render(<FileDropZone mode="overlay" onFilesDrop={vi.fn()}><button onClick={click}>Child action</button></FileDropZone>);
    const child = screen.getByRole('button', { name: 'Child action' });
    expect(document.querySelector('input[type="file"]')).toBeNull();
    expect(zone()).not.toHaveAttribute('data-bg');
    fireEvent.click(child);
    fireEvent.dragEnter(child, { dataTransfer: dt(['Files'], [{ kind: 'file', type: 'image/png' }]) });
    expect(screen.getByRole('status')).toHaveAttribute('data-state', 'accepted');
    fireEvent.dragLeave(child, { dataTransfer: dt() });
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByRole('button')).toBe(child);
    fireEvent.click(child);
    expect(click).toHaveBeenCalledTimes(2);
  });
  it('owns external drops through FileBrowser even when the child has import handlers', () => {
    const outer = vi.fn(), inner = vi.fn();
    render(<FileDropZone mode="overlay" options={{ accept: '.png' }} onFilesDrop={outer}>
      <FileBrowser files={[]} currentPath="/" onFilesDrop={inner} />
    </FileDropZone>);
    const target = document.querySelector('[data-file-drop-target]')!;
    fireEvent.dragEnter(target, { dataTransfer: dt(['Files'], [{ kind: 'file', type: 'image/png' }]) });
    expect(document.querySelectorAll('[data-file-drop-feedback]')).toHaveLength(1);
    fireEvent.drop(target, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(outer).toHaveBeenCalledOnce();
    expect(inner).not.toHaveBeenCalled();
    fireEvent.drop(target, { dataTransfer: dt(['Files'], [], [new File(['pdf'], 'bad.pdf')]) });
    expect(outer).toHaveBeenCalledOnce();
    expect(screen.getByRole('alert')).toBeVisible();
  });
  it('leaves internal row drags and normal child interactions alone when disabled', () => {
    const drag = vi.fn(), outer = vi.fn();
    const { rerender } = render(<FileDropZone mode="overlay" onFilesDrop={outer}><div data-testid="child" onDragOver={drag} /></FileDropZone>);
    fireEvent.dragOver(screen.getByTestId('child'), { dataTransfer: dt(['Files', INTERNAL_DRAG_TYPE]) });
    expect(drag).toHaveBeenCalledOnce();
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<FileDropZone mode="overlay" disabled onFilesDrop={outer}><button>Child action</button></FileDropZone>);
    expect(screen.getByRole('button')).not.toBeDisabled();
    fireEvent.drop(zone(), { dataTransfer: dt(['Files'], [], [image()]) });
    expect(outer).not.toHaveBeenCalled();
  });
  it('keeps processing and failure feedback out of content flow and prevents duplicate drops', async () => {
    let reject!: (error: Error) => void;
    const callback = vi.fn(() => new Promise<void>((_, no) => { reject = no; }));
    render(<FileDropZone mode="overlay" onFilesDrop={callback}><div data-testid="content">Existing table</div></FileDropZone>);
    const child = screen.getByTestId('content');
    fireEvent.drop(child, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(zone()).toHaveAttribute('aria-busy', 'true');
    expect(document.querySelector('.gs-file-drop-overlay-result')).toContainElement(screen.getByRole('status'));
    fireEvent.drop(child, { dataTransfer: dt(['Files'], [], [image()]) });
    expect(callback).toHaveBeenCalledOnce();
    await act(async () => reject(new Error('network')));
    expect(screen.getByTestId('content')).toBe(child);
    expect(document.querySelector('.gs-file-drop-overlay-result')).toContainElement(screen.getByRole('alert'));
    expect(zone()).toHaveAttribute('aria-busy', 'false');
  });
});
