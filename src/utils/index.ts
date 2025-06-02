/**
 * Maps a speed value to a color in the HSL spectrum.
 *
 * @export
 * @param {number} speed
 * @param {number} [maxSpeed=10]
 * @return {*}  {number}
 */
export function speedToColor(speed: number, maxSpeed = 10): number {
  const normalized = Math.min(speed / maxSpeed, 1);
  const hue = Math.floor((1 - normalized) * 240); // 240 = blue, 0 = red
  return hslToHex(hue, 100, 50);
}

/**
 * Converts HSL (Hue, Saturation, Lightness) values to a 24-bit hexadecimal color integer.
 *
 * @param {number} h
 * @param {number} s
 * @param {number} l
 * @return {*}  {number}
 */
function hslToHex(h: number, s: number, l: number): number {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return rgbToHexInt(r, g, b);
}

/**
 * Converts normalized RGB values (range 0–1) to a single 24-bit hexadecimal color integer.
 *
 * @param r - Red component (0 to 1)
 * @param g - Green component (0 to 1)
 * @param b - Blue component (0 to 1)
 * @returns A 24-bit color integer (e.g. 0xff0000 for red)
 */
function rgbToHexInt(r: number, g: number, b: number): number {
  // Convert each component from 0–1 range to 0–255 and round
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  // Shift red by 16 bits, green by 8 bits, and combine with blue
  return (red << 16) + (green << 8) + blue;
}

/**
 * Clamps a number between a minimum and maximum value.
 *
 * @param value - The number to clamp
 * @param min - The lower bound
 * @param max - The upper bound
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}