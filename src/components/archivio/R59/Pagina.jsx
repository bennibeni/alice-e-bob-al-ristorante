// https://www.youtube.com/watch?v=GkXDCwzsXSg&t=1358s
"use client";

// Da Next07/R04. Rimosso usePageSharedStateSync (hook specifico di Next07).
import WindCHSHSimulator from "./Grid4x4WithVectors";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <WindCHSHSimulator />
    </div>
  );
}
