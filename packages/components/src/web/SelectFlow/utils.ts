export const hexToRGBA = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  if (alpha < 0 || alpha > 1) {
    alpha = 1;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(2, 132, 199, ${alpha})`;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
