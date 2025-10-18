const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dinoImg = new Image();
dinoImg.src = 'assets/dino.png';

const bossImg = new Image();
bossImg.src = 'assets/boss.png';

const jumpSound = new Audio('assets/jump.mp3');
const packSound = new Audio('assets/pack.mp3');
const bgm = new Audio('assets/bgm.mp3');
bgm.loop = true;
bgm.volume = 0.3;
bgm.play();

let dino = {
  x: 100, y: 300, width: 60, height: 60,
  vy: 0, jumping: false,
  costume: 'Default Dino'
};

let obstacle = { x: 800, y: 300, width: 50, height: 50 };
let boss = { x: 1200, y: 250, width: 100, height: 100, active: false };
let gravity = 1.5;
let score = 0;

let unlockedCostumes = JSON.parse(localStorage.getItem('costumes')) || ['Default Dino'];
const costumes = [
  { name: 'Cyberpunk Raptor', img: 'assets/costume1.png' },
  { name: 'Pharaoh Stego', img: 'assets/costume2.png' },
  { name: 'Samurai Cerato', img: 'assets/costume3.png' },
  { name: 'Disco Ptero', img: 'assets/costume4.png' },
  { name: 'Knight Trike', img: 'assets/costume5.png' },
  { name: 'Robot Rex', img: 'assets/costume6.png' }
];

function drawDino() {
  ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  ctx.fillStyle = '#000';
  ctx.font = '14px Arial';
  ctx.fillText(dino.costume, dino.x - 10, dino.y - 10);
}

function drawObstacle() {
  ctx.fillStyle = '#333';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawBoss() {
  if (boss.active) {
    ctx.drawImage(bossImg, boss.x, boss.y, boss.width, boss.height);
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (dino.jumping) {
    dino.vy -= gravity;
    dino.y -= dino.vy;
    if (dino.y >= 300) {
      dino.y = 300;
      dino.jumping = false;
      dino.vy = 0;
    }
  }

  obstacle.x -= 5;
  if (obstacle.x < -50) {
    obstacle.x = 800;
    score++;
    if (score % 10 === 0) boss.active = true;
  }

  if (boss.active) {
    boss.x -= 3;
    if (boss.x < -100) {
      boss.x = 1200;
      boss.active = false;
    }
  }

  if (
    dino.x < obstacle.x + obstacle.width &&
    dino.x + dino.width > obstacle.x &&
    dino.y < obstacle.y + obstacle.height &&
    dino.y + dino.height > obstacle.y
  ) {
    alert('Game Over! Score: ' + score);
    localStorage.setItem('costumes', JSON.stringify(unlockedCostumes));
    document.location.reload();
  }

  if (
    boss.active &&
    dino.x < boss.x + boss.width &&
    dino.x + dino.width > boss.x &&
    dino.y < boss.y + boss.height &&
    dino.y + dino.height > boss.y
  ) {
    alert('Boss defeated! You earned a rare costume!');
    boss.active = false;
    const rare = costumes[Math.floor(Math.random() * costumes.length)];
    if (!unlockedCostumes.includes(rare.name)) {
      unlockedCostumes.push(rare.name);
      updateCostumeList();
    }
  }

  drawDino();
  drawObstacle();
  drawBoss();

  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 30);

  requestAnimationFrame(update);
}

document.addEventListener('keydown', function(e) {
  if (e.code === 'Space' && !dino.jumping) {
    dino.jumping = true;
    dino.vy = 20;
    jumpSound.play();
  }
});

function openPack() {
  packSound.play();
  const reward = costumes[Math.floor(Math.random() * costumes.length)];
  alert('You unlocked: ' + reward.name);
  if (!unlockedCostumes.includes(reward.name)) {
    unlockedCostumes.push(reward.name);
    updateCostumeList();
  }
}

function updateCostumeList() {
  const list = document.getElementById('costumeList');
  list.innerHTML = '<strong>Unlocked Costumes:</strong><br>';
  unlockedCostumes.forEach(c => {
    const btn = document.createElement('button');
    btn.textContent = c;
    btn.onclick = () => { dino.costume = c; };
    list.appendChild(btn);
  });
}

updateCostumeList();
update();
