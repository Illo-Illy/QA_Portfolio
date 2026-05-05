// --- TYPING ---
function typeEffect() {
  const p1 = "QA ", p2 = "Portfolio";
  const s1 = document.getElementById('type-p1'), s2 = document.getElementById('type-p2');
  const cursor = document.querySelector('.typing-cursor');
  if (!s1 || !s2) return;
  s1.textContent = ""; s2.textContent = "";
  let i = 0, j = 0;
  function step1() { if (i < p1.length) { s1.textContent += p1[i++]; setTimeout(step1, 150); } else step2(); }
  function step2() { if (j < p2.length) { s2.textContent += p2[j++]; setTimeout(step2, 100); } else {
    cursor.style.animation = 'blink 0.8s infinite';
  } }
  cursor.style.animation = 'none';
  step1();
}

// --- CURSOR ---
const cursor = document.getElementById('cursor');
document.onmousemove = (e) => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; };
document.querySelectorAll('.hover-trigger, button, a').forEach(el => {
  el.onmouseenter = () => document.body.classList.add('cursor-hover');
  el.onmouseleave = () => document.body.classList.remove('cursor-hover');
});

// --- SLIDER ---
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.side-dots .dot');
const topBtns = document.querySelectorAll('.top-nav .top-nav-btn');
let current = 0;
function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  topBtns[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  topBtns[current].classList.add('active');
  if (current === 0) typeEffect();
}
dots.forEach((d, i) => d.onclick = () => goTo(i));
topBtns.forEach((b, i) => b.onclick = () => goTo(i));
document.onkeydown = (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
};

// --- SCROLL (PC) ---
let scrollLocked = false;
window.addEventListener('wheel', (e) => {
  if (scrollLocked) return;
  scrollLocked = true;
  goTo(current + (e.deltaY > 0 ? 1 : -1));
  setTimeout(() => scrollLocked = false, 800);
}, { passive: true });

// --- SWIPE (Mobile) ---
let touchStartX = 0, touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
  if (Math.abs(dy) > Math.abs(dx)) {
    goTo(current + (dy < 0 ? 1 : -1));
  } else {
    goTo(current + (dx < 0 ? 1 : -1));
  }
}, { passive: true });

// --- CANVAS ---
const canvas = document.getElementById('bg-canvas'), ctx = canvas.getContext('2d');
let particles = [];
function init() {
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  particles = Array.from({length:60}, () => ({
    x: Math.random()*canvas.width, y: Math.random()*canvas.height,
    vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4
  }));
}
function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = 'rgba(0,229,195,0.25)';
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if(p.x<0 || p.x>canvas.width) p.vx*=-1; if(p.y<0 || p.y>canvas.height) p.vy*=-1;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, Math.PI*2); ctx.fill();
  });
  requestAnimationFrame(animate);
}

// --- ACCORDION CASES ---
document.querySelectorAll('.case-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('active');
  });
});

// --- INIT ---
window.onload = () => { init(); animate(); typeEffect(); };
window.onresize = init;