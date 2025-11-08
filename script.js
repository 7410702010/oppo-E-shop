
// Basic scroll spy for active nav link
const sections = [...document.querySelectorAll('section, header')];
const navLinks = [...document.querySelectorAll('.links a')];
const setActive = () => {
    let idx = 0;
    const fromTop = window.scrollY + 120;
    sections.forEach((sec, i) => { if (sec.offsetTop <= fromTop) idx = i; });
    navLinks.forEach(l => l.classList.remove('active'));
    const id = sections[idx]?.id || 'overview';
    const match = navLinks.find(l => l.getAttribute('href') === '#' + id);
    if (match) match.classList.add('active');
};
document.addEventListener('scroll', setActive, { passive: true });
window.addEventListener('load', setActive);

// Buy selections
document.querySelectorAll('#buy .card .btn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (btn.closest('.body')?.querySelector('h3')?.textContent === 'Continue') return;
        e.preventDefault();
        btn.textContent = 'Selected ✓';
        btn.classList.remove('outline');
    });
});

// Contact form validation + fake submit
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    statusEl.className = 'status';
    const data = Object.fromEntries(new FormData(form).entries());
    // simple checks
    if (!data.name || !data.email || !data.topic || !data.message) {
        statusEl.textContent = 'Please fill in all fields.';
        statusEl.classList.add('err');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        statusEl.textContent = 'Please enter a valid email address.';
        statusEl.classList.add('err');
        return;
    }
    // Simulate sending
    statusEl.textContent = 'Sending...';
    await new Promise(r => setTimeout(r, 900));
    statusEl.textContent = 'Thanks! Your message has been sent.';
    statusEl.classList.add('ok');
    form.reset();
});

// IntersectionObserver for reveal animations
const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('in');
            // Once revealed, stop observing to prevent re-trigger
            io.unobserve(e.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

// Carousel buttons
function scrollByCard(scroller, dir = 1) {
    const card = scroller.querySelector('.card');
    const delta = card ? card.getBoundingClientRect().width + 14 : scroller.clientWidth * 0.8;
    scroller.scrollBy({ left: dir * delta, behavior: 'smooth' });
}
document.querySelectorAll('.btn-nav').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-target');
        const scroller = document.getElementById(id);
        if (!scroller) return;
        scrollByCard(scroller, btn.classList.contains('btn-next') ? 1 : -1);
    });
});
