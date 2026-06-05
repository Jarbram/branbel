document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CUSTOM AUDIO PLAYER SYSTEM
    // ==========================================================================
    
    // Default background audio URL
    const AUDIO_SRC = 'song.mp3?v=3';
    
    const bgMusic = document.getElementById('bg-music');
    const audioSource = document.getElementById('audio-source');
    
    const btnPlayPause = document.getElementById('btn-play-pause');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');
    
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationTimeEl = document.getElementById('duration-time');
    
    const btnRepeat = document.querySelector('.icon-repeat');
    let isLooping = true; // Loop by default
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
            progressBar.style.background = `linear-gradient(to right, var(--color-burgundy) ${progressPercent}%, rgba(91, 15, 28, 0.2) ${progressPercent}%)`;
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
                progressBar.style.background = `linear-gradient(to right, var(--color-burgundy) ${progressPercent}%, rgba(91, 15, 28, 0.2) ${progressPercent}%)`;
            }
        });
    }
    
    // Set duration when metadata loads
    bgMusic.addEventListener('loadedmetadata', () => {
        if (durationTimeEl) {
            durationTimeEl.textContent = formatTime(bgMusic.duration);
        }
    });

    // Toggle repeat mode
    if (btnRepeat) {
        btnRepeat.addEventListener('click', () => {
            isLooping = !isLooping;
            bgMusic.loop = isLooping;
            if(isLooping) {
                btnRepeat.style.opacity = '1';
            } else {
                btnRepeat.style.opacity = '0.5';
            }
        });
    }

    // Reset when audio ends (if not looping)
    bgMusic.addEventListener('ended', () => {
        if (!isLooping) {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            progressBar.value = 0;
            progressBar.style.background = `rgba(91, 15, 28, 0.2)`;
            currentTimeEl.textContent = '00:00';
        }
    });

    // Decorative buttons (Shuffle, Prev, Next) animation effect only
    document.querySelectorAll('.btn-control:not(.icon-repeat)').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // ==========================================================================
    // COUNTDOWN TIMER
    // ==========================================================================
    const weddingDate = new Date('July 18, 2026 20:00:00').getTime();

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
                    elCountdown.innerHTML = "<div style='font-family: var(--font-script); font-size: 3rem; color: var(--color-burgundy);'>¡Llegó el gran día!</div>";
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
    // RSVP — CONFIRMAR ASISTENCIA (Supabase, lazy-loaded)
    // ==========================================================================
    const SUPABASE_URL = 'https://pncvqukbnuqvwgowperf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY3ZxdWtibnVxdndnb3dwZXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTg4MjUsImV4cCI6MjA5NjEzNDgyNX0.uZWqxvl2kd7Fq9pNAIDi86zWwa0TWhbj0OrSLAmRciE';
    const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    const EVENT_SLUG = 'kyra-arrieta';

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
    const RSVP_KEY = 'kyra_rsvp_done';
    function isRsvpDone() {
        try { return !!localStorage.getItem(RSVP_KEY); } catch (e) { return false; }
    }
    function applyConfirmedUI() {
        if (btnRsvp) {
            const s = btnRsvp.querySelector('span');
            if (s) s.textContent = 'Asistencia confirmada';
            btnRsvp.classList.add('is-confirmed');
        }
        const floating = document.getElementById('floating-rsvp-btn');
        if (floating) {
            floating.classList.remove('show');
            floating.style.display = 'none';
        }
    }
    function markRsvpDone() {
        try { localStorage.setItem(RSVP_KEY, '1'); } catch (e) {}
        applyConfirmedUI();
    }

    function openRsvpModal() {
        if (!rsvpModal) return;
        if (isRsvpDone()) {
            showToast('Ya registramos tu confirmación. ¡Gracias! 🤍');
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
                    ? '¡Gracias! Te esperamos con mucho cariño. 🤍'
                    : 'Gracias por avisarnos, te vamos a extrañar. 🤍');
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
