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
    const prompt = `You are an elite Virtual CISO consulting for a client. Your job is to output a Board-Level Executive Summary of their security posture.

CLIENT PROFILE:
- Name: ${profile.name}
- Industry: ${profile.industry} (${profile.employees} employees, ${profile.region})
- Operations: ${profile.model} model, Cloud: ${profile.hosting}
- Key Assets: ${profile.dataTypes.join(', ') || 'Standard Business Data'}
- Security Budget: $${profile.securityBudget}/year

SECURITY POSTURE SNAPSHOT:
- Maturity Score: ${maturityScore.overall}% (Industry Avg: ~65%)
- Critical Gaps: ${profile.mfa !== 'mandatory' ? 'Lack of Mandatory MFA' : ''}, ${profile.backupFrequency === 'none' ? 'No Offline Backups' : ''}, ${profile.vulnerabilityScanning === 'never' ? 'No Vuln Scanning' : ''}
- Compliance Needs: ${profile.regulatoryRequirements?.join(', ') || 'Standard Data Protection'}

INSTRUCTIONS:
Write a **Strategic Executive Summary** (3-4 paragraphs) addressed to the Board of Directors.
1.  **Strategic Outlook**: Open with a high-level assessment of their risk posture relative to the ${profile.industry} industry threats.
2.  **Critical Risk Exposure**: Explicitly mention the top 1-2 existential risks (e.g., Ransomware due to no backups, Data Breach due to weak auth). Use financial risk language.
3.  **Forward-Looking Strategy**: Briefly justify the need for immediate investment in the top recommendations to protect revenue and reputation.

TONE: Professional, Authoritative, Concise, Business-Aligned. Avoid generic fluff. Use strong verbs.`;

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
    const gapsSummary = gaps.map(g => `- ${g.category}: ${g.description} (Severity: ${g.severity})`).join('\n');

    const prompt = `You are a Technical Security Architect. Generate 15 precise, actionable recommendations for this client.

CLIENT: ${profile.name} (${profile.industry}, ${profile.employees} employees)
BUDGET: $${profile.securityBudget}/year
MATURITY: ${maturityScore.overall}%

IDENTIFIED GAPS & RISKS:
${gapsSummary}

CRITICAL INSTRUCTIONS:
For EACH recommendation, you MUST provide precise technical details.
- Avoid generic advice like "Implement a tool."
- Instead, say "Deploy CrowdStrike Falcon or SentinelOne" or "Configure AWS CloudTrail with log validation."
- Provide a "Technical Configuration" step (e.g., "Run 'npm audit' in CI/CD").

OUTPUT FORMAT (JSON ONLY):
{
  "recommendations": [
    {
      "id": number,
      "title": "Action-Oriented Title",
      "category": "Management" | "Operational" | "Technical",
      "priority": "Critical" | "High" | "Medium" | "Low",
      "businessImpact": "One sentence on WHY this matters financially/operationally.",
      "steps": ["Step 1: Specific action...", "Step 2: Config/Install...", "Step 3: Validation..."],
      "estimatedCost": {"min": number, "max": number},
      "timeline": "e.g., 2 weeks",
      "resources": {"people": "Roles needed", "tools": "Specific tools/licenses"},
      "successMetrics": ["Metric 1", "Metric 2"],
      "quickWins": ["Immediate action 1"]
    }
  ]
}

Prioritize the Critical gaps first. Ensure the "steps" are technical and granular.`;

    try {
        const response = await callOllama(prompt, {
            temperature: 0.4,
            max_tokens: 6000
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
    const prompt = `You are a compliance consultant. Generate a detailed compliance roadmap for this company.

COMPANY:
- Industry: ${profile.industry}
- Region: ${profile.region}
- Size: ${profile.employees} employees
- Data Types: ${profile.dataTypes.join(', ')}
- Existing Certifications: ${profile.existingCertifications?.join(', ') || 'None'}
- Regulatory Requirements: ${profile.regulatoryRequirements?.join(', ') || 'Not specified'}

Generate a compliance roadmap covering:

1. REQUIRED Regulations (mandatory for their industry/region):
   - List each regulation (GDPR, HIPAA, PCI-DSS, SOC 2, ISO 27001, etc.)
   - Why it applies to them
   - Current gap assessment
   - Timeline to achieve (realistic months)
   - Estimated cost range
   - Business benefits

2. RECOMMENDED Frameworks (industry best practice):
   - Similar format as above
   - Focus on competitive advantage

3. Prioritized Action Plan:
   - Month-by-month roadmap for next 12 months
   - Quick wins (0-3 months)
   - Medium-term goals (3-9 months)
   - Long-term goals (9-12 months)

Be specific to their ${profile.industry} industry and ${profile.region} region. Include actual regulation names and specific requirements.

Format as clear markdown with headers, lists, and tables where appropriate.`;

    return await callOllama(prompt, { temperature: 0.6, max_tokens: 3000 });
}

/**
 * Generate risk quantification with financial impact
 * @param {object} profile - Complete assessment profile
 * @param {array} risks - Identified risk scenarios
 * @returns {Promise<array>} - Risks with financial quantification
 */
export async function quantifyRisks(profile, risks) {
    const risksDescription = risks.map(r => `- ${r.risk}: ${r.impact} impact, ${r.likelihood} likelihood`).join('\n');

    const prompt = `You are a Quantitative Risk Analyst (OpenFAIR methodology). Calculate financial risk exposure.

CONTEXT:
- Company Size: ${profile.employees} employees
- Est. Revenue: $${(profile.employees * 200000).toLocaleString()} (approx)
- Industry: ${profile.industry}
- Data Sensitivity: ${profile.dataTypes.join(', ')}

RISK SCENARIOS TO QUANTIFY:
${risksDescription}

INSTRUCTIONS:
Estimate reasonable financial loss values (ALE) for EACH risk.
- **SLE (Single Loss Expectancy)**: Total cost of one event (Response + Downtime + Fines + Reputation).
- **ARO (Annual Rate of Occurrence)**: Probability of event per year (e.g., 0.1 for once in 10 years, 1.0 for once a year).
- **ALE**: SLE * ARO.
- **ROI**: ((ALE - MitigationCost) / MitigationCost) * 100.

BENCHMARKS (Guide only):
- Ransomware: $500k - $2M range for mid-size.
- Data Breach: $150 per record.
- DDoS: $10k - $50k per hour downtime.

OUTPUT FORMAT (JSON ONLY):
[
  {
    "risk": "Exact Risk Name from list",
    "sle": number (USD),
    "aro": number (0.01 - 3.0),
    "ale": number (USD),
    "mitigationCost": number (USD),
    "roi": number (percentage)
  }
]
`;

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
        const hasModel = data.models?.some(m => m.name.includes('llama3.3'));
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
