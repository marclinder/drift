import { Sprite, Texture } from 'pixi.js';
import { config } from '../config';
import { Mouse } from './Mouse';
import { clamp, speedToColor } from '../utils';

/**
 * Represents a single particle in the particle system.
 * @export
 * @class Particle
 */
export class Particle {
  private static texture: Texture;
  public sprite: Sprite;
  private vx = 0;
  private vy = 0;
  private age = 0;
  
  /**
   * Creates an instance of Particle.
   * @param {number} x
   * @param {number} y
   * @memberof Particle
   */
  constructor(private x: number, private y: number) {
    if(!Particle.texture) 
      Particle.texture = this.createParticleTexture();

    this.sprite = new Sprite(Particle.texture);
    this.sprite.blendMode = 'add'; // set blend mode to screen
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.anchor = {x:0, y:1}; // anchor to start of line
    this.sprite.rotation = 0;

    this.sprite.tint = speedToColor(this.x + this.y, 3000);
  }
  
  /**
   *
   * @param {number} noiseAngle
   * @param {number} mouseX
   * @param {number} mouseY
   * @memberof Particle
   */
  public update(noiseAngle: number) {
    this.vx = Math.cos(noiseAngle) * config.noiseStrength;
    this.vy = Math.sin(noiseAngle) * config.noiseStrength;

    this.sprite.x = this.x + this.vx;
    this.sprite.y = this.y + this.vy;

    let scale = Math.min(Math.abs(noiseAngle*.7), 1);
    const growScale = Math.min( this.age / 200, 1 );
    scale = clamp(scale * growScale, -1, 1);
   
    if(Mouse.down) {
      const dx = Mouse.x - this.sprite.x;
      const dy = Mouse.y - this.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const attraction = config.mouseAttraction / dist;
      
      scale = dist / 1000;
    }else {
      this.sprite.rotation = noiseAngle;
    }

    this.sprite.scale.set(scale); // ensure scale is never zero);
    this.age -= noiseAngle;

    const speed = Math.pow(noiseAngle, 1);
    this.sprite.tint = speedToColor(speed, 6);
  }

  /**
   * Creates a texture for the particle with gradient fill.
   *
   * @private
   * @return {*}  {Texture}
   * @memberof Particle
   */
  private createParticleTexture(): Texture {
    const width = 80;
    const height = 6;
    const radius = 30;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d')!;

    // Create gradient: transparent → semi → opaque
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 0)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 1)');

    ctx.fillStyle = gradient;

    // Draw rounded rect manually
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, radius);
    ctx.fill();
    return Texture.from(canvas);
  }

}
