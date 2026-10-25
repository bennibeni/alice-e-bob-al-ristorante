"use client";

import React, { useMemo, useState } from "react";

const DIRECTIONS = {
  N: { label: "N", deg: 0 },
  NE: { label: "NE", deg: 45 },
  E: { label: "E", deg: 90 },
  SE: { label: "SE", deg: 135 },
  S: { label: "S", deg: 180 },
  SO: { label: "SO", deg: 225 },
  O: { label: "O", deg: 270 },
  NO: { label: "NO", deg: 315 },
};

const MEASUREMENTS = [
  {
    id: "AB",
    rowLabel: "AB",
    outcomes: [
      {
        id: "A1B1",
        label: "(A1,B1)",
        redVar: "A1",
        blueVar: "B1",
        redDir: "N",
        blueDir: "NE",
        prob: 0.13,
      },
      {
        id: "A1B2",
        label: "(A1,B2)",
        redVar: "A1",
        blueVar: "B2",
        redDir: "N",
        blueDir: "SO",
        prob: 0.55,
      },
      {
        id: "A2B1",
        label: "(A2,B1)",
        redVar: "A2",
        blueVar: "B1",
        redDir: "S",
        blueDir: "NE",
        prob: 0.25,
      },
      {
        id: "A2B2",
        label: "(A2,B2)",
        redVar: "A2",
        blueVar: "B2",
        redDir: "S",
        blueDir: "SO",
        prob: 0.07,
      },
    ],
  },
  {
    id: "ABp",
    rowLabel: "AB'",
    outcomes: [
      {
        id: "A1Bp1",
        label: "(A1,B'1)",
        redVar: "A1",
        blueVar: "B'1",
        redDir: "N",
        blueDir: "SE",
        prob: 0.47,
      },
      {
        id: "A1Bp2",
        label: "(A1,B'2)",
        redVar: "A1",
        blueVar: "B'2",
        redDir: "N",
        blueDir: "NO",
        prob: 0.12,
      },
      {
        id: "A2Bp1",
        label: "(A2,B'1)",
        redVar: "A2",
        blueVar: "B'1",
        redDir: "S",
        blueDir: "SE",
        prob: 0.06,
      },
      {
        id: "A2Bp2",
        label: "(A2,B'2)",
        redVar: "A2",
        blueVar: "B'2",
        redDir: "S",
        blueDir: "NO",
        prob: 0.35,
      },
    ],
  },
  {
    id: "ApB",
    rowLabel: "A'B",
    outcomes: [
      {
        id: "Ap1B1",
        label: "(A'1,B1)",
        redVar: "A'1",
        blueVar: "B1",
        redDir: "E",
        blueDir: "NE",
        prob: 0.13,
      },
      {
        id: "Ap1B2",
        label: "(A'1,B2)",
        redVar: "A'1",
        blueVar: "B2",
        redDir: "E",
        blueDir: "SO",
        prob: 0.38,
      },
      {
        id: "Ap2B1",
        label: "(A'2,B1)",
        redVar: "A'2",
        blueVar: "B1",
        redDir: "O",
        blueDir: "NE",
        prob: 0.42,
      },
      {
        id: "Ap2B2",
        label: "(A'2,B2)",
        redVar: "A'2",
        blueVar: "B2",
        redDir: "O",
        blueDir: "SO",
        prob: 0.07,
      },
    ],
  },
  {
    id: "ApBp",
    rowLabel: "A'B'",
    outcomes: [
      {
        id: "Ap1Bp1",
        label: "(A'1,B'1)",
        redVar: "A'1",
        blueVar: "B'1",
        redDir: "E",
        blueDir: "SE",
        prob: 0.09,
      },
      {
        id: "Ap1Bp2",
        label: "(A'1,B'2)",
        redVar: "A'1",
        blueVar: "B'2",
        redDir: "E",
        blueDir: "NO",
        prob: 0.44,
      },
      {
        id: "Ap2Bp1",
        label: "(A'2,B'1)",
        redVar: "A'2",
        blueVar: "B'1",
        redDir: "O",
        blueDir: "SE",
        prob: 0.38,
      },
      {
        id: "Ap2Bp2",
        label: "(A'2,B'2)",
        redVar: "A'2",
        blueVar: "B'2",
        redDir: "O",
        blueDir: "NO",
        prob: 0.09,
      },
    ],
  },
];

const GRID_CELL_W = 220;
const GRID_CELL_H = 260;
const ROW_LABEL_W = 96;

function clampParticipants(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 85;
  return Math.max(1, Math.floor(n));
}

function format3(x) {
  return Number(x).toFixed(3);
}

function weightedChoiceIndex(outcomes) {
  const r = Math.random();
  let acc = 0;

  for (let i = 0; i < outcomes.length; i += 1) {
    acc += outcomes[i].prob;
    if (r <= acc) return i;
  }

  return outcomes.length - 1;
}

function computeExpectationFromFreqs(freqs) {
  // ordine celle: ++, +-, -+, --
  return freqs[0] - freqs[1] - freqs[2] + freqs[3];
}

function computeTheoretical() {
  const rows = {};

  for (const measurement of MEASUREMENTS) {
    const freqs = measurement.outcomes.map((o) => o.prob);
    rows[measurement.id] = {
      counts: [null, null, null, null],
      freqs,
      E: computeExpectationFromFreqs(freqs),
    };
  }

  const S = Math.abs(rows.AB.E - rows.ABp.E + rows.ApB.E + rows.ApBp.E);

  return { rows, S };
}

function createDeterministicSimulation(sampleSize) {
  const rows = {};

  for (const measurement of MEASUREMENTS) {
    const freqs = measurement.outcomes.map((o) => o.prob);

    rows[measurement.id] = {
      counts: [null, null, null, null],
      freqs,
      E: computeExpectationFromFreqs(freqs),
    };
  }

  const S = Math.abs(rows.AB.E - rows.ABp.E + rows.ApB.E + rows.ApBp.E);

  return {
    sampleSize,
    rows,
    S,
    timestamp: null,
  };
}

function simulateRun(sampleSize) {
  const rows = {};

  for (const measurement of MEASUREMENTS) {
    const counts = [0, 0, 0, 0];

    for (let i = 0; i < sampleSize; i += 1) {
      const index = weightedChoiceIndex(measurement.outcomes);
      counts[index] += 1;
    }

    const freqs = counts.map((c) => c / sampleSize);

    rows[measurement.id] = {
      counts,
      freqs,
      E: computeExpectationFromFreqs(freqs),
    };
  }

  const S = Math.abs(rows.AB.E - rows.ABp.E + rows.ApB.E + rows.ApBp.E);

  return {
    sampleSize,
    rows,
    S,
    timestamp: null,
  };
}

function polarPoint(cx, cy, radius, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function parseOutcomeLabel(label) {
  const m = label.match(/^\(([^,]+),([^)]+)\)$/);

  if (!m) {
    return {
      open: "",
      red: label,
      comma: "",
      blue: "",
      close: "",
    };
  }

  return {
    open: "(",
    red: m[1],
    comma: ",",
    blue: m[2],
    close: ")",
  };
}

function ColoredPairLabel({ outcome }) {
  const parts = parseOutcomeLabel(outcome.label);

  return (
    <div
      style={{
        marginTop: 10,
        fontSize: 16,
        fontWeight: 600,
        textAlign: "center",
        lineHeight: 1.2,
        minHeight: 22,
      }}
    >
      <span>{parts.open}</span>
      <span style={{ color: "#d62828" }}>{parts.red}</span>
      <span>{parts.comma}</span>
      <span style={{ color: "#1d4ed8" }}>{parts.blue}</span>
      <span>{parts.close}</span>
    </div>
  );
}

function MiniClock({ redDir, blueDir }) {
  const cx = 90;
  const cy = 82;
  const circleR = 52;
  const handLen = 42;
  const ringR1 = 67;
  const ringR2 = 81;

  const red = DIRECTIONS[redDir];
  const blue = DIRECTIONS[blueDir];

  const redEnd = polarPoint(cx, cy, handLen, red.deg);
  const blueEnd = polarPoint(cx, cy, handLen, blue.deg);

  const redText = polarPoint(cx, cy, ringR1, red.deg);
  const blueText = polarPoint(cx, cy, ringR2, blue.deg);

  return (
    <svg width="180" height="170" viewBox="0 0 180 170">
      <circle
        cx={cx}
        cy={cy}
        r={circleR}
        fill="#fbfbfb"
        stroke="#2f2f2f"
        strokeWidth="2.2"
      />

      <line
        x1={cx}
        y1={cy}
        x2={redEnd.x}
        y2={redEnd.y}
        stroke="#d62828"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <line
        x1={cx}
        y1={cy}
        x2={blueEnd.x}
        y2={blueEnd.y}
        stroke="#1d4ed8"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      <circle cx={cx} cy={cy} r="3" fill="#333" />

      <text
        x={redText.x}
        y={redText.y}
        fill="#d62828"
        fontSize="13"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {red.label}
      </text>

      <text
        x={blueText.x}
        y={blueText.y}
        fill="#1d4ed8"
        fontSize="13"
        fontWeight="700"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {blue.label}
      </text>
    </svg>
  );
}

function OutcomeCell({ outcome, count, freq }) {
  const countText = count == null ? "—" : String(count);

  return (
    <div
      style={{
        width: GRID_CELL_W,
        minHeight: GRID_CELL_H,
        border: "1px solid #d6d6d6",
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "14px 10px 12px",
        boxSizing: "border-box",
      }}
    >
      <MiniClock redDir={outcome.redDir} blueDir={outcome.blueDir} />

      <ColoredPairLabel outcome={outcome} />

      <div
        style={{
          marginTop: 12,
          width: "100%",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          color: "#222",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        <div>
          p = <strong>{format3(outcome.prob)}</strong>
        </div>
        <div>
          n = <strong>{countText}</strong>
        </div>
        <div>
          f = <strong>{format3(freq)}</strong>
        </div>
      </div>

      <div
        style={{
          marginTop: 10,
          width: "85%",
          height: 8,
          borderRadius: 999,
          background: "#ececec",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(0, Math.min(100, freq * 100))}%`,
            height: "100%",
            background: "#6b7280",
          }}
        />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        minWidth: 150,
        padding: "12px 14px",
        borderRadius: 12,
        background: "#fff",
        border: "1px solid #ddd",
      }}
    >
      <div style={{ fontSize: 13, color: "#555" }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4 }}>{value}</div>
      {subtitle ? (
        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}

const buttonStyle = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #2563eb",
  background: "#2563eb",
  color: "#fff",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const buttonStyleSecondary = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  color: "#3730a3",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

const buttonStyleGhost = {
  height: 40,
  padding: "0 14px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
};

export default function WindCHSHSimulator() {
  const [participants, setParticipants] = useState(85);
  const [simulation, setSimulation] = useState(() =>
    createDeterministicSimulation(85),
  );

  const theoretical = useMemo(() => computeTheoretical(), []);

  function handleSimulate(n) {
    const size = clampParticipants(n);
    setParticipants(size);
    setSimulation(simulateRun(size));
  }

  function handleInputChange(e) {
    setParticipants(clampParticipants(e.target.value));
  }

  function handleReset() {
    setParticipants(85);
    setSimulation(createDeterministicSimulation(85));
  }

  const simRows = simulation.rows;

  return (
    <div
      style={{
        padding: 20,
        background: "#f3f4f6",
        border: "1px solid #d1d5db",
        borderRadius: 18,
        color: "#111827",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 28, fontWeight: 800 }}>
          Simulatore React · Wind CHSH
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 15,
            color: "#4b5563",
            maxWidth: 980,
          }}
        >
          Ogni riga è un test del questionario. Ogni cella è una delle 4
          risposte possibili per quel test. Lo stato iniziale è deterministico,
          così non ci sono problemi di hydration. La simulazione Monte Carlo
          parte solo quando premi “Simula”.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "flex-end",
          marginBottom: 18,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#555" }}>
            Numero partecipanti
          </span>
          <input
            type="number"
            min="1"
            value={participants}
            onChange={handleInputChange}
            style={{
              width: 140,
              height: 38,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid #c9c9c9",
              fontSize: 16,
              background: "#fff",
            }}
          />
        </label>

        <button
          onClick={() => handleSimulate(participants)}
          style={buttonStyle}
        >
          Simula
        </button>

        <button onClick={() => handleSimulate(85)} style={buttonStyleSecondary}>
          Simula 85
        </button>

        <button
          onClick={() => handleSimulate(8500)}
          style={buttonStyleSecondary}
        >
          Simula 8500
        </button>

        <button onClick={handleReset} style={buttonStyleGhost}>
          Reset
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <SummaryCard
          title="S simulato"
          value={format3(simulation.S)}
          subtitle={`N = ${simulation.sampleSize}`}
        />
        <SummaryCard
          title="S teorico"
          value={format3(theoretical.S)}
          subtitle="atteso dai dati pubblicati"
        />
        <SummaryCard
          title="Violazione CHSH"
          value={simulation.S > 2 ? "Sì" : "No"}
          subtitle="criterio: S > 2"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `${ROW_LABEL_W}px repeat(4, ${GRID_CELL_W}px)`,
          alignItems: "stretch",
          background: "#f8f8f8",
          border: "1px solid #ddd",
          overflowX: "auto",
        }}
      >
        {MEASUREMENTS.map((measurement) => (
          <React.Fragment key={measurement.id}>
            <div
              style={{
                minHeight: GRID_CELL_H,
                borderRight: "1px solid #ddd",
                borderBottom: "1px solid #ddd",
                background: "#f7f7f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                boxSizing: "border-box",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  {measurement.rowLabel}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily:
                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                    fontSize: 13,
                    color: "#4b5563",
                    lineHeight: 1.6,
                  }}
                >
                  <div>E = {format3(simRows[measurement.id].E)}</div>
                  <div>E* = {format3(theoretical.rows[measurement.id].E)}</div>
                </div>
              </div>
            </div>

            {measurement.outcomes.map((outcome, index) => (
              <OutcomeCell
                key={outcome.id}
                outcome={outcome}
                count={simRows[measurement.id].counts[index]}
                freq={simRows[measurement.id].freqs[index]}
              />
            ))}
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 14,
          background: "#fff",
          border: "1px solid #ddd",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          lineHeight: 1.8,
          whiteSpace: "pre-wrap",
        }}
      >
        {`E(AB)   = ${format3(simRows.AB.E)}
E(AB')  = ${format3(simRows.ABp.E)}
E(A'B)  = ${format3(simRows.ApB.E)}
E(A'B') = ${format3(simRows.ApBp.E)}

S = |E(AB) - E(AB') + E(A'B) + E(A'B')|
  = ${format3(simulation.S)}`}
      </div>
    </div>
  );
}
