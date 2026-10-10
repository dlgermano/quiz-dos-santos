"""Monta uma folha de contato com vários originais lado a lado, para conferência rápida.
Uso: py ferramentas/folha.py <serie> <saida.png> <id> [<id> ...]"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
LADO, ALTO, FAIXA, COLUNAS = 400, 531, 24, 4


def main() -> None:
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    serie, saida, ids = sys.argv[1], Path(sys.argv[2]), sys.argv[3:]
    linhas = (len(ids) + COLUNAS - 1) // COLUNAS
    folha = Image.new("RGB", (COLUNAS * LADO, linhas * (ALTO + FAIXA)), "white")
    caneta = ImageDraw.Draw(folha)
    for n, ident in enumerate(ids):
        x, y = (n % COLUNAS) * LADO, (n // COLUNAS) * (ALTO + FAIXA)
        with Image.open(RAIZ / "img" / "originais" / serie / f"{ident}.png") as im:
            folha.paste(im.convert("RGB").resize((LADO, ALTO), Image.LANCZOS), (x, y + FAIXA))
        caneta.text((x + 6, y + 5), f"{serie}/{ident}", fill="black")
    saida.parent.mkdir(parents=True, exist_ok=True)
    folha.save(saida)
    print(saida)


if __name__ == "__main__":
    main()
