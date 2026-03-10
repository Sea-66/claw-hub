/**
 * ClawHub API Module
 * Handles data fetching and ClawHub API integration
 */

const ClawHubAPI = {
    // API base URL
    BASE_URL: 'https://clawhub.ai/api',

    // Local data paths
    PRODUCTS_PATH: 'data/products.json',
    SKILLS_PATH: 'data/skills.json',

    /**
     * Fetch products data from local JSON
     * @returns {Promise<Object>} Products data
     */
    async fetchProducts() {
        try {
            const response = await fetch(this.PRODUCTS_PATH);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Return minimal fallback data
            return {
                products: [],
                categories: [
                    { id: 'all', name: '全部', icon: '🌐' },
                    { id: 'opensource', name: '开源原版', icon: '📖' },
                    { id: 'commercial', name: '国产商业', icon: '🏢' },
                    { id: 'tool', name: '工具/系统', icon: '🛠️' }
                ]
            };
        }
    },

    /**
     * Fetch skills data from local JSON
     * @returns {Promise<Object>} Skills data
     */
    async fetchSkills() {
        try {
            const response = await fetch(this.SKILLS_PATH);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch skills:', error);
            return { skills: [], lastUpdated: null };
        }
    },

    /**
     * Fetch skills from ClawHub API (if available)
     * Note: This is a placeholder for when the API becomes available
     * @returns {Promise<Array>} Skills list
     */
    async fetchSkillsFromAPI() {
        try {
            const response = await fetch(`${this.BASE_URL}/skills`);
            if (!response.ok) {
                console.warn('ClawHub API not available, using local data');
                return [];
            }
            const data = await response.json();
            return data.skills || [];
        } catch (error) {
            console.warn('ClawHub API request failed:', error.message);
            return [];
        }
    },

    /**
     * Fetch skill details from ClawHub API
     * @param {string} skillId - Skill ID
     * @returns {Promise<Object|null>} Skill details
     */
    async fetchSkillDetails(skillId) {
        try {
            const response = await fetch(`${this.BASE_URL}/skills/${skillId}`);
            if (!response.ok) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch skill details:', error);
            return null;
        }
    }
};

// Export for use in other modules
window.ClawHubAPI = ClawHubAPI;
