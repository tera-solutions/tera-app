import { IValue } from "./_interface";

export const convertElements = ({
  elements,
  targetElement,
  outputElement,
  callback,
}: IValue): any => {
  const element = elements?.querySelectorAll(targetElement);
  element.forEach((oldElement) => {
    const newElement = elements.createElement(outputElement ?? "div");
    for (let i = 0; i < oldElement?.attributes?.length; i++) {
      newElement.setAttribute(
        oldElement.attributes[i].name,
        oldElement.attributes[i].value,
      );
    }
    while (oldElement.firstChild) {
      newElement.appendChild(oldElement.firstChild);
    }
    callback && callback(newElement);
    oldElement.parentNode.replaceChild(newElement, oldElement);
    return elements;
  });
};

export const addFigureStyle = (element: any): void => {
  element.className =
    "image ck-widget ck-widget_with-resizer ck-widget_selected";
};

export const addAltImage = (elements: any) => {
  const elementFigures = elements?.querySelectorAll("figure");
  elementFigures.forEach((figure) => {
    const img = figure?.querySelector("img");
    const figcaption = figure?.querySelector("figcaption");
    const alt = figcaption?.innerHTML;
    img.alt = alt;
  });
};
