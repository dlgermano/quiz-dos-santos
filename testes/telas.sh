#!/bin/bash
# Fotografa o jogo em vários tamanhos de tela e junta tudo numa folha. Uso: bash testes/telas.sh <acao> <saida.png>
cd "$(dirname "$0")/.." || exit 1
ACAO=${1:-inicio}; SAIDA=${2:-testes/capturas/telas-$ACAO.png}
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
PERFIL="$(cygpath -w "$TEMP")\quiz-santos-edge-telas"; rm -rf "$TEMP/quiz-santos-edge-telas"
mkdir -p testes/capturas/telas
py -m http.server 8766 --bind 127.0.0.1 >/dev/null 2>&1 &
sleep 2
for T in 320x568 360x640 360x780 390x844 412x915 430x932 768x1024 844x390; do
  W=${T%x*}; H=${T#*x}
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$PERFIL" --virtual-time-budget=8000 --window-size=$((W<600?600:W)),$((H+100)) --screenshot="$(pwd -W)/testes/capturas/telas/$T.png" "http://127.0.0.1:8766/testes/teste.html?acao=$ACAO&modo=imagem&nivel=facil&largura=$W&altura=$H" >/dev/null 2>&1
done
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 8766 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }" >/dev/null 2>&1
py - "$SAIDA" <<'PY'
import sys
from PIL import Image, ImageDraw
tams=["320x568","360x640","360x780","390x844","412x915","430x932","768x1024","844x390"]
ims=[]
for t in tams:
    w,h=map(int,t.split("x")); im=Image.open(f"testes/capturas/telas/{t}.png").convert("RGB").crop((0,0,w,h)); ims.append((t,im))
alt=max(i.height for _,i in ims)+24; larg=sum(i.width for _,i in ims)+10*len(ims)
f=Image.new("RGB",(larg,alt),"#888"); d=ImageDraw.Draw(f); x=0
for t,im in ims:
    f.paste(im,(x,24)); d.text((x+4,6),t,fill="white"); x+=im.width+10
f.save(sys.argv[1]); print(sys.argv[1], f.size)
PY
