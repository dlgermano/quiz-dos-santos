"""Resumo da vida de cada santo, mostrado depois da resposta. Grava a tabela BIO no index.html.
Pode rodar de novo depois de editar um texto: a tabela é substituída.
Uso: py ferramentas/bios.py"""
import json
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

BIO = {
    "pedro": "Pescador da Galileia, chamado por Jesus para ser o primeiro dos apóstolos. Foi o primeiro papa e morreu mártir em Roma, entre os anos 64 e 68, crucificado de cabeça para baixo.",
    "paulo": "Fariseu de Tarso que perseguia os cristãos, converteu-se no caminho de Damasco. Tornou-se o grande missionário dos povos não judeus e morreu mártir em Roma, entre os anos 64 e 67.",
    "francisco": "Filho de um rico comerciante de Assis, na Itália, largou tudo para viver o Evangelho na pobreza. Fundou a Ordem Franciscana e morreu em 1226.",
    "jorge": "Soldado romano nascido na Capadócia, morto por volta de 303 por não renunciar à fé na perseguição de Diocleciano. A lenda do dragão surgiu séculos depois.",
    "teresinha": "Carmelita francesa que entrou no convento de Lisieux aos 15 anos e morreu de tuberculose aos 24, em 1897. Ensinou a “pequena via” da confiança em Deus e é doutora da Igreja.",
    "antonio": "Nascido em Lisboa em 1195, tornou-se frade franciscano e um dos maiores pregadores do seu tempo. Morreu em Pádua, na Itália, em 1231.",
    "sebastiao": "Oficial da guarda do imperador romano, no século III, ajudava em segredo os cristãos presos. Sobreviveu às flechas e foi morto depois a pauladas. É padroeiro do Rio de Janeiro.",
    "luzia": "Jovem de Siracusa, na Sicília, que consagrou a vida a Deus e distribuiu seus bens aos pobres. Foi martirizada por volta de 304.",
    "catarina": "Jovem sábia de Alexandria, no Egito, que segundo a tradição venceu em debate os filósofos do imperador. Foi martirizada no início do século IV.",
    "lourenco": "Diácono de Roma, encarregado dos bens da Igreja e do cuidado dos pobres. Foi martirizado em 258, dias depois do papa Sisto II.",
    "jose": "Carpinteiro de Nazaré, esposo de Maria e pai adotivo de Jesus. É padroeiro da Igreja, dos trabalhadores e da boa morte.",
    "miguel": "Um dos três arcanjos citados na Bíblia, chefe dos exércitos celestes. O Apocalipse o mostra vencendo o dragão.",
    "bento": "Nascido em Núrsia, na Itália, por volta de 480, fundou o mosteiro de Monte Cassino e escreveu a Regra que organizou a vida monástica do Ocidente. É padroeiro da Europa.",
    "barbara": "Jovem do século III que, segundo a tradição, vivia na Nicomédia e foi morta pelo próprio pai por ter se tornado cristã.",
    "joao": "Filho de Zacarias e Isabel, parente de Jesus. Pregou a conversão no deserto, batizou Jesus no rio Jordão e foi decapitado por ordem de Herodes.",
    "clara": "Jovem nobre de Assis que, aos 18 anos, seguiu São Francisco e fundou as Clarissas. Morreu em 1253.",
    "rita": "Italiana da Úmbria, foi esposa, mãe e viúva antes de entrar para o convento agostiniano de Cássia. Morreu em 1457 e é invocada nas causas impossíveis.",
    "judas": "Um dos doze apóstolos, a quem se atribui uma carta do Novo Testamento. Segundo a tradição, pregou na Mesopotâmia e na Pérsia, onde morreu mártir.",
    "cristovao": "Mártir do século III, na Ásia Menor. A tradição o apresenta como um homem de grande estatura que servia a Deus atravessando viajantes num rio.",
    "expedito": "Segundo a tradição, comandante de uma legião romana, martirizado em Melitene, na Armênia, por volta de 303.",
    "agostinho": "Nascido em 354 no norte da África, viveu uma juventude inquieta até se converter aos 32 anos, pelas orações da mãe, Santa Mônica. Bispo de Hipona, escreveu as “Confissões”.",
    "inacio": "Nobre basco ferido em batalha, converteu-se lendo a vida dos santos durante a convalescença. Fundou a Companhia de Jesus em 1540 e morreu em Roma em 1556.",
    "domingos": "Sacerdote espanhol nascido por volta de 1170, fundou a Ordem dos Pregadores, os dominicanos. Morreu em Bolonha em 1221.",
    "jeronimo": "Estudioso nascido na Dalmácia por volta de 347, viveu como eremita e depois em Belém, onde morreu em 420. É doutor da Igreja.",
    "patricio": "Nascido na Britânia, foi levado como escravo para a Irlanda na juventude. Voltou como bispo e evangelizou a ilha no século V.",
    "nicolau": "Bispo de Mira, na atual Turquia, no século IV, lembrado pela generosidade com os pobres. Suas relíquias estão em Bari, na Itália.",
    "cecilia": "Jovem romana de família nobre, martirizada por volta do século III. É uma das mártires mais veneradas de Roma.",
    "apolonia": "Cristã de Alexandria, no Egito, já de idade avançada, morta em 249 num motim contra os cristãos.",
    "bras": "Médico e bispo de Sebaste, na Armênia, martirizado por volta de 316, depois de viver escondido numa gruta.",
    "roque": "Nascido em Montpellier, na França, no século XIV, deu seus bens aos pobres e partiu em peregrinação a Roma, cuidando dos doentes de peste pelo caminho.",
    "tiago": "Pescador, filho de Zebedeu e irmão de João, foi um dos três apóstolos mais próximos de Jesus. Foi o primeiro apóstolo mártir, decapitado em Jerusalém por volta do ano 44.",
    "mateus": "Cobrador de impostos em Cafarnaum, deixou tudo quando Jesus lhe disse “segue-me”. É apóstolo e autor do primeiro Evangelho.",
    "marcos": "Discípulo de Pedro e companheiro de Paulo, escreveu o Evangelho mais antigo. A tradição diz que fundou a Igreja de Alexandria, onde morreu mártir.",
    "lucas": "Médico de origem grega, companheiro de viagem de São Paulo. Escreveu o terceiro Evangelho e os Atos dos Apóstolos.",
    "joaoev": "Pescador, irmão de Tiago, o apóstolo mais jovem e o “discípulo amado”. Esteve aos pés da cruz e recebeu Maria como mãe.",
    "andre": "Pescador de Betsaida, irmão de Pedro e discípulo de João Batista. Segundo a tradição, pregou na Grécia, onde foi martirizado.",
    "estevao": "Um dos sete primeiros diáconos, escolhidos pelos apóstolos para servir os pobres de Jerusalém. Morreu perdoando os que o matavam.",
    "martinho": "Soldado romano nascido na Panônia em 316 ou 336, deixou o exército para ser monge e depois bispo de Tours, na França.",
    "ambrosio": "Governador de Milão, foi aclamado bispo pelo povo em 374, antes mesmo de ser batizado. Doutor da Igreja, batizou Santo Agostinho.",
    "gregorio": "Prefeito de Roma que se fez monge, foi eleito papa em 590. Organizou a liturgia e enviou missionários à Inglaterra. É doutor da Igreja.",
    "helena": "Mãe do imperador Constantino, converteu-se já idosa. Por volta de 326 viajou à Terra Santa e mandou construir basílicas nos lugares da vida de Jesus.",
    "pio": "Frade capuchinho italiano, viveu em San Giovanni Rotondo, onde passava horas no confessionário e fundou um hospital. Morreu em 1968.",
    "joana": "Camponesa francesa que, aos 17 anos, guiada por vozes, liderou o exército da França na Guerra dos Cem Anos. Foi queimada como herege em 1431, aos 19 anos, e reabilitada depois.",
    "cosme": "Irmãos gêmeos nascidos na Arábia, exerceram a medicina na Ásia Menor e foram martirizados por volta do ano 300.",
    "edwiges": "Duquesa da Silésia, nascida na Baviera em 1174. Mãe de sete filhos, dedicou-se aos pobres e pagava as dívidas dos presos. Viúva, viveu no mosteiro de Trebnitz.",
    "rosalima": "Nascida em Lima, no Peru, em 1586, viveu como leiga dominicana na casa dos pais, em oração e no cuidado dos doentes. Morreu aos 31 anos.",
    "xavier": "Jesuíta espanhol, um dos primeiros companheiros de Santo Inácio. Partiu em 1541 para o Oriente e morreu em 1552, às portas da China. É padroeiro das missões.",
    "faustina": "Religiosa polonesa de origem humilde, nascida em 1905. Morreu de tuberculose aos 33 anos, em 1938.",
    "bernadete": "Filha de um moleiro pobre de Lourdes, na França, tinha 14 anos em 1858. Mais tarde entrou para o convento de Nevers, onde morreu em 1879.",
    "teresaavila": "Carmelita espanhola nascida em 1515, reformou o Carmelo e fundou 17 conventos. Mística e escritora, foi a primeira mulher declarada doutora da Igreja.",
    "antao": "Egípcio nascido por volta de 251, aos 20 anos deu seus bens aos pobres e retirou-se para o deserto. Morreu com mais de cem anos.",
    "teresacalcuta": "Nascida em 1910 em Skopje, de família albanesa, foi professora na Índia antes de se dedicar aos moribundos das ruas. Recebeu o Nobel da Paz em 1979 e morreu em 1997.",
    "kolbe": "Frade franciscano polonês, fundou a Milícia da Imaculada e publicações de grande tiragem. Preso pelos nazistas, morreu em Auschwitz em 1941.",
    "ferrer": "Dominicano nascido em Valência, na Espanha, em 1350. Trabalhou pelo fim do cisma que dividia a Igreja e morreu na Bretanha em 1419.",
    "bakhita": "Nascida no Sudão por volta de 1869, foi raptada aos 7 anos e vendida várias vezes. Morreu em 1947, em Schio, na Itália.",
    "eloi": "Nascido na França por volta de 588, foi conselheiro do rei Dagoberto. Usava a riqueza que ganhava para resgatar escravos.",
    "huberto": "Nobre da corte franca, nascido por volta de 656 e apaixonado por caçadas. Depois da conversão foi bispo de Maastricht e Liège e evangelizou as Ardenas. Morreu em 727.",
    "goncalo": "Sacerdote português do século XIII, viveu como eremita e frade dominicano em Amarante, onde construiu uma ponte sobre o rio Tâmega.",
    "galvao": "Frade franciscano nascido em Guaratinguetá (SP) em 1739. Fundou o Mosteiro da Luz, em São Paulo, e morreu em 1822.",
    "anchieta": "Jesuíta nascido nas Ilhas Canárias, chegou ao Brasil aos 19 anos, em 1553. Participou da fundação de São Paulo e escreveu a primeira gramática da língua tupi.",
    "isidoro": "Trabalhador rural nascido em Madri por volta de 1070, casado com Santa Maria de la Cabeza. Passou a vida a serviço do mesmo patrão.",
    "bartolomeu": "Um dos doze apóstolos. Segundo a tradição, pregou na Índia e na Armênia, onde foi martirizado.",
    "madalena": "Discípula de Jesus, natural de Magdala, na Galileia. Acompanhou-o até a cruz e foi ao túmulo na manhã de Páscoa.",
    "barnabe": "Levita nascido em Chipre, vendeu seu campo e entregou o dinheiro aos apóstolos. Apresentou Paulo à comunidade e, segundo a tradição, morreu mártir em Chipre.",
    "benedito": "Nascido na Sicília em 1526, foi frade franciscano em Palermo. Mesmo sem saber ler, foi escolhido superior do convento. Morreu em 1589.",
    "longuinho": "Segundo a tradição, o centurião que estava ao pé da cruz e disse: “Verdadeiramente este homem era Filho de Deus”. Teria se convertido e morrido mártir na Capadócia.",
    "joaopaulo": "Karol Wojtyła, nascido na Polônia em 1920, foi papa de 1978 a 2005. Visitou 129 países, sobreviveu a um atentado em 1981 e criou as Jornadas Mundiais da Juventude.",
    "rafael": "Um dos três arcanjos citados na Bíblia. É padroeiro dos viajantes, dos médicos e dos farmacêuticos.",
    "josemaria": "Sacerdote espanhol nascido em Barbastro em 1902. Morreu em Roma em 1975 e foi canonizado em 2002.",
    "ana": "Segundo uma tradição antiga, esposa de São Joaquim. Os Evangelhos não a mencionam; seu nome vem de escritos do século II.",
    "monica": "Nascida em Tagaste, no norte da África, por volta de 331. Casada com um pagão de gênio difícil, viu o marido e o filho se converterem. Morreu em Óstia em 387.",
    "veronica": "Mulher de Jerusalém lembrada pela tradição. Não aparece nos Evangelhos; seu nome é associado à expressão “vera icon”, imagem verdadeira.",
    "dulce": "Maria Rita Lopes Pontes nasceu em Salvador em 1914 e entrou para a vida religiosa aos 18 anos. Morreu em 1992 e foi canonizada em 2019.",
    "margaridamaria": "Religiosa francesa da Ordem da Visitação, nascida em 1647. Recebeu as revelações entre 1673 e 1675 e morreu em 1690.",
    "gabriel": "Um dos três arcanjos citados na Bíblia. Anunciou também a Zacarias o nascimento de João Batista. É padroeiro das comunicações.",
    "reismagos": "Sábios vindos do Oriente para adorar o Menino Jesus. O Evangelho não diz quantos eram nem que eram reis; a tradição fixou o número três por causa dos presentes.",
    "joaobosco": "Sacerdote nascido no Piemonte, na Itália, em 1815, de família camponesa. Dedicou a vida aos meninos de rua de Turim e morreu em 1888.",
    "carloacutis": "Nascido em Londres em 1991 e criado em Milão, era um adolescente comum que ia à missa todos os dias. Morreu de leucemia e foi canonizado em 2025.",
    "vicentepaulo": "Sacerdote francês nascido em 1581. Fundou a Congregação da Missão e, com Santa Luísa de Marillac, as Filhas da Caridade. Morreu em 1660.",
    "marta": "Irmã de Maria e de Lázaro, amigos de Jesus. Diante do túmulo do irmão, professou sua fé: “Eu creio que tu és o Cristo”.",
    "isabel": "Filha do rei da Hungria, nascida em 1207, casou-se com o landgrave da Turíngia. Morreu aos 24 anos, em 1231.",
    "catarinasena": "Nascida em Siena, na Itália, em 1347, era leiga dominicana e quase não teve estudo. Morreu aos 33 anos; é doutora da Igreja e padroeira da Itália.",
    "efigenia": "Segundo a tradição, era filha do rei da Etiópia no século I e consagrou-se a Deus, recusando o casamento com o sucessor do pai.",
    "paulina": "Amabile Visintainer nasceu na Itália em 1865 e veio para o Brasil aos 9 anos, em 1875. Morreu em São Paulo em 1942.",
    "gianna": "Nascida perto de Milão em 1922, casou-se com Pietro Molla e teve quatro filhos. Foi canonizada em 2004, na presença do marido e dos filhos.",
    "joaquim": "Segundo uma tradição antiga, esposo de Santa Ana. Os Evangelhos não o mencionam; seu nome vem de escritos do século II.",
    "luisgonzaga": "Primogênito do marquês de Castiglione, na Itália, nascido em 1568. Entrou na Companhia de Jesus aos 17 anos.",
    "camilo": "Nascido na Itália em 1550, foi soldado e jogador antes de se converter aos 24 anos. Doente de uma chaga na perna, passou a servir nos hospitais de Roma. Morreu em 1614.",
    "martinholima": "Nascido em Lima, no Peru, em 1579, filho de um nobre espanhol. Aprendeu o ofício de barbeiro-cirurgião e cuidava de doentes de qualquer origem. Morreu em 1639.",
    "raimundononato": "Espanhol da Catalunha, nascido por volta de 1204. Chamam-no “Nonato”, não nascido, porque foi tirado do ventre da mãe já morta. Frade mercedário, entregou-se como refém no lugar de cativos.",
    "vianney": "Camponês francês nascido em 1786, teve grande dificuldade nos estudos. Foi pároco de Ars por 41 anos e atraía multidões. Morreu em 1859.",
    "tarcisio": "Acólito da Igreja de Roma no tempo das perseguições. O papa São Dâmaso registrou seu martírio num poema.",
    "joaodiego": "Indígena nascido por volta de 1474, batizado já adulto. Viveu até 1548 junto à capela construída no monte Tepeyac. Foi canonizado em 2002.",
    "simaostock": "Inglês do século XIII, foi superior geral dos carmelitas quando a ordem se estabelecia na Europa. Morreu em Bordéus, na França.",
    "dimas": "Um dos dois malfeitores crucificados com Jesus. O nome Dimas vem da tradição; o Evangelho não o cita.",
    "onofre": "Eremita do Egito, do século IV ou V. Sua história foi contada pelo monge Pafnúcio, que o encontrou no deserto pouco antes da morte.",
    "tomasaquino": "Nascido perto de Aquino, na Itália, por volta de 1225, de família nobre que se opôs à sua vocação. Ensinou em Paris e morreu em 1274.",
    "carlosborromeu": "Nascido em 1538, sobrinho de papa, foi cardeal aos 21 anos. Arcebispo de Milão, aplicou as reformas do Concílio de Trento e fundou seminários. Morreu em 1584.",
    "brigida": "Nascida por volta de 451, fundou o mosteiro de Kildare, um dos mais importantes da Irlanda. Morreu por volta de 525.",
    "escolastica": "Irmã gêmea de São Bento, nascida em Núrsia por volta de 480. Consagrada a Deus desde jovem, morreu por volta de 543.",
    "doroteia": "Jovem de Cesareia da Capadócia, martirizada por volta de 311, na perseguição de Diocleciano. É padroeira dos floristas e jardineiros.",
    "edithstein": "Nascida em Breslávia em 1891, numa família judia, foi discípula do filósofo Husserl. Converteu-se ao ler Santa Teresa d’Ávila e entrou no Carmelo em 1933.",
    "filipe": "Natural de Betsaida, como Pedro e André, foi um dos primeiros chamados por Jesus e levou Natanael até ele. Segundo a tradição, morreu mártir na Frígia.",
    "tiagomenor": "Apóstolo, filho de Alfeu. A tradição o identifica com o “irmão do Senhor” que chefiou a Igreja de Jerusalém. Morreu por volta do ano 62.",
    "joaodedeus": "Português nascido em Montemor-o-Novo em 1495, foi pastor, soldado e livreiro. Converteu-se aos 41 anos e morreu em 1550. Dele nasceu a Ordem Hospitaleira.",
    "januario": "Bispo de Benevento, na Itália, decapitado por volta de 305, na perseguição de Diocleciano. É padroeiro de Nápoles.",
    "bonifacio": "Monge inglês nascido por volta de 675, com o nome de Winfrid. Organizou a Igreja na Alemanha e foi morto na Frísia em 754, com quase 80 anos.",
    "nepomuceno": "Sacerdote nascido na Boêmia por volta de 1345, vigário-geral do arcebispo de Praga. É padroeiro dos confessores e protetor contra as enchentes.",
    "frassati": "Nascido em Turim em 1901, filho do dono do jornal La Stampa, estudava engenharia de minas. Morreu de poliomielite e foi canonizado em 2025.",
    "charbel": "Youssef Makhlouf nasceu numa aldeia das montanhas do Líbano em 1828. Monge em Annaya, morreu em 1898. Muitas curas são atribuídas à sua intercessão.",
    "cupertino": "Nascido em Copertino, no sul da Itália, em 1603, de família muito pobre. Frade franciscano conventual, morreu em 1663.",
    "foucauld": "Nascido em Estrasburgo em 1858, foi oficial do exército francês e explorador do Marrocos. Convertido aos 28 anos, foi morto em Tamanrasset, na Argélia, em 1916.",
    "joaodacruz": "Nascido em Fontiveros, na Espanha, em 1542, de família pobre. Chegou a ser preso pelos próprios confrades, e na prisão escreveu seus poemas mais famosos. Morreu em 1591 e é doutor da Igreja.",
    "inacioantioquia": "Discípulo dos apóstolos e bispo de Antioquia. Preso, escreveu sete cartas a caminho de Roma. Foi o primeiro a usar a expressão “Igreja católica”.",
    "tomasbecket": "Nascido em Londres por volta de 1120, foi chanceler e amigo do rei. Feito arcebispo, passou a defender a liberdade da Igreja contra ele.",
    "brandao": "Abade irlandês nascido por volta de 484. Fundou vários mosteiros, entre eles o de Clonfert, e morreu por volta de 577.",
    "amaro": "Também chamado São Mauro, nasceu em Roma por volta de 512 e foi entregue ainda menino a São Bento. Conta-se que andou sobre as águas para salvar São Plácido.",
    "ivo": "Nascido na Bretanha, na França, em 1253, estudou direito em Paris e Orléans. Tornou-se padre e morreu em 1303.",
}


def main() -> None:
    jogo = RAIZ / "index.html"
    s = jogo.read_text(encoding="utf-8")
    ids = re.findall(r'\{ id: "([a-z]+)", name: "', s)
    faltam, sobram = [i for i in ids if i not in BIO], [i for i in BIO if i not in ids]
    assert not faltam and not sobram, f"faltam: {faltam}; sobram: {sobram}"
    tabela = "  // Resumo da vida de cada santo, gerado por ferramentas/bios.py\n  const BIO = " + json.dumps(BIO, ensure_ascii=False) + ";\n  SAINTS.forEach(s => { s.bio = BIO[s.id]; });\n"
    s = re.sub(r"  // Resumo da vida de cada santo, gerado por ferramentas/bios\.py\n  const BIO = .*;\n  SAINTS\.forEach\(s => \{ s\.bio = BIO\[s\.id\]; \}\);\n", "", s)
    ancora = "  const WOMEN = "
    assert s.count(ancora) == 1
    s = s.replace(ancora, tabela + ancora)
    jogo.write_text(s, encoding="utf-8", newline="\n")
    print(f"{len(BIO)} resumos gravados; menor tem {min(len(v) for v in BIO.values())} caracteres")


if __name__ == "__main__":
    main()
