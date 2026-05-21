import { Graphics } from "pixi.js";

export class Cannon extends Graphics {
  constructor() {
    super();

    this.drawRect(-20, -50, 40, 100);

    this.endFill();

    this.x = window.innerWidth / 2;
    this.y = window.innerHeight - 80;
  }

  rotateTo(targetX: number, targetY: number) {
    const angle = Math.atan2(
      targetY - this.y,
      targetX - this.x
    );

    this.rotation = angle + Math.PI / 2;
  }
}