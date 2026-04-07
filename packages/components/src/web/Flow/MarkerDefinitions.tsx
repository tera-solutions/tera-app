export const MarkerDefinitions = ({ marker }) => (
  <svg>
    <defs>
      <marker
        className="react-flow__arrowhead"
        id={marker.id}
        viewBox="-10 -10 20 20"
        refX="0"
        refY="0"
        markerWidth={marker.width || 6}
        markerHeight={marker.height || 6}
        markerUnits={marker.markerUnits || 'strokeWidth'}
        orient={marker.orient || 'auto-start-reverse'}
        strokeWidth={marker.strokeWidth || 1}
      >
        <polyline
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          points="-5,-4 0,0 -5,4"
          style={{
            stroke: 'rgb(26, 86, 219)',
            strokeWidth: 1,
          }}
        />
      </marker>
    </defs>
  </svg>
);
