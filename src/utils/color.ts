import { ColorContrastData } from "../types/nodes";

// Source: https://css-tricks.com/converting-color-spaces-in-javascript/
export function RGBToHex(color: RGB) {
    let r = color.r;
    let g = color.g;
    let b = color.b;

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

function getLuminance(color: RGB): number {
    const normalizedColor = {
        r: color.r > 1 ? color.r / 255 : color.r,
        g: color.g > 1 ? color.g / 255 : color.g,
        b: color.b > 1 ? color.b / 255 : color.b
    };

    const [rs, gs, bs] = [normalizedColor.r, normalizedColor.g, normalizedColor.b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(color1: RGB, color2: RGB) {
if (!color1 || !color2) return null;

const l1 = getLuminance(color1);
const l2 = getLuminance(color2);

const lighter = Math.max(l1, l2);
const darker = Math.min(l1, l2);

return ((lighter + 0.05) / (darker + 0.05));
}

export function getColorContrastData(color: RGB) {
    const colorContrastData: ColorContrastData = {
        white: calculateContrastRatio(color, { r: 255, g: 255, b: 255 }),
        black: calculateContrastRatio(color, { r: 0, g: 0, b: 0 })
    };

    return colorContrastData;
}

export function getBestContrastColor(colorContrastData: ColorContrastData): RGB {
  if (colorContrastData.white && colorContrastData.black && colorContrastData.white > colorContrastData.black) {
    return { r: 1, g: 1, b: 1 };
  } else {
    return { r: 0, g: 0, b: 0 };
  }
}