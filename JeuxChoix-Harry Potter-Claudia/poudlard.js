
/* 1. EFFETS VISUELS : TOILE ÉTOILÉE ET BOUGIES FLOTTANTES */


const canvasStars = document.getElementById('stars');
const ctxStars = canvasStars.getContext('2d');
let starsArray = [];

/* Pourquoi : Ajuste dynamiquement la taille du canvas et recrée les étoiles 
   si la fenêtre est redimensionnée par l'utilisateur. */
function resizeCanvas() {
  canvasStars.width = window.innerWidth;
  canvasStars.height = window.innerHeight;
  starsArray = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvasStars.width,
    y: Math.random() * canvasStars.height * .8,
    r: Math.random() * 1.4 + .2,
    p: Math.random() * 6
  }));
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Pourquoi : Boucle d'animation fluide (requestAnimationFrame) pour faire 
   briller les étoiles en modifiant leur opacité via un calcul sinusoïdal. */
(function animateStars(timestamp) {
  ctxStars.clearRect(0, 0, canvasStars.width, canvasStars.height);
  starsArray.forEach(star => {
    ctxStars.globalAlpha = .4 + .6 * Math.abs(Math.sin(timestamp / 1200 + star.p));
    ctxStars.fillStyle = '#fff';
    ctxStars.beginPath();
    ctxStars.arc(star.x, star.y, star.r, 0, 7);
    ctxStars.fill();
  });
  requestAnimationFrame(animateStars);
})(0);

/* Pourquoi : Génération automatique des bougies dans l'écran titre pour 
   éviter de surcharger le HTML avec des éléments statiques en double. */
for (let i = 0; i < 9; i++) {
  const candle = document.createElement('div');
  candle.className = 'candle';
  candle.style.left = (6 + i * 11) + '%';
  candle.style.top = (18 + Math.random() * 30) + 'vh';
  candle.style.animationDelay = (-Math.random() * 7) + 's';
  document.getElementById('title').appendChild(candle);
}



/* 2. DONNÉES DU JEU : MAISONS ET SCÉNARIO*/


/* Pourquoi : Séparer les données de la logique permet de modifier ou ajouter 
   facilement du texte ou des questions sans toucher au moteur du jeu.        */


const HOUSES_DATA = {
  g: {
    n: 'Gryffondor', c1: '#740001', c2: '#d3a625', a: '🦁', f: 'Godric Gryffondor',
    v: 'Le courage, l’audace et la chevalerie', gh: 'Nick Quasi-Sans-Tête', s: 'La tour de Gryffondor',
    t: 'Godric Gryffondor, sorcier brave et sans peur, fonda cette maison pour les élèves au cœur vaillant. Son épée, forgée par des gobelins, ne se laisse saisir que par un vrai Gryffondor en danger. Rouge et or, sous le signe du lion, ta maison a vu naître bien des héros… et bien des imprudents.'
  },
  h: {
    n: 'Poufsouffle', c1: '#372e29', c2: '#ecb939', a: '🦡', f: 'Helga Poufsouffle',
    v: 'La loyauté, la patience et le travail', gh: 'Le Moine Gras', s: 'Un sous-sol près des cuisines',
    t: 'Helga Poufsouffle accueillait tous les élèves, sans distinction, pourvu qu’ils soient justes et travailleurs. Sa maison est la plus chaleureuse du château : on y entre par les cuisines, et l’on n’y manque jamais de gâteaux. Jaune et noir, sous le signe du blaireau, tu portes la fidélité comme une force.'
  },
  r: {
    n: 'Serdaigle', c1: '#0e1a40', c2: '#946b2d', a: '🦅', f: 'Rowena Serdaigle',
    v: 'L’intelligence, le savoir et la sagesse', gh: 'La Dame Grise', s: 'Une haute tour, sous un ciel d’étoiles',
    t: 'Rowena Serdaigle, la plus érudite des fondatrices, réservait sa maison aux esprits curieux. On raconte qu’elle cacha un diadème magique qui rend plus sage celui qui le porte. Bleu et bronze, sous le signe de l’aigle, ta maison croit que l’esprit sans limite est le plus grand des trésors.'
  },
  s: {
    n: 'Serpentard', c1: '#1a472a', c2: '#aaaaaa', a: '🐍', f: 'Salazar Serpentard',
    v: 'L’ambition, la ruse et la détermination', gh: 'Le Baron Sanglant', s: 'Les cachots, sous le lac Noir',
    t: 'Salazar Serpentard cherchait les élèves les plus rusés et les plus ambitieux. Sa maison a donné de grands sorciers, même si l’histoire raconte qu’il quitta l’école après de profonds désaccords avec les autres fondateurs. Vert et argent, sous le signe du serpent, ton ambition peut te mener très loin : à toi d’en choisir le chemin.'
  }
};

const SCENARIO = [
  {
    t: 'Le Parchemin s’éveille',
    x: 'Un vieux parchemin vierge frémit entre tes doigts. Des traces d’encre naissent, pas à pas, comme si quelqu’un marchait dessus… Les Maraudeurs te saluent. Pour révéler la carte, prononce la formule.',
    c: [{ l: '« Je jure solennellement que mes intentions sont mauvaises. »', p: {} }],
    lore: 'Poudlard, l’école de sorcellerie, fut fondée il y a plus de mille ans par quatre sorciers : Godric Gryffondor, Helga Poufsouffle, Rowena Serdaigle et Salazar Serpentard. L’aventure commence.'
  },
  {
    t: 'La Voie 9¾',
    x: 'Le Poudlard Express crache sa vapeur écarlate. Tu es seul(e) devant la barrière, ta valise tremble dans ta main. Que fais-tu ?',
    c: [
      { l: 'Courir droit vers le mur, sans hésiter', p: { g: 2 } },
      { l: 'Observer longuement la foule avant de t’avancer', p: { r: 2 } },
      { l: 'Aider une famille chargée de bagages', p: { h: 2 } },
      { l: 'Repérer qui semble important pour te placer près d’eux', p: { s: 2 } }
    ],
    lore: 'Chaque 1er septembre, le train traverse la campagne jusqu’à l’école, cachée aux yeux des Moldus par de puissants sortilèges.'
  },
  {
    t: 'La Traversée du Lac',
    x: 'Les premières années traversent le lac Noir en barque. Les lanternes dansent sur l’eau, et le château se dresse, immense. Dans ta barque, un élève a peur.',
    c: [
      { l: 'Te lever pour mieux admirer le château', p: { g: 2 } },
      { l: 'Étudier les runes gravées sur la barque', p: { r: 2 } },
      { l: 'Tendre la main à l’élève apeuré', p: { h: 2 } },
      { l: 'Mener ta barque en tête, tu veux arriver premier', p: { s: 2 } }
    ],
    lore: 'Les quatre fondateurs choisirent ensemble ce lieu isolé en Écosse. Ils s’entendaient alors à merveille, chacun apportant ses propres talents au château.'
  },
  {
    t: 'Le Choixpeau parle',
    x: 'Dans la Grande Salle, mille bougies flottent sous un plafond d’étoiles. Le Choixpeau est posé sur le tabouret. Il murmure à ton oreille : « Que cherches-tu vraiment ? »',
    c: [
      { l: 'Prouver ma bravoure', p: { g: 3 } },
      { l: 'Trouver des amis fidèles', p: { h: 3 } },
      { l: 'Comprendre tous les secrets du monde', p: { r: 3 } },
      { l: 'Devenir quelqu’un de grand', p: { s: 3 } }
    ],
    lore: 'Le Choixpeau appartenait à Godric Gryffondor. Les fondateurs l’enchantèrent pour qu’il continue de répartir les élèves selon les qualités qu’ils prisaient le plus.'
  },
  {
    t: 'Le Couloir interdit',
    x: 'Quelques semaines plus tard, un couloir que tu ne connaissais pas s’ouvre devant toi. Un bruit étrange résonne derrière une porte. Tu es seul(e).',
    c: [
      { l: 'Pousser la porte, baguette levée', p: { g: 3 } },
      { l: 'Respecter le règlement et prévenir un professeur', p: { h: 3 } },
      { l: 'Courir à la bibliothèque chercher ce qui fait ce bruit', p: { r: 3 } },
      { l: 'Observer en silence et tirer profit de la situation', p: { s: 3 } }
    ],
    lore: 'La légende dit que Salazar Serpentard fit construire une chambre secrète dans le château avant de partir, après sa querelle avec les autres fondateurs.'
  },
  {
    t: 'La Coupe des Quatre Maisons',
    x: 'Ce soir, la Coupe se joue. Toute ta maison compte sur toi pour l’épreuve finale. Les fantômes flottent dans les gradins et retiennent leur souffle.',
    c: [
      { l: 'Affronter l’épreuve en première ligne', p: { g: 2 } },
      { l: 'Soutenir toute l’équipe, quitte à rester dans l’ombre', p: { h: 2 } },
      { l: 'Élaborer une stratégie parfaite', p: { r: 2 } },
      { l: 'Remporter la victoire à tout prix', p: { s: 2 } }
    ],
    lore: 'Chaque maison a son fantôme : Nick Quasi-Sans-Tête, le Moine Gras, la Dame Grise et le Baron Sanglant, qui veillent sur les élèves depuis des siècles.'
  }
];



/* 3. MOTEUR DU JEU : NAVIGATION, EFFET MACHINE À ÉCRIRE ET CALCUL DU SCORE   */


const $ = id => document.getElementById(id);

let currentStepIndex = 0;
let houseScores = { g: 0, h: 0, r: 0, s: 0 };
let typingTimer = null;
let footstepCount = 0;

/* Pourquoi : Déclenche le passage de l'écran titre vers l'écran de jeu au clic */
$('play').onclick = () => {
  $('title').classList.add('off');$('game').classList.remove('off');
  setTimeout(() => showChapter(0), 1200);
};

/* Pourquoi : Affiche dynamiquement des petites empreintes de pas qui avancent 
   au fur et à mesure que le texte s'écrit sur le parchemin. */
function addFootstep() {
  const trail = $('trail');
  const trailWidth = trail.clientWidth;

  if (footstepCount * 30 + 20 > trailWidth) {
    trail.innerHTML = '';
    footstepCount = 0;
  }

  const foot = document.createElement('div');
  foot.className = 'foot';
  foot.style.left = (footstepCount * 30 + 8) + 'px';
  foot.style.top = (footstepCount % 2 ? 10 : 28) + 'px';
  trail.appendChild(foot);
  footstepCount++;
}

/* Pourquoi : Simule l'écriture lettre par lettre. Permet également au joueur 
   de cliquer directement pour afficher tout le texte instantanément s'il est pressé. */
function typeText(fullText, onComplete) {
  const textElement = $('text');
  textElement.innerHTML = '<span></span><i class="cur"></i>';
  const spanChild = textElement.firstChild;
  let charIndex = 0;

  clearInterval(typingTimer);

  const finishTyping = () => {
    clearInterval(typingTimer);
    spanChild.textContent = fullText;
    textElement.querySelector('.cur')?.remove();
    textElement.onclick = null;
    onComplete();
  };

  typingTimer = setInterval(() => {
    spanChild.textContent = fullText.slice(0, ++charIndex);
    if (charIndex % 4 === 0) addFootstep();
    if (charIndex >= fullText.length) finishTyping();
  }, 28);

  textElement.onclick = finishTyping;
}

/* Pourquoi : Charge un chapitre spécifique, réinitialise les animations 
   et génère les boutons de choix pour l'utilisateur. */
function showChapter(n) {
  currentStepIndex = n;
  const scene = SCENARIO[n];
  footstepCount = 0;
  $('trail').innerHTML = '';$('zone').innerHTML = '';

  $('chap').textContent = n ? `Chapitre ${n} sur ${SCENARIO.length - 1}` : 'Prologue';
  $('stitle').textContent = scene.t;

  typeText(scene.x, () => {
    const choicesZone = document.createElement('div');
    choicesZone.className = 'choices';

    scene.c.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = choice.l;
      button.style.animationDelay = (index * .18) + 's';
      button.onclick = () => handleChoice(choice, button, choicesZone);
      choicesZone.appendChild(button);
    });

    $('zone').appendChild(choicesZone);
  });
}

/* Pourquoi : Enregistre les points attribués à chaque choix de maison, 
   verrouille les autres choix et affiche l'anecdote historique (lore). */
function handleChoice(choice, button, choicesZone) {
  for (const house in choice.p) {
    houseScores[house] += choice.p[house];
  }

  button.classList.add('picked');
  choicesZone.classList.add('done');

  const loreBox = document.createElement('div');
  loreBox.className = 'lore';
  loreBox.innerHTML = '<b>DANS LES ARCHIVES DE POUDLARD</b><br>' + SCENARIO[currentStepIndex].lore;

  const nextButton = document.createElement('button');
  nextButton.className = 'btn next';
  nextButton.textContent = currentStepIndex < SCENARIO.length - 1 ? 'Poursuivre' : 'Découvrir ma maison';
  
  nextButton.onclick = () => {
    if (currentStepIndex < SCENARIO.length - 1) {
      showChapter(currentStepIndex + 1);
    } else {
      endGame();
    }
  };

  $('zone').append(loreBox, nextButton);
  loreBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* Pourquoi : Calcule la maison ayant le score le plus élevé à la fin du quiz, 
   met à jour dynamiquement les couleurs de l'interface et affiche les résultats. */
function endGame() {
  const winningHouseKey = Object.keys(houseScores).reduce((a, b) => houseScores[a] > houseScores[b] ? a : b);
  const house = HOUSES_DATA[winningHouseKey];
  const parchmentElement = $('parch');

  /* Application des couleurs spécifiques de la maison gagnante dans le CSS global */
  document.documentElement.style.setProperty('--c1', house.c1);
  document.documentElement.style.setProperty('--c2', house.c2);

  $('chap').textContent = 'La Répartition';
  $('trail').innerHTML = '';$('stitle').textContent = 'Le Choixpeau a décidé…';
  $('text').innerHTML = '';$('text').style.minHeight = '0';

  const maxScore = Math.max(...Object.values(houseScores), 1);

  /* Génération dynamique des statistiques et des barres de progression des maisons */
  $('zone').innerHTML = `
    <div class="result">
      <svg class="crest" viewBox="0 0 170 200">
        <defs>
          <linearGradient id="crestGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${house.c1}"/>
            <stop offset="1" stop-color="${house.c2}"/>
          </linearGradient>
        </defs>
        <path d="M10 10h150v90c0 50-40 80-75 95C50 180 10 150 10 100z" fill="url(#crestGrad)" stroke="#2c1606" stroke-width="6"/>
        <text x="85" y="122" font-size="78" text-anchor="middle">${house.a}</text>
      </svg>
      <div class="hname">${house.n}</div>
      <p class="hist">${house.t}</p>
      <div class="facts">
        <div><b>FONDATEUR·RICE</b>${house.f}</div>
        <div><b>VALEURS</b>${house.v}</div>
        <div><b>FANTÔME</b>${house.gh}</div>
        <div><b>SALLE COMMUNE</b>${house.s}</div>
      </div>
      ${Object.keys(HOUSES_DATA).map(x => `
        <div class="bar">
          <span>${HOUSES_DATA[x].n}</span>
          <span class="tr">
            <i data-w="${(houseScores[x] / maxScore) * 100}" style="background:linear-gradient(90deg, ${HOUSES_DATA[x].c1},${HOUSES_DATA[x].c2})"></i>
          </span>
        </div>
      `).join('')}
      <button class="btn next" onclick="location.reload()">Rejouer l’aventure</button>
    </div>
  `;

  /* Animation différée des barres de score pour un effet visuel fluide */
  setTimeout(() => {
    document.querySelectorAll('.bar i').forEach(el => {
      el.style.width = el.dataset.w + '%';
    });
  }, 600);

  parchmentElement.scrollIntoView({ behavior: 'smooth' });
}