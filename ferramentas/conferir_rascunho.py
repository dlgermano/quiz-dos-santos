"""Confere o rascunho das coleções bíblicas (ferramentas/biblia_rascunho.py) na Bíblia Ave-Maria, com ferramentas/avemaria.py.
Frases: confere se cada trecho (separado por "[...]") aparece no versículo, ignorando só espaços. Perguntas: mostra o
versículo ao lado da resposta certa e confere sozinho quando a resposta aparece no texto; as outras ficam para ler.
Uso: py ferramentas/conferir_rascunho.py  (grava também ferramentas/conferencia_rascunho.txt)"""
import re
import sys
import urllib.error
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import avemaria  # noqa: E402
from biblia_rascunho import FRASES_RASCUNHO, PERGUNTAS_RASCUNHO  # noqa: E402

# Abreviação usada no jogo -> grafias possíveis do livro no endereço do site (a primeira que responder fica valendo)
LIVROS = {
    "Gn": ["genesis"], "Ex": ["exodo"], "Nm": ["numeros"], "Js": ["josue"], "Jz": ["juizes"], "Rt": ["rute"],
    "1Sm": ["i-samuel", "1-samuel", "samuel-i"], "1Rs": ["i-reis", "1-reis", "reis-i"], "2Rs": ["ii-reis", "2-reis", "reis-ii"],
    "Tb": ["tobias"], "Est": ["ester"], "Jó": ["jo"], "Ez": ["ezequiel"], "Dn": ["daniel"], "Jn": ["jonas"],
    "Mt": ["sao-mateus"], "Mc": ["sao-marcos"], "Lc": ["sao-lucas"], "Jo": ["sao-joao"], "At": ["atos-dos-apostolos", "atos"],
}
achado: dict[str, str] = {}


def versos(ref: str) -> str:
    """Texto dos versículos de uma referência como "Lc 22,55-56" ou "Gn 41,5-7"."""
    livro, resto = ref.split(" ", 1)
    cap, vs = resto.split(",")
    de, _, ate = vs.partition("-")
    for slug in ([achado[livro]] if livro in achado else LIVROS[livro]):
        try:
            texto = avemaria.trecho(slug, int(cap), int(de), int(ate) if ate else None)
            achado[livro] = slug
            return texto
        except (urllib.error.HTTPError, SystemExit, KeyError):
            continue
    raise LookupError(f"não achei {ref} no site (livro {livro}: tentei {', '.join(LIVROS[livro])})")


def limpo(t: str) -> str:
    return re.sub(r"\s+", " ", t.replace("“", "").replace("”", "").replace("\"", "")).strip()


def main() -> None:
    linhas, falhas, ler = [], 0, 0
    for pid, lista in FRASES_RASCUNHO.items():
        for frase, ref in lista:
            try:
                v = limpo(versos(ref))
            except LookupError as e:
                falhas += 1; linhas.append(f"FALHA frase {pid} ({ref}): {e}"); continue
            partes = [limpo(p).strip(" .") for p in frase.split("[...]")]
            if all(p and p in v for p in partes):
                linhas.append(f"ok    frase {pid} ({ref})")
            else:
                falhas += 1; linhas.append(f"FALHA frase {pid} ({ref})\n      rascunho: {frase}\n      site:     {v}")
    for pid, lista in PERGUNTAS_RASCUNHO.items():
        for perg, certa, _erradas, ref in lista:
            try:
                v = limpo(versos(ref))
            except LookupError as e:
                falhas += 1; linhas.append(f"FALHA pergunta {pid} ({ref}): {e}"); continue
            if limpo(certa).strip(" .!?").lower() in v.lower():
                linhas.append(f"ok    pergunta {pid} ({ref}): {certa}")
            else:
                ler += 1; linhas.append(f"LER   pergunta {pid} ({ref})\n      {perg} -> {certa}\n      site: {v}")
    resumo = f"\n{falhas} falhas, {ler} perguntas para conferir lendo, de {sum(map(len, FRASES_RASCUNHO.values()))} frases e {sum(map(len, PERGUNTAS_RASCUNHO.values()))} perguntas."
    texto = "\n".join(linhas) + resumo + "\n"
    (Path(__file__).resolve().parent / "conferencia_rascunho.txt").write_text(texto, encoding="utf-8")
    sys.stdout.reconfigure(encoding="utf-8")
    print(texto)


if __name__ == "__main__":
    main()
