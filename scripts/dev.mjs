import net from "node:net";
import http from "node:http";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const url = "http://localhost:3018/";
const listening = await new Promise((resolve) => {
  const socket = net.createConnection({ host: "localhost", port: 3018 });
  socket.setTimeout(2000);
  socket.once("connect", () => { socket.destroy(); resolve(true); });
  socket.once("error", () => { socket.destroy(); resolve(false); });
  socket.once("timeout", () => { socket.destroy(); resolve(true); });
});

if (listening) {
  const ours = await new Promise((resolve) => {
    const request = http.get(url, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.once("end", () => resolve(response.statusCode === 200 && body.includes("Alice e Bob al ristorante")));
      response.once("error", () => resolve(false));
    });
    request.setTimeout(15000, () => { request.destroy(); resolve(false); });
    request.once("error", () => resolve(false));
  });
  if (ours) {
    console.log(`\nAlice e Bob al ristorante è già in esecuzione.\nContinua nel browser: ${url}\nNon occorre avviare una seconda copia.\n`);
  } else {
    console.error(`\nLa porta 3018 è occupata da un altro servizio oppure il server non risponde.\nControlla ${url} e il terminale del server già avviato.\n`);
    process.exitCode = 1;
  }
} else {
  const require = createRequire(import.meta.url);
  const child = spawn(process.execPath, [require.resolve("next/dist/bin/next"), "dev", "--port", "3018", ...process.argv.slice(2)], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    stdio: "inherit",
    windowsHide: true,
  });
  child.once("error", (error) => { console.error(error.message); process.exitCode = 1; });
  child.once("exit", (code) => { process.exitCode = code ?? 1; });
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
}
