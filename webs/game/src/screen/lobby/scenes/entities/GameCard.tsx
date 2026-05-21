import {
  Container,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from "pixi.js";

export class GameCard extends Container {
  constructor(
    title: string,
    texture: Texture
  ) {
    super();

    const bg = new Graphics()
      .roundRect(0, 0, 260, 320, 30)
      .fill(0x101828);

    const image = new Sprite(texture);

    image.width = 240;
    image.height = 180;

    image.x = 10;
    image.y = 10;

    const text = new Text({
      text: title,
      style: new TextStyle({
        fill: "#ffffff",
        fontSize: 28,
        fontWeight: "bold",
      }),
    });

    text.x = 20;
    text.y = 220;

    this.addChild(bg, image, text);

    this.eventMode = "static";

    this.cursor = "pointer";

    this.on("pointertap", () => {
      console.log(title);
    });

    this.on("pointerover", () => {
      this.scale.set(1.05);
    });

    this.on("pointerout", () => {
      this.scale.set(1);
    });
  }
}