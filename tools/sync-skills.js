/**
 * ClawHub Skills Sync Script
 * Fetches skills from ClawHub API and saves to local JSON
 *
 * Usage: node tools/sync-skills.js
 *
 * Environment variables:
 * - CLAWHUB_API_URL: Override default API URL
 * - CLAWHUB_API_KEY: API key for authenticated requests (optional)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    apiUrl: process.env.CLAWHUB_API_URL || 'https://clawhub.ai/api',
    apiKey: process.env.CLAWHUB_API_KEY || null,
    outputPath: path.join(__dirname, '../data/skills.json'),
    timeout: 30000
};

/**
 * Make HTTP request
 * @param {string} url - Request URL
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response data
 */
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        const reqOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'ClawHub-Sync/1.0',
                ...(CONFIG.apiKey && { 'Authorization': `Bearer ${CONFIG.apiKey}` }),
                ...options.headers
            },
            timeout: CONFIG.timeout
        };

        const req = client.request(reqOptions, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error(`Invalid JSON response: ${e.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

/**
 * Fetch all skills from ClawHub API
 * @returns {Promise<Array>} Skills list
 */
async function fetchAllSkills() {
    console.log(`Fetching skills from ${CONFIG.apiUrl}/skills...`);

    try {
        const response = await makeRequest(`${CONFIG.apiUrl}/skills`);
        return response.skills || response.data || response || [];
    } catch (error) {
        console.warn(`Warning: Failed to fetch from API: ${error.message}`);
        console.log('Using empty skills list as fallback.');
        return [];
    }
}

/**
 * Fetch detailed skill information
 * @param {string} skillId - Skill ID
 * @returns {Promise<Object|null>} Skill details
 */
async function fetchSkillDetails(skillId) {
    try {
        const response = await makeRequest(`${CONFIG.apiUrl}/skills/${skillId}`);
        return response.skill || response.data || response;
    } catch (error) {
        console.warn(`Warning: Failed to fetch skill ${skillId}: ${error.message}`);
        return null;
    }
}

/**
 * Transform skill data to standard format
 * @param {Object} skill - Raw skill data
 * @returns {Object} Standardized skill data
 */
function transformSkill(skill) {
    return {
        id: skill.id || skill.slug || skill.name?.toLowerCase().replace(/\s+/g, '-'),
        name: skill.name || skill.title,
        description: skill.description || skill.summary || '',
        category: skill.category || skill.type || 'general',
        author: skill.author || skill.developer || 'Unknown',
        version: skill.version || '1.0.0',
        rating: skill.rating || skill.score || null,
        downloads: skill.downloads || skill.installCount || null,
        tags: skill.tags || [],
        url: skill.url || skill.link || null,
        installUrl: skill.installUrl || skill.install_link || null,
        createdAt: skill.createdAt || skill.created_at || null,
        updatedAt: skill.updatedAt || skill.updated_at || null
    };
}

/**
 * Save skills to JSON file
 * @param {Array} skills - Skills list
 */
function saveSkills(skills) {
    const data = {
        skills: skills,
        lastUpdated: new Date().toISOString(),
        source: 'clawhub.ai',
        count: skills.length
    };

    // Ensure directory exists
    const dir = path.dirname(CONFIG.outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
        CONFIG.outputPath,
        JSON.stringify(data, null, 2),
        'utf-8'
    );

    console.log(`Saved ${skills.length} skills to ${CONFIG.outputPath}`);
}

/**
 * Main sync function
 */
async function main() {
    console.log('=== ClawHub Skills Sync ===');
    console.log(`Start time: ${new Date().toISOString()}`);
    console.log();

    try {
        // Fetch all skills
        const rawSkills = await fetchAllSkills();
        console.log(`Fetched ${rawSkills.length} skills from API`);

        // Transform skills
        const skills = rawSkills.map(transformSkill);
        console.log(`Transformed ${skills.length} skills`);

        // Optionally fetch details for each skill (commented out to avoid rate limits)
        // for (const skill of skills) {
        //     const details = await fetchSkillDetails(skill.id);
        //     if (details) {
        //         Object.assign(skill, transformSkill(details));
        //     }
        // }

        // Save to file
        saveSkills(skills);

        console.log();
        console.log('=== Sync Complete ===');
        console.log(`End time: ${new Date().toISOString()}`);

        // Exit with success
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

// Run main function
main();
