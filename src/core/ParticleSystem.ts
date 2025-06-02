import {
  Application,
  Container,
  ParticleContainerOptions
} from 'pixi.js';
import { config } from '../config';
import { NoiseField } from './NoiseField';
import { Particle } from './Particle';

/**
 * ParticleSystem class manages a system of particles, rendering them using PixiJS.
 *
 * @export
 * @class ParticleSystem
 */
export class ParticleSystem {
  private app: Application;
  private particleContainer: Container;
  private noise = new NoiseField();
  private particles: Particle[] = [];
  private emitterAngle = 0;

  
  /**
   * Creates an instance of ParticleSystem.
   * @param {Stats} stats
   * @memberof ParticleSystem
   */
  constructor(private stats: Stats) {
    this.app = new Application();

    const particlesConfig: ParticleContainerOptions = {
      dynamicProperties: {
        position: true,
        scale: true,
        rotation: true,
        color: true
      }
    }

    this.particleContainer = new Container(particlesConfig);
    this.init();
  }

  /**
   * Initializes the particle system.
   *
   * @memberof ParticleSystem
   */
  private async init() {
    await this.app.init({
      resizeTo: window,
      antialias: true,
    });
    this.app.stage.addChild(this.particleContainer);
    this.app.ticker.add(this.update.bind(this));
    document.body.appendChild(this.app.canvas);
    this.initGrid();
  }

  /**
   * Initializes a grid of particles.
   *
   * @private
   * @memberof ParticleSystem
   */
  private initGrid() {
    const maxParticles = 10000 - this.particles.length;
    const cols = Math.ceil(Math.sqrt(maxParticles));
    const rows = Math.ceil(maxParticles / cols);
    const spacing = config.particleSpacing;
    const startX = (this.app.screen.width - cols * spacing) / 2;
    const startY = (this.app.screen.height - rows * spacing) / 2;
    for (let i = 0; i < maxParticles; i++) {
      const x = startX + (i % cols) * spacing;
      const y = startY + Math.floor(i / cols) * spacing;
      const p = new Particle(x, y);
      this.addParticle(p);
    }
  }
  
  /**
   * Adds a particle to the system.
   *
   * @private
   * @param {Particle} particle
   * @memberof ParticleSystem
   */
  private addParticle(particle: Particle) {
    this.particles.push(particle);
    this.particleContainer.addChild(particle.sprite);
  }

  /**
   * Removes a particle from the system.
   *
   * @private
   * @param {Particle} particle
   * @memberof ParticleSystem
   */
  private removeParticle(particle: Particle) {
    this.particleContainer.removeChild(particle.sprite);
    this.particles.splice(this.particles.indexOf(particle), 1);
  }
  
  /**
   *  Updates the particle system.
   *
   * @memberof ParticleSystem
   */
  private update() {
    this.stats.begin();
    for (const p of this.particles) {
      const angle = this.noise.getAngle(p.sprite.x + this.emitterAngle, p.sprite.y + this.emitterAngle, config.noiseScale);
      p.update(angle);
    }
    // this.emitterAngle += 1; // tweak this to change rotation speed
    this.emitterAngle += config.noiseStrength; // tweak this to change rotation speed
    this.stats.end();
  }

}
