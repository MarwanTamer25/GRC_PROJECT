// Enhanced GRC Report Generation Engine
// Integrates AI-powered analysis, weighted scoring, and industry benchmarking

import { calculateMaturityScore, identifyGaps } from './scoringFramework';
import { getBenchmarkComparison } from './benchmarks';
import {
    generateExecutiveSummary,
    generateRecommendations,
    generateComplianceRoadmap,
    quantifyRisks
} from './aiEngine';

/**
 * Main report generation function
 * Now AI-powered with Llama 3.3:70b
 * @param {object} profile - Complete assessment profile
 * @returns {Promise<object>} - Comprehensive GRC report
 */
export async function generateReport(profile) {
    console.log('🚀 Generating AI-powered GRC report...');

    //  1. Calculate industry-weighted maturity scores
    console.log('📊 Calculating maturity scores with industry weights...');
    const maturity = calculateMaturityScore(profile);

    // 2. Get industry benchmarks & comparison
    // Pass overall score to benchmark engine
    const benchmarks = getBenchmarkComparison(profile, maturity.overall);

    // 3. Identify security gaps
    console.log('🔍 Identifying security gaps...');
    const gaps = identifyGaps(profile, maturity);

    // 4. Generate risk scenarios
    console.log('⚠️  Generating risk scenarios...');
    const baseRisks = generateBaseRisks(profile);

    // 5. AI: Generate executive summary
    console.log('🤖 Generating AI-powered executive summary...');
    let executiveSummary = '';
    try {
        executiveSummary = await generateExecutiveSummary(profile, maturity);
    } catch (error) {
        console.warn('AI executive summary failed, using fallback:', error.message);
        executiveSummary = generateFallbackSummary(profile, maturity, gaps);
    }

    // 6. AI: Generate detailed recommendations
    console.log('🎯 Generating AI-powered actionable recommendations...');
    let aiRecommendations = [];
    try {
        const result = await generateRecommendations(profile, gaps, maturity);
        aiRecommendations = result.recommendations || [];
    } catch (error) {
        console.warn('AI recommendations failed, using fallback:', error.message);
        aiRecommendations = generateFallbackRecommendations(gaps, profile);
    }

    // 7. AI: Generate compliance roadmap
    console.log('📜 Generating compliance roadmap...');
    let complianceRoadmap = '';
    try {
        complianceRoadmap = await generateComplianceRoadmap(profile);
    } catch (error) {
        console.warn('AI compliance roadmap failed, using fallback:', error.message);
        complianceRoadmap = generateFallbackComplianceRoadmap(profile);
    }

    // 8. AI: Quantify risks with financial impact
    console.log('💰 Calculating financial risk exposure (ALE)...');
    let quantifiedRisks = [];
    try {
        quantifiedRisks = await quantifyRisks(profile, baseRisks);
    } catch (error) {
        console.warn('AI risk quantification failed, using base risks:', error.message);
        quantifiedRisks = baseRisks.map((r) => ({
            risk: r.risk,
            sle: 0,
            aro: 0,
            ale: 0,
            mitigationCost: 0,
            roi: 0
        }));
    }

    console.log('✅ Report generation complete!');

    // Return comprehensive report data
    return {
        // AI-Generated Content
        executiveSummary,
        recommendations: aiRecommendations,
        complianceRoadmap,

        // Calculated Scores
        maturity,
        benchmarks,
        gaps,

        // Risk Analysis
        risks: baseRisks,
        quantifiedRisks,

        // Local Methodology Data
        methodology: generateMethodologyOverview(),

        // Structured Sections Data (for UI rendering)
        sections: {
            governance: { score: maturity.governance, title: maturity.labels.governance },
            risk: { score: maturity.risk, title: maturity.labels.risk },
            compliance: { score: maturity.compliance, title: maturity.labels.compliance },
            technical: { score: maturity.technical, title: maturity.labels.technical },
            application: { score: maturity.application, title: maturity.labels.application },
            operational: { score: maturity.operational, title: maturity.labels.operational }
        }
    };
}

// Risk Scales Definitions
const LIKELIHOOD_SCALE = {
    1: "Rare",
    2: "Unlikely",
    3: "Possible",
    4: "Likely",
    5: "Almost Certain"
};

const CONSEQUENCE_SCALE = {
    1: "Insignificant",
    2: "Minor",
    3: "Moderate",
    4: "Major",
    5: "Catastrophic",
    6: "Doomsday"
};

function getRiskLevel(score) {
    if (score >= 25) return "Extreme";
    if (score >= 15) return "High";
    if (score >= 6) return "Medium";
    return "Low";
}

function generateMethodologyOverview() {
    return {
        title: "Six-Pillar Security Framework",
        executiveSummary: "This assessment evaluates the organization's security posture across six critical dimensions: Governance, Risk, Compliance, Technical Security, Application Security, and Operational Security. It utilizes industry-standard weighting and scoring to provide an actionable roadmap.",
        framework: "Standardized GRC Maturity Model",
        principles: [
            { term: "Holistic", desc: "Covering people, process, and technology." },
            { term: "Risk-Based", desc: "Prioritizing remediation based on potential business impact." },
            { term: "Defensible", desc: "Aligning with recognized standards like NIST CSF and ISO 27001." }
        ],
        controls: ["Strategic", "Tactical", "Operational"]
    };
}

/**
 * Generate base risks using simplified profile checks
 */
function generateBaseRisks(profile) {
    const pool = [];
    let idCounter = 1;

    const addToPool = (risk, likelihoodScore, consequenceScore, mitigation) => {
        const score = likelihoodScore * consequenceScore;
        pool.push({
            id: `R${idCounter++}`, // Will need re-indexing
            risk,
            likelihoodScore,
            likelihoodLabel: LIKELIHOOD_SCALE[likelihoodScore],
            consequenceScore,
            consequenceLabel: CONSEQUENCE_SCALE[consequenceScore],
            score,
            level: getRiskLevel(score),
            mitigation
        });
    };

    // --- Profile-Based Risks ---

    // Remote
    if (profile.remote === 'yes') {
        addToPool(
            "Remote Endpoint Compromise",
            profile.mfa === 'mandatory' ? 2 : 4,
            4,
            "Enforce Endpoint Encryption, VPN, and Mandatory MFA"
        );
    }

    // Cloud
    if (profile.hosting === 'cloud') {
        addToPool(
            "Cloud Misconfiguration / Data Leak",
            3,
            5,
            "CSPM, Regular automated audits"
        );
    }

    // Ransomware (Backup checks)
    if (profile.backupFrequency === 'none') {
        addToPool("Ransomware Data Loss", 5, 6, "Implement 3-2-1 Backup Strategy immediately");
    } else {
        addToPool("Ransomware Operational Impact", 3, 4, "Test Restore Procedures");
    }

    // Auth
    if (profile.mfa === 'none') {
        addToPool("Credential Reuse / Brute Force", 5, 4, "Implement MFA for all accesses");
    }

    // Encryption
    if (profile.encryption === 'no') {
        addToPool("Data Theft in Transit/Rest", 3, 5, "Enable full disk encryption and TLS 1.3");
    }

    // Incident Response
    if (profile.incidentResponsePlan === 'no') {
        addToPool("Chaotic Breach Response", 4, 4, "Develop and Test IR Playbooks");
    }

    // Supply Chain
    if (profile.vendorRiskProgram === 'no') {
        addToPool("Third-Party Vendor Breach", 3, 4, "Implement Vendor Risk Assessments");
    }

    // --- Universal Risks (Always present) ---
    addToPool("Phishing / Social Engineering", 4, 4, "Security Awareness Training");
    addToPool("Insider Threat", 2, 3, "Least Privilege Access Control");
    addToPool("Unpatched Vulnerabilities", profile.patchingAutomated === 'yes' ? 2 : 4, 4, "Automated Patch Management");
    addToPool("Shadow IT", 3, 2, "CASB and Policy Enforcement");
    addToPool("DDoS Attack", 2, 3, "DDoS Mitigation Service");
    addToPool("Regulatory Fines", 2, 5, "Compliance Gap Analysis");

    // Sort and Top 15
    pool.sort((a, b) => b.score - a.score);
    const selectedRisks = pool.slice(0, 15);

    return selectedRisks.map((r, index) => ({
        ...r,
        id: index + 1
    }));
}


// --- Fallbacks ---

function generateFallbackSummary(profile, maturity, gaps) {
    return `# Executive Summary for ${profile.name}\n\nOverall Score: **${maturity.overall}%**\n\nIdentified ${gaps.length} key gaps. Recommendations follow below.`;
}

function generateFallbackRecommendations(gaps) {
    return gaps.slice(0, 10).map((gap, i) => ({
        id: i + 1,
        title: `Fix ${gap.category} Issue`,
        priority: gap.severity,
        steps: ["Investigate", "Remediate"]
    }));
}

function generateFallbackComplianceRoadmap(profile) {
    return `# Compliance Roadmap\n\nFocus on standard frameworks relevant to ${profile.industry}.`;
}

export default { generateReport };
