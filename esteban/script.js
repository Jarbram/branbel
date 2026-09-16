document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // PORTADA DE APERTURA + CANCIÓN
    // Un toque en la portada abre la invitación y arranca la única canción
    // (ese gesto también desbloquea el autoplay del navegador). El sonido se
    // controla después con un toggle inline en el hero, no con un widget.
    // ==========================================================================

    // Default background audio URL (deja song.mp3 en esta carpeta cuando lo tengas)
    const AUDIO_SRC = 'song.mp3?v=1';

    const bgMusic = document.getElementById('bg-music');
    const audioSource = document.getElementById('audio-source');

    bgMusic.loop = true; // una sola canción, siempre en bucle
    if (audioSource) {
        audioSource.src = AUDIO_SRC;
        bgMusic.load();
        bgMusic.volume = 0.5;
    }

    const welcomeOverlay = document.getElementById('welcome-overlay');
    const btnEnter = document.getElementById('btn-enter');
    const btnSound = document.getElementById('btn-sound');
    const soundOn = btnSound && btnSound.querySelector('.sound-toggle__on');
    const soundOff = btnSound && btnSound.querySelector('.sound-toggle__off');
    const soundLabel = btnSound && btnSound.querySelector('.sound-toggle__label');

    // Entrada escalonada de la tarjeta de portada (igual que las otras invitaciones)
    setTimeout(() => {
        if (welcomeOverlay) welcomeOverlay.classList.add('welcome-loaded');
    }, 100);

    function reflectSound() {
        const playing = !bgMusic.paused;
        if (btnSound) btnSound.setAttribute('aria-pressed', String(playing));
        if (soundOn) soundOn.hidden = !playing;
        if (soundOff) soundOff.hidden = playing;
        if (soundLabel) soundLabel.textContent = playing ? 'Pausar música' : 'Reanudar música';
    }

    function enterInvite() {
        if (!welcomeOverlay || welcomeOverlay.classList.contains('dismissed')) return;
        welcomeOverlay.classList.add('dismissed'); // se desliza hacia arriba
        document.body.classList.remove('cover-active');
        bgMusic.play().catch(() => {});
        reflectSound();
    }

    if (btnEnter) btnEnter.addEventListener('click', enterInvite);

    if (btnSound) {
        btnSound.addEventListener('click', () => {
            if (bgMusic.paused) bgMusic.play().catch(() => {});
            else bgMusic.pause();
            reflectSound();
        });
    }
    bgMusic.addEventListener('play', reflectSound);
    bgMusic.addEventListener('pause', reflectSound);
    reflectSound();

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

        // Nota de apertura: se "escribe" sola — cada palabra entra en cascada,
        // verso a verso, al aparecer en pantalla. Con reduce-motion se queda quieta.
        const openingNote = document.getElementById('opening-note');
        if (openingNote) {
            openingNote.querySelectorAll('.opening-note__line').forEach((line) => {
                const words = line.textContent.trim().split(/\s+/);
                line.textContent = '';
                words.forEach((w, i) => {
                    const span = document.createElement('span');
                    span.className = 'opening-note__word';
                    span.textContent = w;
                    line.appendChild(span);
                    if (i < words.length - 1) line.appendChild(document.createTextNode(' '));
                });
            });

            if (!reduceMotion) {
                openingNote.classList.add('is-writing');
                gsap.to(openingNote.querySelectorAll('.opening-note__word'), {
                    opacity: 1, y: 0, filter: 'blur(0px)',
                    duration: 0.5, ease: 'power2.out',
                    stagger: 0.045,
                    scrollTrigger: { trigger: openingNote, start: 'top 80%', once: true }
                });
                const sprig = openingNote.querySelector('.opening-note__sprig');
                if (sprig) {
                    gsap.from(sprig, {
                        opacity: 0, scaleX: 0,
                        duration: 0.6, ease: 'power2.out',
                        scrollTrigger: { trigger: openingNote, start: 'top 62%', once: true }
                    });
                }
            }
        }

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
    const SUPABASE_URL = 'https://yzjggaooqkzsaiktkhvq.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6amdnYW9vcWt6c2Fpa3RraHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNDIwMzIsImV4cCI6MjEwNDkxODAzMn0.euCmwakjXJP7EOX284h0mGITDDj9_cJA8UbLITuL52E';
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
    function getRsvpStatus() {
        try { return localStorage.getItem('esteban_rsvp_status') || ''; } catch (e) { return ''; }
    }
    function getMyGiftChoice() {
        try { return localStorage.getItem('esteban_gift_choice') || ''; } catch (e) { return ''; }
    }

    // Icono de regalo (feather-style) — mismo lenguaje de íconos que el resto del sitio (stroke, no emoji a color)
    const GIFT_ICON_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;margin-left:6px"><rect x="3" y="8" width="18" height="4"></rect><path d="M12 8v13"></path><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8"></path><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"></path></svg>';

    function applyConfirmedUI() {
        if (!btnRsvp) return;
        btnRsvp.classList.add('is-confirmed');
        const s = btnRsvp.querySelector('span');
        const noteEl = document.getElementById('my-gift-page-note');
        const titleEl = document.getElementById('confirm-title');
        if (!s) return;

        const status = getRsvpStatus();
        const gift = getMyGiftChoice();

        if (status === 'No') {
            s.textContent = 'Respuesta registrada';
            if (titleEl) titleEl.textContent = 'Gracias por avisarnos';
            if (noteEl) noteEl.hidden = true;
            return;
        }

        if (titleEl) titleEl.textContent = '¡Ya confirmaste tu asistencia!';
        s.innerHTML = (gift ? 'Ver / cambiar mi idea' : 'Elegir una idea de regalo') + GIFT_ICON_SVG;

        if (noteEl) {
            if (gift) {
                const item = typeof findGiftItem === 'function' ? findGiftItem(gift) : null;
                const link = item && item.link ? item.link : '';
                noteEl.innerHTML = 'Elegiste: ' + escapeHtml(gift)
                    + (link ? ` — <a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Ver tienda ↗</a>` : '');
                noteEl.hidden = false;
            } else {
                noteEl.hidden = true;
            }
        }
    }
    function markRsvpDone() {
        try { localStorage.setItem(RSVP_KEY, '1'); } catch (e) {}
        applyConfirmedUI();
    }

    // rsvp-screen-form / rsvp-screen-gift share one modal, one step visible at a time
    const rsvpScreenForm = document.getElementById('rsvp-screen-form');
    const rsvpScreenGift = document.getElementById('rsvp-screen-gift');

    function showScreen(name) {
        const showGift = name === 'gift';
        if (rsvpScreenForm) rsvpScreenForm.hidden = showGift;
        if (rsvpScreenGift) rsvpScreenGift.hidden = !showGift;
        const active = showGift ? rsvpScreenGift : rsvpScreenForm;
        if (!active) return;
        active.classList.remove('active');
        void active.offsetWidth; // restart the fade-in animation
        active.classList.add('active');
    }

    function openGiftScreen() {
        if (!rsvpModal) return;
        rsvpModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        showScreen('gift');
        renderGiftPillsAndGrid();
        preselectMyGift();
        refreshTakenGifts();
    }

    function openRsvpModal() {
        if (!rsvpModal) return;
        if (isRsvpDone()) {
            if (getRsvpStatus() === 'No') {
                showToast('Ya registramos tu respuesta. ¡Gracias por avisarnos!');
                return;
            }
            openGiftScreen();
            return;
        }
        rsvpModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        showScreen('form');
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

            // "No asistirá": cierra ya, no hay paso de regalos que mostrar.
            // "Sí asistirá": el modal se queda abierto y pasa al paso de regalos.
            if (!confirmacion) closeModal();
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
                try {
                    localStorage.setItem('esteban_rsvp_name', name);
                    localStorage.setItem('esteban_rsvp_phone', phone);
                    localStorage.setItem('esteban_rsvp_status', confirmacion ? 'Si' : 'No');
                } catch (e) {}
                markRsvpDone();

                if (confirmacion) {
                    showToast('¡Gracias! Quedas registrado. Si quieres, aquí tienes algunas ideas de regalo 🎁');
                    renderGiftPillsAndGrid();
                    preselectMyGift();
                    refreshTakenGifts();
                    showScreen('gift');
                } else {
                    showToast('Gracias por avisarnos, te vamos a extrañar en la invitación.');
                }
            } catch (error) {
                console.error('Error al registrar RSVP en Supabase:', error);
                openRsvpModal(); // reabre el modal (no-op si ya estaba abierto en el paso "form")
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

    // ==========================================================================
    // LISTA DE REGALOS — segundo paso, dentro del mismo modal de confirmación.
    // Copy siempre en tono "es una idea, no una obligación".
    // ==========================================================================
    const GIFT_CATEGORIES = [
        {
            title: 'Pañales e Higiene',
            items: [
                { name: 'Pañales Huggies talla RN (máx. 2 paquetes)', image: 'https://media.falabella.com/tottusPE/41234239_1/w=1200,h=1200,fit=cover', link: 'https://tottus.falabella.com.pe/tottus-pe/product/113445715/panales-recien-nacido-natural-care-huggies-por-20-unidades/113445717', price: '', slots: 2 },
                { name: 'Pañales Huggies talla P (3 a 4 paquetes)', image: 'https://media.falabella.com/tottusPE/41313554_1/public', link: 'https://tottus.falabella.com.pe/tottus-pe/product/113445751/panales-huggies-natural-care-talla-p-por-50-unidades/113445753', price: '', slots: 4 },
                { name: 'Pañales Huggies talla M (8 a 10 paquetes)', image: 'https://media.falabella.com/tottusPE/43302944_1/public', link: 'https://tottus.falabella.com.pe/tottus-pe/product/129869602/panal-dermacare-m-huggies-bolsa-58-und/129869605', price: '', slots: 10 },
                { name: 'Pañales Huggies talla G (5 paquetes)', image: 'https://media.falabella.com/tottusPE/43302943_1/public', link: 'https://tottus.falabella.com.pe/tottus-pe/product/129869598/panales-huggies-dermacare-talla-g-empaque-48-und/129869599', price: '', slots: 5 },
                { name: 'Toallitas húmedas Huggies (caja)', image: 'https://media.falabella.com/tottusPE/43388709_1/w=1200,h=1200,fit=cover', link: 'https://www.tottus.com.pe/tottus-pe/articulo/135602204/toallitas-humedas-huggies-puro-y-natural-empaque-240-und/135602205', price: '' },
                { name: 'Eucerin Baby Baño y Shampoo 2 en 1', image: 'https://plazavea.vteximg.com.br/arquivos/ids/7166785-450-450/imageUrl_1.jpg?v=637813595958070000', link: 'https://www.plazavea.com.pe/bano-y-shampoo-eucerin-baby-frasco-240-ml-100208382/p', price: '' },
                { name: 'Crema corporal hidratante Eucerin Baby', image: 'https://plazavea.vteximg.com.br/arquivos/ids/7166733-450-450/imageUrl_1.jpg?v=637813595926170000', link: 'https://www.plazavea.com.pe/locion-corporal-eucerin-baby-frasco-400-ml-100208331/p', price: '' },
                { name: 'Toallas con capucha 100% algodón', image: 'https://media.falabella.com/sodimacPE/2889242_01/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/113321466/Toalla-de-Felpa-con-Capucha-Celeste/113321468', price: '' },
                { name: 'Termómetro digital de frente u oído', image: 'https://media.falabella.com/falabellaPE/16086732_1/public', link: 'https://www.falabella.com.pe/falabella-pe/product/16086732/Termometro-Digital-Frente-y-Oidos/16086732', price: '' },
                { name: 'Kit de aseo (cortaúñas eléctrico, aspirador nasal)', image: 'https://media.falabella.com/falabellaPE/18895204_1/public', link: 'https://www.falabella.com.pe/falabella-pe/product/18895204/Kit-de-Cortaunas-Electrico-Seguro-para-Bebe-R/18895204', price: 'S/ 22.90' }
            ]
        },
        {
            title: 'Alimentación y Ropa',
            items: [
                { name: 'Biberones Philips Avent de vidrio (kit inicial)', image: 'https://images.philips.com/is/image/philipsconsumer/53cacc6e8c064266a663ac55017562a2', link: 'https://www.philips.com.pe/c-p/SCD303_01/newborn-glass-starter-set', price: '' },
                { name: 'Escobillas para biberones (con limpiador de tetina)', image: 'https://www.soft.com.pe/cdn/shop/products/EscobillaparaBiberonesAzul.jpg?v=1642678489&width=1946', link: 'https://www.soft.com.pe/products/escobilla-para-biberones-azul', price: 'S/ 38.90' },
                { name: 'Escurridor vertical de biberones', image: 'https://mundochiquitines.pe/cdn/shop/files/escurridor-4.webp', link: 'https://mundochiquitines.pe/products/escurridor-de-biberones', price: 'S/ 129.00' },
                { name: 'Cojín de lactancia', image: 'https://monchitos.com.pe/wp-content/uploads/2021/06/cojin-croissi-pillow-monchitos-CM-12902001-01-300x300.jpg', link: 'https://monchitos.com.pe/producto/croissi-pillow-xtraconfort-azul/', price: 'S/ 149.90' },
                { name: 'Set de muselinas / babitas de algodón', image: 'https://media.falabella.com/falabellaPE/139812982_01/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/139812981/Manta-Muselina-para-Bebe-Algodon-y-Bambu-Pack-x-3-Unidades/139812982', price: 'S/ 109.90' },
                { name: 'Bodys de manga corta de algodón (pack)', image: 'https://media.falabella.com/falabellaPE/19010302_1/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/19010297/body-bebe-nino-nina-pack-x5-algodon-carters/19010302', price: 'S/ 79.92' },
                { name: 'Pijamas de algodón delgado con cierre', image: 'https://plazavea.vteximg.com.br/arquivos/ids/14681653-450-450/imageUrl_2.jpg?v=637946026067500000', link: 'https://www.plazavea.com.pe/pijama-enterizo-carter-s-con-cierre-diseno-de-animales-para-bebe-nino-100416251/p', price: 'S/ 16.92' }
            ]
        },
        {
            title: 'Descanso · Colecho',
            items: [
                { name: 'Cuna de colecho con lateral abatible', image: 'https://media.falabella.com/falabellaPE/18272091_1/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/prod17650099/Cuna-Colecho-Nido-Bebe/18272091', price: '' },
                { name: 'Sábanas bajeras ajustables tamaño colecho (pack)', image: 'https://promart.vteximg.com.br/arquivos/ids/8205792-1000-1000/image-0.jpg?v=638640872510170000', link: 'https://www.promart.pe/sabanas-bebe-bajeras-cuna-colecho-100-algodon-x2-blancas-1000719015/p', price: 'S/ 99.00' },
                { name: 'Protectores de colchón impermeables pequeños', image: 'https://media.falabella.com/falabellaPE/125780442_01/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/125780439/Protector-De-Colchon-Amoldable-Impermeable-Cuna/125780442', price: '' },
                { name: 'Monitor de bebé (cámara o audio)', image: 'https://media.falabella.com/sodimacPE/2534436_01/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/113529216/Monitor-para-Bebe-VTECH-VM2251/113529219', price: '' }
            ]
        },
        {
            title: 'Movilidad y Paseo',
            items: [
                { name: 'Coche de paseo ligero, fácil de plegar', image: 'https://media.falabella.com/falabellaPE/882815499_01/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/882815498/Coche-Travel-System-Frezzio-Priori-Plegable-Con-Portabebe/882815499', price: 'S/ 519.90' },
                { name: 'Mochila pañalera espaciosa', image: 'https://media.falabella.com/falabellaPE/17628246_1/w=1200,h=1200,fit=cover', link: 'https://www.falabella.com.pe/falabella-pe/product/17628246/Mochila-Panalera-Open-Negra/17628246', price: 'S/ 135.20' }
            ]
        }
    ];
    const GIFT_OTHER = 'Otra idea / sorpresa';
    const GIFT_CHECK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    const giftPillsEl = document.getElementById('gift-pills');
    const giftGridEl = document.getElementById('gift-grid');
    const formGift = document.getElementById('form-gift');
    const giftMessageInput = document.getElementById('gift-message');
    const btnSubmitGift = document.getElementById('btn-submit-gift');
    const btnSkipGift = document.getElementById('btn-skip-gift');

    let giftGridRendered = false;
    let selectedGift = '';

    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    // Recién aquí GIFT_CATEGORIES y escapeHtml ya existen — por eso esta llamada
    // (que busca el link del regalo elegido) vive acá y no arriba, junto al resto
    // del arranque del RSVP.
    if (isRsvpDone()) applyConfirmedUI();

    function renderGiftPillsAndGrid() {
        if (giftGridRendered || !giftGridEl) return;
        giftGridRendered = true;

        giftPillsEl.innerHTML = ['Todas'].concat(GIFT_CATEGORIES.map((c) => c.title)).map((title, i) => `
            <button type="button" class="gift-pill${i === 0 ? ' is-active' : ''}" data-cat="${escapeHtml(title)}">${escapeHtml(title)}</button>
        `).join('');

        giftGridEl.setAttribute('role', 'radiogroup');
        giftGridEl.setAttribute('aria-label', 'Elige un regalo de la lista');

        giftGridEl.innerHTML = GIFT_CATEGORIES.flatMap((category) => category.items.map((item) => `
            <div class="gift-card" role="radio" aria-checked="false" tabindex="0" data-gift="${escapeHtml(item.name)}" data-category="${escapeHtml(category.title)}" data-slots="${item.slots || 1}">
                <span class="gift-card-check" aria-hidden="true">${GIFT_CHECK_SVG}</span>
                ${item.image
                    ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy">`
                    : `<div class="gift-card-icon" aria-hidden="true">🎁</div>`}
                <span class="gift-name">${escapeHtml(item.name)}</span>
                <span class="gift-selected-label">Seleccionado</span>
                <span class="gift-remaining-label" hidden></span>
                ${item.price ? `<span class="gift-price">${escapeHtml(item.price)}</span>` : ''}
                ${item.link ? `<a class="gift-card-link" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Ver tienda ↗</a>` : ''}
            </div>
        `)).join('') + `
            <div class="gift-card gift-card--other" role="radio" aria-checked="false" tabindex="0" data-gift="${escapeHtml(GIFT_OTHER)}" data-category="__other__">
                <span class="gift-card-check" aria-hidden="true">${GIFT_CHECK_SVG}</span>
                <div class="gift-card-icon gift-card-icon--other" aria-hidden="true">🎉</div>
                <span class="gift-name">${escapeHtml(GIFT_OTHER)}</span>
                <span class="gift-note">Cuéntanos tú qué se te ocurre</span>
                <span class="gift-selected-label">Seleccionado</span>
            </div>
        `;

        giftPillsEl.addEventListener('click', (e) => {
            const pill = e.target.closest('.gift-pill');
            if (!pill) return;
            giftPillsEl.querySelectorAll('.gift-pill').forEach((p) => p.classList.remove('is-active'));
            pill.classList.add('is-active');
            const cat = pill.dataset.cat;
            giftGridEl.querySelectorAll('.gift-card').forEach((card) => {
                const show = cat === 'Todas' || card.dataset.category === cat || card.dataset.category === '__other__';
                card.classList.toggle('is-hidden-filter', !show);
            });
        });

        const selectCard = (card) => {
            if (card.classList.contains('is-full')) return;
            giftGridEl.querySelectorAll('.gift-card.is-selected').forEach((c) => {
                c.classList.remove('is-selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('is-selected');
            card.setAttribute('aria-checked', 'true');
            selectedGift = card.dataset.gift;
            if (btnSubmitGift) btnSubmitGift.disabled = false;
        };
        giftGridEl.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // dejar que "Ver tienda" navegue normal
            const card = e.target.closest('.gift-card');
            if (card) selectCard(card);
        });
        giftGridEl.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const card = e.target.closest('.gift-card');
            if (!card) return;
            e.preventDefault();
            selectCard(card);
        });
    }

    function findGiftItem(name) {
        for (const category of GIFT_CATEGORIES) {
            const item = category.items.find((i) => i.name === name);
            if (item) return item;
        }
        return null;
    }

    // Muestra "ya elegiste X" con su link de compra arriba de la grilla,
    // siempre visible al reabrir — no hay que buscar la tarjeta entre las demás.
    function renderMyGiftSummary() {
        const summaryEl = document.getElementById('my-gift-summary');
        if (!summaryEl) return;
        const mine = getMyGiftChoice();
        if (!mine) { summaryEl.hidden = true; return; }
        const item = findGiftItem(mine);
        const link = item && item.link ? item.link : '';
        summaryEl.innerHTML = `
            <span class="my-gift-summary-label">🎁 Ya elegiste</span>
            <span class="my-gift-summary-name">${escapeHtml(mine)}</span>
            ${link ? `<a class="my-gift-summary-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Ver tienda ↗</a>` : ''}
        `;
        summaryEl.hidden = false;
    }

    function preselectMyGift() {
        renderMyGiftSummary();
        const mine = getMyGiftChoice();
        if (!mine || !giftGridEl) return;
        const card = giftGridEl.querySelector(`.gift-card[data-gift="${CSS.escape(mine)}"]`);
        if (card) {
            giftGridEl.querySelectorAll('.gift-card.is-selected').forEach((c) => {
                c.classList.remove('is-selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('is-selected');
            card.setAttribute('aria-checked', 'true');
            selectedGift = mine;
            if (btnSubmitGift) btnSubmitGift.disabled = false;
        }
        if (giftMessageInput) {
            try { giftMessageInput.value = localStorage.getItem('esteban_gift_message') || ''; } catch (e) {}
        }
    }

    // Cada ítem tiene "cupos" (1 para la mayoría — cuna, coche, monitor…, varios
    // para pañales, según el rango que se pidió: RN=2, P=4, M=10, G=5). Cuando se
    // agotan los cupos de un ítem, desaparece de la lista para todos (no se queda
    // ahí tachado): así 10 invitados distintos pueden traer pañales talla M hasta
    // completar el cupo, pero la cuna se va apenas alguien la elige.
    async function refreshTakenGifts() {
        if (!giftGridEl) return;
        try {
            const client = await ensureSupabase();
            const { data, error } = await client
                .from('regalos')
                .select('regalo')
                .eq('event_slug', EVENT_SLUG);
            if (error) throw error;

            const counts = new Map();
            (data || []).forEach((r) => {
                if (!r.regalo || r.regalo === GIFT_OTHER) return;
                counts.set(r.regalo, (counts.get(r.regalo) || 0) + 1);
            });

            giftGridEl.querySelectorAll('.gift-card').forEach((card) => {
                const gift = card.dataset.gift;
                if (gift === GIFT_OTHER) return; // sin límite, siempre disponible
                const slots = parseInt(card.dataset.slots, 10) || 1;
                const isMine = gift === selectedGift;
                const taken = counts.get(gift) || 0;
                const remaining = slots - taken;
                const isFull = remaining <= 0 && !isMine;

                card.classList.toggle('is-full', isFull);

                const remainingLabel = card.querySelector('.gift-remaining-label');
                if (remainingLabel) {
                    if (slots > 1 && !isFull) {
                        remainingLabel.textContent = `Quedan ${Math.max(remaining, 0)} de ${slots}`;
                        remainingLabel.hidden = false;
                    } else {
                        remainingLabel.hidden = true;
                    }
                }
            });
        } catch (err) {
            console.error('No se pudo verificar los regalos ya elegidos:', err);
        }
    }

    if (btnSkipGift) {
        btnSkipGift.addEventListener('click', () => closeModal());
    }

    if (formGift) {
        formGift.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!selectedGift) return;

            const mensaje = giftMessageInput ? giftMessageInput.value.trim() : '';
            let nombre = '', numero = '';
            try {
                nombre = localStorage.getItem('esteban_rsvp_name') || '';
                numero = localStorage.getItem('esteban_rsvp_phone') || '';
            } catch (e) {}

            closeModal();
            showToast('Guardando tu idea…', false, 6000);

            try {
                const client = await ensureSupabase();
                const { error } = await client
                    .from('regalos')
                    .upsert([{
                        event_slug: EVENT_SLUG,
                        nombre: nombre,
                        numero: numero,
                        regalo: selectedGift,
                        mensaje: mensaje
                    }], { onConflict: 'event_slug,numero' });

                if (error) throw error;

                try {
                    localStorage.setItem('esteban_gift_choice', selectedGift);
                    localStorage.setItem('esteban_gift_message', mensaje);
                } catch (e) {}
                applyConfirmedUI();
                renderMyGiftSummary();
                showToast('¡Gracias por la idea! Quedó anotada.');
            } catch (error) {
                console.error('Error al registrar el regalo en Supabase:', error);
                showToast('No se pudo guardar. Revisa tu conexión e inténtalo de nuevo.', true, 4500);
            }
        });
    }
});
