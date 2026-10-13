// Teste do jogo sem internet, num Edge de verdade: guarda as imagens, desliga o servidor e joga de novo.
// Uso: node testes/offline.js
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os"), { spawn } = require("child_process");
const RAIZ = path.join(__dirname, "..");
const PORTA = 8768, DEPURA = 9334;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
const dorme = ms => new Promise(ok => setTimeout(ok, ms));

const linhas = [];
let falhou = false;
const relata = (nome, prob) => { linhas.push(`${nome}: problemas: ${prob.length ? prob.join("; ") : "nenhum"}`); if (prob.length) falhou = true; };

(async () => {
  const conexoes = new Set();
  const servidor = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]);
    const arq = path.join(RAIZ, rel.endsWith("/") ? rel + "index.html" : rel);
    if (!arq.startsWith(RAIZ) || !fs.existsSync(arq) || fs.statSync(arq).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": TIPOS[path.extname(arq)] || "application/octet-stream" });
    fs.createReadStream(arq).pipe(res);
  });
  servidor.on("connection", c => { conexoes.add(c); c.on("close", () => conexoes.delete(c)); });
  await new Promise(ok => servidor.listen(PORTA, "127.0.0.1", ok));

  const edge = ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"].find(p => fs.existsSync(p));
  if (!edge) { console.log("Edge não encontrado"); process.exit(2); }
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), "quiz-santos-offline-"));
  const nav = spawn(edge, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${DEPURA}`, `--user-data-dir=${perfil}`, "--window-size=420,900", "about:blank"], { stdio: "ignore" });

  try {
    let alvo;
    for (let i = 0; i < 50 && !alvo; i++) {
      await dorme(200);
      alvo = await fetch(`http://127.0.0.1:${DEPURA}/json/list`).then(r => r.json()).then(l => l.find(t => t.type === "page")).catch(() => null);
    }
    if (!alvo) throw new Error("o Edge não abriu a porta de depuração");
    const ws = new WebSocket(alvo.webSocketDebuggerUrl);
    await new Promise((ok, erro) => { ws.onopen = ok; ws.onerror = erro; });
    let seq = 0;
    const espera = new Map();
    ws.onmessage = m => { const d = JSON.parse(m.data); if (espera.has(d.id)) { espera.get(d.id)(d); espera.delete(d.id); } };
    const manda = (method, params = {}) => new Promise(ok => { const id = ++seq; espera.set(id, ok); ws.send(JSON.stringify({ id, method, params })); });
    // Roda um trecho de JavaScript na página e devolve o valor
    const roda = async js => {
      const r = await manda("Runtime.evaluate", { expression: `(async () => { ${js} })()`, awaitPromise: true, returnByValue: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "erro na página");
      return r.result?.result?.value;
    };
    const ate = async (js, segundos) => { for (let i = 0; i < segundos * 5; i++) { if (await roda(js).catch(() => false)) return true; await dorme(200); } return false; };
    const url = `http://127.0.0.1:${PORTA}/`;
    const rodape = () => roda(`return document.getElementById("foot").textContent`);
    const vitral = `(() => { const i = document.querySelector("#art img"); return !!i && i.complete && i.naturalWidth > 0; })()`;

    // 1. Com o servidor ligado: o botão aparece, guarda tudo e o sw.js assume a página
    await manda("Page.navigate", { url });
    let prob = [];
    if (!await ate(`return !!document.querySelector("#foot button")`, 15)) prob.push("o botão de guardar não apareceu: " + await rodape().catch(() => "página não abriu"));
    else {
      const texto = await rodape();
      if (!/cerca de \d+ MB/.test(texto)) prob.push("o convite não diz o tamanho: " + texto);
      // CAPTURA=arquivo.png fotografa a página com o convite no rodapé
      if (process.env.CAPTURA) {
        await roda(`document.getElementById("foot").scrollIntoView()`);
        fs.writeFileSync(process.env.CAPTURA, Buffer.from((await manda("Page.captureScreenshot")).result.data, "base64"));
      }
      await roda(`document.querySelector("#foot button").click()`);
      if (!await ate(`return document.getElementById("foot").textContent.startsWith("Pronto")`, 120)) prob.push("não terminou de guardar: " + await rodape());
      const [tem, total] = await roda(`const q = window.__quiz; return [(await (await caches.open("quiz-santos-imagens-v4")).keys()).length, q.COM_FIGURA.length + q.COM_SIMBOLOS.length + Object.values(q.COM_SERIE).flat().length]`);
      if (tem !== total) prob.push(`guardou ${tem} de ${total} imagens`);
      if (!await ate(`return !!navigator.serviceWorker.controller`, 10)) prob.push("o sw.js não assumiu a página");
    }
    await roda(`document.getElementById("livre").click()`);
    for (const modo of ["imagem", "simbolos", "imagem"]) {
      await roda(`document.getElementById("modo-${modo}").click()`);
      const visto = await roda(`return [document.getElementById("modo-${modo}").getAttribute("aria-pressed"), document.querySelector("#art img")?.getAttribute("src") || "sem imagem"]`);
      if (visto[0] !== "true" || !visto[1].startsWith(modo === "imagem" ? "img/santos/" : "img/simbolos/")) prob.push(`depois de guardar, modo ${modo}: botão marcado = ${visto[0]}, quadro = ${visto[1]}`);
    }
    relata("guardar para jogar sem internet", prob);

    // 2. Servidor desligado: a página abre de novo e dá para jogar nos dois modos
    await new Promise(ok => { servidor.close(ok); conexoes.forEach(c => c.destroy()); });
    prob = [];
    if (await fetch(url).then(() => true, () => false)) prob.push("o servidor continuou no ar, o teste não vale");
    await manda("Page.navigate", { url: url + "?origem=atalho" });
    if (!await ate(`return document.querySelector("h1")?.textContent === "Quiz dos Santos" && !!document.getElementById("livre")`, 15)) prob.push("a página não abriu");
    else {
      await roda(`document.getElementById("col-santos").click()`);
      if (await roda(`return document.querySelectorAll("#mapa .casa").length`) !== 20) prob.push("sem internet, o mapa não mostrou as 20 etapas");
      await roda(`document.getElementById("ao-inicio").click(); document.getElementById("livre").click()`);
      if (!await ate(`return ${vitral}`, 10)) prob.push("o vitral da primeira rodada não apareceu");
      if (!await ate(`return document.getElementById("foot").textContent.startsWith("Pronto")`, 10)) prob.push("o rodapé não diz que está pronto: " + await rodape());
      for (const modo of ["simbolos", "imagem"]) {
        await roda(`document.getElementById("modo-${modo}").click(); document.getElementById("lvl-todos").click()`);
        const visto = await roda(`return [document.getElementById("modo-${modo}").getAttribute("aria-pressed"), document.querySelector("#art img")?.getAttribute("src") || "sem imagem"]`);
        const pasta = modo === "imagem" ? "img/santos/" : "img/simbolos/";
        if (visto[0] !== "true" || !visto[1].startsWith(pasta)) prob.push(`modo ${modo}: botão marcado = ${visto[0]}, quadro = ${visto[1]}`);
        for (let r = 0; r < 10; r++) {
          if (!await ate(`return ${vitral}`, 10)) { prob.push(`modo ${modo}, rodada ${r + 1}: o vitral não apareceu`); break; }
          await roda(`document.querySelector(".opt").click(); document.getElementById("next").click()`);
        }
        if (!await ate(`return !!document.getElementById("again")`, 5)) prob.push(`modo ${modo}: a partida não chegou ao fim`);
      }
    }
    relata("jogar com o servidor desligado", prob);
    ws.close();
  } catch (e) {
    relata("teste sem internet", ["EXCECAO: " + e.message]);
  } finally {
    nav.kill();
    servidor.close(); conexoes.forEach(c => c.destroy());
    await dorme(800);
    try { fs.rmSync(perfil, { recursive: true, force: true }); } catch (e) {}
  }
  console.log(linhas.join("\n"));
  console.log(falhou ? "FALHOU" : "PASSOU");
  process.exit(falhou ? 1 : 0);
})();
