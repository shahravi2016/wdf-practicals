// StudentHub - Shared JavaScript (P4)
// Hamburger menu, theme switcher, FAQ collapse, modal, notifications, slider

document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initThemeSwitcher();
    initFaqCollapse();
    initSlider();
});

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
        span.style.cssText = 'display: block; width: 24px; height: 2px; background: #333; transition: 0.3s;';
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
                background: #fff;
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
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = '🌙';
    toggle.style.cssText = `
        background: none;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 0.5rem;
        cursor: pointer;
        font-size: 1.25rem;
        margin-left: var(--spacing-md);
    `;

    const header = document.querySelector('header nav');
    if (header) {
        header.appendChild(toggle);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme);
    });

    function updateToggleIcon(theme) {
        toggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // Dark theme variables
    const darkStyles = document.createElement('style');
    darkStyles.textContent = `
        [data-theme="dark"] {
            --color-bg: #1a1a1a;
            --color-surface: #2d2d2d;
            --color-border: #444;
            --color-text: #f0f0f0;
            --color-text-muted: #aaa;
        }
        [data-theme="dark"] header,
        [data-theme="dark"] footer,
        [data-theme="dark"] .card,
        [data-theme="dark"] .notice-item,
        [data-theme="dark"] .event-item,
        [data-theme="dark"] .course-item,
        [data-theme="dark"] .info-item,
        [data-theme="dark"] .course-card,
        [data-theme="dark"] .faculty-card,
        [data-theme="dark"] .stat-card,
        [data-theme="dark"] .auth-form,
        [data-theme="dark"] .feedback-form,
        [data-theme="dark"] .contact-form,
        [data-theme="dark"] .settings-form,
        [data-theme="dark"] .faq-item,
        [data-theme="dark"] .sidebar,
        [data-theme="dark"] .attendance-table,
        [data-theme="dark"] .admin-table,
        [data-theme="dark"] .attendance-overview {
            background: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
        }
        [data-theme="dark"] .btn { background: var(--color-primary); }
        [data-theme="dark"] .btn:hover { background: var(--color-primary-hover); }
        [data-theme="dark"] input, [data-theme="dark"] select, [data-theme="dark"] textarea {
            background: var(--color-bg);
            border-color: var(--color-border);
            color: var(--color-text);
        }
        [data-theme="dark"] input:focus, [data-theme="dark"] select:focus, [data-theme="dark"] textarea:focus {
            box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3);
        }
        [data-theme="dark"] .nav-links a { color: var(--color-text); }
        [data-theme="dark"] .nav-links a:hover,
        [data-theme="dark"] .nav-links a[aria-current="page"] { color: var(--color-primary); }
        [data-theme="dark"] .sidebar-nav a:hover,
        [data-theme="dark"] .sidebar-nav a[aria-current="page"] {
            background: var(--color-bg);
            color: var(--color-primary);
        }
        [data-theme="dark"] .attendance-table th,
        [data-theme="dark"] .admin-table th { background: var(--color-bg); }
        [data-theme="dark"] .status-good { color: #66bb6a; }
        [data-theme="dark"] .status-warning { color: #ffb74d; }
    `;
    document.head.appendChild(darkStyles);
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