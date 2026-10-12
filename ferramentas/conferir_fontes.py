"""Baixa o resumo da Wikipédia (em inglês e em português) de cada santo, para conferir datas e fatos dos textos do jogo.
Grava um arquivo de texto com: id, festa e resumo do jogo, seguido dos dois resumos da Wikipédia.
Uso: py ferramentas/conferir_fontes.py <saida.txt>"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

# id -> (título na Wikipédia em inglês, título na Wikipédia em português)
TITULOS = {
    "pedro": ("Saint Peter", "São Pedro"), "paulo": ("Paul the Apostle", "Paulo de Tarso"),
    "francisco": ("Francis of Assisi", "Francisco de Assis"), "jorge": ("Saint George", "Jorge da Capadócia"),
    "teresinha": ("Thérèse of Lisieux", "Teresa de Lisieux"), "antonio": ("Anthony of Padua", "António de Lisboa"),
    "sebastiao": ("Saint Sebastian", "São Sebastião"), "luzia": ("Saint Lucy", "Luzia de Siracusa"),
    "catarina": ("Catherine of Alexandria", "Catarina de Alexandria"), "lourenco": ("Saint Lawrence", "Lourenço de Huesca"),
    "jose": ("Saint Joseph", "José de Nazaré"), "miguel": ("Michael (archangel)", "Miguel (arcanjo)"),
    "bento": ("Benedict of Nursia", "Bento de Núrsia"), "barbara": ("Saint Barbara", "Bárbara de Nicomédia"),
    "joao": ("John the Baptist", "João Batista"), "clara": ("Clare of Assisi", "Clara de Assis"),
    "rita": ("Rita of Cascia", "Rita de Cássia"), "judas": ("Jude the Apostle", "Judas Tadeu"),
    "cristovao": ("Saint Christopher", "São Cristóvão"), "expedito": ("Expeditus", "Santo Expedito"),
    "agostinho": ("Augustine of Hippo", "Agostinho de Hipona"), "inacio": ("Ignatius of Loyola", "Inácio de Loyola"),
    "domingos": ("Saint Dominic", "Domingos de Gusmão"), "jeronimo": ("Jerome", "Jerónimo"),
    "patricio": ("Saint Patrick", "São Patrício"), "nicolau": ("Saint Nicholas", "Nicolau de Mira"),
    "cecilia": ("Saint Cecilia", "Santa Cecília"), "apolonia": ("Saint Apollonia", "Santa Apolónia"),
    "bras": ("Saint Blaise", "Brás de Sebaste"), "roque": ("Saint Roch", "São Roque"),
    "tiago": ("James the Great", "Tiago Maior"), "mateus": ("Matthew the Apostle", "Mateus (evangelista)"),
    "marcos": ("Mark the Evangelist", "Marcos (evangelista)"), "lucas": ("Luke the Evangelist", "Lucas (evangelista)"),
    "joaoev": ("John the Apostle", "João (apóstolo)"), "andre": ("Andrew the Apostle", "André (apóstolo)"),
    "estevao": ("Saint Stephen", "Santo Estêvão"), "martinho": ("Martin of Tours", "Martinho de Tours"),
    "ambrosio": ("Ambrose", "Ambrósio"), "gregorio": ("Pope Gregory I", "Papa Gregório I"),
    "helena": ("Helena, mother of Constantine I", "Helena de Constantinopla"), "pio": ("Padre Pio", "Pio de Pietrelcina"),
    "joana": ("Joan of Arc", "Joana d'Arc"), "cosme": ("Saints Cosmas and Damian", "Cosme e Damião"),
    "edwiges": ("Hedwig of Silesia", "Edviges da Silésia"), "rosalima": ("Rose of Lima", "Rosa de Lima"),
    "xavier": ("Francis Xavier", "Francisco Xavier"), "faustina": ("Faustina Kowalska", "Faustina Kowalska"),
    "bernadete": ("Bernadette Soubirous", "Bernadette Soubirous"), "teresaavila": ("Teresa of Ávila", "Teresa de Ávila"),
    "antao": ("Anthony the Great", "Antão do Deserto"), "teresacalcuta": ("Mother Teresa", "Madre Teresa de Calcutá"),
    "kolbe": ("Maximilian Kolbe", "Maximiliano Maria Kolbe"), "ferrer": ("Vincent Ferrer", "Vicente Ferrer"),
    "bakhita": ("Josephine Bakhita", "Josefina Bakhita"), "eloi": ("Saint Eligius", "Elói de Noyon"),
    "huberto": ("Hubertus", "Huberto de Liège"), "goncalo": ("Gonçalo de Amarante", "Gonçalo de Amarante"),
    "galvao": ("Anthony of Saint Anne Galvão", "Frei Galvão"), "anchieta": ("José de Anchieta", "José de Anchieta"),
    "isidoro": ("Isidore the Laborer", "Isidro Lavrador"), "bartolomeu": ("Bartholomew the Apostle", "Bartolomeu (apóstolo)"),
    "madalena": ("Mary Magdalene", "Maria Madalena"), "barnabe": ("Barnabas", "Barnabé"),
    "benedito": ("Benedict the Moor", "Benedito, o Negro"), "longuinho": ("Longinus", "Longino"),
    "joaopaulo": ("Pope John Paul II", "Papa João Paulo II"), "rafael": ("Raphael (archangel)", "Rafael (arcanjo)"),
    "josemaria": ("Josemaría Escrivá", "Josemaría Escrivá"), "ana": ("Saint Anne", "Santa Ana"),
    "monica": ("Saint Monica", "Santa Mônica"), "veronica": ("Saint Veronica", "Santa Verónica"),
    "dulce": ("Irmã Dulce", "Irmã Dulce"), "margaridamaria": ("Margaret Mary Alacoque", "Margarida Maria Alacoque"),
    "gabriel": ("Gabriel", "Gabriel (arcanjo)"), "reismagos": ("Biblical Magi", "Reis Magos"),
    "joaobosco": ("John Bosco", "João Bosco"), "carloacutis": ("Carlo Acutis", "Carlo Acutis"),
    "vicentepaulo": ("Vincent de Paul", "Vicente de Paulo"), "marta": ("Martha", "Marta de Betânia"),
    "isabel": ("Elizabeth of Hungary", "Isabel da Hungria"), "catarinasena": ("Catherine of Siena", "Catarina de Siena"),
    "efigenia": ("Saint Ephigenia of Ethiopia", "Santa Efigénia"), "paulina": ("Paulina do Coração Agonizante de Jesus", "Paulina do Coração Agonizante de Jesus"),
    "gianna": ("Gianna Beretta Molla", "Gianna Beretta Molla"), "joaquim": ("Joachim", "São Joaquim"),
    "luisgonzaga": ("Aloysius Gonzaga", "Luís Gonzaga"), "camilo": ("Camillus de Lellis", "Camilo de Lellis"),
    "martinholima": ("Martin de Porres", "Martinho de Porres"), "raimundononato": ("Raymond Nonnatus", "Raimundo Nonato"),
    "vianney": ("John Vianney", "João Maria Vianney"), "tarcisio": ("Tarcisius", "São Tarcísio"),
    "joaodiego": ("Juan Diego", "Juan Diego Cuauhtlatoatzin"), "simaostock": ("Simon Stock", "Simão Stock"),
    "dimas": ("Penitent thief", "São Dimas"), "onofre": ("Onuphrius", "Santo Onofre"),
    "tomasaquino": ("Thomas Aquinas", "Tomás de Aquino"), "carlosborromeu": ("Charles Borromeo", "Carlos Borromeu"),
    "brigida": ("Brigid of Kildare", "Brígida da Irlanda"), "escolastica": ("Scholastica", "Santa Escolástica"),
    "doroteia": ("Dorothea of Caesarea", "Doroteia de Cesareia"), "edithstein": ("Edith Stein", "Edith Stein"),
    "filipe": ("Philip the Apostle", "Filipe (apóstolo)"), "tiagomenor": ("James, son of Alphaeus", "Tiago, filho de Alfeu"),
    "joaodedeus": ("John of God", "João de Deus (santo)"), "januario": ("Januarius", "São Januário"),
    "bonifacio": ("Saint Boniface", "São Bonifácio"), "nepomuceno": ("John of Nepomuk", "João Nepomuceno"),
    "frassati": ("Pier Giorgio Frassati", "Pier Giorgio Frassati"), "charbel": ("Charbel Makhlouf", "Charbel Makhlouf"),
    "cupertino": ("Joseph of Cupertino", "José de Cupertino"), "foucauld": ("Charles de Foucauld", "Charles de Foucauld"),
    "joaodacruz": ("John of the Cross", "João da Cruz"), "inacioantioquia": ("Ignatius of Antioch", "Inácio de Antioquia"),
    "tomasbecket": ("Thomas Becket", "Thomas Becket"), "brandao": ("Brendan the Navigator", "São Brandão"),
    "amaro": ("Saint Maurus", "Santo Amaro"), "ivo": ("Ivo of Kermartin", "Ivo de Kermartin"),
    "ines": ("Agnes of Rome", "Inês de Roma"),
    "pastorinhos": ("Francisco and Jacinta Marto", "Francisco e Jacinta Marto"),
    "tome": ("Thomas the Apostle", "Tomé (apóstolo)"),
    "tomasmore": ("Thomas More", "Thomas More"),
    "boaventura": ("Bonaventure", "Boaventura de Bagnoregio"),
    "bruno": ("Bruno of Cologne", "Bruno de Colônia"),
    "filipeneri": ("Philip Neri", "Filipe Néri"),
    "franciscopaula": ("Francis of Paola", "Francisco de Paula"),
    "germano": ("Germain of Paris", "Germano de Paris"),
    "ezequielmoreno": ("Ezequiél Moreno y Díaz", "Ezequiel Moreno y Díaz"),
    "tomasvilanova": ("Thomas of Villanova", "Tomás de Vilanova"),
    "joaosahagun": ("John of Sahagún", "João de Sahagún"),
    "nicolautolentino": ("Nicholas of Tolentino", "Nicolau de Tolentino"),
    "madalenanagasaki": ("Magdalene of Nagasaki", "Madalena de Nagasaki"),
    "simao": ("Simon the Zealot", "Simão, o Zelote"),
    "matias": ("Saint Matthias", "Matias (apóstolo)"),
    "valentim": ("Saint Valentine", "Valentim de Roma"),
    "silvestre": ("Pope Sylvester I", "Papa Silvestre I"),
    "pancracio": ("Pancras of Rome", "Pancrácio de Roma"),
    "geraldo": ("Gerard Majella", "Geraldo Majela"),
    "catarinalaboure": ("Catherine Labouré", "Catarina Labouré"),
    "joaoxxiii": ("Pope John XXIII", "Papa João XXIII"),
    "domingossavio": ("Dominic Savio", "Domingos Sávio"),
    "mariagoretti": ("Maria Goretti", "Maria Goretti"),
    "lazaro": ("Lazarus of Bethany", "Lázaro de Betânia"),
    "piox": ("Pope Pius X", "Papa Pio X"),
    "luisrei": ("Louis IX of France", "Luís IX de França"),
    "paulovi": ("Pope Paul VI", "Papa Paulo VI"),
    "franciscosales": ("Francis de Sales", "Francisco de Sales"),
    "afonso": ("Alphonsus Liguori", "Afonso Maria de Ligório"),
    "bernardo": ("Bernard of Clairvaux", "Bernardo de Claraval"),
    "crisostomo": ("John Chrysostom", "João Crisóstomo"),
    "dionisio": ("Saint Denis", "Dionísio de Paris"),
    "ursula": ("Saint Ursula", "Úrsula (santa)"),
    "genoveva": ("Genevieve", "Genoveva"),
    "damiao": ("Father Damien", "Damião de Molokai"),
    "pedroclaver": ("Peter Claver", "Pedro Claver"),
    "romero": ("Óscar Romero", "Óscar Romero"),
    "zita": ("Zita", "Zita de Luca"),
    "peregrino": ("Peregrine Laziosi", "Peregrino Laziosi"),
    "luiszelia": ("Louis and Zélie Martin", "Luís e Zélia Martin"),
    "luisamarillac": ("Louise de Marillac", "Luísa de Marillac"),
    "pedroalcantara": ("Peter of Alcantara", "Pedro de Alcântara"),
    "cunhau": ("Martyrs of Cunhaú and Uruaçu", "Mártires de Cunhaú e Uruaçu"),
    "margaridaantioquia": ("Margaret the Virgin", "Margarida de Antioquia"),
    "paulomiki": ("Paul Miki", "Paulo Miki"),
    "gil": ("Saint Giles", "Santo Egídio"),
    "vito": ("Saint Vitus", "São Vito"),
    "roquegonzalez": ("Roque González de Santa Cruz", "Roque González de Santa Cruz"),
    "kateri": ("Kateri Tekakwitha", "Kateri Tekakwitha"),
    "junipero": ("Junípero Serra", "Junípero Serra"),
    "fiacre": ("Saint Fiacre", "Fiacre"),
    "venceslau": ("Wenceslaus I, Duke of Bohemia", "Venceslau I da Boêmia"),
    "clemente": ("Pope Clement I", "Papa Clemente I"),
    "perpetua": ("Perpetua and Felicity", "Perpétua e Felicidade"),
    "basilio": ("Basil of Caesarea", "Basílio de Cesareia"),
    "leao": ("Pope Leo I", "Papa Leão I"),
    "anselmo": ("Anselm of Canterbury", "Anselmo de Cantuária"),
    "beda": ("Bede", "Beda"),
    "norberto": ("Norbert of Xanten", "Norberto de Xanten"),
    "kostka": ("Stanislaus Kostka", "Estanislau Kostka"),
    "angelamerici": ("Angela Merici", "Ângela Merici"),
    "lwanga": ("Charles Lwanga", "Carlos Lwanga"),
    "cirilometodio": ("Saints Cyril and Methodius", "Cirilo e Metódio"),
    "solano": ("Francis Solanus", "Francisco Solano"),
    "mariaegipciaca": ("Mary of Egypt", "Maria Egipcíaca"),
}


def resumos(lingua: str, titulos: list[str]) -> dict[str, str]:
    """Busca a introdução de várias páginas por vez (20 por pedido), para não esbarrar no limite de consultas."""
    saida: dict[str, str] = {}
    for k in range(0, len(titulos), 20):
        lote = titulos[k:k + 20]
        url = (f"https://{lingua}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1"
               f"&exlimit=20&redirects=1&titles={urllib.parse.quote('|'.join(lote))}")
        pedido = urllib.request.Request(url, headers={"User-Agent": "quiz-dos-santos-conferencia/1.0 (uso pessoal)"})
        d: dict = {}
        for tentativa in range(5):
            try:
                with urllib.request.urlopen(pedido, timeout=30) as r:
                    d = json.load(r)["query"]
                break
            except Exception as e:  # limite de consultas ou rede: espera e tenta de novo
                d = {"erro": str(e)}
                time.sleep(20 * (tentativa + 1))
        de_para = {x["from"]: x["to"] for x in d.get("normalized", [])}
        redir = {x["from"]: x["to"] for x in d.get("redirects", [])}
        paginas = {pg.get("title"): pg.get("extract", "") for pg in d.get("pages", {}).values()}
        for t in lote:
            final = de_para.get(t, t)
            final = redir.get(final, final)
            texto = paginas.get(final)
            saida[t] = f"[{final}] {' '.join(texto.split())[:600]}" if texto else f"(sem página: {d.get('erro', 'título não encontrado')})"
        time.sleep(3)
    return saida


def main() -> None:
    html = (RAIZ / "index.html").read_text(encoding="utf-8")
    bio = json.loads(re.search(r"const BIO = (\{.*\});\n", html).group(1))
    festa = dict(re.findall(r'\{ id: "([a-z]+)", name: "[^"]+", feast: "([^"]+)"', html))
    assert set(bio) == set(TITULOS), set(bio) ^ set(TITULOS)
    en = resumos("en", [t[0] for t in TITULOS.values()])
    pt = resumos("pt", [t[1] for t in TITULOS.values()])
    with open(sys.argv[1], "w", encoding="utf-8") as f:
        for i, (ten, tpt) in TITULOS.items():
            f.write(f"### {i} | festa {festa[i]}\nJOGO: {bio[i]}\nEN: {en[ten]}\nPT: {pt[tpt]}\n\n")
    print("ok", len(TITULOS))


if __name__ == "__main__":
    main()
