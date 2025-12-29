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
 * @param {object} profile - Complete assessment profile (110+ fields)
 * @returns {Promise<object>} - Comprehensive GRC report
 */
export async function generateReport(profile) {
    console.log('🚀 Generating AI-powered GRC report...');

    //  1. Calculate industry-weighted maturity scores
    console.log('📊 Calculating maturity scores with industry weights...');
    const maturity = calculateMaturityScore(profile);

    // 2. Get industry benchmarks & comparison
    console.log('📈 Comparing against industry benchmarks...');
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

    // 6. AI: Generate detailed recommendations (15-20 items)
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
        quantifiedRisks = baseRisks.map((r, i) => ({
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
        executiveSummary,              // Custom executive summary
        recommendations: aiRecommendations, // 15-20 detailed recommendations
        complianceRoadmap,             // Industry-specific compliance plan

        // Calculated Scores
        maturity,                      // Weighted maturity scores
        benchmarks,                    // Industry comparison data
        gaps,                          // Identified security gaps

        // Risk Analysis
        risks: baseRisks,             // Risk scenarios
        quantifiedRisks,              // Financial impact (ALE)

        // Supporting Data (kept from original)
        governance: generateGovernanceSection(profile),
        access: generateAccessSection(profile),
        matrix: generatePrivilegeMatrix(profile),
        compliance: generateComplianceSection(profile),
        logging: generateLoggingSection(profile)
    };
}

/**
 * Generate base risk scenarios based on profile
 */
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
    if (score >= 20) return "Extreme";
    if (score >= 12) return "High";
    if (score >= 6) return "Medium";
    return "Low";
}

function generateBaseRisks(profile) {
    const pool = [];
    let idCounter = 1;

    // Helper to add risk to pool
    const addToPool = (risk, likelihoodScore, consequenceScore, mitigation) => {
        const score = likelihoodScore * consequenceScore;
        pool.push({
            id: `R${idCounter++}`, // Temporary ID, will re-index later if needed
            risk,
            likelihoodScore,
            likelihoodLabel: LIKELIHOOD_SCALE[likelihoodScore],
            consequenceScore,
            consequenceLabel: CONSEQUENCE_SCALE[consequenceScore],
            score, // Risk = Probability * Cost
            level: getRiskLevel(score),
            mitigation
        });
    };

    // --- 1. PROFILE-BASED RISKS (Conditional) ---

    // Remote Access
    if (profile.remote === 'yes') {
        addToPool(
            "Remote Endpoint Compromise",
            profile.mfa === 'mandatory' ? 2 : 4, // Unlikely vs Likely
            4, // Major
            "Enforce Endpoint Encryption, VPN, and Mandatory MFA"
        );
    }

    // Cloud Configuration
    if (profile.hosting === 'cloud') {
        addToPool(
            "Cloud Misconfiguration",
            profile.cloudDataClassification === 'yes' ? 2 : 4, // Unlikely vs Likely
            5, // Catastrophic
            "Enable Cloud Security Posture Management (CSPM), Regular Audits"
        );
    }

    // Supply Chain
    if (profile.vendors === 'yes' || profile.criticalVendorCount > 0) {
        addToPool(
            "Supply Chain / Third-Party Breach",
            profile.vendorRiskAssessments === 'yes' ? 2 : 4,
            4, // Major
            "Vendor Risk Assessment Program, Least Privilege Access, SLAs"
        );
    }

    // Data Leakage
    if (profile.dataTypes.includes('pii') || profile.dataTypes.includes('financial') || profile.dataTypes.includes('health')) {
        addToPool(
            "Data Breach / Leakage (Sensitive Data)",
            (profile.dataEncryptionAtRest === 'yes' && profile.dataEncryptionInTransit === 'yes') ? 2 : 4,
            5, // Catastrophic
            "Data Loss Prevention (DLP), Encryption at Rest/Transit, Access Logging"
        );
    }

    // Ransomware
    if (profile.backupFrequency === 'none') {
        addToPool(
            "Ransomware Attack with Data Loss",
            5, // Almost Certain (eventually)
            6, // Doomsday (if no backups)
            "Implement Backup Strategy, Offline Backups, Incident Response Plan"
        );
    } else {
        addToPool(
            "Ransomware Attack (Recoverable)",
            3, // Possible
            4, // Major (downtime vs data loss)
            "Regular Backups, EDR, Incident Response Plan"
        );
    }

    // Weak Auth
    if (profile.mfa !== 'mandatory') {
        addToPool(
            "Credential Stuffing / Brute Force",
            5, // Almost Certain
            4, // Major
            "Mandatory MFA, Strong Password Policies, Account Lockout"
        );
    }

    // Log Failure
    if (profile.logging !== 'advanced') {
        addToPool(
            "Failure to Detect Intrusions",
            4, // Likely
            4, // Major
            "Centralized Logging, SIEM, Real-time Alerting"
        );
    }

    // Compliance
    if (profile.compliance === 'none' && (profile.dataTypes.includes('pii') || profile.industry === 'healthcare')) {
        addToPool(
            "Regulatory Non-Compliance Fines",
            5, // Almost Certain
            5, // Catastrophic
            "Compliance Audits, Legal Counsel, Policy Management"
        );
    }

    // --- 2. UNIVERSAL RISKS (Always in pool, selected by score) ---

    addToPool(
        "Insider Threat / Privilege Abuse",
        profile.privilegedAccessManagement === 'yes' ? 2 : 3, // Unlikely/Possible
        3, // Moderate
        "RBAC, Privileged Access Management, Audit Logging"
    );

    addToPool(
        "Social Engineering & Phishing Attacks",
        4, // Likely
        4, // Major
        "Security Awareness Training, Phishing Simulations, Email Filtering"
    );

    addToPool(
        "Exploitation of Unpatched Vulnerabilities",
        3, // Possible
        4, // Major
        "Automated Patch Management, Regular Vulnerability Scanning"
    );

    addToPool(
        "Unsanctioned Shadow IT Usage",
        3, // Possible
        2, // Minor
        "Cloud Access Security Broker (CASB), Software Asset Management"
    );

    addToPool(
        "Web Application Attacks (SQLi, XSS)",
        3, // Possible
        4, // Major
        "Web Application Firewall (WAF), Secure Code Review, DAST/SAST"
    );

    addToPool(
        "Denial of Service (DDoS) Attack",
        2, // Unlikely
        3, // Moderate
        "DDoS Protection Services (e.g., Cloudflare), Redundancy"
    );

    addToPool(
        "Mobile Device Compromise (BYOD)",
        3, // Possible
        3, // Moderate
        "Mobile Device Management (MDM), Containerization, Remote Wipe"
    );

    addToPool(
        "Insecure API Endpoints",
        3, // Possible
        4, // Major
        "API Gateway, Rate Limiting, API Authentication"
    );

    addToPool(
        "Data Integrity Corruption",
        1, // Rare
        5, // Catastrophic
        "File Integrity Monitoring (FIM), Checksums, Backup Validation"
    );

    addToPool(
        "Physical Security Breach",
        2, // Unlikely
        3, // Moderate
        "Access Cards, CCTV, Visitor Management"
    );

    addToPool(
        "Reputational Damage from Incident",
        3, // Possible
        5, // Catastrophic
        "Crisis Communication Plan, PR Strategy"
    );

    addToPool(
        "Theft of Intellectual Property",
        2, // Unlikely
        5, // Catastrophic
        "DLP, Access Control, NDA, DRM"
    );

    addToPool(
        "Business Interruption / Failure",
        2, // Unlikely
        6, // Doomsday
        "Business Continuity Plan (BCP), Disaster Recovery (DR) Drills"
    );

    addToPool(
        "Insecure Default Configurations",
        3, // Possible
        4, // Major
        "Hardening Benchmarks (CIS), Automated Config Management"
    );

    addToPool(
        "Network Eavesdropping / MitM",
        profile.dataEncryptionInTransit === 'yes' ? 1 : 2, // Rare/Unlikely
        3, // Moderate
        "End-to-End Encryption, VPN, Mutual TLS"
    );

    addToPool(
        "Inadequate Employee Offboarding",
        3, // Possible
        3, // Moderate
        "Automated Account Deprovisioning, Exit Interviews"
    );

    addToPool(
        "Data Leakage via AI/LLM Tools",
        4, // Likely (Emerging threat)
        4, // Major
        "AI Usage Policy, Enterprise AI Gateways"
    );

    addToPool(
        "Brand Impersonation on Social Media",
        3, // Possible
        2, // Minor
        "Social Media Monitoring, Verified Profiles"
    );

    // --- FILTERING & SELECTION ---
    // User Requirement: "origin at least 20" (Pool is ~26)
    // "Average display between 10 to 15"
    // Strategy: Sort by Score (Desc) and take top 12.

    // Sort by Risk Score (Descending)
    pool.sort((a, b) => b.score - a.score);

    // Select Top 12 risks (fits "between 10 and 15")
    const selectedRisks = pool.slice(0, 12);

    // Re-assign IDs to be sequential 1-12 for the report
    return selectedRisks.map((r, index) => ({
        ...r,
        id: index + 1 // Simple ID 1, 2, 3...
    }));
}

/**
 * Generate governance section
 */
function generateGovernanceSection(profile) {
    return {
        roles: [
            { title: "System Owner", desc: "Executive accountable for system operations and security." },
            { title: profile.cisoPresent === 'yes' ? "CISO" : "Security Officer", desc: profile.cisoPresent === 'yes' ? "Chief Information Security Officer leading security strategy." : "Responsible for security controls implementation." },
            { title: profile.privacyOfficerAppointed === 'yes' ? "Data Protection Officer (DPO)" : "Privacy Lead", desc: profile.privacyOfficerAppointed === 'yes' ? "Ensures privacy compliance (GDPR/CCPA)." : "Designated privacy point of contact." }
        ]
    };
}

/**
 * Generate access control section
 */
function generateAccessSection(profile) {
    return {
        stats: [
            { label: "Total Users", value: profile.employees },
            { label: "Admin Accounts", value: profile.adminCount },
            { label: "Privileged Ratio", value: `${Math.round((profile.adminCount / profile.employees) * 100)}%` },
            { label: "Security Team", value: `${profile.securityTeamSize} FTE` }
        ],
        rules: [
            { control: "MFA", val: profile.mfa === 'mandatory' ? "✅ Enforced (All Users)" : profile.mfa === 'required' ? "⚠️ Partial (Admins Only)" : "❌ Not Enforced" },
            { control: "SSO", val: profile.ssoImplemented === 'yes' ? "✅ Implemented" : "❌ Not Implemented" },
            { control: "PAM", val: profile.privilegedAccessManagement === 'yes' ? "✅ Implemented" : "❌ Not Implemented" },
            { control: "Session Timeout", val: `${profile.sessionTimeouts} minutes` },
            { control: "Account Reviews", val: profile.accountReviewFrequency === 'never' ? "❌ Never" : `✅ ${profile.accountReviewFrequency}` }
        ]
    };
}

/**
 * Generate privilege matrix
 */
function generatePrivilegeMatrix(profile) {
    return [
        { role: "Super Admin", perm: "Full System Access (Read/Write/Delete/Config)" },
        { role: "Security Admin", perm: "Security Tools, Logs, Audit (Read/Write)" },
        { role: "Manager", perm: "Dept Data (Read/Write), User Mgmt (Dept only)" },
        { role: "Standard User", perm: "Own Data (Read/Write), Public Data (Read)" },
        { role: "Auditor", perm: "Logs & Reports (Read Only)" }
    ];
}

/**
 * Generate compliance section
 */
function generateComplianceSection(profile) {
    const frameworks = [];

    // ISO 27001
    frameworks.push({
        std: "ISO 27001",
        status: profile.existingCertifications?.includes('iso27001') ? "✅ Certified" : "Recommended Framework"
    });

    // GDPR/CCPA
    const needsPrivacy = profile.dataTypes.includes('pii') || profile.region === 'eu' || profile.region === 'us';
    frameworks.push({
        std: "GDPR/CCPA",
        status: profile.existingCertifications?.includes('gdpr') || profile.existingCertifications?.includes('ccpa') ? "✅ Compliant" :
            needsPrivacy ? "⚠️ REQUIRED" : "N/A"
    });

    // PCI-DSS
    frameworks.push({
        std: "PCI-DSS",
        status: profile.existingCertifications?.includes('pci_dss') ? "✅ Compliant" :
            profile.dataTypes.includes('financial') ? "⚠️ REQUIRED" : "N/A"
    });

    // SOC 2
    frameworks.push({
        std: "SOC 2",
        status: profile.existingCertifications?.includes('soc2') ? "✅ Certified" :
            profile.industry === 'saas' || profile.industry === 'fintech' ? "Highly Recommended" : "Optional"
    });

    // HIPAA
    if (profile.industry === 'healthcare' || profile.dataTypes.includes('health')) {
        frameworks.push({
            std: "HIPAA",
            status: profile.existingCertifications?.includes('hipaa') ? "✅ Compliant" : "⚠️ REQUIRED"
        });
    }

    return frameworks;
}

/**
 * Generate logging section
 */
function generateLoggingSection(profile) {
    return {
        retention: profile.logging === 'advanced' ? "12 Months (90 days hot, 9 months archive)" : "6 Months",
        alerts: profile.siemDeployed === 'yes' ? "Real-time SIEM alerts enabled" : "Basic error monitoring only",
        frequency: profile.logging === 'advanced' ? "Daily automated analysis, Weekly manual review" : "Monthly review"
    };
}

/**
 * Fallback executive summary if AI fails
 */
function generateFallbackSummary(profile, maturity, gaps) {
    const criticalGaps = gaps.filter(g => g.severity === 'Critical');

    return `# Executive Summary

${profile.name} has achieved an overall security maturity score of **${maturity.overall}%** based on comprehensive assessment across governance, access control, risk management, and compliance dimensions.

**Key Findings:**
- ${criticalGaps.length} critical security gaps identified
- Current maturity level: ${maturity.overall >= 80 ? 'Strong' : maturity.overall >= 60 ? 'Moderate' : 'Developing'}
- Industry: ${profile.industry}
- Employee Count: ${profile.employees}

**Priority Actions Required:**
1. ${criticalGaps[0]?.description || 'Improve overall security posture'}
2. ${criticalGaps[1]?.description || 'Enhance compliance documentation'}
3. ${criticalGaps[2]?.description || 'Implement missing technical controls'}`;
}

/**
 * Fallback recommendations if AI fails
 */
function generateFallbackRecommendations(gaps, profile) {
    return gaps.slice(0, 10).map((gap, i) => ({
        id: i + 1,
        title: `Address ${gap.category} Gap`,
        category: gap.category,
        priority: gap.severity,
        businessImpact: gap.description,
        steps: ["Assess current state", "Design solution", "Implement controls", "Verify effectiveness"],
        estimatedCost: { min: 5000, max: 25000 },
        timeline: "4-8 weeks",
        resources: { people: "1 FTE for 4 weeks", tools: "TBD based on specific solution" },
        successMetrics: ["Gap closed", "Risk reduced"],
        quickWins: []
    }));
}

/**
 * Fallback compliance roadmap if AI fails
 */
function generateFallbackComplianceRoadmap(profile) {
    return `# Compliance Roadmap for ${profile.name}

Based on your industry (${profile.industry}) and data types, the following compliance frameworks are recommended:

1. **ISO 27001** - Information Security Management System
2. **SOC 2 Type II** - Trust Service Criteria for ${profile.industry}
${profile.dataTypes.includes('pii') ? '3. **GDPR/CCPA** - Privacy regulations (REQUIRED)\n' : ''}
${profile.dataTypes.includes('financial') ? '4. **PCI-DSS** - Payment Card Industry (REQUIRED)\n' : ''}

Contact a compliance consultant for detailed roadmap implementation.`;
}

// Export for use in Report component
export default { generateReport };
