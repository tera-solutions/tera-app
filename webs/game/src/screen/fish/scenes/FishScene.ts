import { Application, Container, Ticker  } from "pixi.js";

import { FishManager } from "./managers/FishManager";

export class FishScene {
  app!: Application;

  stage!: Container;

  fishManager!: FishManager;

  async init() {
    this.app = new Application();

    await this.app.init({
      resizeTo: window,
      background: "#001b2e",
      antialias: true,
    });

    document.getElementById("fish-game")?.appendChild(this.app.canvas);

    this.stage = this.app.stage;

    this.initManagers();

    this.start();
  }

  initManagers() {
    this.fishManager = new FishManager(this.stage);
  }

  start() {
    this.app.ticker.add(this.update);
  }

  update = (ticker: Ticker) => {
    const delta = ticker.deltaTime;

    this.fishManager.update(delta);
  };

  destroy() {
    this.app.ticker.remove(this.update);

    this.app.destroy(true, true);
  }
}
