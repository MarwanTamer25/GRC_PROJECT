// AI Engine for GRC Report Generation using Ollama (Llama 3.3:70b)
// This module handles all AI-powered report generation

// Use Vite proxy to avoid CORS issues (routes through localhost:5173/api/ollama)
const OLLAMA_API_URL = '/api/ollama/api/generate';
const MODEL_NAME = 'llama3.1:8b'; // Using installed model for testing (switch to llama3.3:70b when available)

/**
 * Core function to call Ollama API with timeout protection
 * @param {string} prompt - The prompt to send to the model
 * @param {object} options - Additional options (temperature, max tokens, etc.)
 * @returns {Promise<string>} - Generated text from the model
 */
async function callOllama(prompt, options = {}) {
    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options.timeout || 60000); // 60 second default

        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: prompt,
                stream: false,
                options: {
                    temperature: options.temperature || 0.7,
                    top_p: options.top_p || 0.9,
                    num_predict: options.max_tokens || 2000,
                    ...options
                }
            })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.response) {
            throw new Error('Empty response from Ollama');
        }

        return data.response;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Ollama API timeout after', options.timeout || 60000, 'ms');
            throw new Error(`AI generation timed out. The model may be loading or busy. Please try again.`);
        }
        console.error('Ollama API Error:', error);
        throw new Error(`AI generation failed: ${error.message}. Is Ollama running?`);
    }
}

/**
 * Generate executive summary based on company profile
 * @param {object} profile - Complete assessment profile
 * @param {object} maturityScore - Calculated maturity scores
 * @returns {Promise<string>} - AI-generated executive summary
 */
export async function generateExecutiveSummary(profile, maturityScore) {
    const prompt = `You are a Virtual CISO advising the Board of Directors. 
    Review the following client profile and security posture.
    
    CLIENT PROFILE:
    - Name: ${profile.name}
    - Industry: ${profile.industry} (${profile.employees} employees)
    - Critical Assets: ${profile.dataTypes.join(', ') || 'Business Data'}
    
    SECURITY POSTURE:
    - Overall Maturity Score: ${maturityScore.overall}% (Industry Avg: ~65%)
    - Governance Score: ${maturityScore.governance}%
    - Technical Score: ${maturityScore.technical}%
    - Critical Gaps: ${profile.mfa !== 'mandatory' ? 'No Mandatory MFA' : ''}, ${profile.backupFrequency === 'none' ? 'No Disaster Recovery' : ''}

    INSTRUCTIONS:
    Write a "Bottom Line Up Front" (BLUF) Executive Summary (approx 300 words).
    
    Structure:
    1.  **Strategic Risk Assessment**: Start with a direct statement on their risk exposure (e.g., "Critical Exposure", "Moderate Risk"). Connect it to their industry (${profile.industry}).
    2.  **Financial & Operational Impact**: Explain the *business impact* of their top gaps. Use terms like "Revenue Risk", "Operational Downtime", "Regulatory Fines". Avoid purely technical jargon.
    3.  **Forward-Looking Guidance**: Recommend a strategic focus for the next 12 months (e.g., "Shift focus from prevention to resilience").

    TONE: Authoritative, Concise, Board-Ready. No fluff.`;

    return await callOllama(prompt, { temperature: 0.6, max_tokens: 1000 });
}

/**
 * Generate detailed, actionable recommendations
 * @param {object} profile - Complete assessment profile
 * @param {array} gaps - Identified security gaps
 * @param {object} maturityScore - Calculated maturity scores
 * @returns {Promise<object>} - AI-generated recommendations in JSON format
 */
export async function generateRecommendations(profile, gaps, maturityScore) {
    const gapsSummary = gaps.map(g => `- [${g.category}] ${g.description} (Severity: ${g.severity})`).join('\n');

    const prompt = `You are a Lead Security Architect.
    Generate 12 highly specific, technical recommendations based on these gaps.

    CLIENT CONTEXT:
    - Industry: ${profile.industry}
    - Size: ${profile.employees}
    - Budget: Simple/Limited if <50 employees, Enterprise if >500.

    IDENTIFIED GAPS:
    ${gapsSummary}

    INSTRUCTIONS:
    Output strictly valid JSON.
    For each recommendation:
    1.  **Title**: Use specific architectural patterns (e.g., "Implement ZTNA", "Deploy SASE", "Enable DLP").
    2.  **Steps**: Provide 3 granular steps. Step 1 must be a specific configuration or tool selection.
    3.  **Impact**: Explain the financial/security benefit.
    
    JSON STRUCTURE:
    {
      "recommendations": [
        {
          "title": "Short Actionable Title",
          "category": "Technical" | "Governance" | "Operational",
          "priority": "Critical" | "High" | "Medium",
          "businessImpact": "Why this matters to the business",
          "steps": ["Step 1", "Step 2", "Step 3"],
          "difficulty": "Low" | "Medium" | "High",
          "estimatedCost": { "min": number, "max": number }
        }
      ]
    }`;

    try {
        const response = await callOllama(prompt, {
            temperature: 0.4,
            max_tokens: 4000
        });

        // Parse JSON response
        const parsed = JSON.parse(response);
        return parsed;
    } catch (error) {
        console.error('Error parsing AI recommendations:', error);
        // Return fallback structure
        return {
            recommendations: []
        };
    }
}

/**
 * Generate industry-specific compliance roadmap
 * @param {object} profile - Complete assessment profile
 * @returns {Promise<string>} - AI-generated compliance roadmap in markdown
 */
export async function generateComplianceRoadmap(profile) {
    const prompt = `You are a Senior GRC Consultant.
    Create a Compliance Roadmap for a ${profile.industry} company in ${profile.region}.
    
    DATA PROFILE:
    - Types: ${profile.dataTypes.join(', ')}
    - Existing: ${profile.complianceFrameworks?.join(', ') || 'None'}

    INSTRUCTIONS:
    Output Markdown formatted text.
    
    Section 1: **Mandatory Regulatory Requirements**
    - List laws/regulations that legitimately apply (e.g., GDPR, HIPAA, PCI-DSS).
    - For each, state the "Must-Do" immediate action.
    
    Section 2: **Strategic Frameworks (Competitive Advantage)**
    - Recommend frameworks like SOC 2 or ISO 27001 only if they add business value (sales enablement).
    
    Section 3: **12-Month Timeline**
    - Q1: Immediate Fixes
    - Q2: Audit Prep
    - Q3: Certification
    - Q4: Maintenance
    
    Force "Must Have" vs "Nice to Have" distinction.`;

    return await callOllama(prompt, { temperature: 0.5, max_tokens: 2000 });
}

/**
 * Generate risk quantification with financial impact
 * @param {object} profile - Complete assessment profile
 * @param {array} risks - Identified risk scenarios
 * @returns {Promise<array>} - Risks with financial quantification
 */
export async function quantifyRisks(profile, risks) {
    const riskList = risks.map(r => r.risk).join(', ');

    const prompt = `You are an OpenFAIR Risk Analyst.
    Calculate Annual Loss Expectancy (ALE) for these risks: ${riskList}.
    
    CONTEXT:
    - Company Revenue: ~$${(profile.employees * 150000).toLocaleString()}
    - Industry: ${profile.industry}
    
    INSTRUCTIONS:
    Return JSON array.
    For each risk, estimate:
    - SLE: Single Loss Expectancy (reasonable worst case).
    - ARO: Annual Rate of Occurrence (probability 0.0-1.0).
    - ALE: SLE * ARO.
    - MitigationCost: Est. cost to fix.
    - ROI: Return on Investment %.

    JSON:
    [
        { "risk": "Name", "sle": 10000, "aro": 0.5, "ale": 5000, "mitigationCost": 1000, "roi": 400 }
    ]`;

    try {
        const response = await callOllama(prompt, {
            temperature: 0.3, // Lower temperature for math/logic consistency
            max_tokens: 2000
        });
        return JSON.parse(response);
    } catch (error) {
        console.error('Error quantifying risks:', error);
        return [];
    }
}

/**
 * Check if Ollama is running and model is available
 * @returns {Promise<boolean>} - True if Ollama is ready
 */
export async function checkOllamaStatus() {
    try {
        const response = await fetch('http://localhost:11434/api/tags');
        if (!response.ok) return false;

        const data = await response.json();
        const hasModel = data.models?.some(m => m.name.includes('llama3.3') || m.name.includes('llama3'));
        return hasModel;
    } catch (error) {
        return false;
    }
}

export default {
    generateExecutiveSummary,
    generateRecommendations,
    generateComplianceRoadmap,
    quantifyRisks,
    checkOllamaStatus
};
