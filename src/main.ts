import * as dat from 'dat.gui';
import Stats from 'stats.js';
import { ParticleSystem } from './core/ParticleSystem';
import { config } from './config';

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const gui = new dat.GUI();
gui.add(config, 'noiseScale', 0.00001, 0.01, 0.00001);
gui.add(config, 'noiseStrength', 0.1, 5.0, 0.1);

const particleSystem = new ParticleSystem(stats);