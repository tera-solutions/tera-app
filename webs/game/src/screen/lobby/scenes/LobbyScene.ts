import { Application, Container } from "pixi.js";

import { BackgroundLayer } from "./layers/BackgroundLayer";
import { GameLayer } from "./layers/GameLayer";
import { UILayer } from "./layers/UILayer";

export class LobbyScene {
  app!: Application;

  stage!: Container;

  backgroundLayer!: BackgroundLayer;

  gameLayer!: GameLayer;

  uiLayer!: UILayer;

  async init() {
    this.app = new Application();

    await this.app.init({
      resizeTo: window,
      background: "#09111f",
      antialias: true,
    });

    document.getElementById("lobby-game")?.appendChild(this.app.canvas);

    this.stage = this.app.stage;

    await this.initLayers();
  }

  async initLayers() {
    this.backgroundLayer = new BackgroundLayer();

    this.gameLayer = new GameLayer();

    this.stage.addChild(this.backgroundLayer, this.gameLayer);

    this.uiLayer = new UILayer();

    this.stage.addChild(this.uiLayer);

    await Promise.all([
      this.backgroundLayer.init(),
      this.gameLayer.init(),
      this.uiLayer.init(),
    ]);
  }

  destroy() {
    this.app.destroy(true, true);
  }
}
