"""Lê versículos da Bíblia Ave-Maria no site bibliacatolica.com.br, para conferir frases e perguntas das coleções bíblicas.
Uso: py ferramentas/avemaria.py <livro> <capítulo> <versículo>[-<versículo>]     ex.: py ferramentas/avemaria.py sao-joao 2 5-7
Os capítulos baixados ficam guardados na pasta temporária do sistema, para não pedir a mesma página duas vezes."""
import html
import re
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

GUARDA = Path(tempfile.gettempdir()) / "quiz-santos-avemaria"
CABECALHO = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
             "Accept": "text/html", "Accept-Language": "pt-BR,pt;q=0.9"}


def capitulo(livro: str, cap: int) -> dict[int, str]:
    """Devolve {número do versículo: texto} de um capítulo."""
    GUARDA.mkdir(exist_ok=True)
    arq = GUARDA / f"{livro}-{cap}.html"
    if not arq.exists():
        url = f"https://www.bibliacatolica.com.br/biblia-ave-maria/{livro}/{cap}/"
        with urllib.request.urlopen(urllib.request.Request(url, headers=CABECALHO), timeout=40) as r:
            arq.write_bytes(r.read())
        time.sleep(1)  # uma página por segundo, para não pesar no site
    pagina = arq.read_text(encoding="utf-8", errors="replace")
    versos = {}
    for n, texto in re.findall(r"<p><strong>(\d+)\.</strong>(.*?)</p>", pagina, flags=re.S):
        limpo = html.unescape(re.sub(r"<[^>]+>", "", texto))
        versos[int(n)] = re.sub(r"\s+", " ", limpo).replace("*", "").strip()
    if not versos:
        raise SystemExit(f"Não achei versículos em {livro} {cap}: o endereço ou o formato da página mudou.")
    return versos


def trecho(livro: str, cap: int, de: int, ate: int | None = None) -> str:
    v = capitulo(livro, cap)
    return " ".join(v[n] for n in range(de, (ate or de) + 1))


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    de, _, ate = sys.argv[3].partition("-")
    v = capitulo(sys.argv[1], int(sys.argv[2]))
    sys.stdout.reconfigure(encoding="utf-8")
    for n in range(int(de), int(ate or de) + 1):
        print(n, v.get(n, "(não existe)"))
