# Prompts para o Higgsfield: 68 santos, duas séries

Modelo `gpt_image_2_5`, qualidade `high`, resolução `1k`, proporção 3:4.

**Série Imagem** (figura do santo). Trocar `[FIGURA]` pela coluna Figura:

> Gothic cathedral stained glass window, arched top, dark lead lines, jewel-tone glass, backlit glow, plain geometric border, full figure of [FIGURA], golden halo, symmetrical composition, traditional Catholic iconography, vertical composition, no text, no letters, no watermark

**Série Símbolos** (só os objetos). Trocar `[OBJETOS]` pela coluna Objetos:

> Gothic cathedral stained glass window, arched top, dark lead lines, jewel-tone glass, backlit glow, plain geometric border, large central composition showing only symbolic objects and no saint figure: [OBJETOS], symmetrical composition, traditional Catholic iconography, vertical composition, no text, no letters, no watermark

**Ao conferir cada imagem:**

- Série Imagem: os itens da coluna "Conferir figura" aparecem, na quantidade certa.
- Série Símbolos: os objetos da coluna Objetos aparecem, na quantidade certa, e a figura do santo não aparece.
- Nas duas: sem texto (exceto IHS em `inacio` e a letra M em `joaopaulo`), e borda sem flor-de-lis, cruz, chave, estrela ou outro símbolo de santo.

| # | id | Santo | Figura | Conferir figura | Objetos |
|---|---|---|---|---|---|
| 1 | pedro | São Pedro | Saint Peter, bearded old man, holding two crossed keys (one gold, one silver), rooster at his feet | 2 chaves, galo | exactly two large crossed keys, one gold and one silver, with a rooster standing below them |
| 2 | paulo | São Paulo | Saint Paul, bald with long dark beard, holding a sword and an open book | espada, livro | an upright sword, and an open book below it |
| 3 | francisco | São Francisco de Assis | Saint Francis of Assisi, brown habit with white cord with three knots, Tau cross, small birds around him | cordão com 3 nós, Tau, pássaros | a wooden T-shaped Tau cross, two small birds beside it, and a white rope cord with exactly three knots below |
| 4 | jorge | São Jorge | Saint George, Roman soldier on a white horse, spearing a green dragon, white shield with a red cross | dragão, lança, cruz vermelha | a green dragon pierced by a long lance, and a white shield with a red cross |
| 5 | teresinha | Santa Teresinha | Saint Thérèse of Lisieux, Carmelite brown habit and white mantle, holding a crucifix covered with roses | crucifixo, rosas | a wooden crucifix covered with red roses, with more roses falling around it |
| 6 | antonio | Santo Antônio | Saint Anthony of Padua, Franciscan brown habit, tonsure, holding the Child Jesus seated on a book, white lily | Menino sobre o livro, lírio | the Child Jesus seated on a closed book, with a tall white lily beside him |
| 7 | sebastiao | São Sebastião | Saint Sebastian, young man tied to a tree, pierced by arrows | árvore, flechas | a bare tree trunk pierced by several arrows |
| 8 | luzia | Santa Luzia | Saint Lucy, young woman holding a golden plate with two eyes on it, martyr's palm | prato com 2 olhos | a golden plate with exactly two eyes resting on it, and a green martyr's palm branch |
| 9 | catarina | Santa Catarina de Alexandria | Saint Catherine of Alexandria, crowned princess, broken spiked wheel, sword | roda dentada, coroa | a broken wooden wheel with iron spikes, a golden crown above it, and a sword |
| 10 | lourenco | São Lourenço | Saint Lawrence, young deacon in red dalmatic, holding an iron gridiron, martyr's palm | grelha | an iron gridiron over flames, and a green palm branch |
| 11 | jose | São José | Saint Joseph, bearded man holding a flowering staff with white lilies, carpenter's saw and square | vara florida, ferramentas | a flowering staff with white lilies, a carpenter's hand saw, and a wooden carpenter's square |
| 12 | miguel | São Miguel Arcanjo | Saint Michael the Archangel, large wings, armor, sword raised, holding golden scales | asas, balança | a pair of large white angel wings with golden balance scales in the center |
| 13 | bento | São Bento | Saint Benedict, black Benedictine habit, holding a chalice with a serpent rising from it, black raven with bread | cálice com serpente, corvo | a golden chalice with a green serpent rising from it, and a black raven holding a piece of bread |
| 14 | barbara | Santa Bárbara | Saint Barbara, young woman beside a stone tower with three windows, lightning bolt, martyr's palm | torre de 3 janelas, raio | a stone tower with exactly three windows, a yellow lightning bolt, and a green palm branch |
| 15 | joao | São João Batista | Saint John the Baptist, camel-hair garment, lamb at his side, thin reed cross with white banner with red cross | cordeiro, cruz de cana | a white lamb, and a thin reed cross with a white banner bearing a red cross |
| 16 | clara | Santa Clara de Assis | Saint Clare of Assisi, brown habit and black veil, raising a golden monstrance | ostensório | a golden monstrance with radiating rays holding a white host |
| 17 | rita | Santa Rita de Cássia | Saint Rita of Cascia, Augustinian black habit, small thorn wound on her forehead, holding a crucifix, roses and figs | ferida na testa, rosas, figos | a crown of thorns, red roses, and purple figs |
| 18 | judas | São Judas Tadeu | Saint Jude Thaddeus, green cloak, small flame above his head, gold medallion with the face of Jesus on his chest, holding an axe | medalhão com rosto, chama, machado | a gold medallion with the face of Jesus, a small flame above it, and an axe |
| 19 | cristovao | São Cristóvão | Saint Christopher, giant man crossing a river, carrying the Child Jesus on his shoulders, leaning on a flowering staff | Menino nos ombros, rio | the Child Jesus above river waves, with a flowering wooden staff |
| 20 | expedito | Santo Expedito | Saint Expeditus, young Roman soldier, raising a cross, stepping on a black crow | cruz erguida, corvo sob o pé | an upright wooden cross, and a black crow below it |
| 21 | agostinho | Santo Agostinho | Saint Augustine, bishop with mitre and black beard, holding a flaming heart pierced by an arrow, book | coração em chamas, mitra | a red flaming heart pierced by an arrow, a bishop's mitre above it, and an open book |
| 22 | inacio | Santo Inácio de Loyola | Saint Ignatius of Loyola, bald bearded priest in black cassock, holding a book, golden sun emblem with IHS monogram | sol com IHS (só aqui pode ter letras) | a golden radiant sun with the letters IHS inside it, and an open book below |
| 23 | domingos | São Domingos | Saint Dominic, white tunic and black Dominican cape, star on his forehead, rosary, a black and white dog holding a lit torch in its mouth | cão com tocha, estrela | a black and white dog holding a lit torch in its mouth, an eight-pointed star above, and a rosary |
| 24 | jeronimo | São Jerônimo | Saint Jerome, old bearded hermit, red cardinal's wide-brimmed hat, writing in a book, skull on the table, lion at his feet | chapéu vermelho, caveira, leão | a red cardinal's wide-brimmed hat with tassels, an open book, and a human skull |
| 25 | patricio | São Patrício | Saint Patrick, bishop in green vestments with mitre and crozier, holding a three-leaf shamrock, snakes at his feet | trevo, báculo, serpentes | a green three-leaf shamrock, a bishop's golden crozier, and a green snake |
| 26 | nicolau | São Nicolau | Saint Nicholas, bishop with white beard, red vestments and mitre, holding a book with three golden balls on it | 3 bolas de ouro, mitra | a bishop's mitre, and exactly three golden balls |
| 27 | cecilia | Santa Cecília | Saint Cecilia, young woman crowned with roses, playing a small pipe organ | órgão | a small pipe organ, with red roses |
| 28 | apolonia | Santa Apolônia | Saint Apollonia, young woman holding iron pincers gripping a tooth, martyr's palm | tenaz com dente | iron pincers gripping a single tooth, and a green palm branch |
| 29 | bras | São Brás | Saint Blaise, bishop with mitre, holding two crossed candles tied with a red ribbon | 2 velas cruzadas | exactly two lit candles crossed and tied with a red ribbon |
| 30 | roque | São Roque | Saint Roch, pilgrim with wide hat and staff, showing a sore on his thigh, a dog at his side carrying bread in its mouth | cão com pão, ferida na perna | a dog holding a loaf of bread in its mouth, and a pilgrim's wide-brimmed hat |
| 31 | tiago | São Tiago Maior | Saint James the Greater, pilgrim with wide hat, scallop shells on his cloak, staff with a gourd | conchas de vieira, cajado com cabaça | a large scallop shell, and a pilgrim's staff with a gourd tied to it |
| 32 | mateus | São Mateus | Saint Matthew, bearded man writing a book, a bag of gold coins beside him, small angel at his shoulder | bolsa de moedas, anjo | a leather money bag with gold coins spilling out, and an open book |
| 33 | marcos | São Marcos | Saint Mark the Evangelist, writing a book, winged lion beside him | leão alado | a winged lion, and an open book |
| 34 | lucas | São Lucas | Saint Luke the Evangelist, painting an icon of the Virgin Mary, winged ox beside him | touro alado, ícone de Maria | a winged ox, and a small painted icon of the Virgin Mary |
| 35 | joaoev | São João Evangelista | Saint John the Evangelist, young beardless man, red mantle, holding a book, eagle beside him | águia, jovem sem barba | an eagle with spread wings, and an open book |
| 36 | andre | Santo André | Saint Andrew, old man with white beard, holding a large X-shaped cross, fishing net with fish | cruz em X, peixe | a large X-shaped wooden cross, and a fish |
| 37 | estevao | Santo Estêvão | Saint Stephen, young deacon in red dalmatic, holding stones and a martyr's palm, Gospel book | pedras, dalmática | a pile of rough stones, a green palm branch, and a Gospel book |
| 38 | martinho | São Martinho de Tours | Saint Martin of Tours, Roman soldier on horseback, cutting his red cloak in half with a sword to share with a poor beggar | capa cortada ao meio, mendigo | a red cloak cut in two halves by a sword, and a white goose |
| 39 | ambrosio | Santo Ambrósio | Saint Ambrose, bishop with mitre and crozier, a straw beehive with bees beside him | colmeia, abelhas | a straw beehive with bees flying around it, and a bishop's mitre |
| 40 | gregorio | São Gregório Magno | Saint Gregory the Great, pope with triple papal tiara, writing, a white dove whispering at his ear | tiara papal, pomba no ouvido | a papal tiara with three crowns, and a white dove |
| 41 | helena | Santa Helena | Saint Helena, empress with crown and royal mantle, holding a large wooden cross and three nails | cruz grande, cravos, coroa | a large wooden cross, exactly three iron nails, and an imperial golden crown |
| 42 | pio | São Pio de Pietrelcina | Saint Padre Pio, Capuchin brown habit, white beard, brown fingerless half-gloves on his hands, holding a rosary | meias-luvas, terço | a hand wearing a brown fingerless glove, and a rosary |
| 43 | joana | Santa Joana d'Arc | Saint Joan of Arc, young woman in silver armor, holding a white banner with golden fleurs-de-lis | armadura, estandarte com flor-de-lis | a white banner with golden fleurs-de-lis on a pole, and a steel knight's helmet |
| 44 | cosme | São Cosme e São Damião | Saints Cosmas and Damian, twin brothers in red physician robes, holding medicine jars and a mortar and pestle | 2 irmãos, frascos de remédio | two apothecary medicine jars, and a mortar with pestle |
| 45 | edwiges | Santa Edwiges | Saint Hedwig of Silesia, duchess with white veil and crown, holding a pair of shoes in her hand and a small church model | sapatos na mão, igrejinha | a pair of leather shoes, and a small model of a church |
| 46 | rosalima | Santa Rosa de Lima | Saint Rose of Lima, Dominican nun with a crown of roses, holding the Child Jesus, anchor | coroa de rosas, âncora | a wreath crown of red roses, and an iron anchor |
| 47 | xavier | São Francisco Xavier | Saint Francis Xavier, Jesuit in black cassock, on a beach, a crab bringing him a crucifix from the sea | caranguejo com crucifixo | a red crab holding a golden crucifix, with sea waves below |
| 48 | faustina | Santa Faustina | Saint Faustina Kowalska, nun with black veil, beside the Divine Mercy image of Jesus with pale and red rays from his heart | raios pálido e vermelho | two wide rays of light, one pale white and one red, radiating downward from a small heart, and an open diary book |
| 49 | bernadete | Santa Bernadete | Saint Bernadette, peasant girl with white headscarf kneeling with a rosary before the grotto of Lourdes, Virgin Mary in white with blue sash in the niche | gruta, terço, Virgem de branco e azul | a rocky grotto with a small statue of the Virgin Mary in white with a blue sash in a niche, a spring of water, and a rosary |
| 50 | teresaavila | Santa Teresa d'Ávila | Saint Teresa of Avila, Carmelite nun writing with a quill pen, white dove above, an angel piercing her heart with a golden flaming arrow | pena, dardo de fogo | a white quill pen, an open book, and a golden arrow with a flaming tip |
| 51 | antao | Santo Antão | Saint Anthony the Abbot, old bearded hermit monk in dark habit, holding a small bell, a pig at his feet | porco, sino | a pink pig, and a golden hand bell |
| 52 | teresacalcuta | Santa Teresa de Calcutá | Saint Teresa of Calcutta, elderly nun in a white sari with three blue stripes on the border, holding a rosary | sári branco com 3 listras azuis, terço | a folded white sari cloth with exactly three blue stripes on its border, and a rosary |
| 53 | kolbe | São Maximiliano Kolbe | Saint Maximilian Kolbe, Franciscan friar with round glasses and beard, holding two crowns, one white and one red, a blue and grey striped prisoner jacket over his arm | 2 coroas (branca e vermelha), tecido listrado | two crowns side by side, one white and one red, and a folded blue and grey striped prisoner jacket |
| 54 | ferrer | São Vicente Férrer | Saint Vincent Ferrer, Dominican friar in white tunic and black cape, one hand pointing to heaven, golden trumpet with a red pennant, open book | trombeta, livro | a golden trumpet with a red pennant, and an open book |
| 55 | bakhita | Santa Josefina Bakhita | Saint Josephine Bakhita, African nun in black habit and veil, broken iron chains at her feet, holding a small wooden cross | correntes partidas, cruz | a broken iron chain with shattered links, and a small wooden cross |
| 56 | eloi | Santo Elói | Saint Eligius, bishop with mitre, holding a blacksmith's hammer, an iron anvil beside him, a horseshoe | bigorna, martelo, ferradura | an iron anvil, a blacksmith's hammer, and a horseshoe |
| 57 | huberto | Santo Huberto | Saint Hubert, medieval hunter kneeling before a stag with a glowing cross between its antlers | veado com cruz entre os chifres | a stag's head with a glowing golden cross between its antlers |
| 58 | goncalo | São Gonçalo de Amarante | Saint Gonçalo of Amarante, Dominican friar in white tunic and black cape, playing a small wooden viola guitar | viola | a small wooden viola guitar |
| 59 | galvao | São Frei Galvão | Saint Frei Galvão, Brazilian Franciscan friar in brown habit, holding tiny rolled paper pills in his open palm and a sheet of paper with a prayer | pílulas de papel, folha de papel | several tiny rolled paper pills, and a blank sheet of paper |
| 60 | anchieta | São José de Anchieta | Saint José de Anchieta, thin Jesuit in black cassock on a beach, writing verses on the sand with a quill pen, sea waves behind | escrevendo na areia, pena, mar | a white quill pen tracing wavy lines on beach sand, with sea waves behind |
| 61 | isidoro | Santo Isidoro Lavrador | Saint Isidore the Farmer, Spanish peasant, wooden plough beside him, holding a sheaf of wheat | arado, feixe de trigo | a wooden plough, and a sheaf of wheat tied with a red band |
| 62 | bartolomeu | São Bartolomeu | Saint Bartholomew, bearded apostle, holding a curved flaying knife and a book | faca curva, livro | a curved flaying knife with a wooden handle, and an open book |
| 63 | madalena | Santa Maria Madalena | Saint Mary Magdalene, woman with long loose hair and red mantle, holding an alabaster ointment jar with a golden lid | vaso de alabastro | an alabaster ointment jar with a golden lid |
| 64 | barnabe | São Barnabé | Saint Barnabas, bearded apostle, holding an olive branch and a Gospel book | ramo de oliveira, livro | an olive branch with olives, and an open book |
| 65 | benedito | São Benedito | Saint Benedict the Moor, Black Franciscan friar in brown habit, a clay cooking pot beside him, white flowers and roses gathered in the fold of his habit | panela, flores | a clay cooking pot, with white flowers and red roses |
| 66 | longuinho | São Longuinho | Saint Longinus, Roman soldier on foot, holding a long lance with blood drops on the tip, one hand raised to his eye, rays of light around the eye | lança, olho (sem dragão nem cavalo, para não virar São Jorge) | a long lance with drops of blood on its tip, and a single eye surrounded by rays of light |
| 67 | joaopaulo | São João Paulo II | Saint John Paul II, pope in white cassock, holding a silver papal staff topped with a crucifix, blue shield with a golden cross and the letter M | báculo com crucifixo, brasão com cruz e M (só aqui pode ter a letra M) | a silver papal staff topped with a crucifix, and a blue shield with a golden cross and the letter M |
| 68 | rafael | São Rafael Arcanjo | Saint Raphael the Archangel, large wings, pilgrim staff, holding a large fish | asas, peixe (sem balança, para não virar São Miguel) | a pair of large white angel wings, and a large fish |
