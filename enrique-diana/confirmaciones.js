document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // CONFIG
    // ==========================================================================
    const SUPABASE_URL = 'https://pncvqukbnuqvwgowperf.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBuY3ZxdWtibnVxdndnb3dwZXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTg4MjUsImV4cCI6MjA5NjEzNDgyNX0.uZWqxvl2kd7Fq9pNAIDi86zWwa0TWhbj0OrSLAmRciE';
    const EVENT_SLUG = 'enrique-diana';

    // Clave para abrir el panel. Cámbiala por la que prefieras.
    const PASSCODE = 'enriquediana2026';

    let supabaseClient = null;
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // ==========================================================================
    // DOM
    // ==========================================================================
    const gate = document.getElementById('gate');
    const gateForm = document.getElementById('gate-form');
    const gateInput = document.getElementById('gate-input');
    const gateError = document.getElementById('gate-error');
    const panel = document.getElementById('panel');

    const listEl = document.getElementById('rsvp-list');
    const loadingEl = document.getElementById('rsvp-loading');
    const emptyEl = document.getElementById('rsvp-empty');
    const errorEl = document.getElementById('rsvp-error');
    const searchEl = document.getElementById('admin-search');
    const filterBtns = Array.from(document.querySelectorAll('.admin-filter'));

    const elYes = document.getElementById('stat-yes');
    const elNo = document.getElementById('stat-no');
    const elMsg = document.getElementById('stat-msg');
    const elTotal = document.getElementById('stat-total');

    let allRows = [];
    let filter = 'all';
    let search = '';

    // ==========================================================================
    // PASSCODE GATE (obscurity layer — see note in README)
    // ==========================================================================
    const SESSION_KEY = 'ed_admin_ok';

    function unlock() {
        gate.style.display = 'none';
        panel.hidden = false;
        loadRsvps();
    }

    if (sessionStorage.getItem(SESSION_KEY) === '1') {
        unlock();
    } else {
        setTimeout(() => gateInput && gateInput.focus(), 100);
    }

    gateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (gateInput.value.trim() === PASSCODE) {
            sessionStorage.setItem(SESSION_KEY, '1');
            gateError.textContent = '';
            unlock();
        } else {
            gateError.textContent = 'Clave incorrecta. Inténtalo de nuevo.';
            gateInput.value = '';
            gateInput.focus();
        }
    });

    // ==========================================================================
    // DATA
    // ==========================================================================
    async function loadRsvps() {
        if (!supabaseClient) {
            showError('Supabase no está configurado.');
            return;
        }
        try {
            let query = supabaseClient
                .from('rsvp')
                .select('*')
                .order('created_at', { ascending: false });
            // Filtra por evento si la columna existe; si no, trae todo igual.
            let { data, error } = await query.eq('event_slug', EVENT_SLUG);
            if (error && /event_slug/.test(error.message || '')) {
                ({ data, error } = await supabaseClient
                    .from('rsvp').select('*').order('created_at', { ascending: false }));
            }
            if (error) throw error;

            allRows = data || [];
            loadingEl.hidden = true;
            renderStats();
            renderList();
        } catch (err) {
            console.error('Error al leer RSVP:', err);
            showError(
                'No se pudieron cargar las confirmaciones. Asegúrate de haber habilitado una política de lectura (SELECT) para la tabla "rsvp" en Supabase.'
            );
        }
    }

    function showError(msg) {
        loadingEl.hidden = true;
        errorEl.hidden = false;
        errorEl.textContent = msg;
    }

    // ==========================================================================
    // RENDER
    // ==========================================================================
    function isYes(row) {
        return row.confirmacion === true || row.confirmacion === 'true';
    }

    function renderStats() {
        const yes = allRows.filter(isYes).length;
        const no = allRows.length - yes;
        const msg = allRows.filter(r => (r.mensaje || '').trim()).length;
        elYes.textContent = yes;
        elNo.textContent = no;
        elMsg.textContent = msg;
        elTotal.textContent = allRows.length;
    }

    function fmtDate(iso) {
        if (!iso) return '';
        try {
            return new Date(iso).toLocaleDateString('es-PE', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return ''; }
    }

    function waLink(numero) {
        const digits = (numero || '').replace(/[^\d]/g, '');
        if (digits.length < 7) return null;
        // Perú por defecto si el número no trae código de país
        const full = digits.length <= 9 ? '51' + digits : digits;
        return 'https://wa.me/' + full;
    }

    function escapeHtml(s) {
        return (s || '').replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));
    }

    function renderList() {
        const rows = allRows.filter(r => {
            if (filter === 'yes' && !isYes(r)) return false;
            if (filter === 'no' && isYes(r)) return false;
            if (search && !(r.nombre || '').toLowerCase().includes(search)) return false;
            return true;
        });

        listEl.innerHTML = '';
        emptyEl.hidden = rows.length !== 0 || allRows.length === 0;

        if (allRows.length === 0) {
            emptyEl.hidden = false;
            emptyEl.textContent = 'Aún no hay confirmaciones.';
            return;
        }
        if (rows.length === 0) {
            emptyEl.hidden = false;
            emptyEl.textContent = 'No hay resultados para tu búsqueda.';
            return;
        }

        rows.forEach(r => {
            const yes = isYes(r);
            const wa = waLink(r.numero);
            const card = document.createElement('article');
            card.className = 'rsvp-card' + (yes ? '' : ' is-no');
            card.innerHTML = `
                <div class="rsvp-card-head">
                    <span class="rsvp-name">${escapeHtml(r.nombre) || 'Invitado'}</span>
                    <span class="rsvp-badge ${yes ? 'yes' : 'no'}">${yes ? 'Asistirá' : 'No podrá'}</span>
                </div>
                <div class="rsvp-meta">
                    ${r.numero ? `<span class="rsvp-phone">${escapeHtml(r.numero)}</span>` : ''}
                    <span class="rsvp-date">${fmtDate(r.created_at)}</span>
                </div>
                ${(r.mensaje || '').trim() ? `<p class="rsvp-msg">${escapeHtml(r.mensaje)}</p>` : ''}
                ${wa ? `<a class="rsvp-wa" href="${wa}" target="_blank" rel="noopener">Escribir por WhatsApp</a>` : ''}
            `;
            listEl.appendChild(card);
        });
    }

    // ==========================================================================
    // FILTERS / SEARCH
    // ==========================================================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            filter = btn.dataset.filter;
            renderList();
        });
    });

    searchEl.addEventListener('input', () => {
        search = searchEl.value.trim().toLowerCase();
        renderList();
    });
});
