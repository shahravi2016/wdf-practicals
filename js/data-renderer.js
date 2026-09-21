// StudentHub - JSON Data Renderer with Search, Filter, Sort, Pagination (P6)

class DataRenderer {
    constructor(options = {}) {
        this.dataUrl = options.dataUrl;
        this.containerSelector = options.containerSelector;
        this.templateFn = options.templateFn;
        this.searchSelector = options.searchSelector || '#search-input';
        this.filterSelector = options.filterSelector || '#filter-select';
        this.sortSelector = options.sortSelector || '#sort-select';
        this.paginationSelector = options.paginationSelector || '#pagination';
        this.itemsPerPage = options.itemsPerPage || 10;
        this.filterKey = options.filterKey || 'category';
        this.searchKeys = options.searchKeys || ['title', 'description', 'name', 'email', 'course'];
        this.emptyMessage = options.emptyMessage || 'No items found.';
        this.loadingMessage = options.loadingMessage || 'Loading...';
        this.errorMessage = options.errorMessage || 'Failed to load data.';

        this.allData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.currentSearch = '';
        this.currentFilter = 'all';
        this.currentSort = 'default';

        this.init();
    }

    async init() {
        this.container = document.querySelector(this.containerSelector);
        this.searchInput = document.querySelector(this.searchSelector);
        this.filterSelect = document.querySelector(this.filterSelector);
        this.sortSelect = document.querySelector(this.sortSelector);
        this.paginationContainer = document.querySelector(this.paginationSelector);

        if (!this.container) return;

        await this.loadData();
        this.bindEvents();
        this.render();
    }

    async loadData() {
        this.showLoading();
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            this.allData = Object.values(result)[0] || [];
            this.filteredData = [...this.allData];
            this.populateFilters();
        } catch (err) {
            this.showError(err.message);
            console.error('DataRenderer error:', err);
        }
    }

    showLoading() {
        this.container.innerHTML = `<div class="loading">${this.loadingMessage}</div>`;
    }

    showError(msg) {
        this.container.innerHTML = `<div class="error">${msg}</div>`;
    }

    populateFilters() {
        if (!this.filterSelect) return;
        const categories = [...new Set(this.allData.map(item => item[this.filterKey]).filter(Boolean))];
        this.filterSelect.innerHTML = '<option value="all">All Categories</option>' +
            categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }

    bindEvents() {
        if (this.searchInput) {
            let debounceTimer;
            this.searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.currentSearch = e.target.value.toLowerCase().trim();
                    this.currentPage = 1;
                    this.applyFilters();
                }, 300);
            });
        }

        if (this.filterSelect) {
            this.filterSelect.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }

        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let data = [...this.allData];

        // Search
        if (this.currentSearch) {
            data = data.filter(item => this.searchKeys.some(key => {
                const value = item[key];
                return value && String(value).toLowerCase().includes(this.currentSearch);
            }));
        }

        // Filter
        if (this.currentFilter !== 'all') {
            data = data.filter(item => item[this.filterKey] === this.currentFilter);
        }

        // Sort
        data = this.sortData(data);

        this.filteredData = data;
        this.render();
    }

    sortData(data) {
        const sorted = [...data];
        switch (this.currentSort) {
            case 'name-asc':
                return sorted.sort((a, b) => String(a.title || a.name || '').localeCompare(String(b.title || b.name || '')));
            case 'name-desc':
                return sorted.sort((a, b) => String(b.title || b.name || '').localeCompare(String(a.title || a.name || '')));
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0));
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date || b.createdAt || 0) - new Date(a.date || a.createdAt || 0));
            default:
                return sorted;
        }
    }

    render() {
        if (!this.container) return;

        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (this.currentPage > totalPages) this.currentPage = totalPages || 1;

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const pageData = this.filteredData.slice(start, start + this.itemsPerPage);

        if (pageData.length === 0) {
            this.container.innerHTML = `<div class="empty">${this.emptyMessage}</div>`;
            this.renderPagination(totalPages);
            return;
        }

        this.container.innerHTML = pageData.map(item => this.templateFn(item)).join('');
        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        if (!this.paginationContainer || totalPages <= 1) {
            if (this.paginationContainer) this.paginationContainer.innerHTML = '';
            return;
        }

        let html = '<nav class="pagination" aria-label="Pagination"><ul>';
        html += `<li><button ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}" aria-label="Previous">‹</button></li>`;

        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        if (startPage > 1) {
            html += `<li><button data-page="1">1</button></li>`;
            if (startPage > 2) html += `<li><span class="ellipsis">…</span></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li><button class="${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button></li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += `<li><span class="ellipsis">…</span></li>`;
            html += `<li><button data-page="${totalPages}">${totalPages}</button></li>`;
        }

        html += `<li><button ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}" aria-label="Next">›</button></li>`;
        html += '</ul></nav>';

        this.paginationContainer.innerHTML = html;

        this.paginationContainer.querySelectorAll('button[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page, 10);
                if (!isNaN(page) && page !== this.currentPage && page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.render();
                    window.scrollTo({ top: this.container.offsetTop - 100, behavior: 'smooth' });
                }
            });
        });
    }
}

// Auto-initialize on pages with data-renderer attribute
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-renderer]').forEach(el => {
        const config = JSON.parse(el.dataset.renderer);
        new DataRenderer(config);
    });
});

// Export for manual initialization
window.DataRenderer = DataRenderer;