/**
 * Convert hex color to RGB format for CSS variables
 * @param hex - Hex color string (e.g., "#FFFFFF" or "FFFFFF")
 * @returns RGB string (e.g., "255 255 255") or original value if not a valid hex
 */
export function hexToRgb(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Check if it's a valid hex color
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    // Return original value if not a valid 6-digit hex
    return hex;
  }

  // Convert to RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `${r} ${g} ${b}`;
}

/**
 * Check if a value is a hex color
 * @param value - Value to check
 * @returns true if value is a hex color
 */
export function isHexColor(value: string): boolean {
  return /^#?[0-9A-Fa-f]{6}$/.test(value);
}

/**
 * Convert RGB string to hex color
 * @param rgb - RGB string (e.g., "255 255 255")
 * @returns Hex color string (e.g., "#FFFFFF")
 */
export function rgbToHex(rgb: string): string {
  const parts = rgb.split(' ').map(p => parseInt(p, 10));

  if (parts.length !== 3 || parts.some(isNaN)) {
    return rgb; // Return original if not valid RGB format
  }

  const [r, g, b] = parts;
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}