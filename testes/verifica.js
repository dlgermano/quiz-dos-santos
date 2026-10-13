// Testes do jogo sem navegador. Uso: node testes/verifica.js
const { carregar } = require("./carregar");

const falhas = [];
let total = 0;
const confere = (cond, msg) => { total++; if (!cond) falhas.push(msg); };

const MULHERES = "teresinha luzia catarina barbara clara rita cecilia apolonia helena joana edwiges rosalima faustina bernadete teresaavila teresacalcuta bakhita madalena ana monica veronica dulce margaridamaria marta isabel catarinasena efigenia paulina gianna brigida escolastica doroteia edithstein ines madalenanagasaki catarinalaboure mariagoretti ursula genoveva zita luisamarillac margaridaantioquia kateri perpetua angelamerici mariaegipciaca".split(" ");

// A. Dados
{
  const { q } = carregar();
  confere(!!q, "A: window.__quiz não existe");
  if (q) {
    const ids = q.SAINTS.map(s => s.id);
    confere(ids.length === 184, `A: esperava 184 santos no total, achei ${ids.length}`);
    confere(!ids.includes("elias"), "A: Santo Elias foi recusado pelo Daniel e não deveria estar na lista");
    confere(q.levelOf("joaodacruz") === "medio", "A: São João da Cruz deveria ser do nível medio");
    confere(new Set(ids).size === ids.length, "A: há ids repetidos");
    // Lista do Daniel de 11/10/2026: completa os Doze Apóstolos e junta os irmãos de Fátima numa entrada só
    confere(["tome", "simao", "matias", "pastorinhos", "tomasmore", "ines"].every(id => ids.includes(id)), "A: faltam santos da lista de 11/10/2026");
    // Lista aprovada pelo Daniel em 12/10/2026: 50 santos, que entram escondidos até terem as duas imagens
    const lote1210 = "valentim silvestre pancracio geraldo catarinalaboure joaoxxiii domingossavio mariagoretti lazaro piox luisrei paulovi franciscosales afonso bernardo crisostomo dionisio ursula genoveva damiao pedroclaver romero zita peregrino luiszelia luisamarillac pedroalcantara cunhau margaridaantioquia paulomiki gil vito roquegonzalez kateri junipero fiacre venceslau clemente perpetua basilio leao anselmo beda norberto kostka angelamerici lwanga cirilometodio solano mariaegipciaca".split(" ");
    confere(lote1210.length === 50 && lote1210.every(id => ids.includes(id)), "A: faltam santos da lista de 12/10/2026");
    confere(lote1210.every(id => !q.poolFor("todos").includes(id) || q.ativo(q.SAINTS.find(s => s.id === id))), "A: santo da lista de 12/10/2026 apareceu sem as duas imagens");
    confere(q.SAINTS.find(s => s.id === "pastorinhos")?.name === "Santos Francisco e Jacinta Marto", "A: os irmãos de Fátima deveriam ser uma entrada só");
    confere(ids.every(id => /^[a-z]+$/.test(id)), "A: há id com letra maiúscula, acento ou espaço");
    const jm = q.SAINTS.find(s => s.id === "josemaria");
    confere(jm && jm.sex === "m" && q.levelOf("josemaria") === "medio" && jm.feast === "26 de junho", "A: São Josemaria deveria existir, ser homem, do nível medio e ter festa em 26 de junho");
    confere(q.SAINTS.every(s => s.sex === "m" || s.sex === "f"), "A: há santo sem sex válido");
    const f = q.SAINTS.filter(s => s.sex === "f").map(s => s.id).sort();
    confere(f.join() === MULHERES.slice().sort().join(), `A: lista de mulheres difere: ${f.join(" ")}`);
    confere(q.SAINTS.filter(s => s.sex === "m").length === 138, "A: esperava 138 homens");
    confere(q.SAINTS.every(s => s.name && s.feast && s.why && s.why.length > 60), "A: há santo sem nome, festa ou explicação");
    confere(new Set(q.SAINTS.map(s => s.name)).size === ids.length, "A: há nomes repetidos");
    confere(q.SAINTS.every(s => { const v = q.windowSVG(s); return v.includes("<svg") && !/NaN|undefined/.test(v); }), "A: há desenho SVG com defeito");
    const porNivel = n => q.SAINTS.filter(s => q.levelOf(s.id) === n).length;
    confere(porNivel("facil") === 50 && porNivel("medio") === 71 && porNivel("dificil") === 63, `A: níveis no total deveriam ser 50/71/63, achei ${porNivel("facil")}/${porNivel("medio")}/${porNivel("dificil")}`);
  }
}

// P. Santos preparados: ficam escondidos até terem as duas imagens aprovadas
{
  const { q } = carregar();
  if (q.ativo) {
    const prontos = q.SAINTS.filter(s => q.ativo(s)), espera = q.SAINTS.filter(s => !q.ativo(s));
    confere(prontos.length + espera.length === 184, "P: contagem de ativos e preparados não fecha");
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

// D. Baralho: nenhum santo repete como resposta antes de todos do nível aparecerem
{
  const { q, storage } = carregar();
  for (const [nivel] of q.LEVELS) {
    // Em 60 partidas seguidas, cada santo sai quase o mesmo número de vezes (no sorteio solto a diferença passava de 10)
    const pool = q.poolFor(nivel), conta = Object.fromEntries(pool.map(id => [id, 0]));
    for (let g = 0; g < 60; g++) q.dealOrder(nivel).forEach(id => conta[id]++);
    const v = Object.values(conta);
    confere(Math.max(...v) - Math.min(...v) <= 2, `D: em ${nivel} a contagem por santo variou de ${Math.min(...v)} a ${Math.max(...v)}`);
    for (let g = 0; g < 30; g++) { const o = q.dealOrder(nivel); if (new Set(o).size !== o.length) { confere(false, `D: santo repetido dentro da partida em ${nivel}`); break; } }
  }
  confere(typeof storage["quiz-santos-vistos"] === "string", "D: o baralho deveria ficar salvo no aparelho");
  // Baralho salvo é retomado ao reabrir; santo que não existe mais é ignorado
  const pool = q.poolFor("facil"), quase = pool.slice(0, pool.length - 3);
  const r = carregar({ "quiz-santos-nivel": "medio", "quiz-santos-vistos": JSON.stringify({ facil: [...quase, "inexistente"] }) }).q;
  const o = r.dealOrder("facil");
  confere(pool.slice(-3).every(id => o.includes(id)) && o.length === 10, "D: ao reabrir, os santos que faltavam no baralho deveriam sair primeiro");
  confere(carregar({ "quiz-santos-vistos": "lixo" }).q.dealOrder("facil").length === 10, "D: baralho salvo corrompido deveria ser ignorado");
  const b = carregar("bloqueado").q, cb = Object.fromEntries(pool.map(id => [id, 0]));
  for (let g = 0; g < 40; g++) b.dealOrder("facil").forEach(id => cb[id]++);
  const vb = Object.values(cb);
  confere(Math.max(...vb) - Math.min(...vb) <= 2, "D: com localStorage bloqueado o baralho deveria funcionar na memória");
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
  // Quando o nível tem gente suficiente do mesmo sexo, as erradas saem todas do próprio nível;
  // quando não tem, entram primeiro todas as do nível e o resto vem de fora
  if (q.wrongFor) for (const [nivel] of q.LEVELS) {
    const pool = q.poolFor(nivel);
    for (const ans of pool) {
      const doNivel = pool.filter(id => id !== ans && sexo[id] === sexo[ans]);
      const w = q.wrongFor(ans, nivel, "imagem");
      const ok = doNivel.length >= 3 ? w.every(id => doNivel.includes(id)) : doNivel.every(id => w.includes(id));
      confere(ok, `C: modo imagem, ${nivel}, resposta ${ans}: as erradas deveriam priorizar o próprio nível`);
    }
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
    // Pedido do Daniel em 11/10/2026: trocar de modo não começa partida nova, só troca o vitral do santo que está na tela
    const sexo = Object.fromEntries(q.SAINTS.map(s => [s.id, s.sex]));
    const antes = JSON.stringify({ ...q.state(), mode: "imagem" }), santo = q.state().order[3];
    q.setMode("imagem");
    const st = q.state();
    confere(JSON.stringify(st) === antes, "F: trocar de modo deveria manter a partida (ordem, rodada, acertos e opções) e mudar só o modo");
    confere(els.art.innerHTML.includes(`src="img/santos/${santo}.webp"`), "F: o quadro deveria mostrar a figura do mesmo santo que estava na tela");
    confere(storage["quiz-santos-modo"] === "imagem", "F: o modo não foi salvo");
    confere(els.panel.innerHTML.includes("Que santo é este?"), "F: a pergunta não mudou com o modo");
    q.setMode("simbolos");
    confere(els.art.innerHTML.includes(`src="img/simbolos/${santo}.webp"`), "F: de volta a simbolos, o quadro deveria mostrar os símbolos do mesmo santo");
    confere(els.panel.innerHTML.includes("Que santo é representado por estes símbolos?"), "F: a pergunta do modo simbolos não voltou");
    confere(els.cap.textContent === "Vitral com os atributos tradicionais do santo", "F: legenda do modo simbolos errada");
    // Com a resposta já dada, a troca mantém a resposta e a explicação na tela
    q.pick(santo); q.setMode("imagem");
    confere(q.state().picked === santo && q.state().hits === 4 && els.panel.innerHTML.includes("Acertou!") && els.art.innerHTML.includes(`img/santos/${santo}.webp`), "F: trocar de modo depois de responder deveria manter a resposta na tela");
    // A rodada seguinte já é sorteada no modo novo: opções do mesmo sexo
    q.next();
    const s2 = q.state(), a2 = s2.order[4];
    confere(s2.i === 4 && s2.opts.every(id => sexo[id] === sexo[a2]) && els.art.innerHTML.includes(`img/santos/${a2}.webp`), "F: a rodada seguinte deveria seguir no modo novo");
    // Na tela de resultado, a troca não reinicia nem quebra
    for (let r = 4; r < 10; r++) { q.pick(q.state().order[q.state().i]); q.next(); }
    q.setMode("simbolos");
    confere(q.state().i === 10 && q.state().hits === 10 && els.panel.innerHTML.includes("Resultado") && els.art.innerHTML.includes("img/simbolos/"), "F: na tela de resultado, trocar de modo deveria manter o resultado");
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

// I. Compartilhar pelo WhatsApp: o botão leva a mensagem e o link do jogo, sem o ?/# de quem compartilhou
{
  const { els } = carregar({}, null, { location: { protocol: "https:", origin: "https://exemplo.test", pathname: "/quiz/", search: "?x=1", hash: "#y" } });
  const href = (els.convite.innerHTML.match(/href="([^"]+)"/) || [])[1] || "";
  confere(href.startsWith("https://wa.me/?text="), "I: o botão do rodapé deveria abrir o WhatsApp");
  const texto = decodeURIComponent(href.split("text=")[1] || "");
  confere(texto.includes("Quiz dos Santos") && texto.endsWith("\nhttps://exemplo.test/quiz/"), `I: mensagem sem o link do jogo: ${texto}`);
  const { els: semRede } = carregar();
  confere(/wa\.me\/\?text=/.test(semRede.convite.innerHTML) && !/undefined/.test(semRede.convite.innerHTML), "I: aberto do arquivo, o botão deveria sair sem link e sem 'undefined'");
}

// H. Aplicativo sem internet (manifest.webmanifest, sw.js e o botão de guardar as imagens)
const assincronos = (async () => {
  const fs = require("fs"), path = require("path"), { RAIZ } = require("./carregar");
  const ler = n => fs.existsSync(path.join(RAIZ, n)) ? fs.readFileSync(path.join(RAIZ, n), "utf8") : "";
  const html = ler("index.html"), sw = ler("sw.js");

  let man = {};
  try { man = JSON.parse(ler("manifest.webmanifest")); } catch (e) {}
  confere(man.name === "Quiz dos Santos" && !!man.short_name, "H: manifest.webmanifest sem name ou short_name");
  confere(man.start_url === "./" && man.scope === "./", "H: start_url e scope do manifesto deveriam ser ./ (o site mora numa subpasta do GitHub Pages)");
  confere(man.display === "standalone", "H: o manifesto deveria abrir como aplicativo (display standalone)");
  const icones = man.icons || [];
  for (const [lado, uso] of [[192, "any"], [512, "any"], [512, "maskable"]]) {
    const ic = icones.find(i => i.sizes === `${lado}x${lado}` && (i.purpose || "any") === uso);
    confere(!!ic, `H: falta ícone ${lado}x${lado} (${uso}) no manifesto`);
    if (!ic) continue;
    const arq = path.join(RAIZ, ic.src);
    confere(fs.existsSync(arq), `H: o manifesto cita ${ic.src}, que não existe`);
    if (fs.existsSync(arq)) { const b = fs.readFileSync(arq); confere(b.readUInt32BE(16) === lado && b.readUInt32BE(20) === lado, `H: ${ic.src} não tem ${lado}x${lado}`); }
  }
  confere(html.includes('<link rel="manifest" href="manifest.webmanifest">'), "H: o index.html não aponta para o manifesto");
  confere(/serviceWorker\.register\("sw\.js"\)/.test(html), "H: o index.html não registra o sw.js");
  confere(/rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*crossorigin/.test(html), "H: a folha de estilo das fontes precisa de crossorigin para poder ser guardada");

  const nomeImg = t => (t.match(/"(quiz-santos-imagens-v\d+)"/) || [])[1];
  confere(!!nomeImg(sw) && nomeImg(sw) === nomeImg(html), "H: o nome do cache de imagens difere entre sw.js e index.html");
  const lista = JSON.parse((sw.match(/const ARQUIVOS = (\[[^\]]*\])/) || [0, "[]"])[1]);
  confere(lista.includes("./") && lista.includes("manifest.webmanifest"), "H: o sw.js deveria guardar a página e o manifesto na instalação");
  for (const a of lista) confere(fs.existsSync(path.join(RAIZ, a === "./" ? "index.html" : a)), `H: o sw.js guarda ${a}, que não existe`);

  const bytes = ["santos", "simbolos"].flatMap(d => fs.readdirSync(path.join(RAIZ, "img", d)).map(n => fs.statSync(path.join(RAIZ, "img", d, n)).size)).reduce((a, b) => a + b, 0);
  const dito = +(html.match(/cerca de (\d+) MB/) || [0, 0])[1];
  confere(dito === Math.round(bytes / 1048576), `H: a página diz "cerca de ${dito} MB", as imagens somam ${(bytes / 1048576).toFixed(1)} MB`);

  // Caches e rede de mentira, para exercitar o sw.js e o botão sem navegador
  const BASE = "https://exemplo.test/quiz/";
  const chave = (r, o) => { const u = new URL(typeof r === "string" ? r : r.url, BASE); if (o && o.ignoreSearch) u.search = ""; return u.href; };
  const fazCaches = () => {
    const todos = new Map();
    const abre = n => {
      if (!todos.has(n)) todos.set(n, new Map());
      const m = todos.get(n);
      return {
        match: async (r, o) => o && o.ignoreSearch ? [...m].find(([k]) => chave(k, o) === chave(r, o))?.[1] : m.get(chave(r)),
        put: async (r, resp) => { m.set(chave(r), resp); },
        add: async r => { const resp = await api.rede(chave(r)); if (!resp.ok) throw new Error("falhou"); m.set(chave(r), resp); },
        addAll: async rs => { for (const r of rs) m.set(chave(r), await api.rede(chave(r))); },
        keys: async () => [...m.keys()].map(url => ({ url })),
      };
    };
    const api = { todos, rede: async u => ({ ok: true, de: "rede", url: u, clone() { return this; } }),
      caches: { open: async n => abre(n), keys: async () => [...todos.keys()], delete: async n => todos.delete(n) } };
    return api;
  };

  if (sw) {
    const api = fazCaches(), ouv = {};
    let reclamou = false;
    const self = { location: new URL(BASE), addEventListener: (t, f) => { ouv[t] = f; }, skipWaiting: async () => {}, clients: { claim: async () => { reclamou = true; } } };
    const fetchFalso = r => api.rede(chave(r));
    new Function("self", "caches", "fetch", "Response", sw)(self, api.caches, fetchFalso, { error: () => ({ ok: false, de: "erro" }) });
    const dispara = async (tipo, request) => { let p; ouv[tipo]({ request, waitUntil: x => { p = x; }, respondWith: x => { p = x; } }); return p; };
    const pede = (url, mode = "no-cors") => dispara("fetch", { url: chave(url), method: "GET", mode });

    await dispara("install");
    const casca = [...api.todos.keys()].find(k => k.includes("casca"));
    confere(!!casca && api.todos.get(casca).has(BASE) && api.todos.get(casca).has(BASE + "favicon.svg"), "H: a instalação do sw.js não guardou a página e o ícone");
    api.todos.set("quiz-santos-imagens-v0", new Map()); api.todos.set("outra-coisa", new Map());
    await dispara("activate");
    confere(!api.todos.has("quiz-santos-imagens-v0") && api.todos.has("outra-coisa") && api.todos.has(casca) && reclamou, "H: a ativação deveria apagar só os caches antigos do quiz e assumir as páginas abertas");

    confere((await pede(BASE + "?v=1", "navigate")).de === "rede", "H: com internet, a página deveria vir da rede (para chegar correção nova)");
    const r1 = await pede(BASE + "img/santos/pedro.webp");
    confere(r1.de === "rede" && api.todos.get(nomeImg(sw))?.has(BASE + "img/santos/pedro.webp"), "H: imagem vista com internet deveria ficar guardada no cache de imagens");
    confere(await pede("https://outro.test/x.png") === undefined, "H: o sw.js não deveria mexer em pedido de outro site");
    api.rede = async u => ({ ok: true, de: "rede-nova", url: u, clone() { return this; } });
    confere((await pede(BASE + "img/santos/pedro.webp")).de === "rede", "H: imagem guardada deveria vir do cache, sem ir à rede");
    api.rede = async () => { throw new Error("sem internet"); };
    confere((await pede(BASE + "?origem=atalho", "navigate"))?.url === BASE, "H: sem internet, a página deveria abrir do que está guardado");
    confere((await pede(BASE + "img/santos/pedro.webp")).de === "rede", "H: sem internet, a imagem guardada deveria aparecer");
    confere(await pede(BASE + "img/santos/paulo.webp").then(() => false, () => true), "H: sem internet, imagem não guardada deveria falhar (a página trata a falha)");
  } else confere(false, "H: sw.js não existe");

  {
    const api = fazCaches();
    const { q } = carregar({}, undefined, { caches: api.caches });
    const of = q.offline;
    confere(!!of, "H: window.__quiz.offline não existe");
    if (of) {
      const total = q.COM_FIGURA.length + q.COM_SIMBOLOS.length;
      confere((await of.faltam()).length === total, "H: sem nada guardado, deveriam faltar todas as imagens");
      api.rede = async u => ({ ok: !u.endsWith("/img/santos/rita.webp"), url: u, clone() { return this; } });
      const avisos = [];
      confere(await of.baixar((f, t) => avisos.push([f, t])) === 1, "H: baixar deveria contar 1 imagem que falhou");
      confere((await of.faltam()).join() === "img/santos/rita.webp", "H: depois de baixar, deveria faltar só a imagem que falhou");
      confere(avisos.length === total && avisos.at(-1).join() === `${total - 1},${total}`, "H: o andamento deveria ser avisado a cada imagem");
      api.rede = async u => ({ ok: true, url: u, clone() { return this; } });
      confere(await of.baixar() === 0 && (await of.faltam()).length === 0, "H: tentar de novo deveria completar o que faltava");
    }
  }
})();

assincronos.then(() => {
  console.log(`${total - falhas.length} de ${total} conferências passaram`);
  if (falhas.length) { console.log(falhas.join("\n")); process.exit(1); }
});
