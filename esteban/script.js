document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CUSTOM AUDIO PLAYER SYSTEM
    // ==========================================================================

    // Default background audio URL (deja song.mp3 en esta carpeta cuando lo tengas)
    const AUDIO_SRC = '../song.mp3?v=1';
    
    const bgMusic = document.getElementById('bg-music');
    const audioSource = document.getElementById('audio-source');
    
    const btnPlayPause = document.getElementById('btn-play-pause');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    
    const isLooping = true; // una sola canción, siempre en bucle
    bgMusic.loop = isLooping;

    // Initialize audio element source
    if (audioSource) {
        audioSource.src = AUDIO_SRC;
        bgMusic.load();
        bgMusic.volume = 0.5;
    }

    // Format time function (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    // Toggle Play/Pause
    if (btnPlayPause) {
        btnPlayPause.addEventListener('click', (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                bgMusic.play().then(() => {
                    iconPlay.style.display = 'none';
                    iconPause.style.display = 'block';
                }).catch(err => console.log('Audio playback failed: ', err));
            } else {
                bgMusic.pause();
                iconPlay.style.display = 'block';
                iconPause.style.display = 'none';
            }
        });
    }

    // Update progress bar as audio plays
    bgMusic.addEventListener('timeupdate', () => {
        const currentTime = bgMusic.currentTime;
        const duration = bgMusic.duration;
        
        if (!isNaN(duration) && progressBar) {
            // Update time labels
            currentTimeEl.textContent = formatTime(currentTime);
            durationTimeEl.textContent = formatTime(duration);
            
            // Update progress bar value
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            
            // Update background color filling
            progressBar.style.background = `linear-gradient(to right, var(--color-burgundy) ${progressPercent}%, rgba(123, 154, 109, 0.16) ${progressPercent}%)`;
        }
    });

    // Handle progress bar drag/seek
    if (progressBar) {
        progressBar.addEventListener('input', () => {
            const duration = bgMusic.duration;
            if (!isNaN(duration)) {
                const seekTime = (progressBar.value / 100) * duration;
                bgMusic.currentTime = seekTime;
                
                const progressPercent = progressBar.value;
                progressBar.style.background = `linear-gradient(to right, var(--color-burgundy) ${progressPercent}%, rgba(123, 154, 109, 0.16) ${progressPercent}%)`;
            }
        });
    }
    
    // Set duration when metadata loads
    bgMusic.addEventListener('loadedmetadata', () => {
        if (durationTimeEl) {
            durationTimeEl.textContent = formatTime(bgMusic.duration);
        }
    });

    // Reset when audio ends (por si algún día se apaga el loop)
    bgMusic.addEventListener('ended', () => {
        if (!isLooping) {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            progressBar.value = 0;
            progressBar.style.background = `rgba(123, 154, 109, 0.16)`;
            currentTimeEl.textContent = '00:00';
        }
    });

    // ==========================================================================
    // COUNTDOWN TIMER
    // ==========================================================================
    const weddingDate = new Date('October 17, 2026 18:00:00').getTime();

    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elSeconds = document.getElementById('seconds');
    const elCountdown = document.getElementById('countdown');

    if (elDays && elHours && elMinutes && elSeconds) {
        const countdownTimer = setInterval(() => {
            const now = new Date().getTime();
            const distance = weddingDate - now;

            if (distance < 0) {
                clearInterval(countdownTimer);
                if (elCountdown) {
                    elCountdown.innerHTML = "<div style='font-family: var(--font-script); font-size: 3rem; color: var(--color-burgundy);'>¡Llegó Esteban!</div>";
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            elDays.innerText = String(days).padStart(2, '0');
            elHours.innerText = String(hours).padStart(2, '0');
            elMinutes.innerText = String(minutes).padStart(2, '0');
            elSeconds.innerText = String(seconds).padStart(2, '0');
        }, 1000);
    }

    // ==========================================================================
    // SCROLL REVEAL (Intersection Observer)
    // ==========================================================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // ==========================================================================
    // SCROLL PROGRESS INDICATOR
    // ==========================================================================
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress && !CSS.supports('animation-timeline', 'scroll()')) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = height > 0 ? (winScroll / height) : 0;
                    scrollProgress.style.transform = `scaleX(${scrolled})`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    initScrollReveal();

    // ==========================================================================
    // GSAP SCROLL ANIMATIONS — Field Expedition Journal signature moments
    // ==========================================================================
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Egg-hatch pin: the specimen photo settles into place as it appears
        const dinoHero = document.getElementById('dino-hero');
        if (dinoHero) {
            gsap.from(dinoHero, {
                scale: 0.85,
                rotate: -8,
                opacity: 0,
                duration: 1.1,
                ease: 'back.out(1.6)',
                scrollTrigger: { trigger: dinoHero, start: 'top 85%', once: true }
            });
        }

        // Ink-stamp slam: badges and tickets thunk into place like a rubber stamp
        gsap.utils.toArray('.ink-stamp, .field-ticket, .viewfinder').forEach((el) => {
            const baseRotate = el.classList.contains('ink-stamp') ? -7 : 0;
            gsap.fromTo(el,
                { scale: 1.35, opacity: 0, rotate: baseRotate + (Math.random() > 0.5 ? 6 : -6) },
                {
                    scale: 1, opacity: 1, rotate: baseRotate,
                    duration: 0.45, ease: 'power4.out',
                    scrollTrigger: { trigger: el, start: 'top 88%', once: true }
                }
            );
        });

        // Field log: the entry nearest the reading line stays sharp, the rest dim
        gsap.utils.toArray('.field-log__entry').forEach((entry) => {
            ScrollTrigger.create({
                trigger: entry,
                start: 'top 65%',
                end: 'bottom 35%',
                toggleClass: { targets: entry, className: 'is-active' }
            });
        });

        // Video showcase: scale-in reveal, autoplay while in view, pause when scrolled away
        const videoFrame = document.getElementById('video-esteban');
        const videoEl = videoFrame ? videoFrame.querySelector('video') : null;
        if (videoEl && !reduceMotion) {
            ScrollTrigger.create({
                trigger: videoFrame,
                start: 'top 80%',
                end: 'bottom 20%',
                onEnter: () => videoEl.play().catch(() => {}),
                onEnterBack: () => videoEl.play().catch(() => {}),
                onLeave: () => videoEl.pause(),
                onLeaveBack: () => videoEl.pause()
            });
        }
    }

    // ==========================================================================
    // RSVP — CONFIRMAR ASISTENCIA (Supabase, lazy-loaded)
    // ==========================================================================
    const SUPABASE_URL = 'https://pncvqukbnuqvwgowperf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY3ZxdWtibnVxdndnb3dwZXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTg4MjUsImV4cCI6MjA5NjEzNDgyNX0.uZWqxvl2kd7Fq9pNAIDi86zWwa0TWhbj0OrSLAmRciE';
    const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    const EVENT_SLUG = 'josue-elena';

    let supabaseClient = null;
    let supabaseLoading = null;

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = src;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    // Load the Supabase SDK only when the RSVP flow is used.
    function ensureSupabase() {
        if (supabaseClient) return Promise.resolve(supabaseClient);
        if (!supabaseLoading) {
            supabaseLoading = (async () => {
                if (typeof supabase === 'undefined') {
                    await loadScript(SUPABASE_CDN);
                }
                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                return supabaseClient;
            })();
        }
        return supabaseLoading;
    }

    const btnRsvp = document.getElementById('btn-rsvp');
    const rsvpModal = document.getElementById('rsvp-modal');
    const modalClose = document.getElementById('modal-close');
    const formRsvp = document.getElementById('form-rsvp');

    // Inline toast notifications
    const toastEl = document.getElementById('toast');
    let toastTimer = null;
    function showToast(message, isError = false, duration = 3600) {
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.toggle('error', isError);
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), duration);
    }

    // Prevent a second submission once this device has confirmed
    const RSVP_KEY = 'esteban_rsvp_done';
    function isRsvpDone() {
        try { return !!localStorage.getItem(RSVP_KEY); } catch (e) { return false; }
    }
    function applyConfirmedUI() {
        if (btnRsvp) {
            const s = btnRsvp.querySelector('span');
            if (s) s.textContent = 'Asistencia confirmada';
            btnRsvp.classList.add('is-confirmed');
        }
    }
    function markRsvpDone() {
        try { localStorage.setItem(RSVP_KEY, '1'); } catch (e) {}
        applyConfirmedUI();
    }

    function openRsvpModal() {
        if (!rsvpModal) return;
        if (isRsvpDone()) {
            showToast('Ya registramos tu confirmación en la bitácora. ¡Gracias!');
            return;
        }
        rsvpModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        const nameInput = document.getElementById('rsvp-name');
        if (nameInput) nameInput.focus();
        ensureSupabase().catch(() => {}); // Preload in the background for an instant submit
    }

    function closeModal() {
        if (!rsvpModal) return;
        rsvpModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (btnRsvp) btnRsvp.addEventListener('click', openRsvpModal);
    if (isRsvpDone()) applyConfirmedUI();
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (rsvpModal) {
        rsvpModal.addEventListener('click', (e) => {
            if (e.target === rsvpModal) closeModal();
        });
    }

    if (formRsvp) {
        formRsvp.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('rsvp-name').value.trim();
            const phone = document.getElementById('rsvp-phone').value.trim();
            const message = document.getElementById('rsvp-message').value.trim();
            const statusEl = document.querySelector('input[name="rsvp-status"]:checked');
            const confirmacion = statusEl ? statusEl.value === 'Si' : true;

            // Close the form immediately so it feels instant; save in the background
            closeModal();
            showToast('Guardando tu confirmación…', false, 8000);

            try {
                const client = await ensureSupabase();
                const { error } = await client
                    .from('rsvp')
                    .insert([
                        {
                            event_slug: EVENT_SLUG,
                            nombre: name,
                            numero: phone,
                            confirmacion: confirmacion,
                            mensaje: message
                        }
                    ]);

                if (error) throw error;

                formRsvp.reset();
                markRsvpDone();
                showToast(confirmacion
                    ? '¡Gracias! Quedas registrado en la expedición de Esteban.'
                    : 'Gracias por avisarnos, te vamos a extrañar en la expedición.');
            } catch (error) {
                console.error('Error al registrar RSVP en Supabase:', error);
                openRsvpModal();
                showToast('No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.', true, 4500);
            }
        });
    }

    // Sticky Floating RSVP Button toggle
    const floatingRsvpBtn = document.getElementById('floating-rsvp-btn');
    const rsvpSection = document.getElementById('rsvp');
    if (floatingRsvpBtn) {
        floatingRsvpBtn.addEventListener('click', openRsvpModal);
        window.addEventListener('scroll', () => {
            if (isRsvpDone()) { floatingRsvpBtn.classList.remove('show'); return; }
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            const rsvpTop = rsvpSection ? rsvpSection.getBoundingClientRect().top + window.scrollY : 10000;
            const triggerPos = 400;
            const hidePos = rsvpTop - window.innerHeight + 100;
            if (scrollPos > triggerPos && scrollPos < hidePos) {
                floatingRsvpBtn.classList.add('show');
            } else {
                floatingRsvpBtn.classList.remove('show');
            }
        }, { passive: true });
    }
});
