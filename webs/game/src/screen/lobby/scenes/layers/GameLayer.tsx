import {
  Assets,
  Container,
} from "pixi.js";

import fishImage from "@tera/game/assets/images/game/fish.png";

import { GameCard } from "../entities/GameCard";

export class GameLayer extends Container {
  async init() {
    const texture = await Assets.load(fishImage);

    const fish = new GameCard(
      "Bắn Cá",
      texture
    );

    fish.x = 100;
    fish.y = 300;

    this.addChild(fish);
  }
}