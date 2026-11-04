import type { IndustryIcon } from "../../data/industries";
import styles from "./industries.module.css";

/** Abstract diagrams of the work, never represented as client screenshots. */
export function IndustryArt({ kind }: { kind: IndustryIcon }) {
  return (
    <svg
      viewBox="0 0 320 160"
      fill="none"
      aria-hidden="true"
      className={styles.industryArt}
      data-kind={kind}
    >
      <g
        className={styles.artLines}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === "textiles" && (
          <>
            {Array.from({ length: 11 }, (_, i) => (
              <path
                key={`warp-${i}`}
                d={`M${55 + i * 21} 10 Q${25 + i * 21} 80 ${55 + i * 21} 150`}
                opacity={i % 3 === 0 ? 0.7 : 0.2}
              />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={`weft-${i}`}
                d={`M24 ${24 + i * 19} Q160 ${48 + i * 13} 296 ${24 + i * 19}`}
                opacity={i % 2 === 0 ? 0.6 : 0.25}
              />
            ))}
            <rect
              x="103"
              y="42"
              width="114"
              height="76"
              rx="8"
              className={styles.artFill}
            />
            <path d="M123 66h74M123 80h48M123 94h62" strokeWidth="3" />
          </>
        )}
        {kind === "manufacturing" && (
          <>
            <path d="M22 122h276M36 130h248M40 102V58l44 20V42l52 29V24h30v78" />
            <path
              d="M186 96V63l27-23 24 20-16 18M212 42l-10-17 14-7 14 20M237 60l16 10-7 13-21-7"
              strokeWidth="4"
            />
            {[46, 115, 184, 253].map((x) => (
              <g key={x}>
                <rect
                  x={x}
                  y="99"
                  width="25"
                  height="23"
                  rx="3"
                  className={styles.artFill}
                />
                <circle cx={x + 12} cy="136" r="4" />
              </g>
            ))}
            <path d="M52 83h12m28 0h12m28 0h12" strokeWidth="3" />
          </>
        )}
        {kind === "retail" && (
          <>
            <rect
              x="36"
              y="32"
              width="145"
              height="92"
              rx="9"
              className={styles.artFill}
            />
            <path d="M36 55h145M108 124v14m-30 0h60" />
            {[64, 101, 138].map((x) => (
              <g key={x}>
                <rect x={x} y="71" width="20" height="20" rx="3" />
                <path d={`M${x} 102h20`} />
              </g>
            ))}
            <path d="M214 29h59v108l-10-6-10 6-10-6-10 6-10-6-9 6V29Z" />
            <path d="M227 48h32m-32 13h23m-23 17h32m-32 13h32m-32 19h19" />
          </>
        )}
        {kind === "ecommerce" && (
          <>
            <rect
              x="31"
              y="40"
              width="67"
              height="82"
              rx="7"
              className={styles.artFill}
            />
            <path d="M51 50V34a14 14 0 0 1 28 0v16M119 80h35m-9-8 9 8-9 8" />
            <rect x="171" y="46" width="61" height="68" rx="7" />
            <path d="M184 64h34m-34 12h25m-25 17h17M250 80h24" />
            <circle cx="285" cy="80" r="15" className={styles.artFill} />
            <path d="m278 80 5 5 9-10" strokeWidth="2.5" />
          </>
        )}
        {kind === "education" && (
          <>
            <path
              d="m38 52 60-27 60 27-60 27-60-27ZM60 63v36q38 24 76 0V63M154 53v42"
              className={styles.artFill}
            />
            <rect x="188" y="30" width="91" height="106" rx="7" />
            <path d="M204 49h34m-34 14h56M204 83h56m-56 14h56m-56 14h36" />
            <circle cx="70" cy="129" r="5" />
            <circle cx="97" cy="129" r="5" />
            <circle cx="124" cy="129" r="5" />
          </>
        )}
        {kind === "logistics" && (
          <>
            <path
              d="M42 111C42 20 145 21 154 76S267 151 277 43"
              strokeDasharray="5 7"
              className={styles.artRoute}
            />
            <path
              d="m19 94 24-14 24 14v34H19V94Zm8 34v-24h32v24"
              className={styles.artFill}
            />
            <rect
              x="133"
              y="59"
              width="37"
              height="32"
              rx="4"
              className={styles.artFill}
            />
            <path d="m133 59 18 10 19-10m-19 10v22" />
            <path d="M263 31a14 14 0 1 1 28 0c0 12-14 25-14 25s-14-13-14-25Z" />
            <circle cx="277" cy="31" r="4" />
          </>
        )}
        {kind === "services" && (
          <>
            <rect
              x="37"
              y="30"
              width="95"
              height="108"
              rx="8"
              className={styles.artFill}
            />
            <circle cx="84" cy="59" r="12" />
            <path d="M63 91c0-23 42-23 42 0M56 109h56m-56 11h35" />
            <path d="M148 80h28m-8-8 8 8-8 8" />
            <rect x="193" y="30" width="84" height="108" rx="8" />
            <path d="M207 51h55m-55 16h40m-40 16h55m-55 16h36m-36 17h23" />
          </>
        )}
        {kind === "startups" && (
          <>
            <path
              d="M28 135h267M45 135V28M57 113l48-19 49 9 48-52 64-24"
              strokeDasharray="4 5"
            />
            <path d="m239 27 29-2-2 29" strokeWidth="2.5" />
            {[
              [57, 113],
              [105, 94],
              [154, 103],
              [202, 51],
              [266, 27],
            ].map(([x, y], i) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy={y}
                  r={i === 4 ? 11 : 7}
                  className={styles.artFill}
                />
                <circle cx={x} cy={y} r="2" />
              </g>
            ))}
            <rect x="72" y="32" width="72" height="27" rx="5" />
            <path d="M85 45h45" strokeWidth="3" />
          </>
        )}
      </g>
    </svg>
  );
}
