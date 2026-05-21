import { Container } from "pixi.js";

export const hitTest = (a: Container, b: Container) => {
  const dx = a.x - b.x;

  const dy = a.y - b.y;

  const dist = Math.sqrt(dx * dx + dy * dy);

  return dist < 50;
};
