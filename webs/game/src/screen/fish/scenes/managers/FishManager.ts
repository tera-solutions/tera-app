import {
  Container,
  Texture,
} from "pixi.js";

import { Fish } from "../entities/Fish";

export class FishManager {
  container: Container;

  fishes: Fish[] = [];

  spawnTimer = 0;

  constructor(container: Container) {
    this.container = container;
  }

  update(delta: number) {
    this.spawnTimer += delta;

    if (this.spawnTimer > 60) {
      this.spawnFish();

      this.spawnTimer = 0;
    }

    this.fishes.forEach((fish) => {
      fish.update(delta);
    });
  }

  spawnFish() {
    const fish = new Fish(Texture.WHITE);

    fish.width = 80;
    fish.height = 40;

    fish.tint = 0x00ffff;

    fish.x = -100;
    fish.y = Math.random() * window.innerHeight;

    this.container.addChild(fish);

    this.fishes.push(fish);
  }
}