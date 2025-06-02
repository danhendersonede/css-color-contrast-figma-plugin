export function clone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

// Source: https://css-tricks.com/converting-color-spaces-in-javascript/
export function RGBToHex(r: number, g: number, b: number) {
    // Convert 0-1 range to 0-255 if needed
    if (r <= 1 && g <= 1 && b <= 1) {
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
    }

    let rHex = r.toString(16);
    let gHex = g.toString(16);
    let bHex = b.toString(16);
  
    if (rHex.length == 1)
      rHex = "0" + rHex;
    if (gHex.length == 1)
      gHex = "0" + gHex;
    if (bHex.length == 1)
      bHex = "0" + bHex;
  
    return "#" + rHex + gHex + bHex;
}


function getLuminance(r: number, g: number, b: number): number {
const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
});
return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(color1: { r: number, g: number, b: number }, color2: { r: number, g: number, b: number }) {
if (!color1 || !color2) return null;

const l1 = getLuminance(color1.r, color1.g, color1.b);
const l2 = getLuminance(color2.r, color2.g, color2.b);

const lighter = Math.max(l1, l2);
const darker = Math.min(l1, l2);

return ((lighter + 0.05) / (darker + 0.05));
}