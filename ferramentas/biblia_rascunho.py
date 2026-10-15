"""Rascunho (15/10/2026): frases e perguntas a mais das coleções bíblicas, escritas sem acesso ao site da Bíblia
Ave-Maria, para o Daniel ver no jogo antes da conferência. No jogo, só aparecem com ?rascunho=1 no endereço.
Depois de conferidas palavra por palavra com ferramentas/avemaria.py, passam para FRASES_EXTRAS e PERGUNTAS_EXTRAS
(ferramentas/biblia_perguntas.py); as que não baterem são corrigidas ou saem. Usado por ferramentas/biblia.py."""

# Vazios desde 15/10/2026: o rascunho foi conferido e passou para FRASES_EXTRAS e PERGUNTAS_EXTRAS.
# id: [(frase, versículo), ...]
FRASES_RASCUNHO: dict[str, list[tuple[str, str]]] = {
}

# id: [(pergunta, resposta certa, [três erradas], versículo que dá a resposta), ...]
PERGUNTAS_RASCUNHO: dict[str, list[tuple[str, str, list[str], str]]] = {
}
