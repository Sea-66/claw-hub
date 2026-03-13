/**
 * ClawHub Internationalization (i18n)
 * Supports Chinese and English
 */

const i18n = {
    // Current language
    currentLang: localStorage.getItem('clawhub-lang') || 'zh',

    // Translations
    translations: {
        zh: {
            // Meta
            title: 'ClawHub - 龙虾聚合站 | AI Agent 产品导航',
            description: 'ClawHub 是龙虾（OpenClaw）系列 AI Agent 产品的聚合导航站，收录开源原版、国产商业版、工具系统等所有 Claw 系列产品',
            keywords: 'OpenClaw, 龙虾, AI Agent, NanoClaw, QClaw, LobsterAI, AI编程',

            // Header
            siteName: 'ClawHub',
            siteSlogan: '龙虾聚合站',
            searchPlaceholder: '搜索产品...',
            skills: 'Skills',
            community: '养虾交流群',
            themeToggle: '切换主题',
            langToggle: 'EN',

            // Categories
            categories: {
                all: '全部',
                opensource: '开源龙虾',
                commercial: '商业龙虾',
                tool: 'Skills/市场'
            },

            // Stats
            statsProducts: '个产品',
            statsOpensource: '个开源',
            statsCommercial: '个商业',

            // Product card
            visit: '访问',
            noDescription: '暂无描述',
            company: '公司',

            // Type labels
            types: {
                opensource: '开源',
                commercial: '商业',
                tool: 'Skills/市场'
            },

            // Status
            status: {
                '可用': '可用',
                '已开源': '已开源',
                '内测中': '内测中',
                '开发中': '开发中'
            },

            // Empty state
            emptyTitle: '未找到匹配的产品',
            emptyDesc: '尝试其他关键词或清除筛选条件',

            // Modal
            modalTitle: '养虾交流群',
            modalDesc: '扫描二维码加入养虾交流群',
            modalAlt: '飞书群二维码',
            modalScanText: '扫码加入飞书群',

            // Footer
            footerSlogan: 'ClawHub - 让每个人都能找到合适的龙虾',
            footerCopyright: '© 2026 ClawHub. 数据来源于各产品官网及 GitHub，仅供学习参考。',

            // Carousel
            carousel: {
                item1: '🚀 OpenClaw - GitHub 260K+ Stars，功能最完整的 AI Agent 开源项目',
                item2: '💬 QClaw - 腾讯出品，微信直接对话远程操控',
                item3: '☁️ ArkClaw - 火山引擎云端7×24小时在线',
                item4: '🦐 LobsterAI - 网易有道，本地化数据安全',
                item5: '⚡ ZeroClaw - Rust实现，3.4MB极致轻量',
                item6: '🤖 MaxClaw - MiniMax多智能体协作平台',
                item7: '📱 KimiClaw - 月之暗面，长期记忆AI助手'
            }
        },
        en: {
            // Meta
            title: 'ClawHub - AI Agent Directory | OpenClaw Ecosystem',
            description: 'ClawHub is a directory for OpenClaw ecosystem AI Agent products, including open-source versions, commercial versions, tools and more',
            keywords: 'OpenClaw, AI Agent, NanoClaw, QClaw, LobsterAI, AI Programming',

            // Header
            siteName: 'ClawHub',
            siteSlogan: 'AI Agent Directory',
            searchPlaceholder: 'Search products...',
            skills: 'Skills',
            community: 'Community',
            themeToggle: 'Toggle theme',
            langToggle: '中文',

            // Categories
            categories: {
                all: 'All',
                opensource: 'Open Source Lobster',
                commercial: 'Commercial Lobster',
                tool: 'Skills/Market'
            },

            // Stats
            statsProducts: 'Products',
            statsOpensource: 'Open Source',
            statsCommercial: 'Commercial',

            // Product card
            visit: 'Visit',
            noDescription: 'No description',
            company: 'Company',

            // Type labels
            types: {
                opensource: 'Open Source',
                commercial: 'Commercial',
                tool: 'Skills/Market'
            },

            // Status
            status: {
                '可用': 'Available',
                '已开源': 'Open Source',
                '内测中': 'Beta',
                '开发中': 'In Development'
            },

            // Empty state
            emptyTitle: 'No matching products found',
            emptyDesc: 'Try different keywords or clear filters',

            // Modal
            modalTitle: 'Community Group',
            modalDesc: 'Scan QR code to join the community',
            modalAlt: 'Feishu group QR code',
            modalScanText: 'Scan to join Feishu group',

            // Footer
            footerSlogan: 'ClawHub - Find the right AI Agent for you',
            footerCopyright: '© 2026 ClawHub. Data from official websites and GitHub, for reference only.',

            // Carousel
            carousel: {
                item1: '🚀 OpenClaw - GitHub 260K+ Stars, the most complete AI Agent open-source project',
                item2: '💬 QClaw - Tencent, control remotely via WeChat',
                item3: '☁️ ArkClaw - Volcengine, 7x24 cloud service',
                item4: '🦐 LobsterAI - NetEase, local deployment for data security',
                item5: '⚡ ZeroClaw - Rust, 3.4MB ultra-lightweight',
                item6: '🤖 MaxClaw - MiniMax multi-agent collaboration platform',
                item7: '📱 KimiClaw - Moonshot, long-term memory AI assistant'
            }
        }
    },

    /**
     * Get translation by key path (e.g., 'categories.all')
     */
    t(keyPath) {
        const keys = keyPath.split('.');
        let value = this.translations[this.currentLang];

        for (const key of keys) {
            if (value && value[key] !== undefined) {
                value = value[key];
            } else {
                // Fallback to Chinese
                value = this.translations['zh'];
                for (const k of keys) {
                    if (value && value[k] !== undefined) {
                        value = value[k];
                    } else {
                        return keyPath; // Return key if not found
                    }
                }
                break;
            }
        }

        return value;
    },

    /**
     * Get current language
     */
    getLang() {
        return this.currentLang;
    },

    /**
     * Set language
     */
    setLang(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('clawhub-lang', lang);
            return true;
        }
        return false;
    },

    /**
     * Toggle language
     */
    toggleLang() {
        const newLang = this.currentLang === 'zh' ? 'en' : 'zh';
        this.setLang(newLang);
        return newLang;
    },

    /**
     * Get status text (with fallback for English)
     */
    getStatusText(status) {
        if (this.currentLang === 'en') {
            return this.translations.en.status[status] || status;
        }
        return status;
    }
};

// Export for use in other modules
window.i18n = i18n;
