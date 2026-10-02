function arc(cx: number, cy: number, radius: number): string {
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
}

const LEFT = 52;
const RIGHT = 84;
const TIP = 18;

export function TmsLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 -10 152 78" className={className} aria-hidden="true">
      <style>
        {`
          .tms-ring {
            fill: none;
            stroke: #ffff00;
            stroke-width: 2.2;
            stroke-linecap: round;
            opacity: 0;
            transform-box: view-box;
            animation: tms-ping 1.8s ease-out infinite;
          }
          .tms-ring-l { transform-origin: ${LEFT}px ${TIP}px; }
          .tms-ring-r { transform-origin: ${RIGHT}px ${TIP}px; }
          .tms-d1 { animation-delay: 0s; }
          .tms-d2 { animation-delay: 0.16s; }
          .tms-d3 { animation-delay: 0.32s; }
          .tms-d4 { animation-delay: 0.48s; }
          .tms-dot {
            fill: #ffff00;
            transform-box: view-box;
            animation: tms-dot 1.8s ease-out infinite;
          }
          .tms-dot-l { transform-origin: ${LEFT}px ${TIP}px; }
          .tms-dot-r { transform-origin: ${RIGHT}px ${TIP}px; }
          @keyframes tms-ping {
            0% { opacity: 0; transform: scale(0.35); }
            16% { opacity: 1; }
            62% { opacity: 0; transform: scale(1); }
            100% { opacity: 0; transform: scale(1); }
          }
          @keyframes tms-dot {
            0%, 100% { transform: scale(1); }
            10% { transform: scale(1.55); }
          }
          @media (prefers-reduced-motion: reduce) {
            .tms-ring, .tms-dot { animation: none; }
            .tms-ring { opacity: 0.9; transform: none; }
            .tms-dot { transform: none; }
          }
        `}
      </style>
      {[7, 12, 17, 22].map((radius, index) => (
        <path
          key={`l-${radius}`}
          d={arc(LEFT, TIP, radius)}
          className={`tms-ring tms-ring-l tms-d${index + 1}`}
        />
      ))}
      {[7, 12, 17, 22].map((radius, index) => (
        <path
          key={`r-${radius}`}
          d={arc(RIGHT, TIP, radius)}
          className={`tms-ring tms-ring-r tms-d${index + 1}`}
        />
      ))}
      <path
        fill="none"
        stroke="#ffff00"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={`M 6 32 H 30 M 14 32 V 60 H 36 L ${LEFT} ${TIP} L 68 56 L ${RIGHT} ${TIP} L 100 60 H 128 C 144 60 144 46 126 44 C 110 42 112 32 128 32 H 146`}
      />
      <circle className="tms-dot tms-dot-l" cx={LEFT} cy={TIP} r="3.6" />
      <circle className="tms-dot tms-dot-r" cx={RIGHT} cy={TIP} r="3.6" />
    </svg>
  );
}
