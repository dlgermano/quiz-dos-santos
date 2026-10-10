#!/bin/bash
# Baixa as duas opções de figura feitas com foto de referência e monta a comparação com a foto.
# Uso: bash ferramentas/opcoes.sh <id> <arquivo A hf_...png> <arquivo B hf_...png>
cd "$(dirname "$0")/.." || exit 1
ID=$1; U="https://d8j0ntlcm91z4.cloudfront.net/user_3HDqYsmYr9N7xFCNiOY0oQWtmtc"
mkdir -p img/originais/santos testes/capturas
for L in A B; do
  ARQ=$2; [ $L = B ] && ARQ=$3
  curl -s -o "img/originais/santos/${ID}_opcao$L.png" "$U/$ARQ" || exit 1
  echo "santos;$ID;opcao$L;${ARQ:19:36};$U/$ARQ" >> img/originais/registro.csv
done
py - "$ID" <<'PY'
import sys, glob
from PIL import Image, ImageDraw
i = sys.argv[1]
ref = glob.glob(f"img/referencias/{i}.*")[0]
r = Image.open(ref).convert("RGB"); r = r.resize((int(r.width * 876 / r.height), 876))
a, b = (Image.open(f"img/originais/santos/{i}_opcao{l}.png").convert("RGB").resize((660, 876)) for l in "AB")
s = Image.new("RGB", (r.width + 1320, 906), "white"); s.paste(r, (0, 30)); s.paste(a, (r.width, 30)); s.paste(b, (r.width + 660, 30))
d = ImageDraw.Draw(s); d.text((8, 8), f"{i}: referencia", fill="black"); d.text((r.width + 8, 8), "Opcao A", fill="black"); d.text((r.width + 668, 8), "Opcao B", fill="black")
s.save(f"testes/capturas/opcoes-{i}.png"); print(f"testes/capturas/opcoes-{i}.png")
PY
