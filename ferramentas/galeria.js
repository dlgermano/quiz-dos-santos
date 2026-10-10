// Monta a galeria de aprovação de um nível, com os originais das duas séries lado a lado.
// Uso: node ferramentas/galeria.js <facil|medio|dificil|preparados>
const fs = require("fs"), path = require("path");
const { carregar, RAIZ } = require("../testes/carregar");

const nivel = process.argv[2];
const { q } = carregar();
// "preparados" lista os santos que ainda não entraram no jogo, de todos os níveis
if (!["facil", "medio", "dificil", "preparados"].includes(nivel)) { console.log("Uso: node ferramentas/galeria.js <facil|medio|dificil|preparados>"); process.exit(2); }
const idsDoNivel = nivel === "preparados" ? q.SAINTS.filter(s => !q.ativo(s)).map(s => s.id) : q.poolFor(nivel);

// Tabela do prompts-higgsfield.md: | # | id | Santo | Figura | Conferir figura | Objetos |
const linhas = {};
for (const l of fs.readFileSync(path.join(RAIZ, "prompts-higgsfield.md"), "utf8").split(/\r?\n/)) {
  const c = l.split("|").map(s => s.trim());
  if (c.length >= 8 && /^\d+$/.test(c[1])) linhas[c[2]] = { figura: c[5], objetos: c[6] };
}
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const quadro = (serie, id) => fs.existsSync(path.join(RAIZ, "img", "originais", serie, `${id}.png`))
  ? `<img src="img/originais/${serie}/${id}.png" loading="lazy">` : `<div class="falta">sem imagem: fica o desenho</div>`;

const cartoes = idsDoNivel.map(id => {
  const s = q.SAINTS.find(x => x.id === id), p = linhas[id] || { figura: "", objetos: "" };
  return `<section><h2>${esc(s.name)} <small>${id}</small></h2><div class="par">
    <figure>${quadro("santos", id)}<figcaption><b>Imagem.</b> Conferir: ${esc(p.figura)}</figcaption></figure>
    <figure>${quadro("simbolos", id)}<figcaption><b>Símbolos.</b> Pedido: ${esc(p.objetos)}</figcaption></figure>
  </div></section>`;
}).join("\n");

const saida = path.join(RAIZ, `galeria-${nivel}.html`);
fs.writeFileSync(saida, `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Galeria: nível ${nivel}</title>
<style>body{margin:0;padding:16px;background:#e4e8ee;color:#1a2030;font:16px system-ui,sans-serif}
h1{margin:0 0 12px}h2{margin:24px 0 8px;font-size:1.2rem}small{color:#5a6478;font-weight:400}
.par{display:grid;grid-template-columns:repeat(2,minmax(0,380px));gap:16px}figure{margin:0}
img{width:100%;height:auto;display:block;border-radius:6px}figcaption{font-size:.9rem;padding-top:6px}
.falta{aspect-ratio:3/4;display:grid;place-items:center;border:2px dashed #c9d0db;border-radius:6px;color:#5a6478}</style>
<h1>Galeria de aprovação: nível ${nivel} (${idsDoNivel.length} santos)</h1>
${cartoes}</html>`);
console.log(saida);
