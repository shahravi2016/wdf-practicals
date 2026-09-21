// StudentHub - Registration Form Validation (P5)

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const fields = {
        fullName: { required: true, pattern: /^[A-Za-z\s]{2,50}$/, message: 'Enter a valid name (2-50 characters, letters only)' },
        email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
        mobile: { required: true, pattern: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
        password: { required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, message: 'Min 8 chars: uppercase, lowercase, number, special char' },
        confirmPassword: { required: true, message: 'Passwords do not match' },
        course: { required: true, message: 'Select a course' },
        year: { required: true, message: 'Select a year' },
        gender: { required: true, message: 'Select gender' },
        terms: { required: true, message: 'You must accept terms and conditions' }
    };

    const strengthMeter = createStrengthMeter();
    const passwordField = document.getElementById('password');
    if (passwordField) {
        passwordField.parentNode.insertBefore(strengthMeter, passwordField.nextSibling);
    }

    // Real-time validation on input/blur
    Object.keys(fields).forEach(name => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;

        if (field.type === 'radio') {
            const radios = form.querySelectorAll(`[name="${name}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => validateField(name));
            });
        } else if (field.type === 'checkbox') {
            field.addEventListener('change', () => validateField(name));
        } else {
            field.addEventListener('blur', () => validateField(name));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) validateField(name);
                if (name === 'password') updateStrengthMeter(field.value);
            });
        }
    });

    // Form submit
    form.addEventListener('submit', (e) => {
        let isValid = true;
        Object.keys(fields).forEach(name => {
            if (!validateField(name)) isValid = false;
        });
        if (!isValid) e.preventDefault();
    });

    function validateField(name) {
        const config = fields[name];
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return true;

        let value = '';
        let isValid = true;

        if (field.type === 'radio') {
            const checked = form.querySelector(`[name="${name}"]:checked`);
            value = checked ? checked.value : '';
            isValid = !!value;
        } else if (field.type === 'checkbox') {
            isValid = field.checked;
        } else if (field.tagName === 'SELECT') {
            value = field.value;
            isValid = !!value;
        } else {
            value = field.value.trim();
            if (config.required && !value) isValid = false;
            if (value && config.pattern && !config.pattern.test(value)) isValid = false;
            if (name === 'confirmPassword') {
                const pwd = form.querySelector('[name="password"]').value;
                isValid = value === pwd && value.length > 0;
            }
        }

        updateFieldState(field, name, isValid, config.message);
        return isValid;
    }

    function updateFieldState(field, name, isValid, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        // Remove existing error
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) existingError.remove();

        field.classList.remove('invalid', 'valid');
        field.setAttribute('aria-invalid', !isValid);

        if (!isValid) {
            field.classList.add('invalid');
            const error = document.createElement('div');
            error.className = 'error-message';
            error.setAttribute('role', 'alert');
            error.setAttribute('aria-live', 'polite');
            error.textContent = message;
            error.style.cssText = 'color: #f44336; font-size: 0.875rem; margin-top: 0.25rem;';
            formGroup.appendChild(error);
        } else if (field.value || field.checked || (field.tagName === 'SELECT' && field.value)) {
            field.classList.add('valid');
        }
    }

    function createStrengthMeter() {
        const container = document.createElement('div');
        container.className = 'password-strength';
        container.style.cssText = 'margin-top: 0.5rem; display: none;';
        container.innerHTML = `
            <div class="strength-bar" style="height: 4px; background: #e0e0e0; border-radius: 2px; overflow: hidden;">
                <div class="strength-fill" style="height: 100%; width: 0%; transition: width 0.3s, background 0.3s;"></div>
            </div>
            <div class="strength-text" style="font-size: 0.75rem; margin-top: 0.25rem; color: #666;"></div>
        `;
        return container;
    }

    function updateStrengthMeter(password) {
        const meter = document.querySelector('.password-strength');
        if (!meter) return;
        if (!password) { meter.style.display = 'none'; return; }
        meter.style.display = 'block';

        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*]/.test(password)) score++;

        const fill = meter.querySelector('.strength-fill');
        const text = meter.querySelector('.strength-text');
        const colors = ['#f44336', '#ff9800', '#ffeb3b', '#8bc34a', '#4caf50'];
        const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

        fill.style.width = `${(score / 5) * 100}%`;
        fill.style.background = colors[score - 1] || colors[0];
        text.textContent = `Strength: ${labels[score - 1] || labels[0]}`;
        text.style.color = colors[score - 1] || colors[0];
    }
});