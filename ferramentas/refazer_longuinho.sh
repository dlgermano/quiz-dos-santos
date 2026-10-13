#!/bin/bash
# Troca o vitral de São Longuinho (o de 12/10 saiu com três braços) por uma das duas versões geradas em 13/10/2026,
# com a lança na mão direita. Uso: bash ferramentas/refazer_longuinho.sh <1|2>
cd "$(dirname "$0")/.." || exit 1
case $1 in
  1) ARQ=hf_20261013_153914_abbf96c9-0a94-4ef5-bdf4-3ae908df0e3b.png ;;
  2) ARQ=hf_20261013_153915_3248e4d3-d5dd-485a-a590-ea28dd772db6.png ;;
  *) echo "Uso: bash ferramentas/refazer_longuinho.sh <1|2>"; exit 1 ;;
esac
bash ferramentas/lote.sh santos longuinho=$ARQ && py ferramentas/reduzir.py santos longuinho
