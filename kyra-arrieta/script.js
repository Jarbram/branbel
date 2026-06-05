document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // CUSTOM AUDIO PLAYER SYSTEM
    // ==========================================================================
    
    // Default background audio URL
    const AUDIO_SRC = 'song.mp3?v=2';
    
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
});
