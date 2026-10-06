// StudentHub - Shared JavaScript (P4)
// Hamburger menu, theme switcher, FAQ collapse, modal, notifications, slider

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initHamburgerMenu();
    initThemeSwitcher();
    initFaqCollapse();
    initSlider();
    initCardRows();
    initLucide();
});

// ===== Mobile Nav Toggle (public pages) =====
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    function close() {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    links.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target) && links.classList.contains('open')) close();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769) close();
    });
}

function initLucide() {
    if (window.lucide) {
        window.lucide.createIcons();
    } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
        script.onload = () => {
            if (window.lucide) window.lucide.createIcons();
        };
        document.head.appendChild(script);
    }
}

window.refreshLucide = function() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
};

// ===== Row-Alternating Card Colors =====
// Adds .card-row-1/2/3 to each child of a .card-rows grid so every line
// shares one tone and consecutive lines differ.
function initCardRows() {
    const grids = Array.from(document.querySelectorAll('.card-rows'));
    if (!grids.length) return;

    const apply = () => {
        grids.forEach(grid => {
            const tmpl = getComputedStyle(grid).gridTemplateColumns;
            const cols = tmpl.split(/\s+/).length;
            Array.from(grid.children).forEach((child, i) => {
                const row = Math.floor(i / Math.max(cols, 1));
                child.classList.remove('card-row-1', 'card-row-2', 'card-row-3');
                child.classList.add('card-row-' + ((row % 3) + 1));
            });
        });
    };

    apply();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(apply, 120);
    });

    window.refreshCardRows = apply;
}

// ===== Hamburger Menu (Mobile Sidebar) =====
function initHamburgerMenu() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    if (!sidebar || !mainContent) return;

    // Create hamburger button
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.style.cssText = `
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        flex-direction: column;
        gap: 5px;
    `;
    hamburger.querySelectorAll('span').forEach(span => {
        span.style.cssText = 'display: block; width: 24px; height: 2px; background: var(--color-text); transition: 0.3s;';
    });

    // Insert hamburger before sidebar in header
    const header = document.querySelector('header nav');
    if (header) {
        header.insertBefore(hamburger, header.firstChild);
    }

    // Mobile styles
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 899px) {
            .hamburger { display: flex !important; }
            .sidebar {
                position: fixed;
                top: 0;
                left: -280px;
                width: 260px;
                height: 100vh;
                z-index: 1000;
                background: var(--color-surface);
                box-shadow: var(--shadow-md);
                transition: left 0.3s ease;
                overflow-y: auto;
            }
            .sidebar.open { left: 0; }
            .sidebar-overlay {
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .sidebar-overlay.visible { opacity: 1; visibility: visible; }
            body.sidebar-open { overflow: hidden; }
            .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
            .hamburger.open span:nth-child(2) { opacity: 0; }
            .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
        }
    `;
    document.head.appendChild(style);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('visible');
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('sidebar-open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('sidebar-open');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sidebar.classList.contains('open')) closeSidebar();
        else openSidebar();
    });

    overlay.addEventListener('click', closeSidebar);

    // Close on link click
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) closeSidebar();
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900 && sidebar.classList.contains('open')) closeSidebar();
    });
}

// ===== Theme Switcher =====
function initThemeSwitcher() {
    const existingToggle = document.querySelector('.theme-toggle');
    if (existingToggle) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('type', 'button');
    toggle.setAttribute('aria-label', 'Switch to dark mode');
    toggle.setAttribute('aria-pressed', 'false');
    toggle.innerHTML = '<i data-lucide="moon"></i><i data-lucide="sun"></i>';

    const nav = document.querySelector('header nav');
    if (nav) {
        nav.appendChild(toggle);
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleState(savedTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateToggleState(next);
    });

    function updateToggleState(theme) {
        const isDark = theme === 'dark';
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }
}

// ===== FAQ Collapse =====
function initFaqCollapse() {
    const faqItems = document.querySelectorAll('.faq-item h3');
    faqItems.forEach(h3 => {
        h3.style.cursor = 'pointer';
        h3.setAttribute('tabindex', '0');
        h3.setAttribute('role', 'button');
        h3.setAttribute('aria-expanded', 'false');
        const answer = h3.nextElementSibling;
        if (answer) {
            answer.style.display = 'none';
            answer.setAttribute('hidden', '');
        }

        const toggle = () => {
            const isExpanded = h3.getAttribute('aria-expanded') === 'true';
            const answer = h3.nextElementSibling;
            if (answer) {
                answer.style.display = isExpanded ? 'none' : 'block';
                answer.hidden = isExpanded;
            }
            h3.setAttribute('aria-expanded', !isExpanded);
        };

        h3.addEventListener('click', toggle);
        h3.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });
}

// ===== Modal System =====
window.openModal = function(contentHtml, options = {}) {
    const existing = document.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); z-index: 2000;
        display: flex; align-items: center; justify-content: center;
        padding: 1rem; opacity: 0; transition: opacity 0.2s ease;
    `;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        background: var(--color-surface); border-radius: var(--radius-md);
        padding: 2rem; max-width: 500px; width: 100%; max-height: 90vh;
        overflow-y: auto; transform: scale(0.95); transition: transform 0.2s ease;
    `;
    modal.innerHTML = contentHtml;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close modal');
    closeBtn.style.cssText = `
        position: absolute; top: 1rem; right: 1rem; background: none; border: none;
        font-size: 1.5rem; cursor: pointer; color: var(--color-text-muted);
        width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    `;
    modal.style.position = 'relative';
    modal.prepend(closeBtn);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        modal.style.transform = 'scale(1)';
    });

    function close() {
        overlay.style.opacity = '0';
        modal.style.transform = 'scale(0.95)';
        setTimeout(() => overlay.remove(), 200);
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') close();
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKeyDown);

    if (options.onClose) overlay.addEventListener('modalclose', options.onClose);
    return { close };
};

window.closeModal = function() {
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
};

// ===== Notification Banner =====
window.showNotification = function(message, type = 'info', duration = 5000) {
    const container = getOrCreateNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.style.cssText = `
        background: var(--color-surface);
        border-left: 4px solid ${getNotificationColor(type)};
        border-radius: var(--radius-md);
        padding: var(--spacing-md) var(--spacing-lg);
        margin-bottom: var(--spacing-sm);
        box-shadow: var(--shadow-md);
        display: flex; align-items: center; justify-content: space-between;
        gap: var(--spacing-md); min-width: 300px; max-width: 500px;
        animation: slideIn 0.3s ease;
    `;

    const colors = { success: '#4caf50', error: '#f44336', warning: '#ff9800', info: '#0066cc' };
    function getNotificationColor(t) { return colors[t] || colors.info; }

    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Dismiss" style="
            background: none; border: none; cursor: pointer; color: var(--color-text-muted);
            font-size: 1.25rem; padding: 0; line-height: 1;
        ">×</button>
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
        .notification-container { position: fixed; top: 1rem; right: 1rem; z-index: 3000; display: flex; flex-direction: column; gap: 0.5rem; }
    `;
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }

    container.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => dismiss(notification));

    let timer = setTimeout(() => dismiss(notification), duration);
    notification.addEventListener('mouseenter', () => clearTimeout(timer));
    notification.addEventListener('mouseleave', () => {
        timer = setTimeout(() => dismiss(notification), 2000);
    });

    function dismiss(el) {
        el.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => el.remove(), 300);
    }
};

function getOrCreateNotificationContainer() {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}

// ===== Content Slider =====
function initSlider() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        if (!track || slides.length < 2) return;

        let currentIndex = 0;
        const slideWidth = () => slides[0].offsetWidth + 16; // includes gap

        function goTo(index) {
            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            track.style.transform = `translateX(-${currentIndex * slideWidth()}px)`;
            updateButtons();
        }

        function updateButtons() {
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex >= slides.length - 1;
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

        // Keyboard navigation
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
            if (e.key === 'ArrowRight') goTo(currentIndex + 1);
        });

        // Touch swipe
        let startX = 0;
        track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        track.addEventListener('touchend', (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
            }
        });

        updateButtons();
    });
}