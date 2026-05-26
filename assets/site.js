/* ==========================================================================
   JOBQUAL INTERACTIVE SCRIPTS & SIMULATOR ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCallSimulator();
    initRoiCalculator();
    initPilotForm();
});

/* --------------------------------------------------------------------------
   1. Navigation & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavigation() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   2. Outbound Call Simulator (Hero Widget)
   -------------------------------------------------------------------------- */
function initCallSimulator() {
    const simulator = document.getElementById('call-simulator-widget');
    if (!simulator) return;

    const statusDot = simulator.querySelector('.status-dot');
    const statusText = simulator.querySelector('.status-text');
    const voiceWave = simulator.querySelector('.voice-wave');
    const dialogueContainer = simulator.querySelector('.sim-dialogue-box');
    const scorecardPreview = simulator.querySelector('.sim-scorecard-preview');
    const startBtn = simulator.querySelector('#start-sim-btn');

    if (!startBtn) return;

    // Dialogue script for outbound phone screening simulation
    const dialogueScript = [
        {
            sender: 'agent',
            text: '[JobQual Dialing Worker] Initiating TCPA-compliant outbound call to candidate...',
            delay: 1500
        },
        {
            sender: 'candidate',
            text: 'Hello? This is Alex.',
            delay: 1500
        },
        {
            sender: 'agent',
            text: "Hi Alex, this is JobQual calling on behalf of Apex Tech. I'm checking if you're still interested in the Senior Go Developer role and have 5 minutes for a quick fitment screen?",
            delay: 3500
        },
        {
            sender: 'candidate',
            text: 'Oh, hi! Yes, absolutely. I have time.',
            delay: 2000
        },
        {
            sender: 'agent',
            text: 'Excellent. Our playbook has three knockout requirements. First, do you have production experience building distributed systems with Go, and have you used gRPC?',
            delay: 4000
        },
        {
            sender: 'candidate',
            text: 'Yes. In my last role at CloudScale, our entire microservices mesh was built in Go communicating over gRPC. I designed the session replication protocol using Raft.',
            delay: 3800
        },
        {
            sender: 'agent',
            text: 'That sounds solid. Second: the role requires a hybrid schedule in Austin, TX. Does that work for you?',
            delay: 3500
        },
        {
            sender: 'candidate',
            text: 'Yes, I live in North Austin, so a hybrid commute is perfect.',
            delay: 2000
        },
        {
            sender: 'agent',
            text: "Perfect. I'll pass your technical notes to the recruiter, and you'll receive an SMS to book time directly on their Google Calendar. Thank you for your time, Alex!",
            delay: 4000
        },
        {
            sender: 'candidate',
            text: 'Awesome, thanks! Look forward to the link.',
            delay: 1500
        }
    ];

    let running = false;

    startBtn.addEventListener('click', () => {
        if (running) return;
        running = true;
        
        // Reset states
        startBtn.style.display = 'none';
        scorecardPreview.classList.remove('visible');
        dialogueContainer.innerHTML = '';
        
        // Update to Active Status
        statusDot.classList.add('active');
        statusText.textContent = 'Outbound Screening Active';
        statusText.style.color = '#10b981';
        voiceWave.classList.add('active');

        let step = 0;

        function runStep() {
            if (step >= dialogueScript.length) {
                // Simulation Complete
                setTimeout(() => {
                    statusDot.classList.remove('active');
                    statusText.textContent = 'Screen Completed';
                    statusText.style.color = 'var(--accent-teal)';
                    voiceWave.classList.remove('active');
                    scorecardPreview.classList.add('visible');
                    
                    // Show start button again (as restart)
                    startBtn.textContent = 'Run Simulator Again';
                    startBtn.style.display = 'inline-flex';
                    running = false;
                }, 1000);
                return;
            }

            const current = dialogueScript[step];
            
            // Generate message bubble
            const bubble = document.createElement('div');
            bubble.className = `sim-dialogue dialogue-${current.sender} visible`;
            bubble.textContent = current.text;
            dialogueContainer.appendChild(bubble);
            
            // Auto scroll container
            dialogueContainer.scrollTop = dialogueContainer.scrollHeight;

            // Trigger next step
            step++;
            setTimeout(runStep, current.delay);
        }

        runStep();
    });
}

/* --------------------------------------------------------------------------
   3. ROI Savings Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
    const volumeSlider = document.getElementById('calc-volume');
    if (!volumeSlider) return;

    const valCandidates = document.getElementById('calc-val-candidates');
    const valHours = document.getElementById('calc-val-hours');
    const valSaves = document.getElementById('calc-val-savings');

    // Assume average manual recruitment screen takes 45 mins (0.75h) of coordination & phone calls.
    // Assume average internal recruiter hourly rate of $48/hour.
    // Assume JobQual average pricing cost is roughly $2.50 per matched candidate call.
    const TIME_PER_CANDIDATE = 0.75; 
    const RECRUITER_HOURLY_COST = 48;
    const JOBQUAL_COST_PER_CANDIDATE = 2.50;

    function updateCalculator() {
        const candidates = parseInt(volumeSlider.value);
        valCandidates.textContent = candidates;

        const hoursSaved = Math.round(candidates * TIME_PER_CANDIDATE);
        valHours.textContent = `${hoursSaved} hrs`;

        const manualCost = hoursSaved * RECRUITER_HOURLY_COST;
        const jobqualCost = candidates * JOBQUAL_COST_PER_CANDIDATE;
        const netSavings = Math.max(0, manualCost - jobqualCost);
        
        // Format to currency
        valSaves.textContent = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(netSavings);
    }

    volumeSlider.addEventListener('input', updateCalculator);
    updateCalculator(); // Run initial load
}

/* --------------------------------------------------------------------------
   4. Interactive Pilot Request Form
   -------------------------------------------------------------------------- */
function initPilotForm() {
    const form = document.getElementById('pilot-program-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple client-side verification
        const name = document.getElementById('pilot-name').value.trim();
        const email = document.getElementById('pilot-email').value.trim();
        const company = document.getElementById('pilot-company').value.trim();

        if (!name || !email || !company) {
            alert('Please fill out all required fields.');
            return;
        }

        // Animate form container to success state
        const container = form.parentElement;
        container.style.opacity = '0';
        container.style.transform = 'translateY(15px)';
        
        setTimeout(() => {
            container.innerHTML = `
                <div class="glass-panel" style="text-align: center; border-color: var(--accent-teal); padding: 48px;">
                    <div class="logo-icon" style="margin: 0 auto 24px auto; width: 64px; height: 64px; font-size: 28px;">✓</div>
                    <h3 class="highlight" style="font-size: 28px; margin-bottom: 16px;">Welcome to the Queue</h3>
                    <p style="margin-bottom: 24px;">Thank you for applying to the JobQual outbound screening pilot program. Our team will verify your ATS compatibility and email booking hooks, and reach out to you within 24 hours.</p>
                    <a href="/" class="btn btn-primary">Back to Home</a>
                </div>
            `;
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 400);
    });
}
