// Testes do jogo sem navegador. Uso: node testes/verifica.js
const { carregar } = require("./carregar");

const falhas = [];
let total = 0;
const confere = (cond, msg) => { total++; if (!cond) falhas.push(msg); };

const MULHERES = "teresinha luzia catarina barbara clara rita cecilia apolonia helena joana edwiges rosalima faustina bernadete teresaavila teresacalcuta bakhita madalena ana monica veronica dulce margaridamaria marta isabel catarinasena efigenia paulina gianna brigida escolastica doroteia edithstein".split(" ");

// A. Dados
{
  const { q } = carregar();
  confere(!!q, "A: window.__quiz não existe");
  if (q) {
    const ids = q.SAINTS.map(s => s.id);
    confere(ids.length === 118, `A: esperava 118 santos no total, achei ${ids.length}`);
    confere(!ids.includes("elias"), "A: Santo Elias foi recusado pelo Daniel e não deveria estar na lista");
    confere(q.levelOf("joaodacruz") === "medio", "A: São João da Cruz deveria ser do nível medio");
    confere(new Set(ids).size === ids.length, "A: há ids repetidos");
    confere(ids.every(id => /^[a-z]+$/.test(id)), "A: há id com letra maiúscula, acento ou espaço");
    const jm = q.SAINTS.find(s => s.id === "josemaria");
    confere(jm && jm.sex === "m" && q.levelOf("josemaria") === "medio" && jm.feast === "26 de junho", "A: São Josemaria deveria existir, ser homem, do nível medio e ter festa em 26 de junho");
    confere(q.SAINTS.every(s => s.sex === "m" || s.sex === "f"), "A: há santo sem sex válido");
    const f = q.SAINTS.filter(s => s.sex === "f").map(s => s.id).sort();
    confere(f.join() === MULHERES.slice().sort().join(), `A: lista de mulheres difere: ${f.join(" ")}`);
    confere(q.SAINTS.filter(s => s.sex === "m").length === 85, "A: esperava 85 homens");
    confere(q.SAINTS.every(s => s.name && s.feast && s.why && s.why.length > 60), "A: há santo sem nome, festa ou explicação");
    confere(new Set(q.SAINTS.map(s => s.name)).size === ids.length, "A: há nomes repetidos");
    confere(q.SAINTS.every(s => { const v = q.windowSVG(s); return v.includes("<svg") && !/NaN|undefined/.test(v); }), "A: há desenho SVG com defeito");
    const porNivel = n => q.SAINTS.filter(s => q.levelOf(s.id) === n).length;
    confere(porNivel("facil") === 35 && porNivel("medio") === 48 && porNivel("dificil") === 35, `A: níveis no total deveriam ser 35/48/35, achei ${porNivel("facil")}/${porNivel("medio")}/${porNivel("dificil")}`);
  }
}

// P. Santos preparados: ficam escondidos até terem as duas imagens aprovadas
{
  const { q } = carregar();
  if (q.ativo) {
    const prontos = q.SAINTS.filter(s => q.ativo(s)), espera = q.SAINTS.filter(s => !q.ativo(s));
    confere(prontos.length + espera.length === 118, "P: contagem de ativos e preparados não fecha");
    confere(espera.every(s => !s.draw), "P: santo com desenho não pode estar escondido");
    const todos = q.poolFor("todos");
    confere(todos.length === prontos.length && espera.every(s => !todos.includes(s.id)), "P: santo sem imagens apareceu no nível Todos");
    for (const [nivel] of q.LEVELS) confere(q.poolFor(nivel).every(id => q.ativo(q.SAINTS.find(s => s.id === id))), `P: santo escondido apareceu no nível ${nivel}`);
    // Usa o primeiro santo ainda escondido, seja qual for, para conferir a regra de liberação
    const novo = espera[0];
    if (novo) {
      const nv = q.levelOf(novo.id);
      confere(!q.poolFor(nv).includes(novo.id), "P: santo sem imagens deveria estar escondido");
      q.COM_FIGURA.push(novo.id);
      confere(!q.poolFor(nv).includes(novo.id), "P: só com a figura, o santo deveria continuar escondido");
      q.COM_SIMBOLOS.push(novo.id);
      confere(q.poolFor(nv).includes(novo.id) && q.poolFor("todos").includes(novo.id), "P: com as duas imagens, o santo deveria aparecer");
      q.COM_FIGURA.pop(); q.COM_SIMBOLOS.pop();
    }
    for (let k = 0; k < 300; k++) {
      const w = q.wrongFor("apolonia", "dificil", "imagem");
      if (w.some(id => !todos.includes(id))) { confere(false, "P: o sorteio do modo imagem devolveu santo escondido"); break; }
    }
  } else confere(false, "P: ativo não existe");
}

// T. Textos depois da resposta: resumo da vida e explicação do vitral
{
  const { q, els } = carregar();
  confere(q.SAINTS.every(s => typeof s.bio === "string" && s.bio.length >= 60), `T: santos sem resumo da vida: ${q.SAINTS.filter(s => !s.bio || s.bio.length < 60).map(s => s.id).join(" ")}`);
  confere(q.SAINTS.every(s => s.bio !== s.why), "T: o resumo da vida não pode ser igual à explicação do vitral");
  const st = q.state(), ans = q.SAINTS.find(s => s.id === st.order[st.i]);
  q.pick(ans.id);
  confere(!!ans.bio && els.panel.innerHTML.includes(ans.bio) && els.panel.innerHTML.includes(ans.why), "T: depois da resposta deveriam aparecer o resumo da vida e a explicação do vitral");
  confere(els.panel.innerHTML.includes("No vitral"), "T: falta o rótulo que separa a explicação do vitral");
}

// V. Ícone do site
{
  const fs = require("fs"), path = require("path"), { RAIZ } = require("./carregar");
  const html = fs.readFileSync(path.join(RAIZ, "index.html"), "utf8");
  confere(/<link rel="icon"[^>]*href="favicon\.svg"/.test(html) && fs.existsSync(path.join(RAIZ, "favicon.svg")), "V: falta o favicon.svg ou a tag que aponta para ele");
  confere(/<link rel="apple-touch-icon"[^>]*href="favicon-180\.png"/.test(html) && fs.existsSync(path.join(RAIZ, "favicon-180.png")), "V: falta o ícone de 180 px para celular");
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

// B. Modos e estado antigo
{
  const { q } = carregar();
  confere(q.MODES && q.MODES.map(m => m[0]).join() === "simbolos,imagem", "B: MODES ausente ou errado");
  confere(q.mode && q.mode() === "simbolos", "B: o modo padrão deveria ser simbolos");
  confere(q.state().mode === "simbolos", "B: st.mode deveria ser simbolos");
  if (q.mode) {
    confere(carregar({ "quiz-santos-modo": "imagem" }).q.mode() === "imagem", "B: modo salvo não foi lido");
    confere(carregar({ "quiz-santos-modo": "lixo", "quiz-santos-nivel": "medio" }).q.mode() === "simbolos", "B: modo inválido deveria cair em simbolos");
    const antigo = { st: { order: q.poolFor("facil").slice(0, 10), level: "facil", i: 0, hits: 0, results: [], picked: null, opts: q.poolFor("facil").slice(0, 4) } };
    const r = carregar({}, antigo);
    confere(r.q.state().mode === "simbolos" && r.q.mode() === "simbolos", "B: estado antigo sem modo deveria abrir em simbolos");
    const b = carregar("bloqueado").q;
    confere(b.mode() === "simbolos" && b.state().level === "facil", "B: com localStorage bloqueado deveria abrir em simbolos e facil");
    b.setMode("imagem");
    confere(b.state().mode === "imagem", "B: com localStorage bloqueado a troca de modo deveria funcionar");
  }
}

// C. Sorteio das opções erradas
{
  const { q } = carregar();
  const sexo = Object.fromEntries(q.SAINTS.map(s => [s.id, s.sex]));
  if (q.wrongFor) for (const [nivel] of q.LEVELS) {
    for (const ans of q.poolFor(nivel)) {
      let ruim = 0;
      for (let k = 0; k < 200; k++) {
        const w = q.wrongFor(ans, nivel, "imagem");
        if (w.length !== 3 || new Set(w).size !== 3 || w.includes(ans) || w.some(id => sexo[id] !== sexo[ans])) ruim++;
      }
      confere(ruim === 0, `C: modo imagem, ${nivel}, resposta ${ans}: ${ruim} sorteios errados em 200`);
      const s = q.wrongFor(ans, nivel, "simbolos"), pool = q.poolFor(nivel);
      confere(s.length === 3 && new Set(s).size === 3 && !s.includes(ans) && s.every(id => pool.includes(id)), `C: modo simbolos, ${nivel}, resposta ${ans}: sorteio errado`);
    }
  } else confere(false, "C: wrongFor não existe");
  if (q.wrongFor) {
    const w = q.wrongFor("apolonia", "dificil", "imagem");
    confere(w.includes("rosalima") && w.includes("bakhita"), "C: no Difícil, as duas outras santas do nível deveriam sempre entrar");
  }
}

// E2. Partida inteira no modo Imagem
{
  const { q, els } = carregar();
  const sexo = Object.fromEntries(q.SAINTS.map(s => [s.id, s.sex]));
  if (q.setMode) for (const [nivel] of q.LEVELS) {
    q.setMode("imagem"); q.setLevel(nivel);
    confere(els.panel.innerHTML.includes("Que santo é este?"), `E2: pergunta do modo imagem ausente em ${nivel}`);
    confere(els.cap.textContent === "Vitral do santo", `E2: legenda do modo imagem errada em ${nivel}`);
    for (let r = 0; r < 10; r++) {
      const st = q.state(), ans = st.order[st.i];
      confere(st.opts.length === 4 && new Set(st.opts).size === 4 && st.opts.includes(ans) && st.opts.every(id => sexo[id] === sexo[ans]), `E2: opções erradas em ${nivel}, rodada ${r + 1}`);
      q.pick(ans); q.next();
    }
    confere(q.state().hits === 10, `E2: esperava 10 acertos em ${nivel}`);
  } else confere(false, "E2: setMode não existe");
}

// F. Troca de modo no meio da partida
{
  const { q, els, storage } = carregar();
  if (q.setMode) {
    for (let r = 0; r < 3; r++) { q.pick(q.state().order[q.state().i]); q.next(); }
    q.setMode("imagem");
    const st = q.state();
    confere(st.mode === "imagem" && st.i === 0 && st.hits === 0 && st.results.length === 0, "F: trocar de modo deveria começar partida nova");
    confere(storage["quiz-santos-modo"] === "imagem", "F: o modo não foi salvo");
    confere(els.panel.innerHTML.includes("Que santo é este?"), "F: a pergunta não mudou com o modo");
    q.setMode("simbolos");
    confere(els.panel.innerHTML.includes("Que santo é representado por estes símbolos?"), "F: a pergunta do modo simbolos não voltou");
    confere(els.cap.textContent === "Vitral com os atributos tradicionais do santo", "F: legenda do modo simbolos errada");
  } else confere(false, "F: setMode não existe");
}

// D. O que o quadro mostra
{
  const { q } = carregar();
  const pedro = q.SAINTS.find(s => s.id === "pedro");
  if (q.artFor) {
    const semLista = !q.COM_FIGURA.includes("pedro") && !q.COM_SIMBOLOS.includes("pedro");
    if (semLista) confere(q.artFor(pedro, "imagem").includes("<svg") && q.artFor(pedro, "simbolos").includes("<svg"), "D: santo sem imagem deveria mostrar o desenho");
    const fig = q.COM_FIGURA.slice(), sim = q.COM_SIMBOLOS.slice();
    q.COM_FIGURA.push("luzia");
    const luzia = q.SAINTS.find(s => s.id === "luzia");
    const a = q.artFor(luzia, "imagem");
    confere(a.includes('src="img/santos/luzia.webp"') && !a.includes("<svg"), "D: modo imagem deveria usar img/santos/luzia.webp");
    confere(!a.includes("Luzia"), "D: o alt da imagem não pode revelar o nome do santo");
    if (!sim.includes("luzia")) confere(q.artFor(luzia, "simbolos").includes("<svg"), "D: lista de figuras não pode afetar o modo simbolos");
    q.COM_SIMBOLOS.push("rita");
    const rita = q.SAINTS.find(s => s.id === "rita");
    confere(q.artFor(rita, "simbolos").includes('src="img/simbolos/rita.webp"'), "D: modo simbolos deveria usar img/simbolos/rita.webp");
    confere(q.imgFor("rita", "simbolos") === "img/simbolos/rita.webp" && (fig.includes("rita") || q.imgFor("rita", "imagem") === null), "D: imgFor errado");
  } else confere(false, "D: artFor não existe");
}

// G. Arquivos das imagens aprovadas
{
  const fs = require("fs"), path = require("path"), { RAIZ } = require("./carregar");
  const { q } = carregar();
  const ids = q.SAINTS.map(s => s.id);
  const tamanho = arq => {
    const b = fs.readFileSync(arq);
    if (b.toString("ascii", 12, 16) === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (b.toString("ascii", 12, 16) === "VP8X") return [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
    return [0, 0];
  };
  for (const [serie, lista] of [["santos", q.COM_FIGURA || []], ["simbolos", q.COM_SIMBOLOS || []]]) {
    const dir = path.join(RAIZ, "img", serie);
    const nomes = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
    confere(new Set(lista).size === lista.length && lista.every(id => ids.includes(id)), `G: lista de ${serie} tem id repetido ou inexistente`);
    for (const id of lista) {
      const nome = `${id}.webp`;
      confere(nomes.includes(nome), `G: falta img/${serie}/${nome} (o nome precisa bater letra por letra)`);
      if (!nomes.includes(nome)) continue;
      const arq = path.join(dir, nome), kb = fs.statSync(arq).size / 1024, [w, h] = tamanho(arq);
      confere(kb <= 120, `G: img/${serie}/${nome} tem ${kb.toFixed(0)} KB, o limite é 120`);
      confere(w === 600 && h === 796, `G: img/${serie}/${nome} tem ${w}x${h}, deveria ter 600x796`);
    }
    for (const nome of nomes) confere(lista.includes(nome.replace(/\.webp$/, "")) && nome.endsWith(".webp"), `G: img/${serie}/${nome} está na pasta do site mas não está na lista de aprovadas`);
  }
}

console.log(`${total - falhas.length} de ${total} conferências passaram`);
if (falhas.length) { console.log(falhas.join("\n")); process.exit(1); }
