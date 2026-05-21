import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class UILayer extends Container {
  init() {
    this.createLoginButton();

    this.createWalletButton();
  }

  createLoginButton() {
    const button = new Container();

    const bg = new Graphics().roundRect(0, 0, 140, 50, 20).fill(0x06b6d4);

    const text = new Text({
      text: "LOGIN",
      style: new TextStyle({
        fill: "#000000",
        fontSize: 20,
        fontWeight: "bold",
      }),
    });

    text.anchor.set(0.5);

    text.x = 70;
    text.y = 25;

    button.addChild(bg, text);

    button.x = window.innerWidth - 320;
    button.y = 40;

    button.eventMode = "static";

    button.cursor = "pointer";

    button.on("pointertap", () => {
      window.dispatchEvent(new CustomEvent("open-auth"));
    });

    this.addChild(button);
  }

  createWalletButton() {
    const button = new Container();

    const bg = new Graphics().roundRect(0, 0, 140, 50, 20).fill(0xfacc15);

    const text = new Text({
      text: "WALLET",
      style: new TextStyle({
        fill: "#000000",
        fontSize: 20,
        fontWeight: "bold",
      }),
    });

    text.anchor.set(0.5);

    text.x = 70;
    text.y = 25;

    button.addChild(bg, text);

    button.x = window.innerWidth - 160;
    button.y = 40;

    button.eventMode = "static";

    button.cursor = "pointer";

    this.addChild(button);
  }
}
