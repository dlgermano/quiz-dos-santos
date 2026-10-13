"""Gera a imagem do site (WebP 600x796, até 120 KB) a partir do original.
Uso: py ferramentas/reduzir.py <serie> <id> [<id> ...]"""
import sys
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SERIES = ("santos", "simbolos", "nossasenhora")
LARGURA, ALTURA, LIMITE = 600, 796, 120 * 1024


def reduzir(origem: Path, destino: Path) -> int:
    """Grava destino a partir de origem, baixando a qualidade até caber no limite. Devolve o tamanho em bytes."""
    with Image.open(origem) as im:
        pequena = im.convert("RGB").resize((LARGURA, ALTURA), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    for qualidade in range(84, 30, -6):
        pequena.save(destino, "WEBP", quality=qualidade, method=6)
        if destino.stat().st_size <= LIMITE:
            return destino.stat().st_size
    destino.unlink()
    raise ValueError(f"{origem.name}: não coube em {LIMITE // 1024} KB")


def main() -> None:
    if len(sys.argv) < 3 or sys.argv[1] not in SERIES:
        sys.exit(__doc__)
    serie = sys.argv[1]
    for ident in sys.argv[2:]:
        origem = RAIZ / "img" / "originais" / serie / f"{ident}.png"
        tamanho = reduzir(origem, RAIZ / "img" / serie / f"{ident}.webp")
        print(f"{serie}/{ident}: {tamanho // 1024} KB")


if __name__ == "__main__":
    main()
