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