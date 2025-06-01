import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
// TODO - replace with pixi.js noise implmentation
/**
 * NoiseField class provides a method to generate noise-based angles for particles.
 *
 * @export
 * @class NoiseField
 */
export class NoiseField {
  private noise2D: NoiseFunction2D;
  
  /**
   * Creates an instance of NoiseField.
   * @memberof NoiseField
   */
  constructor() {
    this.noise2D = createNoise2D();
  }
  
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} scale
   * @return {*}  {number}
   * @memberof NoiseField
   */
  public getAngle(x: number, y: number, scale: number): number {
    const value = this.noise2D(x * scale, y * scale);
    return value * Math.PI * 2;
  }
}
