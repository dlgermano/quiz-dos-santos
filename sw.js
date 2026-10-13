// Deixa o Quiz dos Santos abrir sem internet: guarda a página e as imagens no aparelho e as serve de lá.
// Mudou favicon, ícone ou manifesto: suba o número de CASCA. Refez imagem com o mesmo nome: ponha (ou suba) o número
// dela em REFEITAS, no index.html, e só ela é baixada de novo. Subir o de IMAGENS faz baixar todas outra vez.
const CASCA = "quiz-santos-casca-v1";
const IMAGENS = "quiz-santos-imagens-v2";
const ARQUIVOS = ["./", "manifest.webmanifest", "favicon.svg", "favicon-180.png", "icone-192.png", "icone-512.png", "icone-mascara-512.png"];

self.addEventListener("install", e => e.waitUntil(
  caches.open(CASCA).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting())));

self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(nomes => Promise.all(nomes.filter(n => n.startsWith("quiz-santos-") && n !== CASCA && n !== IMAGENS).map(n => caches.delete(n))))
    .then(() => self.clients.claim())));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const fonte = /^fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== self.location.origin && !fonte) return;
  if (req.mode === "navigate") e.respondWith(pagina(req));
  else e.respondWith(guardado(req, url.pathname.includes("/img/") ? IMAGENS : CASCA));
});

// A página vem da rede sempre que der, para as correções chegarem; sem rede (ou rede travada), vem a cópia guardada.
async function pagina(req) {
  const cache = await caches.open(CASCA);
  let relogio;
  try {
    const resp = await Promise.race([fetch(req), new Promise((_, falha) => { relogio = setTimeout(() => falha(new Error("demorou")), 4000); })]);
    if (resp.ok) cache.put(req, resp.clone());
    return resp;
  } catch (e) {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match("./")) || Response.error();
  } finally {
    clearTimeout(relogio);
  }
}

// Imagens, ícones e fontes não mudam de conteúdo: vale o que está guardado; o que ainda não está, busca e guarda.
async function guardado(req, nome) {
  const cache = await caches.open(nome);
  const tem = await cache.match(req);
  if (tem) return tem;
  const resp = await fetch(req);
  if (resp.ok) cache.put(req, resp.clone());
  return resp;
}
