/* =============================================================================
   JOBQUAL — Site Scripts
   Domain: jobqual.goldenkall.com
   ============================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initCallSimulator();
});

/* ---------------------------------------------------------------------------
   1. Navigation scroll state
   --------------------------------------------------------------------------- */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------------
   2. Scroll reveal (IntersectionObserver)
   Adds .reveal-pending BEFORE observing so elements start invisible
   only in environments where the observer fires — avoids blank sections
   on headless renderers or when JS is slow.
   --------------------------------------------------------------------------- */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  targets.forEach(el => el.classList.add('reveal-pending'));

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => obs.observe(el));
}

/* ---------------------------------------------------------------------------
   3. Outbound Call Simulator (Hero Widget)
   --------------------------------------------------------------------------- */
function initCallSimulator() {
  const widget = document.getElementById('call-simulator-widget');
  if (!widget) return;

  const dot         = widget.querySelector('.widget-dot');
  const statusText  = widget.querySelector('.widget-status-text');
  const waveform    = widget.querySelector('.waveform');
  const dialogue    = widget.querySelector('.sim-dialogue-box');
  const scorecard   = widget.querySelector('.scorecard-reveal');
  const startBtn    = widget.querySelector('#sim-start-btn');

  if (!startBtn || !dialogue) return;

  const script = [
    { role: 'agent',     text: 'Initiating TCPA-compliant outbound call — checking calling window for candidate timezone…',  delay: 1800 },
    { role: 'candidate', text: 'Hello? This is Alex.',                                                                        delay: 1400 },
    { role: 'agent',     text: "Hi Alex — calling on behalf of Apex Tech regarding the Senior Go Engineer role. Do you have five minutes for a quick fit check?", delay: 3800 },
    { role: 'candidate', text: 'Sure, absolutely.',                                                                            delay: 1400 },
    { role: 'agent',     text: 'Great. First knockout: do you have production experience with Go and gRPC in a distributed systems context?', delay: 3500 },
    { role: 'candidate', text: 'Yes — at CloudScale our entire microservices mesh ran on Go over gRPC. I designed the session replication layer using Raft.', delay: 4000 },
    { role: 'agent',     text: 'Excellent. Second: the role is hybrid in Austin, TX. Does that work for you?',                 delay: 3000 },
    { role: 'candidate', text: "Yes, I'm in North Austin — hybrid is perfect.",                                                delay: 1600 },
    { role: 'agent',     text: "Both knockouts passed. I'm sending you a scheduling link by SMS now. You'll hear from the recruiter shortly. Thanks, Alex!", delay: 4000 },
    { role: 'candidate', text: 'Awesome, looking forward to it!',                                                              delay: 1200 },
  ];

  let running = false;

  startBtn.addEventListener('click', () => {
    if (running) return;
    running = true;

    startBtn.style.display = 'none';
    scorecard.classList.remove('visible');

    // Clear dialogue
    while (dialogue.firstChild) dialogue.removeChild(dialogue.firstChild);

    dot.classList.add('active');
    statusText.textContent = 'Screening active';
    statusText.style.color = '#4ade80';
    waveform.classList.add('active');

    let idx = 0;
    function runStep() {
      if (idx >= script.length) {
        setTimeout(() => {
          waveform.classList.remove('active');
          dot.classList.remove('active');
          statusText.textContent = 'Screen complete';
          statusText.style.color = '';
          scorecard.classList.add('visible');
          startBtn.textContent = 'Replay';
          startBtn.style.display = '';
          running = false;
        }, 800);
        return;
      }
      const line = script[idx++];
      const bubble = document.createElement('div');
      bubble.className = `dialogue-bubble dialogue-${line.role}`;
      bubble.textContent = line.text;
      dialogue.appendChild(bubble);
      dialogue.scrollTop = dialogue.scrollHeight;
      setTimeout(runStep, line.delay);
    }
    runStep();
  });
}
