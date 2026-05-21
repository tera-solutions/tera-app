import { Sprite, Texture } from "pixi.js";

export class Fish extends Sprite {
  speed = 2;

  constructor(texture: Texture) {
    super(texture);

    this.anchor.set(0.5);
  }

  update(delta: number) {
    this.x += this.speed * delta;

    if (this.x > window.innerWidth + 100) {
      this.destroy();
    }
  }
}