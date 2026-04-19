// script.js - portfolio interactivity

// --- mobile nav ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
});

// close menu when you click a link or anywhere else on the page
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
    });
});
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
    }
});

// keyboard accessibility for hamburger
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
    }
});


// --- highlight active nav link on scroll ---
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        let top = section.offsetTop;
        let bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
            let id = section.getAttribute('id');
            navItems.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + id);
            });
        }
    });
}
window.addEventListener('scroll', updateActiveNav);


// --- typing effect in the hero ---
// cycles through phrases, types them out, pauses, deletes, repeat
const phrases = [
    'Software Developer',
    'Full-Stack Builder',
    'Problem Solver',
    'Lifelong Learner'
];
const typingEl = document.getElementById('typingText');
let phraseIdx = 0;
let charIdx = 0;
let deleting = false;

function typeLoop() {
    let current = phrases[phraseIdx];
    typingEl.innerHTML = current.substring(0, charIdx) + '<span class="typing-cursor"></span>';

    if (!deleting) {
        charIdx++;
        if (charIdx > current.length) {
            deleting = true;
            setTimeout(typeLoop, 2200); // pause before deleting
            return;
        }
        setTimeout(typeLoop, 65);
    } else {
        charIdx--;
        if (charIdx < 0) {
            deleting = false;
            charIdx = 0;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(typeLoop, 350);
            return;
        }
        setTimeout(typeLoop, 35); // deleting is faster than typing
    }
}
typeLoop();


// --- scroll reveal ---
// adds .visible class when elements enter viewport, which triggers CSS transitions
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-scale')
    .forEach(el => revealObserver.observe(el));


// --- stat counters ---
// count up from 0 when the stats bar scrolls into view
let hasCounted = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting || hasCounted) return;
        hasCounted = true;

        document.querySelectorAll('.stat-number').forEach(el => {
            let target = parseInt(el.dataset.target);
            let suffix = el.dataset.suffix || '';
            let duration = 1600;
            let start = performance.now();

            function tick(now) {
                let progress = Math.min((now - start) / duration, 1);
                // cubic ease-out so it decelerates
                let eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-bar').forEach(el => counterObserver.observe(el));


// --- project filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let filter = btn.dataset.filter;

        // swap active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // show/hide cards
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.tags === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});


// --- image lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(wrapper) {
    let img = wrapper.querySelector('img');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

lightbox.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});


// --- back to top ---
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    backBtn.classList.toggle('show', window.scrollY > 500);
});
