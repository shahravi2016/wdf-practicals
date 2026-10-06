document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fields = ['name', 'email', 'subject', 'message'].map(n => form.querySelector(`[name="${n}"]`)).filter(Boolean);

    function setState(field, ok, message) {
        const group = field.closest('.form-group');
        if (!group) return;
        const old = group.querySelector('.error-message');
        if (old) old.remove();
        if (!ok) {
            const error = document.createElement('div');
            error.className = 'error-message';
            error.setAttribute('role', 'alert');
            error.textContent = message;
            error.style.cssText = 'color: #f44336; font-size: 0.875rem; margin-top: 0.25rem;';
            group.appendChild(error);
        }
    }

    function checkField(field) {
        const v = field.value.trim();
        if (field.name === 'name') {
            const ok = /^[A-Za-z ]{2,}$/.test(v);
            setState(field, ok, 'Enter your name.');
            return ok;
        }
        if (field.name === 'email') {
            const ok = emailPattern.test(v);
            setState(field, ok, 'Enter a valid email.');
            return ok;
        }
        if (field.name === 'subject') {
            const ok = v !== '';
            setState(field, ok, 'Select a subject.');
            return ok;
        }
        const ok = v.length >= 5;
        setState(field, ok, 'Message is too short.');
        return ok;
    }

    fields.forEach(f => f.addEventListener('blur', () => checkField(f)));

    form.addEventListener('submit', (e) => {
        let valid = true;
        fields.forEach(f => { if (!checkField(f)) valid = false; });
        if (!valid) e.preventDefault();
    });
});
