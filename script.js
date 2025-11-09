const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const themes = ['', 'red', 'pink', 'brown', 'purple', 'orange', 'cyan']; 
let currentThemeIndex = 0;

const themeBtn = $('.theme-toggle');
const cycleTheme = () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const theme = themes[currentThemeIndex];
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  updateThemeIcon();
};

const updateThemeIcon = () => {
  const icon = themeBtn.querySelector('i');
  icon.className = 'fas fa-palette'; 
};

themeBtn.addEventListener('click', cycleTheme);

const savedTheme = localStorage.getItem('theme');
if (savedTheme && themes.includes(savedTheme)) {
  currentThemeIndex = themes.indexOf(savedTheme);
  document.documentElement.dataset.theme = savedTheme;
}
updateThemeIcon();

window.addEventListener("load", () =>
  setTimeout(() => ($("#loader").style.display = "none"), 2800)
);

const matrixCanvas = $("#matrixCanvas");
const mCtx = matrixCanvas.getContext("2d");
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
let drops = [],
  columns;
const initMatrix = () => {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  columns = Math.floor(matrixCanvas.width / 16);
  drops = Array(columns).fill(1);
};
initMatrix();
const drawMatrix = () => {
  mCtx.fillStyle = "rgba(0,0,0,0.04)";
  mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  mCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(
    "--c-primary"
  );
  mCtx.font = "15px monospace";
  drops.forEach((y, i) => {
    const text = chars[Math.floor(Math.random() * chars.length)];
    mCtx.fillText(text, i * 16, y * 16);
    if (y * 16 > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
  requestAnimationFrame(drawMatrix);
};
drawMatrix();

const particlesCanvas = $("#particles-canvas");
const pCtx = particlesCanvas.getContext("2d");
let particles = [];
const createParticles = () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  particles = Array.from({ length: 90 }, () => ({
    x: Math.random() * particlesCanvas.width,
    y: Math.random() * particlesCanvas.height,
    vx: (Math.random() - 0.5) * 1.3,
    vy: (Math.random() - 0.5) * 1.3,
    r: Math.random() * 2 + 1,
  }));
};
createParticles();
const drawParticles = () => {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  const col = getComputedStyle(document.documentElement).getPropertyValue(
    "--c-primary"
  );
  particles.forEach((p) => {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pCtx.fillStyle = col.replace("ff", "99");
    pCtx.fill();
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;
  });
  requestAnimationFrame(drawParticles);
};
drawParticles();

const createSideRain = (container) => {
  const chars = "01";
  for (let i = 0; i < 30; i++) {
    const span = document.createElement("span");
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.left = Math.random() * 100 + "%";
    span.style.animationDuration = Math.random() * 8 + 5 + "s";
    span.style.animationDelay = Math.random() * 5 + "s";
    container.appendChild(span);
  }
};
createSideRain($("#leftRain"));
createSideRain($("#rightRain"));

const trail = $(".cursor-trail");
let trailTimeout;
document.addEventListener("mousemove", (e) => {
  clearTimeout(trailTimeout);
  trail.style.left = e.pageX + "px";
  trail.style.top = e.pageY + "px";
  trail.style.opacity = "1";
  trailTimeout = setTimeout(() => (trail.style.opacity = "0"), 600);
});

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const current = window.scrollY;
  const speed = Math.abs(current - lastScroll);
  if (speed > 15 && Math.random() > 0.9) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = Math.random() * window.innerWidth + "px";
    s.style.top = current + Math.random() * 300 + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
  lastScroll = current;
});

const counters = $$(".counter");
const countUp = (el) => {
  const target = +el.dataset.target;
  const speed = 60;
  const increment = target / speed;
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    el.textContent = Math.ceil(current);
    if (current > target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, 30);
};
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => counterObserver.observe(c));

const sections = $$(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);
sections.forEach((s) => observer.observe(s));

const navLinks = $$(".nav-links a");
const setActive = (id) =>
  navLinks.forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === "#".$id)
  );
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  if (current) setActive(current);
});

const form = $(".contact-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Message sent! (Demo only)");
  form.reset();
});

const backBtn = $("#backToTop");
window.addEventListener("scroll", () => {
  backBtn.classList.toggle("show", window.scrollY > 600);
});
backBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  for (let i = 0; i < 15; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    s.style.left = backBtn.offsetLeft + 25 + "px";
    s.style.top = backBtn.offsetTop + Math.random() * 30 + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
});
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initMatrix();
    createParticles();
  }, 250);
});
