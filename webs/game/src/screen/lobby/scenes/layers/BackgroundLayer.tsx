import { Assets, Container, Sprite } from "pixi.js";
import bgImage from "@tera/game/assets/images/lobby/bg.jpg";

export class BackgroundLayer extends Container {
  async init() {
    const texture = await Assets.load(bgImage);

    console.log(texture);
    const bg = new Sprite(texture);

    bg.width = window.innerWidth;
    bg.height = window.innerHeight;

    this.addChild(bg);
  }
}
