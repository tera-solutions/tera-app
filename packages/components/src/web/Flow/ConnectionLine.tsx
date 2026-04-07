import React from "react";

export default ({ fromX, fromY, toX, toY }) => {
  return (
    <g>
      <path
        fill="none"
        stroke="#3b82f6"
        strokeWidth={1.5}
        className="animated"
        d={`M${fromX},${fromY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#3b82f6"
        strokeWidth={1.5}
      />
    </g>
  );
};
