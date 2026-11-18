import type { HeroDiagram as HeroDiagramKind } from "@/lib/types";

const WALL = "fill-none stroke-cream stroke-3";
const ZONE = "fill-yellow/50 stroke-cream stroke-[1.5]";
const DEVICE = "fill-ink stroke-yellow stroke-3";
const SIREN = "fill-yellow stroke-cream stroke-2";
const LABEL = "fill-cream text-[12px]";

function AlarmPlan() {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label="Floor plan showing door sensor, motion detector coverage, smoke detectors and a siren"
      className="block h-auto w-full font-body"
    >
      <rect x="100" y="50" width="280" height="200" className={WALL} />
      <line
        x1="240"
        y1="50"
        x2="240"
        y2="250"
        className="stroke-cream stroke-2"
      />
      <path d="M110 60 L225 60 L110 150Z" className={ZONE} />
      <path d="M370 240 L255 240 L370 150Z" className={ZONE} />
      <circle cx="110" cy="60" r="8" className={DEVICE} />
      <circle cx="370" cy="240" r="8" className={DEVICE} />
      <circle cx="170" cy="200" r="9" className={DEVICE} />
      <circle cx="310" cy="100" r="9" className={DEVICE} />
      <rect x="224" y="246" width="32" height="8" className={SIREN} />
      <text x="240" y="280" textAnchor="middle" className={LABEL}>
        Door contact
      </text>
      <text x="150" y="228" className={LABEL}>
        Smoke
      </text>
      <text x="262" y="96" className={LABEL}>
        Smoke
      </text>
      <text x="120" y="42" className={LABEL}>
        Motion detector
      </text>
    </svg>
  );
}

function CctvPlan() {
  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-label="Example floor plan with four cameras and their fields of view covering the entrance, car park and rear yard"
      className="block h-auto w-full font-body"
    >
      <rect x="150" y="90" width="180" height="140" rx="2" className={WALL} />
      <line
        x1="240"
        y1="90"
        x2="240"
        y2="230"
        className="stroke-cream stroke-2"
      />
      <path
        d="M150 90 L20 20 L20 160Z"
        className="fill-yellow/50 stroke-cream stroke-1"
      />
      <path
        d="M330 90 L460 20 L460 160Z"
        className="fill-yellow/50 stroke-cream stroke-1"
      />
      <path
        d="M150 230 L20 300 L20 170Z"
        className="fill-yellow/50 stroke-cream stroke-1"
      />
      <path
        d="M330 230 L460 300 L460 170Z"
        className="fill-yellow/50 stroke-cream stroke-1"
      />
      <circle cx="150" cy="90" r="9" className={DEVICE} />
      <circle cx="330" cy="90" r="9" className={DEVICE} />
      <circle cx="150" cy="230" r="9" className={DEVICE} />
      <circle cx="330" cy="230" r="9" className={DEVICE} />
      <rect x="224" y="226" width="32" height="8" className={SIREN} />
      <text x="240" y="262" textAnchor="middle" className={LABEL}>
        Main entrance
      </text>
      <text x="55" y="95" className={LABEL}>
        Car park
      </text>
      <text x="372" y="95" className={LABEL}>
        Rear yard
      </text>
    </svg>
  );
}

function WifiPlan() {
  return (
    <svg
      viewBox="0 0 480 300"
      role="img"
      aria-label="Main building with Wi-Fi coverage and a remote building up to 3 kilometres away"
      className="block h-auto w-full font-body"
    >
      <rect x="40" y="120" width="130" height="100" className={WALL} />
      <circle cx="105" cy="170" r="30" className={ZONE} />
      <circle
        cx="105"
        cy="170"
        r="62"
        className="fill-yellow/25 stroke-cream stroke-[1.5]"
      />
      <circle cx="105" cy="170" r="9" className={DEVICE} />
      <line
        x1="170"
        y1="150"
        x2="370"
        y2="150"
        strokeDasharray="8 6"
        className="stroke-cream stroke-3"
      />
      <rect x="370" y="120" width="70" height="60" className={WALL} />
      <circle cx="370" cy="150" r="9" className={DEVICE} />
      <text x="270" y="140" textAnchor="middle" className={LABEL}>
        link up to 3km
      </text>
      <text x="105" y="250" textAnchor="middle" className={LABEL}>
        Main site, up to 20,000 m²
      </text>
      <text x="405" y="205" textAnchor="middle" className={LABEL}>
        Remote building
      </text>
    </svg>
  );
}

export function HeroDiagram({ kind }: { kind: HeroDiagramKind }) {
  switch (kind) {
    case "alarms":
      return <AlarmPlan />;
    case "cctv":
      return <CctvPlan />;
    case "wifi":
      return <WifiPlan />;
    default: {
      const unhandled: never = kind;
      throw new Error(`Unhandled hero diagram: ${String(unhandled)}`);
    }
  }
}
