/**
 * ClawHub Main Application
 * Handles rendering, filtering, and UI interactions
 */

(function() {
    'use strict';

    // Application State
    const state = {
        products: [],
        categories: [],
        filteredProducts: [],
        currentCategory: 'all',
        searchQuery: '',
        isLoading: true,
        votes: {} // Store votes { productId: { up: count, down: count, userVote: 'up'|'down'|null } }
    };

    // DOM Elements
    const elements = {
        productsGrid: document.getElementById('productsGrid'),
        categoryTabs: document.getElementById('categoryTabs'),
        searchInput: document.getElementById('searchInput'),
        mobileSearchInput: document.getElementById('mobileSearchInput'),
        themeToggle: document.getElementById('themeToggle'),
        emptyState: document.getElementById('emptyState'),
        totalCount: document.getElementById('totalCount'),
        opensourceCount: document.getElementById('opensourceCount'),
        commercialCount: document.getElementById('commercialCount')
    };

    /**
     * Initialize the application
     */
    async function init() {
        // Initialize theme
        initTheme();

        // Load votes from localStorage
        loadVotes();

        // Load products data
        await loadProducts();

        // Setup event listeners
        setupEventListeners();

        // Initial render
        renderCategories();
        filterAndRender();

        state.isLoading = false;
    }

    /**
     * Load votes from localStorage
     */
    function loadVotes() {
        try {
            const saved = localStorage.getItem('clawhub-votes');
            if (saved) {
                state.votes = JSON.parse(saved);
            }
        } catch (e) {
            state.votes = {};
        }
    }

    /**
     * Save votes to localStorage
     */
    function saveVotes() {
        try {
            localStorage.setItem('clawhub-votes', JSON.stringify(state.votes));
        } catch (e) {
            console.error('Failed to save votes:', e);
        }
    }

    /**
     * Get vote data for a product
     */
    function getVoteData(productId) {
        if (!state.votes[productId]) {
            // Initialize with random votes for demo
            state.votes[productId] = {
                up: Math.floor(Math.random() * 100) + 10,
                userVote: null
            };
        }
        return state.votes[productId];
    }

    /**
     * Handle vote action
     */
    function handleVote(productId) {
        const voteData = getVoteData(productId);

        // Toggle vote
        if (voteData.userVote === 'up') {
            voteData.up--;
            voteData.userVote = null;
        } else {
            voteData.up++;
            voteData.userVote = 'up';
        }

        saveVotes();

        // Update UI
        const voteContainer = document.querySelector(`[data-product-id="${productId}"] .vote-container`);
        if (voteContainer) {
            renderVoteButtons(voteContainer, productId);
        }
    }

    /**
     * Render vote buttons
     */
    function renderVoteButtons(container, productId) {
        const voteData = getVoteData(productId);
        container.innerHTML = `
            <button class="vote-btn ${voteData.userVote === 'up' ? 'upvoted' : ''}"
                    onclick="window.ClawHubApp.handleVote('${productId}')">
                <span class="vote-icon">👍</span>
                <span class="vote-count">${voteData.up}</span>
            </button>
        `;
    }

    /**
     * Initialize theme from localStorage
     */
    function initTheme() {
        const savedTheme = localStorage.getItem('clawhub-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    }

    /**
     * Load products from API
     */
    async function loadProducts() {
        try {
            const data = await ClawHubAPI.fetchProducts();
            state.products = data.products || [];
            state.categories = data.categories || [];
            updateStats();
        } catch (error) {
            console.error('Failed to load products:', error);
            state.products = [];
        }
    }

    /**
     * Update statistics display
     */
    function updateStats() {
        const opensource = state.products.filter(p => p.type === 'opensource').length;
        const commercial = state.products.filter(p => p.type === 'commercial').length;

        elements.totalCount.textContent = state.products.length;
        elements.opensourceCount.textContent = opensource;
        elements.commercialCount.textContent = commercial;
    }

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Theme toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Search inputs
        elements.searchInput.addEventListener('input', handleSearch);
        elements.mobileSearchInput.addEventListener('input', handleSearch);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                elements.searchInput.focus();
            }
        });
    }

    /**
     * Toggle dark/light theme
     */
    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('clawhub-theme', isDark ? 'dark' : 'light');
    }

    /**
     * Handle search input
     * @param {Event} e - Input event
     */
    function handleSearch(e) {
        state.searchQuery = e.target.value.toLowerCase().trim();

        // Sync both search inputs
        if (e.target === elements.searchInput) {
            elements.mobileSearchInput.value = e.target.value;
        } else {
            elements.searchInput.value = e.target.value;
        }

        filterAndRender();
    }

    /**
     * Handle category selection
     * @param {string} categoryId - Selected category ID
     */
    function handleCategorySelect(categoryId) {
        state.currentCategory = categoryId;
        updateCategoryTabs();
        filterAndRender();
    }

    /**
     * Filter products and render
     */
    function filterAndRender() {
        let filtered = [...state.products];

        // Filter by category
        if (state.currentCategory !== 'all') {
            filtered = filtered.filter(p => p.type === state.currentCategory);
        }

        // Filter by search query
        if (state.searchQuery) {
            filtered = filtered.filter(p => {
                const name = p.name.toLowerCase();
                const description = (p.description || '').toLowerCase();
                const tags = (p.tags || []).join(' ').toLowerCase();
                const company = (p.company || '').toLowerCase();

                return name.includes(state.searchQuery) ||
                       description.includes(state.searchQuery) ||
                       tags.includes(state.searchQuery) ||
                       company.includes(state.searchQuery);
            });
        }

        state.filteredProducts = filtered;
        renderProducts();
    }

    /**
     * Render category tabs
     */
    function renderCategories() {
        elements.categoryTabs.innerHTML = state.categories.map(cat => `
            <button
                class="category-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition
                       ${cat.id === state.currentCategory
                           ? 'bg-claw-500 text-white'
                           : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
                data-category="${cat.id}"
            >
                <span class="mr-1">${cat.icon}</span>
                ${cat.name}
            </button>
        `).join('');

        // Add click handlers
        elements.categoryTabs.querySelectorAll('.category-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                handleCategorySelect(btn.dataset.category);
            });
        });
    }

    /**
     * Update category tabs active state
     */
    function updateCategoryTabs() {
        elements.categoryTabs.querySelectorAll('.category-tab').forEach(btn => {
            const isActive = btn.dataset.category === state.currentCategory;
            btn.classList.toggle('bg-claw-500', isActive);
            btn.classList.toggle('text-white', isActive);
            btn.classList.toggle('bg-gray-100', !isActive);
            btn.classList.toggle('dark:bg-gray-700', !isActive);
            btn.classList.toggle('text-gray-700', !isActive);
            btn.classList.toggle('dark:text-gray-300', !isActive);
        });
    }

    /**
     * Render products list
     */
    function renderProducts() {
        if (state.filteredProducts.length === 0) {
            elements.productsGrid.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');

        elements.productsGrid.innerHTML = state.filteredProducts.map((product, index) => `
            <div class="product-bar bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 p-4 fade-in type-${product.type}"
                 data-product-id="${product.id}"
                 style="animation-delay: ${Math.min(index * 30, 300)}ms">
                <div class="flex items-center gap-4">
                    <!-- Vote Buttons -->
                    <div class="vote-container flex flex-col items-center gap-1 flex-shrink-0">
                        <!-- Vote buttons will be rendered here -->
                    </div>

                    <!-- Icon -->
                    <div class="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                        ${product.icon
                            ? `<img src="${product.icon}" alt="${product.name}" class="w-8 h-8 object-contain" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="text-2xl hidden items-center justify-center">🦞</span>`
                            : `<span class="text-2xl">🦞</span>`
                        }
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-bold text-gray-900 dark:text-white">${product.name}</h3>
                            ${product.company ? `<span class="text-xs text-gray-500 dark:text-gray-400">· ${product.company}</span>` : ''}
                            ${product.stars ? `<span class="text-xs text-yellow-500">⭐ ${product.stars}</span>` : ''}
                            ${product.status ? `<span class="text-xs px-2 py-0.5 rounded-full ${getStatusClass(product.status)}">${product.status}</span>` : ''}
                        </div>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                            ${product.description || '暂无描述'}
                        </p>
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${getProductTypeTag(product)}
                            ${(product.tags || []).slice(0, 4).map(tag => `
                                <span class="tag px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Button -->
                    <a href="${product.installUrl || product.url}"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="install-btn inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                              bg-claw-500 hover:bg-claw-600 text-white transition flex-shrink-0">
                        ${product.type === 'commercial' ? '访问' : '安装'}
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                </div>
            </div>
        `).join('');

        // Render vote buttons for each product
        state.filteredProducts.forEach(product => {
            const container = document.querySelector(`[data-product-id="${product.id}"] .vote-container`);
            if (container) {
                renderVoteButtons(container, product.id);
            }
        });
    }

    /**
     * Get product type tag HTML
     * @param {Object} product - Product data
     * @returns {string} Tag HTML
     */
    function getProductTypeTag(product) {
        const typeConfig = {
            opensource: { label: '开源', class: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' },
            commercial: { label: '商业', class: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' },
            tool: { label: '工具', class: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' }
        };

        const config = typeConfig[product.type] || typeConfig.tool;
        return `<span class="tag px-2 py-0.5 text-xs rounded-full ${config.class}">${config.label}</span>`;
    }

    /**
     * Get status badge class
     * @param {string} status - Product status
     * @returns {string} CSS classes
     */
    function getStatusClass(status) {
        const statusMap = {
            '可用': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 status-available',
            '已开源': 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
            '内测中': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
            '开发中': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
        };
        return statusMap[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions to window for onclick handlers
    window.ClawHubApp = {
        handleVote
    };
})();
