#!/bin/bash
# Baixa vários originais de uma vez. Uso: bash ferramentas/lote.sh <serie> <id>=<arquivo hf_...png> [...]
cd "$(dirname "$0")/.." || exit 1
S=$1; shift
for par in "$@"; do
  id=${par%%=*}; arq=${par#*=}
  py ferramentas/baixar.py "$S" "$id" "https://d8j0ntlcm91z4.cloudfront.net/user_3HDqYsmYr9N7xFCNiOY0oQWtmtc/$arq" "${arq:19:36}" >/dev/null || echo "FALHOU $id"
done
