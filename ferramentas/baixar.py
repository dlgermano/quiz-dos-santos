"""Baixa um original do Higgsfield sem sobrescrever a tentativa anterior.
Uso: py ferramentas/baixar.py <serie> <id> <url> [job_id]"""
import sys
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SERIES = ("santos", "simbolos")


def baixar(url: str, destino: Path) -> int:
    """Grava a URL em destino. Se destino já existe, ele vira <id>_tentativaN.png. Devolve o número desta tentativa."""
    destino.parent.mkdir(parents=True, exist_ok=True)
    n = 1
    while (destino.parent / f"{destino.stem}_tentativa{n}{destino.suffix}").exists():
        n += 1
    if destino.exists():
        destino.rename(destino.parent / f"{destino.stem}_tentativa{n}{destino.suffix}")
        n += 1
    urllib.request.urlretrieve(url, destino)
    return n


def main() -> None:
    if len(sys.argv) < 4 or sys.argv[1] not in SERIES:
        sys.exit(__doc__)
    serie, ident, url = sys.argv[1:4]
    job = sys.argv[4] if len(sys.argv) > 4 else ""
    destino = RAIZ / "img" / "originais" / serie / f"{ident}.png"
    tentativa = baixar(url, destino)
    with open(RAIZ / "img" / "originais" / "registro.csv", "a", encoding="utf-8") as reg:
        reg.write(f"{serie};{ident};{tentativa};{job};{url}\n")
    print(f"{serie}/{ident}: tentativa {tentativa}, {destino.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
