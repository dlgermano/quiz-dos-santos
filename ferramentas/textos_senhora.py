"""Textos da coleção Nossa Senhora: nome curto, festa, história do título e explicação do vitral.
Depois de editar, rodar `py ferramentas/textos_senhora.py`, que regrava a linha `const SENHORAS` no index.html."""
import json
from pathlib import Path

from nossa_senhora import TITULOS

RAIZ = Path(__file__).resolve().parent.parent

# id: (nome curto, festa, história, o que se vê no vitral)
TEXTOS = {
    "nsaparecida": ("Aparecida", "12 de outubro",
        "Em 1717, três pescadores tiraram do rio Paraíba do Sul, em Guaratinguetá (SP), uma pequena imagem de terracota: primeiro o corpo, depois a cabeça. Em seguida, as redes vieram cheias de peixe. É a padroeira do Brasil.",
        "A imagem pequena e escura, de mãos postas: é de barro cozido e escureceu no fundo do rio. O manto azul em triângulo e a coroa foram postos nela depois, pela devoção do povo."),
    "nsfatima": ("Fátima", "13 de maio",
        "Em 1917, em Fátima, Portugal, apareceu seis vezes, de maio a outubro, a três crianças pastoras: Lúcia e os irmãos Francisco e Jacinta Marto. Pediu oração, penitência e a reza diária do terço pela paz.",
        "Toda de branco, com o terço nas mãos, sobre uma pequena azinheira: foi assim que os pastorinhos a descreveram, na Cova da Iria. As três crianças ajoelhadas são Lúcia, Francisco e Jacinta, com o rebanho."),
    "nsguadalupe": ("Guadalupe", "12 de dezembro",
        "Em 1531, no monte Tepeyac, no México, apareceu ao indígena São Juan Diego. Como sinal para o bispo, mandou-o colher rosas em pleno inverno; quando ele abriu o manto, a imagem estava gravada no tecido. É a padroeira da América Latina.",
        "O manto azul-esverdeado coberto de estrelas, os raios de sol em volta do corpo, a lua escura sob os pés e o anjo que a sustenta: é a imagem que ficou no manto de Juan Diego, guardado até hoje na basílica da Cidade do México."),
    "nslourdes": ("Lourdes", "11 de fevereiro",
        "Em 1858, em Lourdes, na França, apareceu dezoito vezes à menina Bernadete Soubirous, na gruta de Massabielle. Disse-lhe: “Eu sou a Imaculada Conceição”. A fonte que brotou na gruta atrai doentes do mundo inteiro.",
        "A faixa azul na cintura, o terço no braço e uma rosa dourada sobre cada pé: é a descrição de Bernadete, a menina ajoelhada com a vela. A gruta e a fonte são as de Massabielle."),
    "nsgracas": ("Graças", "27 de novembro",
        "Em 1830, em Paris, apareceu a Santa Catarina Labouré, noviça das Filhas da Caridade, e pediu que se cunhasse uma medalha com aquela imagem. A medalha se espalhou tão depressa, e com tantas graças, que o povo a chamou de Medalha Milagrosa.",
        "Os raios que saem das mãos abertas são as graças que ela derrama sobre quem as pede. Está de pé sobre o globo e pisa a serpente, com as estrelas em volta da cabeça, como na medalha."),
    "nsperpetuosocorro": ("Perpétuo Socorro", "27 de junho",
        "É um ícone de estilo bizantino venerado em Roma, na igreja de Santo Afonso. Em 1866, o papa Pio IX o confiou aos missionários redentoristas, com o pedido de que o tornassem conhecido no mundo inteiro.",
        "O Menino, assustado, agarra a mão da Mãe e olha para trás, e uma sandália lhe escapa do pé: ele viu os dois anjos que trazem os instrumentos da Paixão, a lança, a esponja, a cruz e os cravos. O fundo dourado é o dos ícones."),
    "nscarmo": ("Carmo", "16 de julho",
        "O título vem do monte Carmelo, na Terra Santa, onde nasceu a Ordem dos Carmelitas. Segundo a tradição da ordem, em 1251 Nossa Senhora apareceu a São Simão Stock e lhe entregou o escapulário como sinal de proteção.",
        "O hábito marrom e a capa branca são os dos carmelitas. O escapulário, dois pedaços de pano marrom ligados por cordões, está na mão dela e na do Menino. O monte ao fundo é o Carmelo."),
    "nsdores": ("Dores", "15 de setembro",
        "Lembra os sofrimentos de Maria ao lado do Filho, que a tradição conta em sete dores, da profecia de Simeão ao sepultamento de Jesus. A festa cai no dia seguinte ao da Exaltação da Santa Cruz.",
        "As sete espadas no coração são as sete dores, e lembram a profecia de Simeão: “uma espada traspassará a tua alma”. O manto escuro e as lágrimas são do luto."),
    "nsrosario": ("Rosário", "7 de outubro",
        "A festa foi instituída depois da batalha de Lepanto, em 1571, vitória que o papa São Pio V atribuiu à reza do rosário. Uma tradição dos dominicanos conta que a própria Virgem entregou o rosário a São Domingos.",
        "Nossa Senhora, com o Menino no colo, entrega o rosário a São Domingos, de hábito branco e capa preta. As rosas lembram o nome da oração: rosário quer dizer coroa de rosas."),
    "nsimaculada": ("Imaculada Conceição", "8 de dezembro",
        "Celebra a fé de que Maria foi preservada do pecado original desde o primeiro instante de sua existência, dogma proclamado pelo papa Pio IX em 1854. É padroeira de Portugal e de muitas cidades brasileiras.",
        "A jovem de mãos no peito e olhos no céu, sobre a lua e o globo, com as estrelas em volta da cabeça, é a “mulher vestida de sol” do Apocalipse. A imagem ficou famosa nas pinturas do espanhol Murillo."),
    "nsauxiliadora": ("Auxiliadora", "24 de maio",
        "O título “Auxílio dos Cristãos” é antigo. A festa foi criada pelo papa Pio VII, em agradecimento por ter voltado a Roma em 24 de maio de 1814, depois de anos preso por Napoleão. São João Bosco espalhou a devoção e lhe dedicou a basílica de Turim.",
        "O cetro e a coroa são de rainha. O Menino, também coroado, abre os braços para acolher. É a imagem do quadro que Dom Bosco mandou pintar para a basílica de Turim."),
    "nsnazare": ("Nazaré", "segundo domingo de outubro (Círio de Nazaré)",
        "Por volta de 1700, o caboclo Plácido achou uma pequena imagem à beira de um igarapé, em Belém do Pará. Conta-se que ele a levava para casa e ela voltava ao lugar onde foi achada; ali se ergueu a basílica. O Círio de Nazaré é uma das maiores procissões do mundo.",
        "A pequena imagem com o Menino, de manto bordado, vai dentro da berlinda enfeitada de flores, o andor fechado que percorre as ruas de Belém. A corda é a que os promesseiros seguram durante toda a procissão."),
    "nsdesatadora": ("Desatadora dos Nós", "sem data única (15 de agosto ou 8 de dezembro, conforme o lugar)",
        "A devoção nasceu de um quadro pintado por volta de 1700 para a igreja de São Pedro, em Augsburgo, na Alemanha. Os nós são as dificuldades da vida, que ela desfaz. O papa Francisco, que conheceu a imagem na Alemanha, ajudou a espalhar a devoção na Argentina e no Brasil.",
        "Um anjo entrega a fita cheia de nós, Nossa Senhora os desata, e o outro anjo recebe a fita lisa. A pomba é o Espírito Santo, e a lua sob os pés vem da mulher do Apocalipse."),
    "nsassuncao": ("Assunção", "15 de agosto",
        "Celebra a fé de que Maria, terminada a vida na terra, foi levada ao céu em corpo e alma. O dogma foi proclamado pelo papa Pio XII em 1950, mas a festa é celebrada desde os primeiros séculos.",
        "Maria sobe ao céu de braços abertos, levada pelos anjos. Embaixo fica o túmulo vazio, cheio de flores: segundo uma tradição antiga, foi o que os apóstolos encontraram no lugar do corpo."),
    "nspiedade": ("Piedade", "15 de setembro",
        "Lembra o momento em que Maria recebe nos braços o corpo de Jesus descido da cruz. A cena, chamada Pietà, é uma das mais representadas da arte cristã. Nossa Senhora da Piedade é a padroeira de Minas Gerais.",
        "O corpo de Jesus morto no colo da Mãe, ao pé da cruz já vazia. A coroa de espinhos ficou no chão."),
    "nsnavegantes": ("Navegantes", "2 de fevereiro",
        "É a protetora dos pescadores e dos marinheiros, devoção trazida pelos navegadores portugueses. No Brasil, a festa mais conhecida é a de Porto Alegre, com procissão em 2 de fevereiro.",
        "De pé num barco à vela, sobre as ondas, com o Menino num braço e a âncora na outra mão. A estrela no alto lembra outro título dela, Estrela do Mar, a que guia quem navega."),
    "nspenha": ("Penha", "varia conforme o lugar (no Rio de Janeiro, os domingos de outubro)",
        "Penha quer dizer rochedo. Segundo a tradição, em 1434 o peregrino francês Simão Vela achou uma imagem de Maria no alto da Penha de França, na Espanha. No Brasil, a devoção ergueu igrejas no alto de pedras, como o convento de Vila Velha (ES) e a igreja da Penha, no Rio de Janeiro.",
        "Nossa Senhora com o Menino no topo de um penhasco altíssimo, com a igrejinha branca e a escadaria talhada na pedra, como a da Penha, no Rio de Janeiro, que os romeiros sobem pagando promessa."),
    "nssalete": ("Salete", "19 de setembro",
        "Em 1846, em La Salette, nos Alpes da França, apareceu a duas crianças pastoras, Maximino e Melânia. Estava sentada, chorando, e pediu a conversão do povo, a oração e o respeito ao domingo.",
        "Sentada numa pedra, com o rosto entre as mãos, chorando: foi assim que as duas crianças a viram primeiro. No peito traz um crucifixo com um martelo de um lado e uma torquês do outro; na cabeça e no xale, rosas."),
    "nscandelaria": ("Candelária", "2 de fevereiro",
        "O título vem da festa da Apresentação do Senhor, quarenta dias depois do Natal, quando Maria e José levaram o Menino ao Templo. Nesse dia se benzem as velas, as candeias, porque o velho Simeão chamou Jesus de “luz para iluminar as nações”. Também é chamada Nossa Senhora das Candeias ou da Luz.",
        "A vela acesa na mão é a candeia que dá nome ao título. As duas pombas no cesto são a oferta dos pobres, que Maria e José levaram ao Templo."),
    "nsdesterro": ("Desterro", "17 de fevereiro (em Florianópolis)",
        "Desterro quer dizer exílio. O título lembra a fuga da Sagrada Família para o Egito, quando o rei Herodes mandou matar os meninos de Belém. Florianópolis nasceu com o nome de Nossa Senhora do Desterro.",
        "Maria no burrinho, com o Menino no colo, e São José à frente, a pé, puxando o animal. As palmeiras e a pirâmide ao longe mostram que a família já chegou ao Egito."),
    "nsconsolacao": ("Consolação e Correia", "4 de setembro",
        "É a padroeira da família agostiniana. Conta a tradição que Santa Mônica, aflita com a vida do filho Agostinho, pediu consolo a Nossa Senhora, que lhe apareceu vestida de luto, com uma correia na cintura, e mandou que se vestisse do mesmo modo.",
        "Nossa Senhora, com o Menino, entrega a correia preta a Santo Agostinho, de mitra de bispo, e a Santa Mônica, sua mãe. A correia é o cinto de couro do hábito dos agostinianos."),
    "nsloreto": ("Loreto", "10 de dezembro",
        "Em Loreto, na Itália, venera-se a Santa Casa, que a tradição diz ser a casa de Maria em Nazaré, levada pelos anjos para lá no fim do século XIII. Por causa desse voo, Nossa Senhora de Loreto é a padroeira dos aviadores.",
        "Nossa Senhora e o Menino sobre o telhado da casinha de tijolos, que os anjos carregam pelo céu, por cima do mar. A veste em forma de sino, cheia de joias, é a que cobre a imagem venerada em Loreto."),
    "nsmerces": ("Mercês", "24 de setembro",
        "Em 1218, em Barcelona, São Pedro Nolasco fundou a Ordem das Mercês para resgatar os cristãos feitos escravos, segundo a tradição a pedido da própria Virgem. Mercê quer dizer misericórdia, favor.",
        "Toda de branco, como os frades mercedários, com o escudo da ordem no peito. Nas mãos, os grilhões abertos; aos pés, os cativos libertados, com as correntes quebradas."),
    "nsmaerainha": ("Mãe Rainha", "18 de outubro",
        "Em 18 de outubro de 1914, na capelinha de Schoenstatt, na Alemanha, o padre José Kentenich e um grupo de jovens fizeram com Maria uma aliança de amor. O quadro da “Mãe Três Vezes Admirável” visita as casas, de família em família, na Campanha da Mãe Peregrina, iniciada no Brasil por João Pozzobon.",
        "A Mãe aperta o Menino contra si, os dois envoltos no mesmo véu: é o quadro venerado nas capelinhas do movimento. A capelinha branca ao fundo é a de Schoenstatt, copiada igual no mundo inteiro."),
    "nsbomconselho": ("Bom Conselho", "26 de abril",
        "É um afresco venerado em Genazzano, perto de Roma, na igreja dos agostinianos. Conta a tradição que a imagem apareceu na parede da igreja em 25 de abril de 1467, vinda da Albânia.",
        "O Menino cola o rosto no da Mãe, com um braço em volta do pescoço dela, como quem lhe fala ao ouvido. O arco-íris aparece atrás dos dois na imagem de Genazzano."),
    "nsrosamistica": ("Rosa Mística", "13 de julho",
        "Rosa Mística é um dos nomes de Maria na ladainha. A imagem das três rosas vem dos relatos de Pierina Gilli, enfermeira italiana que disse ter visto Nossa Senhora em Montichiari, a partir de 1947. A devoção se espalhou muito no Brasil.",
        "As três rosas no peito: a branca é a oração, a vermelha o sacrifício e a dourada a penitência."),
    "nscaravaggio": ("Caravaggio", "26 de maio",
        "Em 26 de maio de 1432, perto da vila de Caravaggio, na Itália, apareceu à camponesa Joaneta, que cortava capim para os animais e sofria com os maus-tratos do marido. No lugar brotou uma fonte. Os imigrantes italianos trouxeram a devoção para o Rio Grande do Sul, onde fica o santuário de Farroupilha.",
        "A camponesa Joaneta ajoelhada, a fonte que brota do chão entre as duas, e no chão o feixe de capim e a foice que ela largou ao ver Nossa Senhora."),
    "nsdoo": ("do Ó", "18 de dezembro",
        "É Nossa Senhora grávida, à espera do nascimento de Jesus; por isso também se chama Nossa Senhora da Expectação. O nome vem das antífonas cantadas nos sete dias antes do Natal, que começam todas com a exclamação “Ó”.",
        "A mão pousada sobre o ventre: Maria está grávida de Jesus. Não há Menino no colo, porque ele ainda vai nascer."),
    "nsneves": ("Neves", "5 de agosto",
        "Conta a tradição que, no século IV, numa noite de agosto, em pleno verão, nevou no monte Esquilino, em Roma, desenhando no chão a planta de uma igreja. Ali foi erguida a basílica de Santa Maria Maior, a maior igreja de Roma dedicada a Maria.",
        "A neve cai sob o sol de verão. Na colina, a mancha de neve tem a forma da planta de uma igreja, e ao lado está a basílica que ali se construiu."),
    "nspilar": ("Pilar", "12 de outubro",
        "Segundo a tradição, Nossa Senhora, ainda viva em Jerusalém, apareceu ao apóstolo São Tiago às margens do rio Ebro, em Saragoça, na Espanha, sobre uma coluna de pedra, para animá-lo na pregação. É a padroeira da Espanha.",
        "A pequena imagem com o Menino no alto de uma coluna, o pilar que dá nome ao título, com o resplendor redondo atrás. Ajoelhado junto ao rio está São Tiago, de peregrino."),
    "nsmontserrat": ("Montserrat", "27 de abril",
        "É a padroeira da Catalunha, venerada num mosteiro beneditino no alto da serra de Montserrat, perto de Barcelona. Por causa da cor escura, o povo a chama de “la Moreneta”, a moreninha. Diante dela, Santo Inácio de Loyola deixou a espada e mudou de vida.",
        "A imagem escura, sentada no trono, com o globo na mão direita e o Menino no colo. Ao fundo, a serra de pontas arredondadas, que parece serrada: Montserrat quer dizer “monte serrado”."),
    "nsczestochowa": ("Czestochowa", "26 de agosto",
        "É o ícone mais venerado da Polônia, guardado no mosteiro de Jasna Góra desde o século XIV. Em 1430, ladrões atacaram o santuário e golpearam a imagem; as marcas nunca saíram. São João Paulo II era seu grande devoto.",
        "As duas cicatrizes no rosto são as marcas do ataque de 1430. A pele escura deu-lhe o nome de Virgem Negra. Com a mão, ela aponta para o Menino, que segura um livro e abençoa."),
    "nslujan": ("Luján", "8 de maio",
        "Em 1630, uma carroça que levava uma pequena imagem da Imaculada Conceição parou à beira do rio Luján, na Argentina, e os bois só voltaram a andar quando a imagem foi descida. O povo entendeu que ela queria ficar ali. É a padroeira da Argentina.",
        "A imagem pequena, de mãos postas, com o manto azul-celeste e a túnica branca, as cores da bandeira argentina. Os raios dourados a cercam por inteiro, e ela pisa a meia-lua."),
    "nscabeca": ("Cabeça", "último domingo de abril (em Andújar, na Espanha)",
        "O nome vem do Cerro da Cabeça, monte da Andaluzia onde, segundo a tradição, um pastor de braço paralisado achou a imagem em 1227 e ficou curado. No Brasil, o nome fez dela a protetora de quem sofre de doenças e dores de cabeça e de quem estuda.",
        "Nossa Senhora, com o Menino num braço, traz uma cabeça na palma da outra mão: é assim que a imagem é feita no Brasil. Conta-se que um condenado à morte, salvo por ela, lhe ofereceu uma cabeça de cera em agradecimento."),
    "nssagradocoracao": ("Sagrado Coração", "último sábado de maio",
        "O título foi criado em 1857 pelo padre francês Júlio Chevalier, fundador dos Missionários do Sagrado Coração, em Issoudun, na França. Quer dizer que Maria leva ao coração de Jesus quem recorre a ela.",
        "O Menino aponta para o próprio coração em chamas e, com a outra mão, para o alto, para a Mãe: quem procura o coração dele pode pedir por meio dela."),
    "nsrainhadapaz": ("Rainha da Paz", "sem data única no calendário",
        "Em maio de 1917, em plena Primeira Guerra Mundial, o papa Bento XV pediu orações pela paz e mandou acrescentar à ladainha de Nossa Senhora a invocação “Rainha da paz, rogai por nós”. Poucos dias depois começaram as aparições de Fátima.",
        "O ramo de oliveira na mão e a pomba com o raminho no bico são sinais de paz desde a história de Noé. O Menino no outro braço é o Príncipe da Paz."),
    "nsdoleite": ("do Leite", "sem data única no calendário",
        "É uma das representações mais antigas de Maria: a mãe que amamenta o filho, sinal de que Jesus foi um bebê de verdade. Em Belém existe a Gruta do Leite, onde a tradição diz que a Sagrada Família se abrigou. Muitas mães pedem a ela ajuda para amamentar.",
        "Maria, sentada, amamenta o Menino, coberta pelo manto."),
    "nsboamorte": ("Boa Morte", "15 de agosto",
        "Lembra o fim da vida de Maria na terra, que os cristãos do Oriente chamam de Dormição: ela adormece cercada pelos apóstolos, antes de ser levada ao céu. No Brasil, a festa mais conhecida é a da Irmandade da Boa Morte, em Cachoeira, na Bahia, em agosto.",
        "Maria deitada, de olhos fechados e mãos cruzadas no peito, com os apóstolos em volta do leito. A vela acesa é a que se põe junto de quem está morrendo."),
    "nsrainha": ("Nossa Senhora Rainha", "22 de agosto",
        "A festa foi criada pelo papa Pio XII em 1954 e é celebrada oito dias depois da Assunção. É também o quinto mistério glorioso do rosário: a coroação de Maria como rainha do céu e da terra.",
        "Maria, ajoelhada sobre as nuvens, recebe a coroa das mãos de Jesus e de Deus Pai, com a pomba do Espírito Santo no alto: é coroada pela Santíssima Trindade."),
    "nslibano": ("Líbano", "primeiro domingo de maio",
        "É a grande estátua branca no alto do monte de Harissa, voltada para o mar, inaugurada em 1908. Os libaneses sobem até lá em peregrinação, e os imigrantes trouxeram a devoção ao Brasil.",
        "Toda de branco, de braços abertos voltados para o mar, no alto da torre branca em espiral. Os cedros dos lados são a árvore símbolo do Líbano."),
}


def main() -> None:
    faltam = [i for i, *_ in TITULOS if i not in TEXTOS]
    if faltam:
        raise SystemExit(f"Títulos sem texto: {faltam}")
    itens = [{"id": i, "name": nome, "curto": TEXTOS[i][0], "feast": TEXTOS[i][1], "bio": TEXTOS[i][2], "why": TEXTOS[i][3], "serie": "nossasenhora"}
             for i, nome, _figura, _conferir in TITULOS]
    linha = "  const SENHORAS = " + json.dumps(itens, ensure_ascii=False) + ";"
    arq = RAIZ / "index.html"
    with open(arq, encoding="utf-8", newline="") as f:  # newline="" preserva o fim de linha que o arquivo já usa
        texto = f.read()
    fim = "\r\n" if "\r\n" in texto else "\n"
    linhas = texto.split(fim)
    onde = [n for n, l in enumerate(linhas) if l.startswith("  const SENHORAS = ")]
    if len(onde) != 1:
        raise SystemExit("O index.html deveria ter exatamente uma linha `const SENHORAS = `.")
    linhas[onde[0]] = linha
    with open(arq, "w", encoding="utf-8", newline="") as f:
        f.write(fim.join(linhas))
    print(f"{len(itens)} títulos gravados no index.html")


if __name__ == "__main__":
    main()
