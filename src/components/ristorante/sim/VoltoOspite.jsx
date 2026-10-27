import Image from "next/image";

export default function VoltoOspite({ nome }) {
  const personaggio = { Alice: "alice", Bob: "bob", Charlie: "charlie" }[nome] || "charlie";
  return <Image src={`/r04/volti/${personaggio}.svg`} width={96} height={84} alt={`Volto di ${nome}`} />;
}
