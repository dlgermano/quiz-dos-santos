// Testes do jogo sem navegador. Uso: node testes/verifica.js
const { carregar } = require("./carregar");

const falhas = [];
let total = 0;
const confere = (cond, msg) => { total++; if (!cond) falhas.push(msg); };

const MULHERES = "teresinha luzia catarina barbara clara rita cecilia apolonia helena joana edwiges rosalima faustina bernadete teresaavila teresacalcuta bakhita madalena".split(" ");

// A. Dados
{
  const { q } = carregar();
  confere(!!q, "A: window.__quiz não existe");
  if (q) {
    const ids = q.SAINTS.map(s => s.id);
    confere(ids.length === 68, `A: esperava 68 santos, achei ${ids.length}`);
    confere(new Set(ids).size === ids.length, "A: há ids repetidos");
    confere(q.SAINTS.every(s => s.sex === "m" || s.sex === "f"), "A: há santo sem sex válido");
    const f = q.SAINTS.filter(s => s.sex === "f").map(s => s.id).sort();
    confere(f.join() === MULHERES.slice().sort().join(), `A: lista de mulheres difere: ${f.join(" ")}`);
    confere(q.SAINTS.filter(s => s.sex === "m").length === 50, "A: esperava 50 homens");
    confere(q.SAINTS.every(s => s.name && s.feast && s.why), "A: há santo sem nome, festa ou explicação");
    confere(q.SAINTS.every(s => { const v = q.windowSVG(s); return v.includes("<svg") && !/NaN|undefined/.test(v); }), "A: há desenho SVG com defeito");
  }
}

// E. Partida inteira por nível (modo padrão)
{
  const { q } = carregar();
  if (q) for (const [nivel] of q.LEVELS) {
    q.setLevel(nivel);
    for (let r = 0; r < 10; r++) {
      const st = q.state(), ans = st.order[st.i];
      confere(st.opts.length === 4 && new Set(st.opts).size === 4 && st.opts.includes(ans), `E: opções erradas em ${nivel}, rodada ${r + 1}`);
      q.pick(r % 2 ? ans : st.opts.find(o => o !== ans));
      q.next();
    }
    confere(q.state().hits === 5, `E: esperava 5 acertos em ${nivel}, achei ${q.state().hits}`);
    confere(new Set(q.state().order).size === 10, `E: santo repetido na partida em ${nivel}`);
  }
}

console.log(`${total - falhas.length} de ${total} conferências passaram`);
if (falhas.length) { console.log(falhas.join("\n")); process.exit(1); }
