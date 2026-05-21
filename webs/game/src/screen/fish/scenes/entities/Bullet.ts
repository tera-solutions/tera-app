import { Graphics } from "pixi.js";

export class Bullet extends Graphics {
  speed = 10;

  vx = 0;

  vy = 0;

  constructor(
    x: number,
    y: number,
    angle: number
  ) {
    super();

    this.beginFill(0xffff00);

    this.drawCircle(0, 0, 8);

    this.endFill();

    this.x = x;
    this.y = y;

    this.vx = Math.cos(angle) * this.speed;

    this.vy = Math.sin(angle) * this.speed;
  }

  update(delta: number) {
    this.x += this.vx * delta;

    this.y += this.vy * delta;
  }
}