export const getMidPoint = (A, B) => {
  const x = (A.x + B.x) / 2;
  const y = (A.y + B.y) / 2;
  return { x, y };
};

export const determinePoints = (source, target) => {
  if (source?.x < target?.x) {
    if (source?.y > target?.y && Math.abs(source?.y - target?.y) > 50) {
      return {
        sourceHandle: "right",
        targetHandle: "bottom-left",
      };
    }
    if (source?.y < target?.y && Math.abs(source?.y - target?.y) > 50) {
      return {
        sourceHandle: "right",
        targetHandle: "top-left",
      };
    }
    return {
      sourceHandle: "right",
      targetHandle: "left",
    };
  } else {
    if (source?.y > target?.y && Math.abs(source?.y - target?.y) > 50) {
      return {
        sourceHandle: "top",
        targetHandle: "bottom-right",
      };
    }
    if (source?.y < target?.y && Math.abs(source?.y - target?.y) > 50) {
      return {
        sourceHandle: "bottom",
        targetHandle: "top-right",
      };
    }
    return {
      sourceHandle: "right",
      targetHandle: "left",
    };
  }
};

export const edgePath = (edge, midPoint) => {
  const sourcePosition = edge.sourcePosition;
  const targetPosition = edge.targetPosition;
  const sourceX = edge.sourceX || 0;
  const sourceY = edge.sourceY || 0;
  const targetX = edge.targetX || 0;
  const targetY = edge.targetY || 0;
  const lineSpace = 25;

  // này là top - top
  if (sourcePosition === "top" && targetPosition === "top") {
    const rectY = sourceY - lineSpace;
    return `M${sourceX},${sourceY} 
    L${sourceX},${rectY + (sourceY > targetY ? targetY - sourceY : 0)} 
    L${targetX},${rectY + (sourceY > targetY ? targetY - sourceY : 0)} 
    L${targetX},${targetY}`;
  }

  // này là right - right
  if (sourcePosition === "right" && targetPosition === "right") {
    return `M${sourceX},${sourceY} 
    L${sourceX > targetX ? sourceX + lineSpace : targetX + lineSpace},${sourceY}
    L${sourceX > targetX ? sourceX + lineSpace : targetX + lineSpace},${targetY}
    L${targetX},${targetY}`;
  }

  // này là left - left
  if (sourcePosition === "left" && targetPosition === "left") {
    return `M${sourceX},${sourceY} 
    L${sourceX < targetX ? sourceX - lineSpace : targetX - lineSpace},${sourceY}
    L${sourceX < targetX ? sourceX - lineSpace : targetX - lineSpace},${targetY}
    L${targetX},${targetY}`;
  }

  // này là bottom - bottom
  if (sourcePosition === "bottom" && targetPosition === "bottom") {
    const rectY = sourceY + lineSpace;
    return `M${sourceX},${sourceY} 
    L${sourceX},${rectY + (sourceY < targetY ? targetY - sourceY : 0)} 
    L${targetX},${rectY + (sourceY < targetY ? targetY - sourceY : 0)} 
    L${targetX},${targetY}`;
  }

  // này là right - top
  if (sourcePosition === "right" && targetPosition === "top") {
    if (sourceX > targetX) {
      if (sourceY < targetY) {
        return `M${sourceX},${sourceY} 
        L${sourceX + lineSpace},${sourceY} 
        L${sourceX + lineSpace},${midPoint.y} 
        L${targetX},${midPoint.y} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${sourceX + lineSpace},${sourceY} 
        L${sourceX + lineSpace},${targetY - lineSpace} 
        L${targetX},${targetY - lineSpace} 
        L${targetX},${targetY}`;
      }
    } else {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} 
        L${midPoint.x},${sourceY} 
        L${midPoint.x},${targetY - lineSpace} 
        L${targetX},${targetY - lineSpace} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${targetX},${sourceY} 
        L${targetX},${targetY}`;
      }
    }
  }

  // này là left - top
  if (sourcePosition === "left" && targetPosition === "top") {
    if (sourceX < targetX) {
      if (sourceY < targetY) {
        return `M${sourceX},${sourceY} 
        L${sourceX - lineSpace},${sourceY} 
        L${sourceX - lineSpace},${midPoint.y} 
        L${targetX},${midPoint.y} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${sourceX - lineSpace},${sourceY} 
        L${sourceX - lineSpace},${targetY - lineSpace} 
        L${targetX},${targetY - lineSpace} 
        L${targetX},${targetY}`;
      }
    } else {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} 
        L${midPoint.x},${sourceY} 
        L${midPoint.x},${targetY - lineSpace} 
        L${targetX},${targetY - lineSpace} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${targetX},${sourceY} 
        L${targetX},${targetY}`;
      }
    }
  }

  // này là right - bottom
  if (sourcePosition === "right" && targetPosition === "bottom") {
    // const rect = sourceX + rectHeight;
    if (sourceX > targetX) {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} 
        L${sourceX + lineSpace},${sourceY} 
        L${sourceX + lineSpace},${midPoint.y} 
        L${targetX},${midPoint.y} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${sourceX + lineSpace},${sourceY} 
        L${sourceX + lineSpace},${targetY + lineSpace} 
        L${targetX},${targetY + lineSpace} 
        L${targetX},${targetY}`;
      }
    } else {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} L${targetX},${sourceY}L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${midPoint.x},${sourceY} 
        L${midPoint.x},${targetY + lineSpace} 
        L${targetX},${targetY + lineSpace} 
        L${targetX},${targetY}`;
      }
    }
  }

  // này là left - bottom
  if (sourcePosition === "left" && targetPosition === "bottom") {
    // const rect = sourceX + rectHeight;
    if (sourceX < targetX) {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} 
        L${sourceX - lineSpace},${sourceY} 
        L${sourceX - lineSpace},${midPoint.y} 
        L${targetX},${midPoint.y} 
        L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${sourceX - lineSpace},${sourceY} 
        L${sourceX - lineSpace},${targetY + lineSpace} 
        L${targetX},${targetY + lineSpace} 
        L${targetX},${targetY}`;
      }
    } else {
      if (sourceY > targetY) {
        return `M${sourceX},${sourceY} L${targetX},${sourceY}L${targetX},${targetY}`;
      } else {
        return `M${sourceX},${sourceY} 
        L${midPoint.x},${sourceY} 
        L${midPoint.x},${targetY + lineSpace} 
        L${targetX},${targetY + lineSpace} 
        L${targetX},${targetY}`;
      }
    }
  }

  // này là right - left
  if (sourcePosition === "right" && targetPosition === "left") {
    if (sourceX > targetX) {
      return `M ${sourceX},${sourceY}
      L${sourceX + lineSpace},${sourceY}
      L${sourceX + lineSpace},${midPoint.y}
      L${targetX - lineSpace},${midPoint.y}
      L${targetX - lineSpace},${targetY}
      L${targetX},${targetY}`;
    }
    return `M${sourceX},${sourceY} L${midPoint.x},${sourceY} L${midPoint.x},${targetY} L${targetX},${targetY}`;
  }

  // này là left - right
  if (sourcePosition === "left" && targetPosition === "right") {
    if (sourceX < targetX) {
      return `M ${sourceX},${sourceY}
      L${sourceX - lineSpace},${sourceY}
      L${sourceX - lineSpace},${midPoint.y}
      L${targetX + lineSpace},${midPoint.y}
      L${targetX + lineSpace},${targetY}
      L${targetX},${targetY}`;
    }
    return `M${sourceX},${sourceY} L${midPoint.x},${sourceY} L${midPoint.x},${targetY} L${targetX},${targetY}`;
  }

  // này là top - bottom
  if (sourcePosition === "top" && targetPosition === "bottom") {
    if (sourceY > targetY) {
      return `
      M${sourceX},${sourceY}
      L${sourceX},${midPoint.y}
      L${targetX},${midPoint.y}
      L${targetX},${targetY}
      `;
    }
    return `
      M${sourceX},${sourceY}
      L${sourceX},${sourceY - lineSpace}
      L${midPoint.x},${sourceY - lineSpace}
      L${midPoint.x},${targetY + lineSpace}
      L${midPoint.x},${targetY + lineSpace}
      L${targetX},${targetY + lineSpace}
      L${targetX},${targetY}
      `;
  }

  // này là bottom - top
  if (sourcePosition === "bottom" && targetPosition === "top") {
    if (sourceY < targetY) {
      return `
      M${sourceX},${sourceY}
      L${sourceX},${midPoint.y}
      L${targetX},${midPoint.y}
      L${targetX},${targetY}
      `;
    }
    return `
      M${sourceX},${sourceY}
      L${sourceX},${sourceY + lineSpace}
      L${midPoint.x},${sourceY + lineSpace}
      L${midPoint.x},${targetY - lineSpace}
      L${midPoint.x},${targetY - lineSpace}
      L${targetX},${targetY - lineSpace}
      L${targetX},${targetY}
      `;
  }
  // này là top - left
  if (sourcePosition === "top" && targetPosition === "left") {
    if (sourceX > targetX) {
      if (sourceY < targetY) {
        return `
          M${sourceX},${sourceY}
          L${sourceX},${sourceY - lineSpace}
          L${targetX - lineSpace},${sourceY - lineSpace}
          L${targetX - lineSpace},${targetY}
          L${targetX},${targetY}
          `;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${midPoint.y}
        L ${targetX - lineSpace},${midPoint.y}
        L ${targetX - lineSpace},${targetY}
        L ${targetX},${targetY}
        `;
    } else {
      if (sourceY > targetY) {
        return `M ${sourceX},${sourceY} L ${sourceX},${targetY} L ${targetX},${targetY}`;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${sourceY - lineSpace}
        L ${midPoint.x},${sourceY - lineSpace}
        L ${midPoint.x},${targetY}
        L ${targetX},${targetY}
        `;
    }
  }
  // này là top - right
  if (sourcePosition === "top" && targetPosition === "right") {
    if (sourceX < targetX) {
      if (sourceY < targetY) {
        return `
          M${sourceX},${sourceY}
          L${sourceX},${sourceY - lineSpace}
          L${targetX + lineSpace},${sourceY - lineSpace}
          L${targetX + lineSpace},${targetY}
          L${targetX},${targetY}
          `;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${midPoint.y}
        L ${targetX + lineSpace},${midPoint.y}
        L ${targetX + lineSpace},${targetY}
        L ${targetX},${targetY}
        `;
    } else {
      if (sourceY > targetY) {
        return `M ${sourceX},${sourceY} L ${sourceX},${targetY} L ${targetX},${targetY}`;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${sourceY - lineSpace}
        L ${midPoint.x},${sourceY - lineSpace}
        L ${midPoint.x},${targetY}
        L ${targetX},${targetY}
        `;
    }
  }
  // này là bottom - left
  if (sourcePosition === "bottom" && targetPosition === "left") {
    if (sourceX > targetX) {
      if (sourceY < targetY) {
        return `
          M ${sourceX},${sourceY}
          L ${sourceX},${midPoint.y}
          L ${targetX - lineSpace},${midPoint.y}
          L ${targetX - lineSpace},${targetY}
          L ${targetX},${targetY}
          `;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${sourceY + lineSpace}
        L ${targetX - lineSpace},${sourceY + lineSpace}
        L ${targetX - lineSpace},${targetY}
        L ${targetX},${targetY}
        `;
    } else {
      if (sourceY < targetY) {
        return `M ${sourceX},${sourceY} L ${sourceX},${targetY}L ${targetX},${targetY}`;
      }
      return `M ${sourceX},${sourceY}
        L ${sourceX},${sourceY + lineSpace}
        L ${midPoint.x},${sourceY + lineSpace}
        L ${midPoint.x},${targetY}
        L ${targetX},${targetY}`;
    }
  }

  // này là bottom - right
  if (sourcePosition === "bottom" && targetPosition === "right") {
    if (sourceX < targetX) {
      if (sourceY < targetY) {
        return `
          M ${sourceX},${sourceY}
          L ${sourceX},${midPoint.y}
          L ${targetX + lineSpace},${midPoint.y}
          L ${targetX + lineSpace},${targetY}
          L ${targetX},${targetY}
          `;
      }
      return `
        M ${sourceX},${sourceY}
        L ${sourceX},${sourceY + lineSpace}
        L ${targetX + lineSpace},${sourceY + lineSpace}
        L ${targetX + lineSpace},${targetY}
        L ${targetX},${targetY}
        `;
    } else {
      if (sourceY < targetY) {
        return `M ${sourceX},${sourceY} L ${sourceX},${targetY}L ${targetX},${targetY}`;
      }
      return `M ${sourceX},${sourceY}
        L ${sourceX},${sourceY + lineSpace}
        L ${midPoint.x},${sourceY + lineSpace}
        L ${midPoint.x},${targetY}
        L ${targetX},${targetY}`;
    }
  }

  return `M ${sourceX},${sourceY} L ${targetX},${targetY}`;
};

export const parseSVGPath = (pathString) => {
  const points = [];

  const matches = pathString.match(/[ML]\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)/g);

  if (matches) {
    matches.forEach((match) => {
      const [type, x, y] = match
        .match(/[ML]\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)/)
        .map(parseFloat);
      console.log(type);

      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y });
      }
    });
  }

  return points;
};

export const calculateMidpoint = (zigzagPoints) => {
  let totalLength = 0;
  for (let i = 1; i < zigzagPoints.length; i++) {
    const dx = zigzagPoints[i].x - zigzagPoints[i - 1].x;
    const dy = zigzagPoints[i].y - zigzagPoints[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
  }

  const desiredLengthRatio = 0.5;
  let accumulatedLength = 0;
  let midPoints;

  for (let i = 1; i < zigzagPoints.length; i++) {
    const dx = zigzagPoints[i].x - zigzagPoints[i - 1].x;
    const dy = zigzagPoints[i].y - zigzagPoints[i - 1].y;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);

    if (
      (accumulatedLength + segmentLength) / totalLength >=
      desiredLengthRatio
    ) {
      const ratio =
        (desiredLengthRatio * totalLength - accumulatedLength) / segmentLength;
      midPoints = {
        x: zigzagPoints[i - 1].x + ratio * dx,
        y: zigzagPoints[i - 1].y + ratio * dy,
      };
      break;
    }

    accumulatedLength += segmentLength;
  }

  return midPoints;
};

export const HANDLE_NODE = {
  source: [
    { handle: "right", left: null, position: "right" },
    { handle: "top", left: null, position: "top" },
    { handle: "bottom", left: null, position: "bottom" },
    { handle: "top-right", left: "75%", position: "top" },
    { handle: "top-left", left: "25%", position: "top" },
    { handle: "left", left: null, position: "left" },
    { handle: "bottom-right", left: "75%", position: "bottom" },
    { handle: "bottom-left", left: "25%", position: "bottom" },
  ],
  target: [
    { handle: "right", left: null, position: "right" },
    { handle: "top", left: null, position: "top" },
    { handle: "bottom", left: null, position: "bottom" },
    { handle: "top-right", left: "75%", position: "top" },
    { handle: "top-left", left: "25%", position: "top" },
    { handle: "left", left: null, position: "left" },
    { handle: "bottom-right", left: "75%", position: "bottom" },
    { handle: "bottom-left", left: "25%", position: "bottom" },
  ],
};
