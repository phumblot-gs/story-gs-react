import React from "react";
import type { CustomIconProps } from "./types";

/** Selection pictograms share the approved 24-unit geometry and inherit the surrounding text color. */
function SelectionSvg({ size = 12, strokeWidth = 1.2, children }: CustomIconProps & { children: React.ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">{children}</svg>;
}

function SelectionFrame() {
  return <rect x="3.5" y="3.5" width="17" height="17" rx=".8" strokeDasharray="3 3" />;
}

function OverlappingSelections() {
  return <><path d="M14 6.5V3.5H3.5V14H6.5" /><rect x="9.5" y="9.5" width="11" height="11" rx=".7" /></>;
}

export function CustomSelectionIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}><SelectionFrame /></SelectionSvg>;
}

export function CustomSelectionAddIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}><OverlappingSelections /><path d="M16.5 5h5M19 2.5v5" /></SelectionSvg>;
}

export function CustomSelectionSubtractIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}><OverlappingSelections /><path d="M16.5 5h5" /></SelectionSvg>;
}

export function CustomSelectionInvertIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}>
    <path d="M12 3.5H19.7Q20.5 3.5 20.5 4.3V19.7Q20.5 20.5 19.7 20.5H12V17A5 5 0 0 0 12 7Z" fill="currentColor" stroke="none" opacity=".2" />
    <path d="M12 7A5 5 0 0 0 12 17Z" fill="currentColor" stroke="none" opacity=".65" />
    <rect x="3.5" y="3.5" width="17" height="17" rx=".8" /><circle cx="12" cy="12" r="5" />
  </SelectionSvg>;
}

export function CustomSelectionDeleteIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}>
    <path d="M3.5 7V3.5H7M11 3.5h4M19 3.5h1.5V7M3.5 11v4M3.5 19v1.5H7M11 20.5h1" />
    <path d="M14.5 12.5h8M17 12.5v-2h3v2M15.5 12.5v9h6v-9M17.5 15.5v3.5M19.5 15.5v3.5" />
  </SelectionSvg>;
}

export function CustomSelectionDeselectIcon(props: CustomIconProps) {
  return <SelectionSvg {...props}><SelectionFrame /><path d="M2.5 21.5 21.5 2.5" /></SelectionSvg>;
}
