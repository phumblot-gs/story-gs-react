
/**
 * Converts a hex color string to an HSL color
 * @param hex Color in hex format (e.g., "#FF0000")
 * @returns HSL color as [hue, saturation, lightness] (e.g., [0, 100, 50])
 */
export function hexToHSL(hex: string): [number, number, number] {
  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Parse hex to RGB
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  // Convert RGB to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }

  // Return HSL values in their standard ranges
  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100)
  ];
}

/**
 * Formats HSL values to a CSS HSL string
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * @returns CSS HSL string (e.g., "0 100% 50%")
 */
export function formatHSL(h: number, s: number, l: number): string {
  return `${h} ${s}% ${l}%`;
}

/**
 * Converts a hex color to a CSS HSL string for Tailwind CSS variables
 * @param hex Hex color string
 * @returns CSS HSL string
 */
export function hexToHSLString(hex: string | undefined): string | undefined {
  if (!hex) return undefined;
  try {
    const [h, s, l] = hexToHSL(hex);
    return formatHSL(h, s, l);
  } catch (e) {
    console.error("Error converting hex to HSL:", e);
    return undefined;
  }
}
