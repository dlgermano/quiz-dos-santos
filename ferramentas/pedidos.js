// Monta os pedidos de geração de um lote, a partir do prompts-higgsfield.md.
// Uso: node ferramentas/pedidos.js <santos|simbolos|nossasenhora|novotestamento|antigotestamento> <id> [<id> ...]   (acrescente "id=texto extra" para corrigir uma refação)
const fs = require("fs"), path = require("path");
const md = fs.readFileSync(path.join(__dirname, "..", "prompts-higgsfield.md"), "utf8");
const [serie, ...args] = process.argv.slice(2);
const MARCA = { santos: "[FIGURA]", simbolos: "[OBJETOS]", nossasenhora: "[SENHORA]", novotestamento: "[CENA]", antigotestamento: "[CENA]" }[serie];
if (!MARCA || !args.length) { console.log("Uso: node ferramentas/pedidos.js <santos|simbolos|nossasenhora|novotestamento|antigotestamento> <id> [<id> ...]"); process.exit(2); }

const base = md.split(/\r?\n/).find(l => l.startsWith("> Gothic") && l.includes(MARCA)).slice(2).trim();
const linhas = {};
let n = 0;
for (const l of md.split(/\r?\n/)) {
  const c = l.split("|").map(s => s.trim());
  if (c.length >= 8 && /^\d+$/.test(c[1])) linhas[c[2]] = { index: +c[1], figura: c[4], objetos: c[6] };
}
const pedidos = args.map(a => {
  const [id, extra] = a.split("=");
  const l = linhas[id];
  if (!l) { console.error("id desconhecido: " + id); process.exit(2); }
  const prompt = base.replace(MARCA, serie === "simbolos" ? l.objetos : l.figura) + (extra ? ", " + extra : "");
  return { index: l.index, params: { model: "gpt_image_2_5", aspect_ratio: "3:4", quality: "high", resolution: "1k", prompt } };
});
console.log(JSON.stringify(pedidos));
