import Link from "next/link";
import CHSHGame from "../../components/laboratorio/CHSHGame";

export const metadata = {
  title: "Laboratorio CHSH · Alice e Bob al ristorante",
  description: "Esplora le strategie classiche e le correlazioni quantistiche del gioco CHSH con Alice e Bob.",
};

export default async function LaboratorioPage({ searchParams }) {
  const { capitolo } = await searchParams;
  const ritorno = typeof capitolo === "string" && /^[a-z0-9-]+$/.test(capitolo)
    ? `/#${capitolo}` : "/";
  return <main className="mx-auto max-w-6xl px-4 py-6">
    <nav aria-label="Navigazione del laboratorio" className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <Link href={ritorno} className="rounded-md border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100">← Torna al racconto</Link>
      <span className="text-sm font-semibold text-zinc-700">Laboratorio CHSH</span>
    </nav>
    <CHSHGame />
  </main>;
}
