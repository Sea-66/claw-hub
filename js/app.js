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
        votes: {}, // Store votes { productId: { up: count, down: count, userVote: 'up'|'down'|null } }
        carouselIndex: 0,
        carouselInterval: null,
    };

    // DOM Elements
    const elements = {
        productsGrid: document.getElementById('productsGrid'),
        categoryTabs: document.getElementById('categoryTabs'),
        searchInput: document.getElementById('searchInput'),
        mobileSearchInput: document.getElementById('mobileSearchInput'),
        themeToggle: document.getElementById('themeToggle'),
        emptyState: document.getElementById('emptyState'),
        statsBar: document.getElementById('statsBar'),
        communityBtn: document.getElementById('communityBtn'),
        qrModal: document.getElementById('qrModal'),
        closeModal: document.getElementById('closeModal')
    };

    /**
     * Initialize the application
     */
    async function init() {
        // Show loading state
        elements.productsGrid.innerHTML = '<div class="text-center py-8"><span class="text-4xl">🦞</span><p class="text-gray-500 dark:text-gray-400 mt-2">加载中...</p></div>';

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

        // Start carousel
        startCarousel();

        state.isLoading = false;
    }

    /**
     * Start stats carousel
     */
    function startCarousel() {
        // Clear existing interval
        if (state.carouselInterval) {
            clearInterval(state.carouselInterval);
        }

        const total = state.products.length;
        const opensource = state.products.filter(p => p.type === 'opensource').length;
        const commercial = state.products.filter(p => p.type === 'commercial').length;

        const carouselItems = [
            // Stats
            `<div class="flex items-center justify-center space-x-8 text-sm">
                <span class="flex items-center"><span class="font-bold">${total}</span><span class="ml-1 opacity-80">个产品</span></span>
                <span class="flex items-center"><span class="font-bold">${opensource}</span><span class="ml-1 opacity-80">个开源</span></span>
                <span class="flex items-center"><span class="font-bold">${commercial}</span><span class="ml-1 opacity-80">个商业</span></span>
            </div>`,
            // Product intros
            `<span class="text-sm">🚀 OpenClaw - GitHub 260K+ Stars，功能最完整的 AI Agent 开源项目</span>`,
            `<span class="text-sm">💬 QClaw - 腾讯出品，微信直接对话远程操控</span>`,
            `<span class="text-sm">☁️ ArkClaw - 火山引擎云端7×24小时在线</span>`,
            `<span class="text-sm">🦐 LobsterAI - 网易有道，本地化数据安全</span>`,
            `<span class="text-sm">⚡ ZeroClaw - Rust实现，3.4MB极致轻量</span>`,
            `<span class="text-sm">🤖 MaxClaw - MiniMax多智能体协作平台</span>`,
            `<span class="text-sm">📱 KimiClaw - 月之暗面，长期记忆AI助手</span>`
        ];

        function updateCarousel() {
            const item = carouselItems[state.carouselIndex % carouselItems.length];
            elements.statsBar.innerHTML = item;
            state.carouselIndex++;
        }

        updateCarousel();
        state.carouselInterval = setInterval(updateCarousel, 4000);
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
            console.log('Loaded products:', state.products.length);
            updateStats();
        } catch (error) {
            console.error('Failed to load products:', error);
            state.products = [];
            // Show error message
            elements.productsGrid.innerHTML = '<div class="text-center py-8"><span class="text-4xl">❌</span><p class="text-red-500 mt-2">数据加载失败，请刷新页面重试</p><p class="text-gray-400 text-sm mt-1">请确保通过 HTTP 服务器访问此页面</p></div>';
        }
    }

    /**
     * Update statistics display (now handled by carousel)
     */
    function updateStats() {
        // Stats are now displayed via carousel
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

        // Community button - QR modal
        if (elements.communityBtn) {
            elements.communityBtn.addEventListener('click', openQRModal);
        }

        // Close modal
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', closeQRModal);
        }

        // Close modal on backdrop click
        if (elements.qrModal) {
            elements.qrModal.addEventListener('click', (e) => {
                if (e.target === elements.qrModal) {
                    closeQRModal();
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                elements.searchInput.focus();
            }
            // Escape to close modal
            if (e.key === 'Escape' && !elements.qrModal.classList.contains('hidden')) {
                closeQRModal();
            }
        });
    }

    /**
     * Open QR code modal
     */
    function openQRModal() {
        elements.qrModal.classList.remove('hidden');
        elements.qrModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close QR code modal
     */
    function closeQRModal() {
        elements.qrModal.classList.add('hidden');
        elements.qrModal.classList.remove('flex');
        document.body.style.overflow = '';
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

        // Sort: OpenClaw first, then ClawHub, then other featured products,
        // then other commercial, then opensource, then tools
        const featuredProductIds = ['miaoda', 'deskclaw', 'duclaw'];
        filtered.sort((a, b) => {
            if (a.id === 'openclaw') return -1;
            if (b.id === 'openclaw') return 1;
            if (a.id === 'clawhub') return -1;
            if (b.id === 'clawhub') return 1;
            if (featuredProductIds.includes(a.id) && !featuredProductIds.includes(b.id)) return -1;
            if (featuredProductIds.includes(b.id) && !featuredProductIds.includes(a.id)) return 1;
            if (a.type === 'commercial' && b.type !== 'commercial') return -1;
            if (b.type === 'commercial' && a.type !== 'commercial') return 1;
            if (a.type === 'opensource' && b.type === 'tool') return -1;
            if (b.type === 'opensource' && a.type === 'tool') return 1;
            return 0;
        });

        state.filteredProducts = filtered;
        renderProducts();
    }

    /**
     * Render category tabs
     */
    function renderCategories() {
        const categoryNames = {
            all: '全部',
            opensource: '开源龙虾',
            commercial: '商业龙虾',
            tool: 'Skills/市场'
        };

        elements.categoryTabs.innerHTML = state.categories.map(cat => `
            <button
                class="category-tab px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition
                       ${cat.id === state.currentCategory
                           ? 'bg-claw-500 text-white'
                           : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
                data-category="${cat.id}"
            >
                <span class="mr-0.5 sm:mr-1">${cat.icon}</span>
                ${categoryNames[cat.id] || cat.name}
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
        console.log('renderProducts called, filtered products:', state.filteredProducts.length);

        if (state.filteredProducts.length === 0) {
            elements.productsGrid.innerHTML = '';
            elements.emptyState.classList.remove('hidden');
            return;
        }

        elements.emptyState.classList.add('hidden');
        console.log('Rendering products to grid...');

        elements.productsGrid.innerHTML = state.filteredProducts.map((product, index) => {
            // Get description
            const description = product.description || '暂无描述';

            // Get status
            const status = product.status || '';

            // Check if featured (OpenClaw)
            const isFeatured = product.id === 'openclaw';
            const featuredClass = isFeatured ? 'product-featured' : '';

            return `
            <a href="${product.installUrl || product.url}"
               target="_blank"
               rel="noopener noreferrer"
               class="product-bar block bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 p-3 sm:p-4 fade-in type-${product.type} ${featuredClass} cursor-pointer"
               data-product-id="${product.id}"
               style="animation-delay: ${Math.min(index * 30, 300)}ms">
                ${isFeatured ? '<span class="featured-badge">原版</span>' : ''}
                <div class="flex items-center gap-2 sm:gap-4">
                    <!-- Vote Buttons - Hidden on mobile -->
                    <div class="vote-container hidden sm:flex flex-col items-center gap-1 flex-shrink-0" onclick="event.preventDefault(); event.stopPropagation();">
                        <!-- Vote buttons will be rendered here -->
                    </div>

                    <!-- Icon -->
                    <div class="${isFeatured ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-10 h-10 sm:w-12 sm:h-12'} flex items-center justify-center rounded-lg bg-white overflow-hidden flex-shrink-0">
                        ${product.icon
                            ? `<img src="${product.icon}" alt="${product.name}" class="${isFeatured ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-6 h-6 sm:w-8 sm:h-8'} object-contain" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="text-xl sm:text-2xl hidden items-center justify-center">🦞</span>`
                            : `<span class="text-xl sm:text-2xl">🦞</span>`
                        }
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <h3 class="font-bold text-sm sm:text-base text-gray-900 dark:text-white">${product.name}</h3>
                            ${product.company ? `<span class="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">· ${product.company}</span>` : ''}
                            ${product.stars ? `<span class="text-xs text-yellow-500">⭐ ${product.stars}</span>` : ''}
                            ${status ? `<span class="text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${getStatusClass(product.status)}">${status}</span>` : ''}
                        </div>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                            ${description}
                        </p>
                        <div class="flex flex-wrap gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">
                            ${getProductTypeTag(product)}
                            ${(product.tags || []).slice(0, 3).map(tag => `
                                <span class="tag px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Button - Hidden on mobile -->
                    <span class="install-btn hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
                              bg-claw-500 hover:bg-claw-600 text-white transition flex-shrink-0">
                        访问
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </span>

                    <!-- Mobile Arrow -->
                    <svg class="sm:hidden w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </a>
        `}).join('');

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
            opensource: {
                label: '开源',
                class: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
            },
            commercial: {
                label: '商业',
                class: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
            },
            tool: {
                label: 'Skills/市场',
                class: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
            }
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
