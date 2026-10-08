import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = document.documentElement;
const reduce = root.classList.contains('reduce') || matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll<T>(s));

/* ---- Method walkthrough ---- */
const tabs = $$<HTMLButtonElement>('[role=tab]');
const panels = $$('[data-panel]');
if (tabs.length && panels.length) {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  const count = document.querySelector<HTMLElement>('[data-stage-count]');
  const show = (i: number) => {
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', String(k === i)); t.tabIndex = k === i ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== i; });
    if (bar) bar.style.width = ((i + 1) / panels.length) * 100 + '%';
    if (count) count.textContent = `STAGE ${String(i + 1).padStart(2, '0')} OF ${panels.length}`;
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => show(i));
    t.addEventListener('keydown', (e) => {
      const k = (e as KeyboardEvent).key;
      if (k === 'ArrowDown' || k === 'ArrowRight') { e.preventDefault(); const n = (i + 1) % tabs.length; show(n); tabs[n].focus(); }
      if (k === 'ArrowUp' || k === 'ArrowLeft') { e.preventDefault(); const n = (i - 1 + tabs.length) % tabs.length; show(n); tabs[n].focus(); }
    });
  });
  show(0);
}

/* ---- Work filter ---- */
const fbtns = $$<HTMLButtonElement>('[data-filter]');
const projects = $$('[data-sector]');
fbtns.forEach((b) =>
  b.addEventListener('click', () => {
    const f = b.dataset.filter!;
    fbtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    projects.forEach((p) => { p.hidden = !(f === 'All' || p.dataset.sector === f); });
    ScrollTrigger.refresh();
  }),
);

/* ---- Booking embed loads when it comes into view ---- */
const cal = document.querySelector<HTMLElement>('[data-cal]');
if (cal && 'IntersectionObserver' in window) {
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) {
      const f = document.createElement('iframe');
      f.src = cal.dataset.cal!; f.title = 'Book a call'; f.loading = 'lazy';
      cal.querySelector('[data-cal-slot]')!.replaceChildren(f);
      o.disconnect();
    }
  }, { rootMargin: '300px' }).observe(cal);
}

/* ---- Enquiry form: send to the form service, or fall back to the email app ---- */
const form = document.querySelector<HTMLFormElement>('[data-enquiry]');
form?.addEventListener('submit', async (e) => {
  const action = form.dataset.endpoint;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const data = new FormData(form);
  if ((data.get('website') as string)?.length) { e.preventDefault(); return; }
  e.preventDefault();
  if (action) {
    status.textContent = 'Sending…';
    try {
      const r = await fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error();
      form.reset(); status.textContent = 'Thank you. Your enquiry has arrived and I will reply by email.';
    } catch { status.textContent = `Something went wrong. Please email ${form.dataset.email} directly.`; }
  } else {
    const body = ['Name: ' + data.get('name'), 'Company or institution: ' + data.get('company'), 'Email: ' + data.get('email'), 'Offer of interest: ' + data.get('offer'), '', String(data.get('message') || '')].join('\n');
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent('Enquiry from the website')}&body=${encodeURIComponent(body)}`;
  }
});

/* ---- Everything below is motion. Skipped for reduced-motion visitors. ---- */
if (reduce) {
  $$('[data-reveal]').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
} else {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal on scroll
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, overwrite: true }),
  });

  // Counters
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count), plus = el.dataset.plus === '1';
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', dec = Number(el.dataset.dec || 0);
    const fmt = (n: number) => pre + n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf + (plus ? '+' : '');
    const o = { v: 0 };
    el.textContent = fmt(0);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = fmt(end); } }),
    });
  });

  // Ribbon speeds up with scroll velocity, then settles
  const tracks = $$('.track,.track-r');
  if (tracks.length) {
    let rate = 1;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 5);
        rate = Math.max(rate, boost);
      },
    });
    gsap.ticker.add(() => {
      rate += (1 - rate) * 0.06;
      tracks.forEach((t) => t.getAnimations().forEach((a) => (a.playbackRate = rate)));
    });
  }

  // Hero portrait drifts slowly
  const pic = document.querySelector('.portrait img');
  if (pic) gsap.to(pic, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

/* ---- Header: highlight the section in view ---- */
const links = $$<HTMLAnchorElement>('.navlink[data-nav]');
const secs = links.map((l) => document.querySelector(l.dataset.nav!)).filter(Boolean) as Element[];
if (secs.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((l) => l.classList.toggle('on', l.dataset.nav === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach((s) => io.observe(s));
}
