'use client';

import React from 'react';

interface ConfidenceLevels {
  Passion?: number;
  Profession?: number;
  Mission?: number;
  Vocation?: number;
}

interface IkigaiDiagramProps {
  className?: string;
  size?: number;
  showLabels?: boolean;
  confidenceLevels?: ConfidenceLevels;
}

export function IkigaiDiagram({ 
  className = '', 
  size = 400, 
  showLabels = true, 
  confidenceLevels 
}: IkigaiDiagramProps) {
  const radius = size * 0.18;
  const centerX = size / 2;
  const centerY = size / 2;
  const offset = size * 0.08;

  // Function to adjust opacity based on confidence level
  const getOpacity = (baseOpacity: number, confidence?: number) => {
    if (!confidence) return baseOpacity;
    // Scale confidence (0-100) to opacity modifier (0.3-1.0)
    const opacityModifier = 0.3 + (confidence / 100) * 0.7;
    return Math.min(baseOpacity * opacityModifier, 1.0);
  };

  // Circle positions with confidence-based styling
  const circles = [
    { 
      id: 'love', 
      cx: centerX, 
      cy: centerY - offset, 
      fill: '#F7DC6F', // Yellow
      label: 'What you\nLOVE',
      labelX: centerX,
      labelY: centerY - offset - radius * 0.3,
      opacity: getOpacity(0.8, confidenceLevels?.Passion)
    },
    { 
      id: 'good', 
      cx: centerX - offset, 
      cy: centerY + offset * 0.5, 
      fill: '#A9DFBF', // Light green
      label: 'What you are\nGOOD AT',
      labelX: centerX - offset - radius * 0.7,
      labelY: centerY + offset * 0.5,
      opacity: getOpacity(0.8, confidenceLevels?.Profession)
    },
    { 
      id: 'needs', 
      cx: centerX + offset, 
      cy: centerY + offset * 0.5, 
      fill: '#F1948A', // Pink/coral
      label: 'What the world\nNEEDS',
      labelX: centerX + offset + radius * 0.7,
      labelY: centerY + offset * 0.5,
      opacity: getOpacity(0.8, confidenceLevels?.Mission)
    },
    { 
      id: 'paid', 
      cx: centerX, 
      cy: centerY + offset * 2, 
      fill: '#85E3C7', // Turquoise/mint
      label: 'What you can be\nPAID FOR',
      labelX: centerX,
      labelY: centerY + offset * 2 + radius * 0.6,
      opacity: getOpacity(0.8, confidenceLevels?.Vocation)
    }
  ];

  const intersectionLabels = [
    { text: 'PASSION', x: centerX - offset * 0.5, y: centerY - offset * 0.2, fontSize: size * 0.04 },
    { text: 'MISSION', x: centerX + offset * 0.5, y: centerY - offset * 0.2, fontSize: size * 0.04 },
    { text: 'PROFESSION', x: centerX - offset * 0.5, y: centerY + offset * 1.2, fontSize: size * 0.04 },
    { text: 'VOCATION', x: centerX + offset * 0.5, y: centerY + offset * 1.2, fontSize: size * 0.04 },
    { text: 'Ikigai', x: centerX, y: centerY + offset * 0.2, fontSize: size * 0.05, fontWeight: 'bold' }
  ];

  // Calculate center opacity based on overall confidence
  const overallConfidence = confidenceLevels ? 
    (Object.values(confidenceLevels).reduce((sum, val) => sum + (val || 0), 0) / Object.keys(confidenceLevels).length) : 
    null;
  const centerOpacity = overallConfidence ? getOpacity(0.9, overallConfidence) : 0.9;

  return (
    <div className={`flex justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Define masks for intersections */}
        <defs>
          {circles.map((circle) => (
            <mask key={`mask-${circle.id}`} id={`mask-${circle.id}`}>
              <rect width={size} height={size} fill="black" />
              <circle cx={circle.cx} cy={circle.cy} r={radius} fill="white" />
            </mask>
          ))}
          
          {/* Center intersection mask */}
          <mask id="center-mask">
            <rect width={size} height={size} fill="black" />
            {circles.map((circle) => (
              <circle key={circle.id} cx={circle.cx} cy={circle.cy} r={radius} fill="white" />
            ))}
          </mask>
        </defs>

        {/* Draw circles with confidence-based opacity */}
        {circles.map((circle) => (
          <circle
            key={circle.id}
            cx={circle.cx}
            cy={circle.cy}
            r={radius}
            fill={circle.fill}
            opacity={circle.opacity}
            stroke="white"
            strokeWidth={2}
          />
        ))}

        {/* Center circle for ikigai with dynamic opacity */}
        <circle
          cx={centerX}
          cy={centerY + offset * 0.2}
          r={radius * 0.4}
          fill="rgba(139, 159, 120, 0.9)"
          opacity={centerOpacity}
          stroke="white"
          strokeWidth={2}
        />

        {showLabels && (
          <>
            {/* Main circle labels */}
            {circles.map((circle) => (
              <text
                key={`label-${circle.id}`}
                x={circle.labelX}
                y={circle.labelY}
                textAnchor="middle"
                fontSize={size * 0.035}
                fontWeight="600"
                fill="#2C3E50"
                dominantBaseline="middle"
              >
                {circle.label.split('\n').map((line, index) => (
                  <tspan key={index} x={circle.labelX} dy={index === 0 ? 0 : size * 0.04}>
                    {line}
                  </tspan>
                ))}
              </text>
            ))}

            {/* Intersection labels */}
            {intersectionLabels.map((label, index) => (
              <text
                key={index}
                x={label.x}
                y={label.y}
                textAnchor="middle"
                fontSize={label.fontSize}
                fontWeight={label.fontWeight || '600'}
                fill="#2C3E50"
                dominantBaseline="middle"
              >
                {label.text}
              </text>
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
