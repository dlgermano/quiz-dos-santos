// Carrega o <script> do index.html no Node, com um DOM mínimo de mentira.
const fs = require("fs"), path = require("path");
const RAIZ = path.join(__dirname, "..");

// cru = true deixa a página como abre para o jogador (tela inicial). Sem ele, o carregador entra no jogo livre,
// que é de onde partem os testes anteriores ao mapa.
function carregar(storage = {}, hot, extra, cru) {
  const html = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");
  const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const els = {};
  const filho = { classList: { add() {} }, tagName: "svg" };
  const el = id => els[id] ??= { id, dataset: {}, innerHTML: "", textContent: "", focus() {}, querySelectorAll: () => [], querySelector: () => filho };
  const window = hot ? { claude: { hot: { data: hot } } } : {};
  Object.assign(window, extra); // ex.: caches de mentira, para o modo sem internet
  const document = { getElementById: el, addEventListener() {} };
  // storage === "bloqueado" imita o navegador que proíbe o localStorage
  const localStorage = storage === "bloqueado"
    ? { getItem() { throw new Error("bloqueado"); }, setItem() { throw new Error("bloqueado"); } }
    : { getItem: k => (k in storage ? storage[k] : null), setItem(k, v) { storage[k] = String(v); } };
  new Function("window", "document", "localStorage", js)(window, document, localStorage);
  if (!hot && !cru) window.__quiz?.jogoLivre?.();
  return { q: window.__quiz, els, storage };
}

module.exports = { carregar, RAIZ };
