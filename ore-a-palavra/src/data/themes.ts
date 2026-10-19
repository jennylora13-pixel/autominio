import type { Theme } from '../types'

/**
 * Biblioteca offline de temas de oração.
 *
 * - `keywords` são radicais SEM acento (a busca normaliza o texto do usuário);
 *   uma palavra casa quando começa com o radical ("ansi" casa "ansiosa").
 *   Termine com `=` para exigir a palavra inteira ("dor=" não casa "dormir").
 * - Os versículos seguem a tradição Almeida. Antes de publicar o app
 *   comercialmente, confira os textos com a tradução que você licenciar.
 */
export const THEMES: Theme[] = [
  {
    id: 'ansiedade',
    name: 'Ansiedade',
    emoji: '🕊️',
    keywords: ['ansi', 'preocup', 'nervos', 'inquiet', 'angusti', 'aflit', 'agonia', 'tenso', 'tensa'],
    opening: 'com o coração inquieto, mas sabendo que Tu cuidas de mim',
    closing: 'Eu escolho descansar em Ti. Recebo agora a Tua paz que excede todo o entendimento.',
    verses: [
      {
        ref: 'Filipenses 4:6-7',
        text: 'Não estejais inquietos por coisa alguma; antes, as vossas petições sejam em tudo conhecidas diante de Deus, pela oração e súplica, com ação de graças. E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos sentimentos em Cristo Jesus.',
        declaration: 'eu entrego a Ti cada preocupação, e a Tua paz guarda o meu coração e a minha mente em Cristo Jesus.',
      },
      {
        ref: '1 Pedro 5:7',
        text: 'Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.',
        declaration: 'eu lanço sobre Ti toda a minha ansiedade, porque Tu cuidas de mim.',
      },
      {
        ref: 'Mateus 6:34',
        text: 'Não vos inquieteis, pois, pelo dia de amanhã, porque o dia de amanhã cuidará de si mesmo. Basta a cada dia o seu mal.',
        declaration: 'eu vivo o dia de hoje com a Tua graça e não carrego o amanhã que ainda está nas Tuas mãos.',
      },
      {
        ref: 'Isaías 26:3',
        text: 'Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.',
        declaration: 'a minha mente está firme em Ti, e por isso Tu me guardas em perfeita paz.',
      },
    ],
  },
  {
    id: 'medo',
    name: 'Medo',
    emoji: '🛡️',
    keywords: ['medo', 'assust', 'panico', 'temor', 'pavor', 'receio', 'insegur', 'apavor'],
    opening: 'reconhecendo os meus medos e trazendo cada um deles à Tua presença',
    closing: 'O medo não tem a última palavra na minha vida. Tu tens.',
    verses: [
      {
        ref: 'Isaías 41:10',
        text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te esforço, e te ajudo, e te sustento com a destra da minha justiça.',
        declaration: 'eu não temo, porque Tu estás comigo; Tu me fortaleces, me ajudas e me sustentas.',
      },
      {
        ref: '2 Timóteo 1:7',
        text: 'Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.',
        declaration: 'eu não recebi espírito de medo; em mim habita poder, amor e equilíbrio.',
      },
      {
        ref: 'Salmos 27:1',
        text: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?',
        declaration: 'o Senhor é a minha luz e a força da minha vida; não há o que temer.',
      },
      {
        ref: 'Salmos 56:3',
        text: 'Em qualquer tempo em que eu temer, confiarei em ti.',
        declaration: 'quando o medo bater à porta, eu escolho confiar em Ti.',
      },
    ],
  },
  {
    id: 'cura',
    name: 'Cura e saúde',
    emoji: '🌿',
    keywords: ['doen', 'saude', 'cura', 'curar', 'hospital', 'dor=', 'diagnost', 'cancer', 'cirurgi', 'exame', 'tratamento', 'enferm', 'sintoma', 'uti=', 'remedio', 'internad'],
    opening: 'pedindo a Tua mão de cura sobre o corpo, a mente e as emoções',
    closing: 'Eu entrego este corpo e este tratamento nas Tuas mãos. Tu és o Deus que sara.',
    verses: [
      {
        ref: 'Êxodo 15:26',
        text: 'Porque eu sou o Senhor que te sara.',
        declaration: 'Tu és o Senhor que me sara, e eu recebo a Tua cura.',
      },
      {
        ref: 'Isaías 53:5',
        text: 'Mas ele foi ferido pelas nossas transgressões e moído pelas nossas iniquidades; o castigo que nos traz a paz estava sobre ele, e pelas suas pisaduras fomos sarados.',
        declaration: 'pelas feridas de Jesus há cura disponível para mim.',
      },
      {
        ref: 'Jeremias 30:17',
        text: 'Porque te restaurarei a saúde e te sararei das tuas chagas, diz o Senhor.',
        declaration: 'Tu restauras a minha saúde e cuidas de cada ferida.',
      },
      {
        ref: 'Salmos 103:2-3',
        text: 'Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios. É ele que perdoa todas as tuas iniquidades e sara todas as tuas enfermidades.',
        declaration: 'a minha alma bendiz ao Senhor, que perdoa e sara.',
      },
    ],
  },
  {
    id: 'provisao',
    name: 'Provisão e finanças',
    emoji: '🌾',
    keywords: ['dinheiro', 'divida', 'conta', 'financ', 'salario', 'pagar', 'aluguel', 'falta', 'provis', 'necessidade', 'pobre', 'boleto', 'renda', 'desempreg'],
    opening: 'trazendo as minhas necessidades e confiando que Tu és o meu provedor',
    closing: 'Eu Te dou graças antes mesmo de ver a provisão, porque Tu és fiel.',
    verses: [
      {
        ref: 'Filipenses 4:19',
        text: 'O meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.',
        declaration: 'o meu Deus supre cada uma das minhas necessidades segundo as Suas riquezas.',
      },
      {
        ref: 'Mateus 6:33',
        text: 'Mas buscai primeiro o Reino de Deus, e a sua justiça, e todas essas coisas vos serão acrescentadas.',
        declaration: 'eu busco primeiro o Teu Reino, e Tu acrescentas o que me falta.',
      },
      {
        ref: 'Salmos 23:1',
        text: 'O Senhor é o meu pastor; nada me faltará.',
        declaration: 'o Senhor é o meu pastor, e nada me faltará.',
      },
      {
        ref: 'Salmos 37:25',
        text: 'Fui moço e agora sou velho; mas nunca vi desamparado o justo, nem a sua descendência a mendigar o pão.',
        declaration: 'eu não sou desamparado(a); Tu sustentas a mim e à minha casa.',
      },
    ],
  },
  {
    id: 'trabalho',
    name: 'Trabalho',
    emoji: '💼',
    keywords: ['trabalh', 'emprego', 'chefe', 'carreira', 'empresa', 'negocio', 'entrevista', 'projeto', 'cliente', 'vendas', 'equipe', 'colega', 'promoc', 'vaga'],
    opening: 'consagrando a Ti o meu trabalho e as obras das minhas mãos',
    closing: 'Que o meu trabalho seja adoração e testemunho do Teu nome.',
    verses: [
      {
        ref: 'Colossenses 3:23',
        text: 'E, tudo quanto fizerdes, fazei-o de todo o coração, como ao Senhor e não aos homens.',
        declaration: 'eu trabalho de todo o coração, como para o Senhor.',
      },
      {
        ref: 'Provérbios 16:3',
        text: 'Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.',
        declaration: 'eu confio a Ti as minhas obras, e Tu estabeleces os meus planos.',
      },
      {
        ref: 'Salmos 90:17',
        text: 'E seja sobre nós a graça do Senhor, nosso Deus; e confirma sobre nós a obra das nossas mãos; sim, confirma a obra das nossas mãos.',
        declaration: 'a Tua graça está sobre mim e Tu confirmas a obra das minhas mãos.',
      },
      {
        ref: 'Deuteronômio 8:18',
        text: 'Antes, te lembrarás do Senhor, teu Deus, que ele é o que te dá força para adquirires poder.',
        declaration: 'é de Ti que vem a força e a capacidade para prosperar.',
      },
    ],
  },
  {
    id: 'familia',
    name: 'Família',
    emoji: '🏡',
    keywords: ['familia', 'casa=', 'lar=', 'pais=', 'mae=', 'pai=', 'irmao', 'irma', 'parente', 'avo', 'sogr'],
    opening: 'colocando a minha família e o meu lar debaixo da Tua cobertura',
    closing: 'A minha casa pertence a Ti. Que o Teu amor seja o alicerce do nosso lar.',
    verses: [
      {
        ref: 'Josué 24:15',
        text: 'Porém eu e a minha casa serviremos ao Senhor.',
        declaration: 'eu e a minha casa serviremos ao Senhor.',
      },
      {
        ref: 'Atos 16:31',
        text: 'Crê no Senhor Jesus Cristo e serás salvo, tu e a tua casa.',
        declaration: 'a salvação alcança a mim e a toda a minha casa.',
      },
      {
        ref: 'Salmos 127:1',
        text: 'Se o Senhor não edificar a casa, em vão trabalham os que a edificam.',
        declaration: 'é o Senhor quem edifica o meu lar.',
      },
      {
        ref: 'Colossenses 3:14',
        text: 'E, sobre tudo isto, revesti-vos de amor, que é o vínculo da perfeição.',
        declaration: 'a minha família se reveste de amor, que nos une.',
      },
    ],
  },
  {
    id: 'filhos',
    name: 'Filhos',
    emoji: '👶',
    keywords: ['filho', 'filha', 'crianc', 'adolescent', 'bebe', 'neto', 'neta', 'menino', 'menina', 'escola'],
    opening: 'intercedendo pelos meus filhos, que são herança Tua',
    closing: 'Eu entrego os meus filhos a Ti. Eles são Teus antes de serem meus.',
    verses: [
      {
        ref: 'Isaías 54:13',
        text: 'E todos os teus filhos serão discípulos do Senhor; e a paz de teus filhos será abundante.',
        declaration: 'os meus filhos são ensinados pelo Senhor, e grande é a paz deles.',
      },
      {
        ref: 'Provérbios 22:6',
        text: 'Instrui o menino no caminho em que deve andar, e, até quando envelhecer, não se desviará dele.',
        declaration: 'o caminho que ensinamos aos nossos filhos permanece no coração deles.',
      },
      {
        ref: 'Salmos 127:3',
        text: 'Eis que os filhos são herança do Senhor, e o fruto do ventre, o seu galardão.',
        declaration: 'os meus filhos são herança do Senhor e presente das Tuas mãos.',
      },
      {
        ref: 'Salmos 91:11',
        text: 'Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos.',
        declaration: 'os Teus anjos guardam os meus filhos em todos os seus caminhos.',
      },
    ],
  },
  {
    id: 'casamento',
    name: 'Casamento',
    emoji: '💍',
    keywords: ['marido', 'esposa', 'esposo', 'casament', 'conjuge', 'relacionament', 'namor', 'noiv', 'casal', 'divorc', 'separac'],
    opening: 'apresentando o meu casamento e pedindo que Tu sejas o centro dele',
    closing: 'Senhor, sê o terceiro cordão que nos mantém unidos.',
    verses: [
      {
        ref: 'Eclesiastes 4:12',
        text: 'E, se alguém prevalecer contra um, os dois lhe resistirão; e o cordão de três dobras não se quebra tão depressa.',
        declaration: 'o nosso casamento é um cordão de três dobras, e Tu és o centro dele.',
      },
      {
        ref: '1 Coríntios 13:4-7',
        text: 'O amor é sofredor, é benigno; o amor não é invejoso; não trata com leviandade, não se ensoberbece. Tudo sofre, tudo crê, tudo espera, tudo suporta.',
        declaration: 'o amor que Tu derramas em nós é paciente, bondoso e persevera.',
      },
      {
        ref: 'Efésios 4:32',
        text: 'Antes, sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.',
        declaration: 'nós escolhemos a bondade e o perdão um com o outro, como Cristo nos perdoou.',
      },
      {
        ref: 'Marcos 10:9',
        text: 'Portanto, o que Deus ajuntou não separe o homem.',
        declaration: 'o que Tu uniste, nada separa.',
      },
    ],
  },
  {
    id: 'tristeza',
    name: 'Tristeza e luto',
    emoji: '🌧️',
    keywords: ['trist', 'depress', 'chor', 'luto', 'perda', 'perdi', 'morre', 'falec', 'saudade', 'desanim', 'abatid', 'quebrant', 'vazio'],
    opening: 'com o coração ferido, sabendo que Tu estás perto dos quebrantados',
    closing: 'Eu não sei todas as respostas, mas sei que Tu estás comigo. Consola o meu coração.',
    verses: [
      {
        ref: 'Salmos 34:18',
        text: 'Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.',
        declaration: 'Tu estás perto de mim neste momento de dor.',
      },
      {
        ref: 'Mateus 5:4',
        text: 'Bem-aventurados os que choram, porque eles serão consolados.',
        declaration: 'as minhas lágrimas serão consoladas por Ti.',
      },
      {
        ref: 'Salmos 30:5',
        text: 'O choro pode durar uma noite, mas a alegria vem pela manhã.',
        declaration: 'esta noite vai passar, e a alegria vem pela manhã.',
      },
      {
        ref: 'Apocalipse 21:4',
        text: 'E Deus limpará de seus olhos toda lágrima, e não haverá mais morte, nem pranto, nem clamor, nem dor.',
        declaration: 'Tu enxugas cada lágrima, e a minha esperança está na eternidade contigo.',
      },
    ],
  },
  {
    id: 'cansaco',
    name: 'Cansaço',
    emoji: '🌙',
    keywords: ['cansad', 'cansac', 'exaust', 'esgotad', 'sobrecarreg', 'burnout', 'sem forc', 'fadiga', 'estress', 'estafa'],
    opening: 'cansado(a) e sobrecarregado(a), atendendo ao Teu convite para descansar',
    closing: 'Eu deixo aqui o que não é meu para carregar. Renova as minhas forças.',
    verses: [
      {
        ref: 'Mateus 11:28',
        text: 'Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.',
        declaration: 'eu venho a Ti como estou, e Tu me dás alívio.',
      },
      {
        ref: 'Isaías 40:31',
        text: 'Mas os que esperam no Senhor renovarão as suas forças, subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.',
        declaration: 'as minhas forças são renovadas enquanto eu espero em Ti.',
      },
      {
        ref: 'Salmos 23:2-3',
        text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas. Refrigera a minha alma.',
        declaration: 'Tu me levas ao descanso e restauras a minha alma.',
      },
      {
        ref: '2 Coríntios 12:9',
        text: 'A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza.',
        declaration: 'a Tua graça me basta, e o Teu poder se aperfeiçoa na minha fraqueza.',
      },
    ],
  },
  {
    id: 'perdao',
    name: 'Perdão',
    emoji: '🤍',
    keywords: ['perdo', 'perdao', 'culpa', 'pecad', 'pequei', 'arrepend', 'magoa', 'ressentiment', 'rancor', 'ofend', 'traic', 'traiu', 'vergonha'],
    opening: 'buscando o Teu perdão e a graça para perdoar',
    closing: 'Eu recebo o Teu perdão e libero o perdão. Estou livre.',
    verses: [
      {
        ref: '1 João 1:9',
        text: 'Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.',
        declaration: 'eu confesso, e Tu és fiel para me perdoar e me purificar.',
      },
      {
        ref: 'Romanos 8:1',
        text: 'Portanto, agora, nenhuma condenação há para os que estão em Cristo Jesus.',
        declaration: 'não há condenação para mim, porque estou em Cristo Jesus.',
      },
      {
        ref: 'Salmos 103:12',
        text: 'Quanto está longe o Oriente do Ocidente, assim afasta de nós as nossas transgressões.',
        declaration: 'Tu afastaste de mim os meus pecados para nunca mais.',
      },
      {
        ref: 'Colossenses 3:13',
        text: 'Suportando-vos uns aos outros e perdoando-vos uns aos outros; assim como Cristo vos perdoou, assim fazei vós também.',
        declaration: 'assim como fui perdoado(a), eu escolho perdoar.',
      },
    ],
  },
  {
    id: 'sabedoria',
    name: 'Decisões e direção',
    emoji: '🧭',
    keywords: ['decis', 'decid', 'escolh', 'direc', 'sabedor', 'duvid', 'caminho', 'rumo', 'orientac', 'mudanc', 'mudar'],
    opening: 'precisando de direção e pedindo a Tua sabedoria',
    closing: 'Fala, Senhor, que o Teu servo(a) ouve. Eu quero o Teu caminho, não apenas o meu.',
    verses: [
      {
        ref: 'Tiago 1:5',
        text: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente e o não lança em rosto, e ser-lhe-á dada.',
        declaration: 'eu peço sabedoria, e Tu me dás com generosidade.',
      },
      {
        ref: 'Provérbios 3:5-6',
        text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.',
        declaration: 'eu confio em Ti de todo o coração, e Tu endireitas os meus caminhos.',
      },
      {
        ref: 'Salmos 32:8',
        text: 'Instruir-te-ei e ensinar-te-ei o caminho que deves seguir; guiar-te-ei com os meus olhos.',
        declaration: 'Tu me instruis e me guias no caminho que devo seguir.',
      },
      {
        ref: 'Isaías 30:21',
        text: 'E os teus ouvidos ouvirão a palavra que está por detrás de ti, dizendo: Este é o caminho; andai nele.',
        declaration: 'eu ouço a Tua voz me dizendo: este é o caminho, anda nele.',
      },
    ],
  },
  {
    id: 'paz',
    name: 'Paz',
    emoji: '🌊',
    keywords: ['paz', 'conflit', 'brig', 'confus', 'calma', 'discuss', 'tumult', 'caos', 'agitad'],
    opening: 'buscando a Tua paz no meio de tudo o que está agitado',
    closing: 'Tu és o Príncipe da Paz, e a Tua paz reina em mim.',
    verses: [
      {
        ref: 'João 14:27',
        text: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.',
        declaration: 'eu recebo a paz de Jesus, e o meu coração não se perturba.',
      },
      {
        ref: 'Romanos 12:18',
        text: 'Se for possível, quanto estiver em vós, tende paz com todos os homens.',
        declaration: 'no que depender de mim, eu sou instrumento de paz.',
      },
      {
        ref: 'Salmos 4:8',
        text: 'Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes habitar em segurança.',
        declaration: 'eu habito em segurança e em paz, porque Tu me guardas.',
      },
      {
        ref: 'Colossenses 3:15',
        text: 'E a paz de Deus, para a qual também fostes chamados em um corpo, domine em vossos corações.',
        declaration: 'a paz de Deus governa o meu coração.',
      },
    ],
  },
  {
    id: 'forca',
    name: 'Força e fé',
    emoji: '🔥',
    keywords: ['frac', 'forc', 'fe=', 'desist', 'coragem', 'luta', 'batalha', 'dificil', 'crise', 'prova=', 'aguentar', 'vencer'],
    opening: 'pedindo força para continuar e fé para crer',
    closing: 'Eu não desisto, porque Tu não desistes de mim.',
    verses: [
      {
        ref: 'Filipenses 4:13',
        text: 'Posso todas as coisas naquele que me fortalece.',
        declaration: 'eu posso todas as coisas em Cristo, que me fortalece.',
      },
      {
        ref: 'Josué 1:9',
        text: 'Não to mandei eu? Esforça-te e tem bom ânimo; não temas, nem te espantes, porque o Senhor, teu Deus, é contigo por onde quer que andares.',
        declaration: 'eu me esforço e tenho bom ânimo, porque Tu estás comigo por onde eu for.',
      },
      {
        ref: 'Romanos 8:37',
        text: 'Mas em todas estas coisas somos mais do que vencedores, por aquele que nos amou.',
        declaration: 'em tudo isso eu sou mais do que vencedor(a) por meio dAquele que me amou.',
      },
      {
        ref: 'Hebreus 11:1',
        text: 'Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.',
        declaration: 'a minha fé é firme naquilo que ainda não vejo.',
      },
    ],
  },
  {
    id: 'protecao',
    name: 'Proteção',
    emoji: '⛰️',
    keywords: ['protec', 'proteg', 'perigo', 'viag', 'seguranc', 'violenc', 'assalt', 'acidente', 'estrada', 'ameac', 'inimig'],
    opening: 'buscando abrigo debaixo das Tuas asas',
    closing: 'Eu e os meus estamos guardados por Ti, na entrada e na saída.',
    verses: [
      {
        ref: 'Salmos 91:1-2',
        text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei.',
        declaration: 'eu habito no esconderijo do Altíssimo; Tu és o meu refúgio e a minha fortaleza.',
      },
      {
        ref: 'Salmos 121:7-8',
        text: 'O Senhor te guardará de todo mal; guardará a tua alma. O Senhor guardará a tua entrada e a tua saída, desde agora e para sempre.',
        declaration: 'o Senhor guarda a minha alma, a minha entrada e a minha saída.',
      },
      {
        ref: 'Isaías 54:17',
        text: 'Toda ferramenta preparada contra ti não prosperará.',
        declaration: 'nenhuma arma forjada contra mim prosperará.',
      },
      {
        ref: 'Provérbios 18:10',
        text: 'Torre forte é o nome do Senhor; a ele correrá o justo e estará em alto retiro.',
        declaration: 'o Teu nome é torre forte, e nele eu estou seguro(a).',
      },
    ],
  },
  {
    id: 'gratidao',
    name: 'Gratidão',
    emoji: '🙌',
    keywords: ['grat', 'agradec', 'obrigad', 'bencao', 'vitoria', 'conquist', 'alegr', 'louv', 'aprovad', 'consegui'],
    opening: 'com o coração cheio de gratidão',
    closing: 'Toda a glória é Tua. Obrigado(a), Senhor!',
    verses: [
      {
        ref: '1 Tessalonicenses 5:18',
        text: 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
        declaration: 'em tudo eu dou graças, porque esta é a Tua vontade para mim.',
      },
      {
        ref: 'Salmos 118:24',
        text: 'Este é o dia que fez o Senhor; regozijemo-nos e alegremo-nos nele.',
        declaration: 'este é o dia que o Senhor fez, e eu me alegro nele.',
      },
      {
        ref: 'Tiago 1:17',
        text: 'Toda boa dádiva e todo dom perfeito vêm do alto, descendo do Pai das luzes.',
        declaration: 'reconheço que todo bem que recebi vem de Ti.',
      },
      {
        ref: 'Salmos 103:1',
        text: 'Bendize, ó minha alma, ao Senhor, e tudo o que há em mim bendiga o seu santo nome.',
        declaration: 'tudo o que há em mim bendiz o Teu santo nome.',
      },
    ],
  },
  {
    id: 'identidade',
    name: 'Identidade e valor',
    emoji: '👑',
    keywords: ['rejeit', 'valor', 'autoestima', 'feio', 'feia', 'comparac', 'compar', 'identidade', 'insuficient', 'incapaz', 'fracass', 'nao sou', 'nao presto'],
    opening: 'deixando que a Tua Palavra diga quem eu sou',
    closing: 'Eu sou quem Tu dizes que eu sou.',
    verses: [
      {
        ref: 'Salmos 139:14',
        text: 'Eu te louvarei, porque de um modo terrível e tão maravilhoso fui formado; maravilhosas são as tuas obras, e a minha alma o sabe muito bem.',
        declaration: 'eu fui formado(a) de modo maravilhoso, e a minha alma sabe disso.',
      },
      {
        ref: 'Efésios 2:10',
        text: 'Porque somos feitura sua, criados em Cristo Jesus para as boas obras, as quais Deus preparou para que andássemos nelas.',
        declaration: 'eu sou obra das Tuas mãos, criado(a) para boas obras que Tu preparaste.',
      },
      {
        ref: '1 Pedro 2:9',
        text: 'Mas vós sois a geração eleita, o sacerdócio real, a nação santa, o povo adquirido.',
        declaration: 'eu sou escolhido(a), parte de um sacerdócio real, propriedade exclusiva de Deus.',
      },
      {
        ref: 'Isaías 43:4',
        text: 'Visto que foste precioso aos meus olhos, também foste honrado, e eu te amei.',
        declaration: 'eu sou precioso(a) aos Teus olhos, honrado(a) e amado(a).',
      },
    ],
  },
  {
    id: 'solidao',
    name: 'Solidão',
    emoji: '🫂',
    keywords: ['sozinh', 'solid', 'abandon', 'isolad', 'ninguem', 'excluid', 'esquecid'],
    opening: 'sentindo-me só, mas lembrando que Tu nunca me deixas',
    closing: 'Eu não estou sozinho(a). Tu estás aqui, e Tu colocas pessoas no meu caminho.',
    verses: [
      {
        ref: 'Deuteronômio 31:8',
        text: 'O Senhor, pois, é aquele que vai adiante de ti; ele será contigo, não te deixará, nem te desamparará; não temas, nem te espantes.',
        declaration: 'Tu vais adiante de mim e nunca me deixas nem me abandonas.',
      },
      {
        ref: 'Mateus 28:20',
        text: 'E eis que eu estou convosco todos os dias, até a consumação dos séculos.',
        declaration: 'Jesus está comigo todos os dias.',
      },
      {
        ref: 'Salmos 68:6',
        text: 'Deus faz que o solitário viva em família.',
        declaration: 'Tu colocas o solitário em família, e eu recebo comunhão e amizade.',
      },
      {
        ref: 'Salmos 27:10',
        text: 'Porque, quando meu pai e minha mãe me desampararem, o Senhor me recolherá.',
        declaration: 'mesmo que todos se afastem, o Senhor me acolhe.',
      },
    ],
  },
  {
    id: 'sono',
    name: 'Sono e descanso',
    emoji: '😴',
    keywords: ['insoni', 'dormir', 'sono', 'noite', 'pesadel', 'madrugada'],
    opening: 'ao fim do dia, entregando a Ti a minha mente e o meu descanso',
    closing: 'Eu me deito em paz. Tu velas por mim enquanto durmo.',
    verses: [
      {
        ref: 'Salmos 4:8',
        text: 'Em paz também me deitarei e dormirei, porque só tu, Senhor, me fazes habitar em segurança.',
        declaration: 'eu me deito e durmo em paz, porque Tu me guardas.',
      },
      {
        ref: 'Salmos 127:2',
        text: 'Inútil vos será levantar de madrugada, repousar tarde, comer o pão de dores; pois assim dá ele aos seus amados o sono.',
        declaration: 'Tu dás sono tranquilo aos Teus amados, e eu sou amado(a).',
      },
      {
        ref: 'Provérbios 3:24',
        text: 'Quando te deitares, não temerás; sim, tu te deitarás, e o teu sono será suave.',
        declaration: 'quando eu me deito não temo, e o meu sono é suave.',
      },
      {
        ref: 'Salmos 121:3-4',
        text: 'Não deixará vacilar o teu pé; aquele que te guarda não tosquenejará. Eis que não tosquenejará nem dormirá o guarda de Israel.',
        declaration: 'Aquele que me guarda não dorme; eu posso descansar.',
      },
    ],
  },
  {
    id: 'proposito',
    name: 'Propósito e chamado',
    emoji: '✨',
    keywords: ['proposit', 'chamad', 'ministeri', 'sentido', 'vocac', 'futuro', 'sonho', 'destino', 'missao', 'dom=', 'talento'],
    opening: 'buscando viver o propósito para o qual Tu me criaste',
    closing: 'Eis-me aqui, Senhor. Usa a minha vida para a Tua glória.',
    verses: [
      {
        ref: 'Jeremias 29:11',
        text: 'Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais.',
        declaration: 'os Teus planos para mim são de paz, de futuro e de esperança.',
      },
      {
        ref: 'Romanos 8:28',
        text: 'E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto.',
        declaration: 'todas as coisas cooperam para o meu bem, porque eu amo a Deus e sou chamado(a) por Ele.',
      },
      {
        ref: 'Filipenses 1:6',
        text: 'Tendo por certo isto mesmo: que aquele que em vós começou a boa obra a aperfeiçoará até ao Dia de Jesus Cristo.',
        declaration: 'a boa obra que Tu começaste em mim, Tu vais completar.',
      },
      {
        ref: 'Salmos 138:8',
        text: 'O Senhor aperfeiçoará o que me diz respeito.',
        declaration: 'o Senhor cumpre o Seu propósito na minha vida.',
      },
    ],
  },
  {
    id: 'espera',
    name: 'Espera e promessas',
    emoji: '⏳',
    keywords: ['esper', 'promess', 'demor', 'paciencia', 'resposta', 'aguard', 'gravid', 'engravid'],
    opening: 'no tempo de espera, escolhendo confiar no Teu tempo',
    closing: 'O Teu tempo é perfeito. Eu espero com fé, não com medo.',
    verses: [
      {
        ref: 'Habacuque 2:3',
        text: 'Porque a visão é ainda para o tempo determinado, e até ao fim falará, e não mentirá; se tardar, espera-o, porque certamente virá, não tardará.',
        declaration: 'a promessa tem tempo determinado; ainda que pareça tardar, certamente virá.',
      },
      {
        ref: 'Eclesiastes 3:11',
        text: 'Tudo fez formoso em seu tempo.',
        declaration: 'Tu fazes tudo belo no tempo certo.',
      },
      {
        ref: 'Salmos 27:14',
        text: 'Espera no Senhor, anima-te, e ele fortalecerá o teu coração; espera, pois, no Senhor.',
        declaration: 'eu espero no Senhor com bom ânimo, e Ele fortalece o meu coração.',
      },
      {
        ref: '2 Coríntios 1:20',
        text: 'Porque todas quantas promessas há de Deus são nele sim; e por ele o Amém, para glória de Deus.',
        declaration: 'todas as Tuas promessas são sim e amém em Cristo.',
      },
    ],
  },
  {
    id: 'libertacao',
    name: 'Tentação e libertação',
    emoji: '⛓️',
    keywords: ['tentac', 'vicio', 'viciad', 'porn', 'bebid', 'alcool', 'droga', 'libertac', 'compuls', 'cigarro', 'jogo', 'aposta', 'recaid'],
    opening: 'reconhecendo a minha luta e pedindo a Tua libertação',
    closing: 'Eu não luto sozinho(a). Tu me dás o escape e a vitória.',
    verses: [
      {
        ref: '1 Coríntios 10:13',
        text: 'Não veio sobre vós tentação, senão humana; mas fiel é Deus, que vos não deixará tentar acima do que podeis; antes, com a tentação dará também o escape, para que a possais suportar.',
        declaration: 'Tu és fiel; na tentação Tu me dás o escape.',
      },
      {
        ref: 'João 8:36',
        text: 'Se, pois, o Filho vos libertar, verdadeiramente sereis livres.',
        declaration: 'o Filho me liberta, e eu sou verdadeiramente livre.',
      },
      {
        ref: 'Gálatas 5:1',
        text: 'Estai, pois, firmes na liberdade com que Cristo nos libertou e não torneis a meter-vos debaixo do jugo da servidão.',
        declaration: 'eu permaneço firme na liberdade que Cristo conquistou para mim.',
      },
      {
        ref: '2 Coríntios 5:17',
        text: 'Assim que, se alguém está em Cristo, nova criatura é: as coisas velhas já passaram; eis que tudo se fez novo.',
        declaration: 'eu sou nova criatura; o que era velho passou.',
      },
    ],
  },
]

export const THEME_BY_ID: Record<string, Theme> = Object.fromEntries(
  THEMES.map((t) => [t.id, t]),
)
