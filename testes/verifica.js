// Testes do jogo sem navegador. Uso: node testes/verifica.js
const { carregar } = require("./carregar");

const falhas = [];
let total = 0;
const confere = (cond, msg) => { total++; if (!cond) falhas.push(msg); };

const MULHERES = "teresinha luzia catarina barbara clara rita cecilia apolonia helena joana edwiges rosalima faustina bernadete teresaavila teresacalcuta bakhita madalena ana monica veronica dulce margaridamaria marta isabel catarinasena efigenia paulina gianna brigida escolastica doroteia edithstein ines madalenanagasaki catarinalaboure mariagoretti ursula genoveva zita luisamarillac margaridaantioquia kateri perpetua angelamerici mariaegipciaca agueda hildegarda cabrini dimpna".split(" ");

// A. Dados
{
  const { q } = carregar();
  confere(!!q, "A: window.__quiz não existe");
  if (q) {
    const ids = q.SAINTS.map(s => s.id);
    confere(ids.length === 200, `A: esperava 200 santos no total, achei ${ids.length}`);
    confere(!ids.includes("elias"), "A: Santo Elias foi recusado pelo Daniel e não deveria estar na lista");
    confere(q.levelOf("joaodacruz") === "medio", "A: São João da Cruz deveria ser do nível medio");
    confere(new Set(ids).size === ids.length, "A: há ids repetidos");
    // Lista do Daniel de 11/10/2026: completa os Doze Apóstolos e junta os irmãos de Fátima numa entrada só
    confere(["tome", "simao", "matias", "pastorinhos", "tomasmore", "ines"].every(id => ids.includes(id)), "A: faltam santos da lista de 11/10/2026");
    // Lista aprovada pelo Daniel em 12/10/2026: 50 santos, que entram escondidos até terem as duas imagens
    const lote1210 = "valentim silvestre pancracio geraldo catarinalaboure joaoxxiii domingossavio mariagoretti lazaro piox luisrei paulovi franciscosales afonso bernardo crisostomo dionisio ursula genoveva damiao pedroclaver romero zita peregrino luiszelia luisamarillac pedroalcantara cunhau margaridaantioquia paulomiki gil vito roquegonzalez kateri junipero fiacre venceslau clemente perpetua basilio leao anselmo beda norberto kostka angelamerici lwanga cirilometodio solano mariaegipciaca".split(" ");
    confere(lote1210.length === 50 && lote1210.every(id => ids.includes(id)), "A: faltam santos da lista de 12/10/2026");
    confere(lote1210.every(id => !q.poolFor("todos").includes(id) || q.ativo(q.SAINTS.find(s => s.id === id))), "A: santo da lista de 12/10/2026 apareceu sem as duas imagens");
    // Lista aprovada pelo Daniel em 13/10/2026: 16 santos que completam os 200 e entram escondidos até terem as duas imagens
    const lote1310 = "anjodaguarda zacariasisabel agueda floriano lasalle champagnat aleixo hildegarda cabrini dimpna albertomagno nuno joaodebrito erasmo raimundopenaforte borja".split(" ");
    confere(lote1310.length === 16 && lote1310.every(id => ids.includes(id)), "A: faltam santos da lista de 13/10/2026");
    confere(lote1310.every(id => !q.poolFor("todos").includes(id) || q.ativo(q.SAINTS.find(s => s.id === id))), "A: santo da lista de 13/10/2026 apareceu sem as duas imagens");
    confere(lote1310.every(id => q.ORDEM.includes(id) === q.ativo(q.SAINTS.find(s => s.id === id))), "A: santo da lista de 13/10/2026 só entra na ordem do mapa quando tiver as duas imagens");
    confere(q.SAINTS.find(s => s.id === "pastorinhos")?.name === "Santos Francisco e Jacinta Marto", "A: os irmãos de Fátima deveriam ser uma entrada só");
    confere(ids.every(id => /^[a-z]+$/.test(id)), "A: há id com letra maiúscula, acento ou espaço");
    const jm = q.SAINTS.find(s => s.id === "josemaria");
    confere(jm && jm.sex === "m" && q.levelOf("josemaria") === "medio" && jm.feast === "26 de junho", "A: São Josemaria deveria existir, ser homem, do nível medio e ter festa em 26 de junho");
    confere(q.SAINTS.every(s => s.sex === "m" || s.sex === "f"), "A: há santo sem sex válido");
    const f = q.SAINTS.filter(s => s.sex === "f").map(s => s.id).sort();
    confere(f.join() === MULHERES.slice().sort().join(), `A: lista de mulheres difere: ${f.join(" ")}`);
    confere(q.SAINTS.filter(s => s.sex === "m").length === 150, "A: esperava 150 homens");
    confere(q.SAINTS.every(s => s.name && s.feast && s.why && s.why.length > 60), "A: há santo sem nome, festa ou explicação");
    confere(new Set(q.SAINTS.map(s => s.name)).size === ids.length, "A: há nomes repetidos");
    confere(q.SAINTS.every(s => { const v = q.windowSVG(s); return v.includes("<svg") && !/NaN|undefined/.test(v); }), "A: há desenho SVG com defeito");
    const porNivel = n => q.SAINTS.filter(s => q.levelOf(s.id) === n).length;
    confere(porNivel("facil") === 51 && porNivel("medio") === 77 && porNivel("dificil") === 72, `A: níveis no total deveriam ser 51/77/72, achei ${porNivel("facil")}/${porNivel("medio")}/${porNivel("dificil")}`);
  }
}

// M. Mapa: ordem dos santos, etapas e progresso guardado
{
  const { q } = carregar();
  const col = q.COLECOES?.find(c => c.id === "santos");
  confere(!!col, "M: a coleção santos não existe");
  if (col) {
    const ativos = q.poolFor("todos");
    confere(col.ordem.length === ativos.length && new Set(col.ordem).size === col.ordem.length && ativos.every(id => col.ordem.includes(id)),
      "M: a ordem do mapa deveria ter cada santo ativo uma vez só");
    const ets = q.etapas(col);
    confere(ets.length === 20 && ets.every(e => e.length === 10),
      `M: esperava 20 etapas de 10, achei ${ets.map(e => e.length).join(",")}`);
    const peso = { facil: 0, medio: 1, dificil: 2 }, pesos = col.ordem.slice(0, 184).map(id => peso[q.levelOf(id)]); // os 16 de 13/10/2026 entraram no fim, à espera da reclassificação do Daniel
    confere(pesos.every((p, k) => !k || p >= pesos[k - 1]), "M: há santo de nível mais difícil antes de um mais fácil");
    confere(ets[0].join(" ") === "jose pedro antonio francisco jorge joao sebastiao luzia rita expedito", "M: a etapa 1 difere da aprovada pelo Daniel em 13/10/2026");
    confere(q.acertados(col).length === 0 && q.etapaAberta(col) === 0 && q.situacao(col, 0) === "aberta" && q.situacao(col, 1) === "trancada",
      "M: sem progresso, só a etapa 1 deveria estar aberta");
    ets[0].forEach(id => q.marcarAcerto(col, id));
    q.marcarAcerto(col, ets[0][0]);
    confere(q.acertados(col).length === 10, "M: marcar o mesmo santo duas vezes não deveria contar em dobro");
    confere(q.etapaAberta(col) === 1 && q.situacao(col, 0) === "completa" && q.situacao(col, 1) === "aberta" && q.situacao(col, 2) === "trancada",
      "M: com a etapa 1 acertada, a 2 deveria abrir e a 3 continuar trancada");
    col.ordem.forEach(id => q.marcarAcerto(col, id));
    confere(q.etapaAberta(col) === -1 && q.situacao(col, 19) === "completa", "M: com tudo acertado, não deveria haver etapa aberta");
  }
}
{
  const ets = (() => { const { q } = carregar(); return q.etapas ? q.etapas(q.COLECOES[0]) : null; })();
  if (ets) {
    const guardado = texto => carregar({ "quiz-santos-progresso": texto }).q;
    let q = guardado(JSON.stringify({ santos: ets[0].concat(ets[1]).filter(id => id !== ets[0][3]) }));
    let col = q.COLECOES[0];
    confere(q.etapaAberta(col) === 0 && q.situacao(col, 0) === "aberta" && q.situacao(col, 1) === "completa" && q.situacao(col, 2) === "trancada",
      "M: com um santo por acertar numa etapa antiga, ela reabre e a seguinte, já feita, continua completa");
    for (const ruim of ["{", "[1,2]", "\"x\"", "null", "{\"santos\":\"pedro\"}", "{\"santos\":{\"a\":1}}"]) {
      q = guardado(ruim); col = q.COLECOES[0];
      confere(q.acertados(col).length === 0 && q.etapaAberta(col) === 0, `M: progresso estragado (${ruim}) deveria ser ignorado`);
      q.marcarAcerto(col, "pedro");
      confere(q.acertados(col).join() === "pedro", `M: depois de progresso estragado (${ruim}), marcar acerto deveria funcionar`);
    }
    q = guardado("{\"santos\":[\"naoexiste\",\"pedro\",\"pedro\"]}"); col = q.COLECOES[0];
    confere(q.acertados(col).join() === "pedro", "M: id que não existe mais, ou repetido, não deveria contar");
    const s = {};
    q = carregar(s).q; q.marcarAcerto(q.COLECOES[0], "pedro");
    confere(JSON.parse(s["quiz-santos-progresso"]).santos.join() === "pedro", "M: o acerto deveria ser gravado em quiz-santos-progresso");
    q.zerarMapa?.("santos");
    confere(q.acertados(q.COLECOES[0]).length === 0 && q.etapaAberta(q.COLECOES[0]) === 0 && !JSON.parse(s["quiz-santos-progresso"]).santos, "M: recomeçar o mapa deveria apagar os acertos, na memória e no aparelho");
    q = carregar("bloqueado").q; q.marcarAcerto(q.COLECOES[0], "jose");
    confere(q.acertados(q.COLECOES[0]).join() === "jose", "M: com o localStorage bloqueado, o progresso deveria valer em memória");
  }
}

// N. Partida de etapa: fila, erro que volta, acerto gravado na hora
{
  const s = {}, { q, els } = carregar(s);
  if (q.jogarEtapa) {
    const col = q.COLECOES[0], ets = q.etapas(col), sexo = id => q.SAINTS.find(x => x.id === id).sex;
    const antes = q.state();
    q.jogarEtapa("santos", 1); q.jogarEtapa("santos", 99); q.jogarEtapa("nada", 0);
    confere(q.state() === antes, "N: etapa trancada, etapa que não existe ou coleção que não existe não deveriam começar partida");
    q.jogarEtapa("santos", 0);
    const st = q.state();
    confere(st.tipo === "etapa" && st.order.length === 10 && st.order.slice().sort().join() === ets[0].slice().sort().join(), "N: a fila da etapa 1 deveria ser os 10 santos dela");
    confere(st.opts.length === 4 && new Set(st.opts).size === 4 && st.opts.includes(st.order[0]) && st.opts.every(id => ets[0].includes(id)),
      "N: na etapa 1, modo Símbolos, as 4 opções deveriam ser santos da própria etapa");
    confere(els.levels.innerHTML === "", "N: em etapa, os botões de nível não deveriam aparecer");
    const errado = st.order[0];
    q.pick(st.opts.find(id => id !== errado));
    confere(st.order.length === 11 && st.order[10] === errado && q.acertados(col).length === 0, "N: santo errado deveria voltar no fim da fila, sem contar como acerto");
    confere(!els.panel.innerHTML.includes("opt ok") && !els.panel.innerHTML.includes("class=\"name\"") && els.panel.innerHTML.includes("volta mais adiante"), "N: em etapa, errar não deveria mostrar qual era a resposta certa");
    q.setMode("imagem");
    confere(q.state() === st && st.order.length === 11, "N: trocar o modo no meio da etapa não deveria recomeçar a etapa");
    q.next();
    let mesmoSexo = true, voltas = 0;
    while (st.i < st.order.length && voltas++ < 40) {
      if (new Set(st.opts.map(sexo)).size !== 1) mesmoSexo = false;
      q.pick(st.order[st.i]);
      if (st.i === 1) confere(els.panel.innerHTML.includes("opt ok") && els.panel.innerHTML.includes("class=\"name\""), "N: em etapa, acertar deveria mostrar o nome e a explicação do santo");
      if (st.i === 1) confere(els.dots.innerHTML.startsWith('<span class="dot ok"></span><span class="dot now"></span><span class="dot "></span>'), "N: em etapa, as bolinhas deveriam acender em ordem, da esquerda para a direita");
      if (st.i === 1) confere(JSON.parse(s["quiz-santos-progresso"]).santos.length === 1, "N: o acerto deveria ser gravado na hora, antes de a etapa acabar");
      q.next();
    }
    confere(mesmoSexo, "N: em etapa, no modo Imagem, as opções deveriam ser do mesmo sexo da resposta");
    confere(st.i === 11 && st.results.length === 11 && st.results.filter(r => !r.ok).length === 1, "N: errando um santo, a etapa deveria fechar em 11 respostas");
    confere(q.acertados(col).length === 10 && q.situacao(col, 0) === "completa" && q.situacao(col, 1) === "aberta", "N: com os 10 acertados, a etapa fecha e a seguinte abre");
    const fim = els.panel.innerHTML;
    confere(fim.includes("Etapa 1 completa") && fim.includes("id=\"proxima\"") && fim.includes("id=\"vermapa\"") && fim.includes(q.SAINTS.find(x => x.id === errado).name),
      "N: a tela final deveria dizer que a etapa fechou, oferecer a próxima e o mapa, e listar o santo errado em Para rever");
    q.jogarEtapa("santos", 0);
    const denovo = q.state();
    confere(denovo.order.length === 10 && denovo.certos.length === 0, "N: etapa completa jogada de novo deveria trazer os 10 santos");
    q.pick(denovo.opts.find(id => id !== denovo.order[0]));
    confere(q.acertados(col).length === 10, "N: errar ao jogar de novo uma etapa completa não deveria tirar progresso");
    q.setMode("simbolos"); q.jogarEtapa("santos", 1);
    const ate2 = ets[0].concat(ets[1]);
    confere(q.state().opts.every(id => ate2.includes(id)), "N: na etapa 2, as opções deveriam sair das etapas 1 e 2");
    q.setLevel("dificil");
    const livre = q.state();
    confere(livre.tipo === "livre" && livre.order.length === 10, "N: escolher um nível deveria começar uma partida livre de 10 rodadas");
    q.pick(livre.order[0]);
    confere(q.acertados(col).length === 10, "N: acerto no jogo livre não deveria contar para o mapa");
  } else confere(false, "N: jogarEtapa não existe");
}
{
  const ets = (() => { const { q } = carregar(); return q.etapas(q.COLECOES[0]); })();
  let { q, els } = carregar({ "quiz-santos-progresso": JSON.stringify({ santos: ets[0].slice(0, 4) }) });
  if (q.jogarEtapa) {
    q.jogarEtapa("santos", 0);
    const st = q.state();
    confere(st.order.length === 6 && st.order.every(id => !ets[0].slice(0, 4).includes(id)) && st.certos.length === 4,
      "N: voltar a uma etapa pela metade deveria trazer só os santos que faltam");
    for (let k = 0; k < 6; k++) { q.pick(st.order[st.i]); q.next(); }
    const retomada = els.panel.innerHTML;
    confere(retomada.includes("Etapa 1 completa") && retomada.includes("6 que faltavam") && !retomada.includes("Todos de primeira"),
      "N: etapa retomada sem erro deveria dizer que acertou os 6 que faltavam, e não 'Todos de primeira'");
    q.jogarEtapa("santos", 0);
    const zero = q.state();
    for (let k = 0; k < 10; k++) { q.pick(zero.order[zero.i]); q.next(); }
    confere(els.panel.innerHTML.includes("Todos de primeira"), "N: etapa jogada inteira sem erro deveria dizer 'Todos de primeira'");
    q = carregar("bloqueado").q;
    q.jogarEtapa("santos", 0);
    const b = q.state();
    for (let k = 0; k < 10; k++) { q.pick(b.order[b.i]); q.next(); }
    confere(q.situacao(q.COLECOES[0], 0) === "completa", "N: com o localStorage bloqueado, a etapa deveria fechar com o progresso em memória");
  }
}

// O. Telas: início, mapa e jogo
{
  const { q, els } = carregar({}, undefined, undefined, true);
  if (q.tela) {
    confere(q.tela() === "inicio" && q.state() === undefined, "O: a página deveria abrir no início, sem partida em curso");
    confere(els.inicio.hidden === false && els.mapa.hidden === true && els.stage.hidden === true && els.modes.hidden === true && els.dots.hidden === true,
      "O: no início, o mapa, o jogo e os botões do jogo deveriam estar escondidos");
    const ini = els.inicio.innerHTML;
    confere(ini.includes("id=\"col-santos\"") && ini.includes("0 de 200") && ini.includes("id=\"livre\""), "O: o início deveria ter a carta dos santos com 0 de 200 e o botão de jogo livre");
    q.abrirMapa("nada");
    confere(q.tela() === "inicio", "O: coleção que não existe não deveria abrir mapa");
    q.abrirMapa("santos");
    const mapa = els.mapa.innerHTML, conta = t => (mapa.match(new RegExp(`class="casa ${t}"`, "g")) || []).length;
    confere(q.tela() === "mapa" && els.mapa.hidden === false && els.inicio.hidden === true, "O: abrir o mapa deveria esconder o início");
    confere(conta("aberta") === 1 && conta("trancada") === 19 && conta("completa") === 0 && mapa.includes("Caminho dos Santos") && mapa.includes("id=\"etapa-20\"") && !mapa.includes("id=\"zerar\""),
      "O: sem progresso, o mapa deveria ter 1 etapa aberta e 19 trancadas");
    q.jogarEtapa("santos", 0);
    confere(q.tela() === "jogo" && els.stage.hidden === false && els.mapa.hidden === true && els.modes.hidden === false && els.nav.innerHTML.includes("Mapa"),
      "O: começar uma etapa deveria mostrar o jogo, com o botão de volta ao mapa");
    confere(els.score.hidden === true, "O: em etapa, o placar Rodada/Acertos deveria ficar escondido");
    q.jogoLivre();
    confere(q.tela() === "jogo" && q.state().tipo === "livre" && els.levels.innerHTML.includes("lvl-facil") && els.nav.innerHTML.includes("Início"),
      "O: o jogo livre deveria mostrar os níveis e o botão de volta ao início");
    confere(els.score.hidden === false, "O: no jogo livre, o placar deveria voltar");
    q.abrirInicio();
    confere(q.tela() === "inicio" && els.stage.hidden === true && els.foot.hidden === false, "O: voltar ao início deveria esconder o jogo e mostrar o rodapé");
  } else confere(false, "O: window.__quiz.tela não existe");
}
{
  const ets = (() => { const { q } = carregar(); return q.etapas(q.COLECOES[0]); })();
  const { q, els } = carregar({ "quiz-santos-progresso": JSON.stringify({ santos: ets[0].concat(ets[1].slice(0, 3)) }) }, undefined, undefined, true);
  if (q.tela) {
    confere(els.inicio.innerHTML.includes("13 de 200"), "O: a carta dos santos deveria mostrar o progresso guardado");
    q.abrirMapa("santos");
    const mapa = els.mapa.innerHTML;
    confere(mapa.includes("class=\"casa completa\" id=\"etapa-1\"") && mapa.includes("class=\"casa aberta\" id=\"etapa-2\"") && mapa.includes("Etapa 2 · 3 de 10") && mapa.includes("id=\"zerar\"") && mapa.includes("class=\"casa trancada\" id=\"etapa-3\""),
      "O: com 13 acertos, a etapa 1 fica completa, a 2 aberta com 3 de 10 e a 3 trancada");
  }
}

// S. Coleção Nossa Senhora: 40 títulos, só figura, mapa e progresso próprios
{
  const fs = require("fs"), path = require("path");
  const s = {}, { q, els } = carregar(s, undefined, undefined, true);
  const col = q.colecao?.("nossasenhora");
  confere(!!col && !!q.SENHORAS, "S: a coleção nossasenhora não existe");
  if (col && q.SENHORAS) {
    const ids = q.SENHORAS.map(x => x.id), santos = q.SAINTS.map(x => x.id);
    confere(ids.length === 40 && new Set(ids).size === 40 && ids.every(id => /^ns[a-z]+$/.test(id)) && ids.every(id => !santos.includes(id)), "S: deveriam ser 40 títulos, com ids de prefixo ns e sem repetir id de santo");
    confere(q.SENHORAS.every(x => x.name && x.curto && x.feast && x.bio && x.bio.length > 60 && x.why && x.why.length > 30), "S: há título sem nome, nome curto, festa, história ou explicação");
    confere(new Set(q.SENHORAS.map(x => x.curto)).size === 40 && new Set(q.SENHORAS.map(x => x.name)).size === 40, "S: há nome ou nome curto repetido");
    confere(q.poolFor("todos").every(id => !ids.includes(id)) && q.SAINTS.length === 200, "S: os títulos de Nossa Senhora não deveriam entrar no jogo livre nem na lista de santos");
    confere(q.COM_SENHORA.every(id => fs.existsSync(path.join(__dirname, "..", "img", "nossasenhora", id + ".webp"))), "S: há título listado em COM_SENHORA sem arquivo de imagem");
    const ets = q.etapas(col);
    confere(ets.length === 4 && ets.every(e => e.length === 10) && ets[0][0] === "nsaparecida" && ets[3][9] === "nslibano", `S: esperava 4 etapas de 10, de Aparecida a Líbano, achei ${ets.map(e => e.length).join(",")}`);
    confere(q.imgFor("nsfatima", "simbolos") === "img/nossasenhora/nsfatima.webp" && q.imgFor("nsfatima", "imagem") === "img/nossasenhora/nsfatima.webp", "S: o vitral de um título é o mesmo em qualquer modo");
    confere(els.inicio.innerHTML.includes("id=\"col-nossasenhora\"") && els.inicio.innerHTML.includes("0 de 40"), "S: o início deveria ter a carta de Nossa Senhora com 0 de 40");
    q.abrirMapa("nossasenhora");
    confere(els.mapa.innerHTML.includes("Caminho de Nossa Senhora") && els.mapa.innerHTML.includes("de 40 títulos") && els.mapa.innerHTML.includes("id=\"etapa-4\"") && !els.mapa.innerHTML.includes("id=\"etapa-5\""), "S: o mapa de Nossa Senhora deveria ter 4 etapas e contar títulos");
    q.jogarEtapa("nossasenhora", 0); // o modo guardado é Símbolos (padrão): a coleção tem de impor o seu
    const st = q.state();
    confere(st.mode === "imagem" && els.modes.innerHTML === "", "S: Nossa Senhora só tem o modo Imagem, sem botões de modo");
    confere(st.opts.length === 4 && new Set(st.opts).size === 4 && st.opts.every(id => ets[0].includes(id)), "S: na etapa 1, as 4 opções deveriam ser títulos da própria etapa");
    const p0 = els.panel.innerHTML, certo = q.SENHORAS.find(x => x.id === st.order[0]);
    confere(p0.includes("Que título de Nossa Senhora é este?") && p0.includes(`<span>${certo.curto}</span>`) && els.art.innerHTML.includes(`img/nossasenhora/${certo.id}.webp`) && els.art.innerHTML.includes("Vitral de Nossa Senhora"), "S: a rodada deveria ter a pergunta da coleção, o nome curto nas opções e o vitral da pasta nossasenhora");
    q.pick(st.opts.find(id => id !== certo.id));
    confere(els.panel.innerHTML.includes("Este título volta") && els.panel.innerHTML.includes("Próximo título") && !els.panel.innerHTML.includes("class=\"name\""), "S: errar não deveria mostrar o título certo");
    q.next();
    let fora = false;
    for (let g = 0; g < 40 && st.i < st.order.length; g++) {
      if (!st.opts.every(id => ids.includes(id))) fora = true;
      q.pick(st.order[st.i]);
      if (st.i === 1) confere(els.panel.innerHTML.includes(`class="name">${q.SENHORAS.find(x => x.id === st.order[1]).name}<`) && els.panel.innerHTML.includes("Festa:"), "S: acertar deveria mostrar o nome inteiro e a festa do título");
      q.next();
    }
    confere(!fora, "S: apareceu opção que não é título de Nossa Senhora");
    confere(q.situacao(col, 0) === "completa" && q.situacao(col, 1) === "aberta" && els.panel.innerHTML.includes("Etapa 1 completa"), "S: com os 10 títulos acertados, a etapa 1 fecha");
    const guardado = JSON.parse(s["quiz-santos-progresso"]);
    confere(guardado.nossasenhora.length === 10 && !guardado.santos && q.acertados(q.colecao("santos")).length === 0, "S: o progresso de Nossa Senhora não deveria mexer no dos santos");
    q.zerarMapa("nossasenhora");
    confere(q.acertados(col).length === 0, "S: recomeçar o mapa de Nossa Senhora deveria zerar só ele");
    q.jogoLivre();
    confere(q.state().tipo === "livre" && els.modes.innerHTML.includes("modo-simbolos") && els.panel.innerHTML.includes("santo"), "S: o jogo livre continua sendo de santos, com os dois modos");
    // Coleção com menos de 10 itens com imagem não aparece no início
    const guarda = q.COM_SENHORA.splice(9);
    q.abrirInicio();
    confere(!els.inicio.innerHTML.includes("col-nossasenhora") && els.inicio.innerHTML.includes("col-santos"), "S: coleção com menos de 10 títulos prontos não deveria aparecer no início");
    q.COM_SENHORA.push(...guarda);
  }
}

// T. Coleções bíblicas: 40 passagens por Testamento, cada uma com 3 tipos de pergunta, em 12 etapas (3 voltas, cada uma um caminho próprio)
{
  const fs = require("fs"), path = require("path");
  for (const [id, nome, prefixo, primeira, ultima] of [["novotestamento", "Novo Testamento", "nt", "ntanunciacao", "ntcriancas"], ["antigotestamento", "Antigo Testamento", "at", "atcriacao", "atescrita"]]) {
    const s = {}, { q, els } = carregar(s, undefined, undefined, true);
    const col = q.colecao?.(id);
    confere(!!col && !!q.PASSAGENS && !!col?.tipos, `T: a coleção ${id} não existe ou não tem tipos de pergunta`);
    if (!col || !q.PASSAGENS || !col.tipos) continue;
    const itens = q.PASSAGENS.filter(x => x.serie === id), ids = itens.map(x => x.id), outros = [...q.SAINTS, ...q.SENHORAS].map(x => x.id), por = Object.fromEntries(itens.map(x => [x.id, x]));
    confere(ids.length === 40 && new Set(ids).size === 40 && ids.every(i => new RegExp(`^${prefixo}[a-z]+$`).test(i)) && ids.every(i => !outros.includes(i)), `T: ${nome} deveria ter 40 passagens, com ids de prefixo ${prefixo} e sem repetir id de outra coleção`);
    confere(itens.every(x => x.name && /^[1-2]?[A-Z][a-zó]{1,2} \d/.test(x.feast) && x.bio && x.bio.length > 60 && x.why && x.why.length > 30), `T: há passagem do ${nome} sem nome, referência bíblica, resumo ou explicação`);
    confere(new Set(itens.map(x => x.name)).size === 40, `T: há nome de passagem repetido no ${nome}`);
    confere(q.COM_SERIE[id].every(i => fs.existsSync(path.join(__dirname, "..", "img", id, i + ".webp"))), `T: há passagem do ${nome} listada sem arquivo de imagem`);
    // Conteúdo dos tipos
    confere(itens.every(x => x.grupo && itens.filter(y => y.grupo === x.grupo).length >= 3), `T: há passagem do ${nome} sem grupo, ou grupo com menos de 3 cenas`);
    confere(itens.every(x => Array.isArray(x.rec) && x.rec.length === 3 && x.rec[0] >= 0 && x.rec[1] >= 0 && x.rec[2] >= 0.2 && x.rec[2] <= 0.4 && x.rec[0] + x.rec[2] <= 1.0001 && x.rec[1] + x.rec[2] <= 1.0001), `T: há recorte do ${nome} fora da imagem ou de tamanho estranho`);
    const perguntas = itens.flatMap(x => Array.isArray(x.qs) ? x.qs : [{}]);
    confere(itens.every(x => x.qs?.length >= 1) && perguntas.every(p => p.t?.endsWith("?") && p.c && p.e?.length === 3 && new Set([p.c, ...p.e]).size === 4 && /\d/.test(p.ref)), `T: há pergunta do ${nome} sem 4 respostas diferentes ou sem versículo`);
    confere(itens.every(x => new Set((x.qs || []).map(p => p.t)).size === (x.qs || []).length), `T: há pergunta repetida numa passagem do ${nome}`);
    const frases = itens.flatMap(x => Array.isArray(x.frases) ? x.frases : [{}]);
    confere(itens.every(x => x.frases?.length >= 1) && frases.every(f => f.t?.length >= 15 && /\d,\d/.test(f.ref)) && new Set(frases.map(f => f.t)).size === frases.length, `T: há frase do ${nome} vazia, repetida ou sem versículo`);
    confere(itens.every(x => (x.frases || []).every(f => !f.t.toLowerCase().includes(x.name.toLowerCase()))), `T: há frase do ${nome} que traz o nome da própria passagem`);
    // Mapa: 120 itens, 12 etapas, uma volta por tipo (a volta pelo nome saiu em 15/10/2026)
    const ets = q.etapas(col);
    confere(q.itensDe(col).length === 120 && ets.length === 12 && ets.every(e => e.length === 10), `T: ${nome} deveria ter 12 etapas de 10, achei ${ets.map(e => e.length).join(",")}`);
    confere(ets[0][0] === primeira + ":detalhe" && ets[3][9] === ultima + ":detalhe" && ets[4][0] === primeira + ":pergunta" && ets[8][0] === primeira + ":frase" && ets[11][9] === ultima + ":frase" && !q.itensDe(col).some(i => i.endsWith(":nome")), `T: as voltas do ${nome} deveriam ser detalhe, pergunta e frase, com as passagens na mesma ordem e sem a volta pelo nome`);
    confere(els.inicio.innerHTML.includes(`id="col-${id}"`) && els.inicio.innerHTML.includes("0 de 120") && q.poolFor("todos").every(i => !ids.includes(i)), `T: ${nome} deveria aparecer no início com 0 de 120 e ficar fora do jogo livre`);
    // Cada volta é um caminho próprio: sem progresso, a primeira etapa de cada volta já está aberta
    confere([0, 4, 8].every(n => q.situacao(col, n) === "aberta") && [1, 2, 3, 5, 9, 11].every(n => q.situacao(col, n) === "trancada") && q.etapaAberta(col, "pergunta") === 4 && q.etapaAberta(col, "frase") === 8, `T: no ${nome}, a primeira etapa de cada volta deveria estar aberta, e as outras trancadas`);
    q.abrirMapa(id);
    const mapa = els.mapa.innerHTML;
    confere(mapa.includes(`Caminho do ${nome}`) && mapa.includes("de 120 perguntas") && mapa.includes("id=\"etapa-12\"") && !mapa.includes("id=\"etapa-13\"") && !mapa.includes("Pelo nome") && ["Pelo detalhe", "Pela pergunta", "Pela frase"].every(v => mapa.split(v).length === 2), `T: o mapa do ${nome} deveria ter 12 etapas e um rótulo por volta, sem a volta pelo nome`);
    confere(["detalhe\" data-n=\"0\"", "pergunta\" data-n=\"4\"", "frase\" data-n=\"8\""].every(v => mapa.includes(`<button class="volta" id="volta-${v}`)) && mapa.split("class=\"casa aberta\"").length === 4, `T: no mapa do ${nome}, os rótulos das voltas deveriam ser botões, com as 3 etapas iniciais abertas`);
    // Joga uma etapa de cada tipo, sem precisar fechar as voltas anteriores
    const joga = (n, aCada) => {
      q.jogarEtapa(id, n);
      const st = q.state();
      for (let g = 0; g < 60 && st.i < st.order.length; g++) { aCada(st, g); if (!st.picked) q.pick(st.certa); q.next(); }
      return st;
    };
    // Começa pela frase: a volta da frase abre sem ter jogado o detalhe e a pergunta
    let okFrase = true, viuFrase = false;
    let st = joga(8, (st, g) => {
      const p = por[q.base(st.order[st.i])], h = els.panel.innerHTML;
      if (st.certa !== p.id || new Set(st.opts).size !== 4 || !st.opts.every(i => h.includes(`<span>“${por[i].frases[st.frase[i]].t}”</span>`)) || !h.includes("Qual destas frases é desta passagem?") || h.includes(`<span>${p.name}</span>`)) okFrase = false;
      if (g === 0) { q.pick(st.certa); viuFrase = els.panel.innerHTML.includes(`“${p.frases[st.frase[p.id]].t}” (${p.frases[st.frase[p.id]].ref}, Bíblia Ave-Maria)`); }
    });
    confere(okFrase && viuFrase && q.situacao(col, 8) === "completa" && q.situacao(col, 9) === "aberta" && q.situacao(col, 0) === "aberta", `T: na volta da frase do ${nome}, as opções deveriam ser 4 frases de passagens diferentes, com o versículo depois do acerto, e a etapa 2 da frase abriria sem mexer no detalhe`);
    confere(els.panel.innerHTML.includes("Próxima etapa") && !els.panel.innerHTML.includes("Você completou"), `T: fechar a etapa 1 da frase do ${nome} deveria oferecer a próxima, sem dizer que o mapa acabou`);
    // Volta do detalhe: opções de cenas parecidas, erro que volta, vitral recortado
    q.jogarEtapa(id, 0);
    st = q.state();
    const p0 = por[q.base(st.order[0])];
    confere(st.mode === "imagem" && els.modes.innerHTML === "" && st.certa === p0.id && st.opts.length === 4 && new Set(st.opts).size === 4 && st.opts.every(i => ids.includes(i)), `T: na volta do detalhe do ${nome}, as 4 opções deveriam ser passagens diferentes`);
    const doGrupo = itens.filter(x => x.grupo === p0.grupo && x.id !== p0.id).length;
    confere(st.opts.filter(i => i !== p0.id && por[i].grupo === p0.grupo).length === Math.min(3, doGrupo), `T: as opções erradas do ${nome} deveriam sair primeiro das cenas parecidas`);
    confere(els.panel.innerHTML.includes(`De que passagem do ${nome} é este detalhe?`) && els.art.innerHTML.includes("class=\"recorte\"") && els.art.innerHTML.includes(`img/${id}/${p0.id}.webp`), `T: a volta do detalhe do ${nome} deveria perguntar pelo detalhe, com o vitral recortado`);
    q.pick(st.opts.find(i => i !== st.certa));
    confere(els.panel.innerHTML.includes("Esta passagem volta") && !els.panel.innerHTML.includes("class=\"name\"") && st.order.length === 11, `T: errar no ${nome} não deveria mostrar a resposta, e a pergunta deveria voltar`);
    q.next();
    let recortes = 0, inteiros = 0;
    for (let g = 0; g < 40 && st.i < st.order.length; g++) {
      if (els.art.innerHTML.includes("class=\"recorte\"") && els.art.innerHTML.includes("left:-")) recortes++;
      q.pick(st.certa);
      if (g === 0) { if (!els.art.innerHTML.includes("recorte")) inteiros++; confere(els.panel.innerHTML.includes("Onde está: ") && !els.panel.innerHTML.includes("Festa:"), `T: acertar no ${nome} deveria mostrar a referência bíblica`); }
      q.next();
    }
    confere(recortes === 10 && inteiros === 1, `T: na volta do detalhe do ${nome}, o vitral deveria aparecer recortado antes da resposta e inteiro depois (recortes: ${recortes}, inteiros: ${inteiros})`);
    confere(q.situacao(col, 0) === "completa" && els.panel.innerHTML.includes("Você acertou as 10 em 11 respostas.") && JSON.parse(s["quiz-santos-progresso"])[id].filter(i => i.endsWith(":detalhe")).length === 10, `T: a etapa 1 do ${nome} deveria fechar, com os acertos guardados como tipo detalhe`);
    // Volta 3: pergunta própria
    let okPerg = true;
    st = joga(4, (st) => {
      const p = por[q.base(st.order[st.i])], h = els.panel.innerHTML;
      if (st.certa !== "c" || st.opts.slice().sort().join() !== "0,1,2,c" || !h.includes(p.qs[st.pergunta].t) || ![p.qs[st.pergunta].c, ...p.qs[st.pergunta].e].every(r => h.includes(`<span>${r}</span>`)) || !h.includes("opts longas") || els.art.innerHTML.includes("recorte")) okPerg = false;
    });
    confere(okPerg && q.situacao(col, 4) === "completa", `T: na volta da pergunta do ${nome}, cada rodada deveria trazer a pergunta e as 4 respostas da passagem`);
  }
  // Volta da frase com mais de uma frase por passagem: cada rodada sorteia uma, para a certa e para as erradas
  {
    const { q, els } = carregar({}, undefined, undefined, true), col = q.colecao("novotestamento");
    const extra = { t: "Frase de teste, só para conferir o sorteio.", ref: "Jo 99,1" };
    q.PASSAGENS.filter(x => x.serie === "novotestamento").forEach(x => x.frases.push({ ...extra, t: extra.t + " " + x.id }));
    const vistas = new Set();
    let mostraSorteada = true;
    for (let k = 0; k < 30; k++) {
      q.jogarEtapa("novotestamento", 8);
      const st = q.state(), id = st.certa, f = q.PASSAGENS.find(x => x.id === id).frases[st.frase[id]];
      vistas.add(st.frase[id]);
      if (!els.panel.innerHTML.includes(`<span>“${f.t}”</span>`)) mostraSorteada = false;
      q.pick(id);
      if (!els.panel.innerHTML.includes(`“${f.t}” (${f.ref}, Bíblia Ave-Maria)`)) mostraSorteada = false;
    }
    confere(vistas.size === 2 && mostraSorteada && q.etapas(col).length === 12, "T: com duas frases por passagem, as rodadas deveriam sortear entre elas e mostrar, depois do acerto, a frase sorteada");
  }
  // Rascunho: frases e perguntas não conferidas só aparecem com ?rascunho=1, e avisam que estão por conferir
  {
    const comR = carregar({}, undefined, { location: { search: "?rascunho=1" } }, true).q, semR = carregar({}, undefined, undefined, true).q;
    const nR = q => q.PASSAGENS.reduce((n, p) => n + p.frases.filter(f => f.rascunho).length + p.qs.filter(x => x.rascunho).length, 0);
    confere(nR(semR) === 0, "T: sem ?rascunho=1, nenhuma frase ou pergunta de rascunho deveria aparecer");
    const { q, els } = carregar({}, undefined, { location: { search: "?rascunho=1" } }, true);
    if (nR(comR) > 0) {
      let viu = false;
      for (let k = 0; k < 60 && !viu; k++) {
        q.jogarEtapa("novotestamento", 8);
        const st = q.state(), f = q.PASSAGENS.find(x => x.id === st.certa).frases[st.frase[st.certa]];
        q.pick(st.certa);
        if (f.rascunho) viu = els.panel.innerHTML.includes(`(${f.ref}, rascunho por conferir)`);
      }
      confere(viu, "T: com ?rascunho=1, a frase de rascunho deveria aparecer e avisar que está por conferir");
    }
  }
  // Volta da pergunta com mais de uma pergunta por passagem: cada rodada sorteia uma, com as respostas dela
  {
    const { q, els } = carregar({}, undefined, undefined, true);
    q.PASSAGENS.filter(x => x.serie === "novotestamento").forEach(x => x.qs.push({ t: "Pergunta de teste " + x.id + "?", c: "Certa " + x.id, e: ["Errada A", "Errada B", "Errada C"], ref: "Jo 99,1" }));
    const vistas = new Set();
    let mostraSorteada = true;
    for (let k = 0; k < 30; k++) {
      q.jogarEtapa("novotestamento", 4);
      const st = q.state(), p = q.PASSAGENS.find(x => x.id === q.base(st.order[st.i])).qs[st.pergunta];
      vistas.add(st.pergunta);
      if (!els.panel.innerHTML.includes(p.t) || ![p.c, ...p.e].every(r => els.panel.innerHTML.includes(`<span>${r}</span>`))) mostraSorteada = false;
      q.pick("c");
      if (!els.panel.innerHTML.includes(`<b>Resposta:</b> ${p.c} (${p.ref}).`)) mostraSorteada = false;
    }
    confere(vistas.size === 2 && mostraSorteada, "T: com duas perguntas por passagem, as rodadas deveriam sortear entre elas, com as respostas e o versículo da pergunta sorteada");
  }
  // Acerto guardado pelo nome (volta que saiu) ou sem tipo não conta, mas também não estraga os santos
  const antigo = carregar({ "quiz-santos-progresso": JSON.stringify({ novotestamento: ["ntanunciacao", "ntcana:nome", "ntcana:frase", "naoexiste"], santos: ["pedro"] }) }, undefined, undefined, true).q;
  confere(antigo.acertados(antigo.colecao("novotestamento")).join() === "ntcana:frase" && antigo.acertados(antigo.colecao("santos")).join() === "pedro", "T: acerto antigo pelo nome não deveria contar, e o da frase sim, sem mexer nos santos");
}

// P. Santos preparados: ficam escondidos até terem as duas imagens aprovadas
{
  const { q } = carregar();
  if (q.ativo) {
    const prontos = q.SAINTS.filter(s => q.ativo(s)), espera = q.SAINTS.filter(s => !q.ativo(s));
    confere(prontos.length + espera.length === 200, "P: contagem de ativos e preparados não fecha");
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

// J. Imagem refeita: São Longuinho ganhou vitral novo em 13/10/2026 e o endereço muda, para os aparelhos baixarem de novo
{
  const { q } = carregar();
  confere(q.imgFor("longuinho", "imagem") === "img/santos/longuinho.webp?v=2", "J: a figura de São Longuinho deveria vir com ?v=2");
  confere(q.imgFor("longuinho", "simbolos") === "img/simbolos/longuinho.webp", "J: os símbolos de São Longuinho não mudaram");
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

  const bytes = ["santos", "simbolos", "nossasenhora", "novotestamento", "antigotestamento"].flatMap(d => fs.readdirSync(path.join(RAIZ, "img", d)).map(n => fs.statSync(path.join(RAIZ, "img", d, n)).size)).reduce((a, b) => a + b, 0);
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
      const total = q.COM_FIGURA.length + q.COM_SIMBOLOS.length + Object.values(q.COM_SERIE).flat().length;
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
