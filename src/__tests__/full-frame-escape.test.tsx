import { StrictMode, useState } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import * as SelectPrimitive from '@radix-ui/react-select';
import { FullFrame } from '@/components/layout/FullFrame';
import { Modal } from '@/components/layout/Modal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

afterEach(cleanup);
const escape = () => fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });

describe('FullFrame Escape', () => {
  it('calls the same callback as X, ignoring other keys and auto-repeat', () => {
    const onClose = vi.fn();
    render(<FullFrame onClose={onClose}><input aria-label="Field" /></FullFrame>);
    screen.getByRole('textbox').focus();
    fireEvent.keyDown(document.activeElement!, { key: 'Enter' });
    fireEvent.keyDown(document.activeElement!, { key: 'Escape', repeat: true });
    expect(onClose).not.toHaveBeenCalled();
    escape();
    expect(onClose).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: /close|fermer/i }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
  it('respects cancellation during Radix-style capture or React bubbling', () => {
    const onClose = vi.fn();
    render(<FullFrame onClose={onClose}><input aria-label="Field" onKeyDown={event => event.preventDefault()} /></FullFrame>);
    screen.getByRole('textbox').focus();
    escape();
    expect(onClose).not.toHaveBeenCalled();
    const cancel = (event: KeyboardEvent) => event.preventDefault();
    document.addEventListener('keydown', cancel, true);
    fireEvent.keyDown(document.body, { key: 'Escape' });
    document.removeEventListener('keydown', cancel, true);
    expect(onClose).not.toHaveBeenCalled();
  });
  it('protects an open Radix surface before its own Escape listener is installed', () => {
    const onClose = vi.fn();
    const { rerender } = render(<FullFrame onClose={onClose}><div role="menu" data-state="open">Opening menu</div></FullFrame>);
    escape();
    expect(onClose).not.toHaveBeenCalled();
    rerender(<FullFrame onClose={onClose}><div role="menu" data-state="closed">Closing animation</div></FullFrame>);
    escape();
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('supports disabling Escape dynamically and keeps the X functional', () => {
    const first = vi.fn(), current = vi.fn();
    const { rerender, unmount } = render(<FullFrame onClose={first} closeOnEscape={false}>Body</FullFrame>);
    escape();
    expect(first).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /close|fermer/i }));
    expect(first).toHaveBeenCalledOnce();
    rerender(<FullFrame onClose={current}>Body</FullFrame>);
    escape();
    expect(current).toHaveBeenCalledOnce();
    expect(first).toHaveBeenCalledOnce();
    unmount();
    escape();
    expect(current).toHaveBeenCalledOnce();
  });
  it('closes only the visually upper nested frame despite child-first effect registration', () => {
    const outer = vi.fn(), inner = vi.fn();
    render(<FullFrame onClose={outer}>Outer<FullFrame onClose={inner}>Inner</FullFrame></FullFrame>);
    escape();
    expect(inner).toHaveBeenCalledOnce();
    expect(outer).not.toHaveBeenCalled();
  });
  it.each([false, undefined])('does not fall through a disabled/non-closable upper frame (%s)', flag => {
    const lower = vi.fn(), upper = vi.fn();
    render(<><FullFrame onClose={lower}>Lower</FullFrame><FullFrame closeOnEscape={flag} onClose={flag === false ? upper : undefined}>Upper</FullFrame></>);
    escape();
    expect(lower).not.toHaveBeenCalled();
    expect(upper).not.toHaveBeenCalled();
  });
  it('follows sibling z-index before DOM order', () => {
    const first = vi.fn(), last = vi.fn();
    render(<><FullFrame className="first-frame" onClose={first}>First</FullFrame><FullFrame onClose={last}>Last</FullFrame></>);
    (document.querySelector('.first-frame') as HTMLElement).style.zIndex = '100';
    escape();
    expect(first).toHaveBeenCalledOnce();
    expect(last).not.toHaveBeenCalled();
  });
  it('closes one sibling per press and cleans up correctly in StrictMode', () => {
    const lower = vi.fn(), upper = vi.fn();
    function Stack() {
      const [open, setOpen] = useState(true);
      return <><FullFrame onClose={lower}>Lower</FullFrame>{open && <FullFrame onClose={() => { upper(); setOpen(false); }}>Upper</FullFrame>}</>;
    }
    render(<StrictMode><Stack /></StrictMode>);
    escape();
    expect(upper).toHaveBeenCalledOnce();
    expect(lower).not.toHaveBeenCalled();
    escape();
    expect(lower).toHaveBeenCalledOnce();
  });
});

function RadixOverlay({ kind, onClose }: { kind: 'modal' | 'menu' | 'select' | 'tooltip'; onClose: () => void }) {
  const [open, setOpen] = useState(true);
  return <FullFrame onClose={onClose}>
    <p>Wizard</p>
    {kind === 'modal' && <Modal isOpen={open} onClose={() => setOpen(false)} header={<span>Remplacer les données</span>} title="Remplacer les données"><p>Modal content</p></Modal>}
    {kind === 'menu' && <DropdownMenu open={open} onOpenChange={setOpen}><DropdownMenuTrigger>Menu</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Action</DropdownMenuItem></DropdownMenuContent></DropdownMenu>}
    {kind === 'select' && <SelectPrimitive.Root open={open} onOpenChange={setOpen}><SelectPrimitive.Trigger>Choisir</SelectPrimitive.Trigger><SelectPrimitive.Portal><SelectPrimitive.Content><SelectPrimitive.Viewport><SelectPrimitive.Item value="one"><SelectPrimitive.ItemText>Option</SelectPrimitive.ItemText></SelectPrimitive.Item></SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal></SelectPrimitive.Root>}
    {kind === 'tooltip' && <TooltipProvider><Tooltip open={open} onOpenChange={setOpen}><TooltipTrigger>Aide</TooltipTrigger><TooltipContent>Tooltip content</TooltipContent></Tooltip></TooltipProvider>}
    <output>{open ? 'overlay open' : 'overlay closed'}</output>
  </FullFrame>;
}

describe('Radix overlay above FullFrame', () => {
  it.each(['modal', 'menu', 'select', 'tooltip'] as const)('Escape closes %s alone, then closes the frame on the next press', async kind => {
    const onClose = vi.fn();
    render(<RadixOverlay kind={kind} onClose={onClose} />);
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
    escape();
    await waitFor(() => expect(screen.getByText('overlay closed')).toBeInTheDocument());
    expect(onClose).not.toHaveBeenCalled();
    escape();
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('does not close the wizard when the modal above disables Escape', () => {
    const onClose = vi.fn(), modalClose = vi.fn();
    render(<FullFrame onClose={onClose}><Modal isOpen closeOnEscape={false} onClose={modalClose} title="Confirm" header={<span>Confirm</span>}>Protected content</Modal></FullFrame>);
    escape();
    expect(modalClose).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
