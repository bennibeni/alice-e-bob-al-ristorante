"use client";

import React, { useMemo, useState } from "react";

const DIRECTIONS = {
  N: { label: "N", deg: 0, warmth: -1 },
  NE: { label: "NE", deg: 45, warmth: -1 },
  E: { label: "E", deg: 90, warmth: 0 },
  SE: { label: "SE", deg: 135, warmth: 1 },
  S: { label: "S", deg: 180, warmth: 1 },
  SO: { label: "SO", deg: 225, warmth: 1 },
  O: { label: "O", deg: 270, warmth: 0 },
  NO: { label: "NO", deg: 315, warmth: -1 },
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
      },
      {
        id: "A1B2",
        label: "(A1,B2)",
        redVar: "A1",
        blueVar: "B2",
        redDir: "N",
        blueDir: "SO",
      },
      {
        id: "A2B1",
        label: "(A2,B1)",
        redVar: "A2",
        blueVar: "B1",
        redDir: "S",
        blueDir: "NE",
      },
      {
        id: "A2B2",
        label: "(A2,B2)",
        redVar: "A2",
        blueVar: "B2",
        redDir: "S",
        blueDir: "SO",
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
      },
      {
        id: "A1Bp2",
        label: "(A1,B'2)",
        redVar: "A1",
        blueVar: "B'2",
        redDir: "N",
        blueDir: "NO",
      },
      {
        id: "A2Bp1",
        label: "(A2,B'1)",
        redVar: "A2",
        blueVar: "B'1",
        redDir: "S",
        blueDir: "SE",
      },
      {
        id: "A2Bp2",
        label: "(A2,B'2)",
        redVar: "A2",
        blueVar: "B'2",
        redDir: "S",
        blueDir: "NO",
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
      },
      {
        id: "Ap1B2",
        label: "(A'1,B2)",
        redVar: "A'1",
        blueVar: "B2",
        redDir: "E",
        blueDir: "SO",
      },
      {
        id: "Ap2B1",
        label: "(A'2,B1)",
        redVar: "A'2",
        blueVar: "B1",
        redDir: "O",
        blueDir: "NE",
      },
      {
        id: "Ap2B2",
        label: "(A'2,B2)",
        redVar: "A'2",
        blueVar: "B2",
        redDir: "O",
        blueDir: "SO",
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
      },
      {
        id: "Ap1Bp2",
        label: "(A'1,B'2)",
        redVar: "A'1",
        blueVar: "B'2",
        redDir: "E",
        blueDir: "NO",
      },
      {
        id: "Ap2Bp1",
        label: "(A'2,B'1)",
        redVar: "A'2",
        blueVar: "B'1",
        redDir: "O",
        blueDir: "SE",
      },
      {
        id: "Ap2Bp2",
        label: "(A'2,B'2)",
        redVar: "A'2",
        blueVar: "B'2",
        redDir: "O",
        blueDir: "NO",
      },
    ],
  },
];

const MODEL_OPTIONS = [
  { id: "randomUniform", label: "Casuale uniforme" },
  { id: "localHiddenS2", label: "Locale classico saturato (S = 2)" },
  { id: "geometryMaxDiff", label: "Geometria: massima differenza angolare" },
  {
    id: "semanticContrast",
    label: "Semantica: contrasto caldo/freddo + angolo",
  },
];

const GRID_CELL_W = 220;
const GRID_CELL_H = 262;
const ROW_LABEL_W = 110;

function clampParticipants(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 100;
  return Math.max(1, Math.floor(n));
}

function format3(x) {
  return Number(x).toFixed(3);
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

function computeExpectationFromFreqs(freqs) {
  return freqs[0] - freqs[1] - freqs[2] + freqs[3];
}

function createEmptyRows() {
  const rows = {};

  for (const measurement of MEASUREMENTS) {
    rows[measurement.id] = {
      counts: [0, 0, 0, 0],
      freqs: [0, 0, 0, 0],
      E: 0,
    };
  }

  return rows;
}

function createEmptyDatasetState() {
  return {
    participants: [],
    sampleSize: 0,
    rows: createEmptyRows(),
    S: 0,
    model: "randomUniform",
  };
}

function randomSign() {
  return Math.random() < 0.5 ? 1 : -1;
}

function choiceUniform4() {
  return Math.floor(Math.random() * 4);
}

function choiceWeighted(weights) {
  const total = weights.reduce((acc, w) => acc + w, 0);
  if (total <= 0) return choiceUniform4();

  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i += 1) {
    r -= weights[i];
    if (r <= 0) return i;
  }
  return weights.length - 1;
}

function softmaxChoice(scores, temperature = 60) {
  const weights = scores.map((score) => Math.exp(score / temperature));
  return choiceWeighted(weights);
}

function circularAngularDistanceDeg(dirA, dirB) {
  const a = DIRECTIONS[dirA].deg;
  const b = DIRECTIONS[dirB].deg;
  const raw = Math.abs(a - b);
  return Math.min(raw, 360 - raw);
}

function warmthGap(dirA, dirB) {
  return Math.abs(DIRECTIONS[dirA].warmth - DIRECTIONS[dirB].warmth);
}

function outcomeIndexFromSigns(leftSign, rightSign) {
  if (leftSign === 1 && rightSign === 1) return 0;
  if (leftSign === 1 && rightSign === -1) return 1;
  if (leftSign === -1 && rightSign === 1) return 2;
  return 3;
}

function modelLabel(modelId) {
  return MODEL_OPTIONS.find((m) => m.id === modelId)?.label || modelId;
}

function simulateRandomUniformParticipants(sampleSize) {
  const participants = [];

  for (let i = 0; i < sampleSize; i += 1) {
    participants.push({
      id: i + 1,
      AB: choiceUniform4(),
      ABp: choiceUniform4(),
      ApB: choiceUniform4(),
      ApBp: choiceUniform4(),
    });
  }

  return participants;
}

function simulateLocalHiddenS2Participants(sampleSize) {
  const participants = [];

  for (let i = 0; i < sampleSize; i += 1) {
    const b = randomSign();
    const bPrime = randomSign();

    let a = randomSign();
    let aPrime = randomSign();

    if (b === bPrime) {
      aPrime = b;
    } else {
      a = b;
    }

    participants.push({
      id: i + 1,
      AB: outcomeIndexFromSigns(a, b),
      ABp: outcomeIndexFromSigns(a, bPrime),
      ApB: outcomeIndexFromSigns(aPrime, b),
      ApBp: outcomeIndexFromSigns(aPrime, bPrime),
    });
  }

  return participants;
}

function simulateGeometryMaxDiffParticipants(sampleSize) {
  const participants = [];

  for (let i = 0; i < sampleSize; i += 1) {
    const participantTemperature = 60 + (Math.random() * 20 - 10);

    const record = { id: i + 1 };

    for (const measurement of MEASUREMENTS) {
      const scores = measurement.outcomes.map((outcome) =>
        circularAngularDistanceDeg(outcome.redDir, outcome.blueDir),
      );

      record[measurement.id] = softmaxChoice(scores, participantTemperature);
    }

    participants.push(record);
  }

  return participants;
}

function simulateSemanticContrastParticipants(sampleSize) {
  const participants = [];

  for (let i = 0; i < sampleSize; i += 1) {
    const angleWeight = 0.45 + Math.random() * 0.25;
    const warmthWeight = 22 + Math.random() * 16;
    const oppositionBonus = 10 + Math.random() * 12;
    const participantTemperature = 46 + Math.random() * 14;

    const record = { id: i + 1 };

    for (const measurement of MEASUREMENTS) {
      const scores = measurement.outcomes.map((outcome) => {
        const angle = circularAngularDistanceDeg(
          outcome.redDir,
          outcome.blueDir,
        );
        const warmGap = warmthGap(outcome.redDir, outcome.blueDir);
        const isStrongOpposition = angle >= 135 ? 1 : 0;

        return (
          angleWeight * angle +
          warmthWeight * warmGap +
          oppositionBonus * isStrongOpposition
        );
      });

      record[measurement.id] = softmaxChoice(scores, participantTemperature);
    }

    participants.push(record);
  }

  return participants;
}

function aggregateParticipants(participants) {
  const rows = createEmptyRows();

  for (const participant of participants) {
    rows.AB.counts[participant.AB] += 1;
    rows.ABp.counts[participant.ABp] += 1;
    rows.ApB.counts[participant.ApB] += 1;
    rows.ApBp.counts[participant.ApBp] += 1;
  }

  const n = participants.length;

  for (const measurement of MEASUREMENTS) {
    const row = rows[measurement.id];
    row.freqs = n === 0 ? [0, 0, 0, 0] : row.counts.map((c) => c / n);
    row.E = computeExpectationFromFreqs(row.freqs);
  }

  const S = Math.abs(rows.AB.E - rows.ABp.E + rows.ApB.E + rows.ApBp.E);

  return {
    participants,
    sampleSize: n,
    rows,
    S,
  };
}

function simulateDataset(sampleSize, model) {
  let participants = [];

  if (model === "randomUniform") {
    participants = simulateRandomUniformParticipants(sampleSize);
  } else if (model === "localHiddenS2") {
    participants = simulateLocalHiddenS2Participants(sampleSize);
  } else if (model === "geometryMaxDiff") {
    participants = simulateGeometryMaxDiffParticipants(sampleSize);
  } else if (model === "semanticContrast") {
    participants = simulateSemanticContrastParticipants(sampleSize);
  }

  return {
    ...aggregateParticipants(participants),
    model,
  };
}

function SummaryCard({ title, value, subtitle }) {
  return (
    <div
      style={{
        minWidth: 160,
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
          n = <strong>{count}</strong>
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

function ParticipantsPreview({ participants }) {
  const preview = participants.slice(0, 8);

  return (
    <div
      style={{
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #ddd",
        overflowX: "auto",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        Anteprima dataset sintetico
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          minWidth: 560,
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>id</th>
            <th style={thStyle}>AB</th>
            <th style={thStyle}>AB{"'"}</th>
            <th style={thStyle}>A{"'"}B</th>
            <th style={thStyle}>
              A{"'"}B{"'"}
            </th>
          </tr>
        </thead>
        <tbody>
          {preview.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{MEASUREMENTS[0].outcomes[p.AB].label}</td>
              <td style={tdStyle}>{MEASUREMENTS[1].outcomes[p.ABp].label}</td>
              <td style={tdStyle}>{MEASUREMENTS[2].outcomes[p.ApB].label}</td>
              <td style={tdStyle}>{MEASUREMENTS[3].outcomes[p.ApBp].label}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
        Mostro solo i primi 8 partecipanti sintetici.
      </div>
    </div>
  );
}

function FinalSummaryTable({ dataset }) {
  return (
    <div
      style={{
        marginTop: 18,
        padding: 14,
        borderRadius: 14,
        background: "#fff",
        border: "1px solid #ddd",
        overflowX: "auto",
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
        Tabella finale
      </div>

      <table
        style={{
          borderCollapse: "collapse",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          minWidth: 620,
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Modello</th>
            <th style={thStyle}>E(AB)</th>
            <th style={thStyle}>E(AB{"'"})</th>
            <th style={thStyle}>E(A{"'"}B)</th>
            <th style={thStyle}>
              E(A{"'"}B{"'"})
            </th>
            <th style={thStyle}>S</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>{modelLabel(dataset.model)}</td>
            <td style={tdStyle}>{format3(dataset.rows.AB.E)}</td>
            <td style={tdStyle}>{format3(dataset.rows.ABp.E)}</td>
            <td style={tdStyle}>{format3(dataset.rows.ApB.E)}</td>
            <td style={tdStyle}>{format3(dataset.rows.ApBp.E)}</td>
            <td style={tdStyle}>{format3(dataset.S)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #d8d8d8",
  padding: "8px 10px",
  textAlign: "left",
  background: "#f3f4f6",
};

const tdStyle = {
  border: "1px solid #e2e2e2",
  padding: "8px 10px",
  textAlign: "left",
};

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

function Grid4x4WithVectors() {
  const [participantsInput, setParticipantsInput] = useState(100);
  const [model, setModel] = useState("randomUniform");
  const [dataset, setDataset] = useState(() => createEmptyDatasetState());

  const simRows = dataset.rows;

  const quickExpectation = useMemo(() => {
    if (model === "randomUniform") {
      return "Atteso: celle circa 0.25, E circa 0, S circa 0";
    }
    if (model === "localHiddenS2") {
      return "Atteso: modello classico locale strutturato, S circa 2 ma non oltre";
    }
    if (model === "geometryMaxDiff") {
      return "Atteso: preferenza per coppie piu opposte, possibile S maggiore di 2";
    }
    if (model === "semanticContrast") {
      return "Atteso: contrasto sintetico caldo/freddo piu angolo, possibile S maggiore di 2";
    }
    return "";
  }, [model]);

  function handleGenerate(n = participantsInput) {
    const size = clampParticipants(n);
    setParticipantsInput(size);
    setDataset(simulateDataset(size, model));
  }

  function handleReset() {
    setParticipantsInput(100);
    setModel("randomUniform");
    setDataset(createEmptyDatasetState());
  }

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
          Strumento raccolta dati · Wind CHSH
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 15,
            color: "#4b5563",
            maxWidth: 980,
          }}
        >
          Questa versione non usa alcun esito del paper. Genera singoli
          partecipanti sintetici, registra le loro 4 risposte e calcola i valori
          CHSH a partire dal dataset prodotto.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
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
            value={participantsInput}
            onChange={(e) =>
              setParticipantsInput(clampParticipants(e.target.value))
            }
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

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#555" }}>
            Modello partecipanti
          </span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={{
              width: 340,
              height: 40,
              padding: "0 10px",
              borderRadius: 10,
              border: "1px solid #c9c9c9",
              fontSize: 15,
              background: "#fff",
            }}
          >
            {MODEL_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button onClick={() => handleGenerate()} style={buttonStyle}>
          Genera dataset
        </button>

        <button onClick={() => handleGenerate(85)} style={buttonStyleSecondary}>
          Genera 85
        </button>

        <button
          onClick={() => handleGenerate(8500)}
          style={buttonStyleSecondary}
        >
          Genera 8500
        </button>

        <button onClick={handleReset} style={buttonStyleGhost}>
          Reset
        </button>
      </div>

      <div
        style={{
          marginBottom: 18,
          padding: "10px 12px",
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #ddd",
          fontSize: 14,
          color: "#374151",
        }}
      >
        {quickExpectation}
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
          title="S osservato"
          value={format3(dataset.S)}
          subtitle={`N = ${dataset.sampleSize}`}
        />
        <SummaryCard
          title="Violazione CHSH"
          value={dataset.S > 2 ? "Sì" : "No"}
          subtitle="criterio: S > 2"
        />
        <SummaryCard
          title="Modello"
          value={modelLabel(dataset.model)}
          subtitle="nessun dato del paper"
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
      >{`E(AB)   = ${format3(simRows.AB.E)}
E(AB')  = ${format3(simRows.ABp.E)}
E(A'B)  = ${format3(simRows.ApB.E)}
E(A'B') = ${format3(simRows.ApBp.E)}

S = |E(AB) - E(AB') + E(A'B) + E(A'B')|
  = ${format3(dataset.S)}`}</div>

      {dataset.sampleSize > 0 ? <FinalSummaryTable dataset={dataset} /> : null}

      {dataset.sampleSize > 0 ? (
        <ParticipantsPreview participants={dataset.participants} />
      ) : null}
    </div>
  );
}

export { Grid4x4WithVectors as WindCHSHSimulator };
export default Grid4x4WithVectors;
