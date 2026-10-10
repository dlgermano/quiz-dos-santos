"""Testes de ferramentas/baixar.py e ferramentas/reduzir.py. Uso: py -m unittest testes/test_ferramentas.py -v"""
import random
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "ferramentas"))
import baixar  # noqa: E402
import reduzir  # noqa: E402


def imagem_de_teste(caminho: Path, semente: int = 1) -> None:
    """PNG de 880x1168 com faixas coloridas e ruído leve, parecido em peso com um vitral."""
    rnd = random.Random(semente)
    im = Image.new("RGB", (880, 1168))
    px = im.load()
    for y in range(1168):
        for x in range(880):
            r = rnd.randint(-12, 12)
            px[x, y] = ((x // 40 * 37 + r) % 256, (y // 40 * 53 + r) % 256, ((x + y) // 60 * 29 + r) % 256)
    im.save(caminho)


class Reduzir(unittest.TestCase):
    def test_gera_webp_no_tamanho_e_no_peso(self):
        with tempfile.TemporaryDirectory() as d:
            origem, destino = Path(d) / "pedro.png", Path(d) / "site" / "pedro.webp"
            imagem_de_teste(origem)
            antes = origem.read_bytes()
            tamanho = reduzir.reduzir(origem, destino)
            self.assertEqual(origem.read_bytes(), antes, "o original foi alterado")
            self.assertLessEqual(tamanho, 120 * 1024)
            self.assertEqual(tamanho, destino.stat().st_size)
            with Image.open(destino) as im:
                self.assertEqual(im.size, (600, 796))
                self.assertEqual(im.format, "WEBP")


class Baixar(unittest.TestCase):
    def test_nao_sobrescreve_a_tentativa_anterior(self):
        with tempfile.TemporaryDirectory() as d:
            a, b = Path(d) / "a.png", Path(d) / "b.png"
            imagem_de_teste(a, 1)
            imagem_de_teste(b, 2)
            destino = Path(d) / "originais" / "santos" / "pedro.png"
            baixar.baixar(a.as_uri(), destino)
            self.assertEqual(destino.read_bytes(), a.read_bytes())
            baixar.baixar(b.as_uri(), destino)
            self.assertEqual(destino.read_bytes(), b.read_bytes())
            self.assertEqual((destino.parent / "pedro_tentativa1.png").read_bytes(), a.read_bytes())
            baixar.baixar(a.as_uri(), destino)
            self.assertEqual((destino.parent / "pedro_tentativa2.png").read_bytes(), b.read_bytes())


if __name__ == "__main__":
    unittest.main()
