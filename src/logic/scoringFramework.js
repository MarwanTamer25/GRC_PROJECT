// Enhanced Scoring Framework with Industry-Specific Weighted Calculations
// Refactored to 6 Dimensions: Governance, Risk, Compliance, Technical, Application, Operational

/**
 * Industry-specific scoring weights and thresholds
 */
export const INDUSTRY_WEIGHTS = {
    fintech: {
        dimensions: {
            governance: { weight: 0.15, threshold: 75, label: "Governance & Strategy" },
            risk: { weight: 0.15, threshold: 80, label: "Risk & Continuity" },
            compliance: { weight: 0.25, threshold: 90, label: "Compliance & Privacy" },
            technical: { weight: 0.15, threshold: 85, label: "Technical Security" },
            application: { weight: 0.15, threshold: 85, label: "App & Data Security" },
            operational: { weight: 0.15, threshold: 80, label: "Operational Security" }
        },
        penalties: {
            no_mfa: -25,
            no_encryption: -25,
            no_incident_response: -20
        },
        bonuses: {
            cert_exists: +10
        }
    },
    healthcare: {
        dimensions: {
            governance: { weight: 0.10, threshold: 70 },
            risk: { weight: 0.15, threshold: 80 },
            compliance: { weight: 0.30, threshold: 95 }, // Compliance critical
            technical: { weight: 0.15, threshold: 80 },
            application: { weight: 0.15, threshold: 85 },
            operational: { weight: 0.15, threshold: 80 }
        }
    },
    saas: {
        dimensions: {
            governance: { weight: 0.10, threshold: 70 },
            risk: { weight: 0.15, threshold: 75 },
            compliance: { weight: 0.15, threshold: 80 },
            technical: { weight: 0.20, threshold: 85 },
            application: { weight: 0.25, threshold: 90 }, // AppSec critical
            operational: { weight: 0.15, threshold: 80 }
        }
    },
    default: {
        dimensions: {
            governance: { weight: 0.166, threshold: 70, label: "Governance & Strategy" },
            risk: { weight: 0.166, threshold: 70, label: "Risk & Continuity" },
            compliance: { weight: 0.166, threshold: 70, label: "Compliance & Privacy" },
            technical: { weight: 0.166, threshold: 70, label: "Technical Security" },
            application: { weight: 0.166, threshold: 70, label: "App & Data Security" },
            operational: { weight: 0.166, threshold: 70, label: "Operational Security" }
        },
        penalties: {
            no_mfa: -20,
            no_backup: -20
        }
    }
};

/**
 * 1. Governance & Strategy Score
 * Inputs: Policies, CISO role, Security Team, Budget presence
 */
function calculateGovernanceScore(profile) {
    let score = 50;

    // Policies
    if (profile.policiesDocumented === 'complete') score += 20;
    else if (profile.policiesDocumented === 'partial') score += 10;
    else score -= 15;

    // Roles (Simplified inputs: cisoPresent now implies leadership)
    if (profile.cisoPresent === 'yes') score += 15;

    // Team/Budget
    // We assume if they have a team, they have some budget.
    // Simplifying: if securityTeamSize > 0 -> good.
    if (profile.securityTeamSize && profile.securityTeamSize > 0) score += 10;

    // Reviews
    if (profile.managementReview && profile.managementReview !== 'never') score += 5;

    return clamp(score);
}

/**
 * 2. Risk & Continuity Score
 * Inputs: Risk Assessments, BCP, Insurance, Backups
 */
function calculateRiskScore(profile) {
    let score = 50;

    // Risk Assessment
    if (profile.riskAssessmentFreq === 'annual' || profile.riskAssessmentFreq === 'quarterly') score += 15;
    else score -= 10; // "never"

    // Business Continuity / Insurance
    if (profile.cyberInsurance === 'yes') score += 10;

    // BCP
    if (profile.bcpDocumented === 'yes') score += 15;
    else score -= 10;

    // Backup Basics (Frequency)
    if (profile.backupFrequency === 'daily' || profile.backupFrequency === 'real_time') score += 10;
    else if (profile.backupFrequency === 'none') score -= 20;

    return clamp(score);
}

/**
 * 3. Compliance & Privacy Score
 * Inputs: Frameworks, Privacy checks, Audits
 */
function calculateComplianceScore(profile) {
    let score = 50;

    // Certifications (Strongest indicator)
    const certs = profile.complianceFrameworks || [];
    if (certs.length > 0) score += 20;
    if (certs.includes('iso27001') || certs.includes('soc2')) score += 10;

    // Privacy
    if (profile.privacyProgram === 'yes') score += 10;

    // Audits
    if (profile.lastAuditDate && profile.lastAuditDate !== 'never') score += 10;

    return clamp(score);
}

/**
 * 4. Technical Security Score (Infrastructure)
 * Inputs: Network, Cloud, Host Security, Patching
 */
function calculateTechnicalScore(profile) {
    let score = 50;

    // Network / Cloud
    if (profile.firewallEnabled === 'yes') score += 10;
    if (profile.networkSegmentation === 'yes') score += 10;

    // Endpoint / Host
    if (profile.antivirus === 'yes' || profile.edr === 'yes') score += 10;

    // Vuln Management
    if (profile.vulnerabilityScanning === 'regular') score += 15;
    else if (profile.vulnerabilityScanning === 'never') score -= 15;

    // Patching
    if (profile.patchingAutomated === 'yes') score += 5;

    return clamp(score);
}

/**
 * 5. Application & Data Security Score
 * Inputs: AppSec, Encryption, Auth (MFA/SSO), SDLC
 */
function calculateApplicationScore(profile) {
    let score = 50;

    // Access Control (MFA is critical)
    if (profile.mfa === 'mandatory') score += 25;
    else if (profile.mfa === 'optional') score -= 10;
    else score -= 25; // None

    if (profile.sso === 'yes') score += 5;

    // Encryption
    if (profile.encryption === 'yes') score += 15; // Combined AtRest/Transit

    // SDLC / Code
    if (profile.codeReview === 'yes') score += 10;

    return clamp(score);
}

/**
 * 6. Operational Security Score
 * Inputs: Incident Response, Training, Vendor Mgmt
 */
function calculateOperationalScore(profile) {
    let score = 50;

    // Incident Response
    if (profile.incidentResponsePlan === 'yes') score += 20;
    else score -= 15;

    // Training
    if (profile.securityTraining === 'regular') score += 15;
    else score -= 10; // none

    // Vendor / Third Party
    if (profile.vendorRiskProgram === 'yes') score += 10;

    return clamp(score);
}


// --- Helper ---
function clamp(val) {
    return Math.max(0, Math.min(100, val));
}


/**
 * Main Calculation Function
 */
export function calculateMaturityScore(profile) {
    const industryKey = INDUSTRY_WEIGHTS[profile.industry] ? profile.industry : 'default';
    const config = INDUSTRY_WEIGHTS[industryKey] || INDUSTRY_WEIGHTS.default;
    const dims = config.dimensions; // default weights if not specific

    // Calculate raw dimension scores
    const s_gov = calculateGovernanceScore(profile);
    const s_risk = calculateRiskScore(profile);
    const s_comp = calculateComplianceScore(profile);
    const s_tech = calculateTechnicalScore(profile);
    const s_app = calculateApplicationScore(profile);
    const s_ops = calculateOperationalScore(profile);

    // Weighted Overall Calculation
    let overall = (
        s_gov * (dims.governance?.weight || 0.166) +
        s_risk * (dims.risk?.weight || 0.166) +
        s_comp * (dims.compliance?.weight || 0.166) +
        s_tech * (dims.technical?.weight || 0.166) +
        s_app * (dims.application?.weight || 0.166) +
        s_ops * (dims.operational?.weight || 0.166)
    );

    // Apply Penalties (Global)
    if (profile.mfa === 'none') overall -= 5;
    if (profile.backupFrequency === 'none') overall -= 5;

    return {
        overall: Math.round(clamp(overall)),
        governance: Math.round(s_gov),
        risk: Math.round(s_risk),
        compliance: Math.round(s_comp),
        technical: Math.round(s_tech),
        application: Math.round(s_app),
        operational: Math.round(s_ops),
        labels: {
            governance: "Governance & Strategy",
            risk: "Risk & Continuity",
            compliance: "Compliance & Privacy",
            technical: "Technical Security",
            application: "App & Data Security",
            operational: "Operational Security"
        }
    };
}


/**
 * Identify Gaps based on the 6 dimensions
 */
export function identifyGaps(profile, scores) {
    const gaps = [];

    // 1. Governance
    if (scores.governance < 60) {
        gaps.push({ category: 'Governance', severity: 'High', description: 'Lack of formal security leadership and documented policies.' });
    }

    // 2. Risk
    if (profile.backupFrequency === 'none') {
        gaps.push({ category: 'Risk', severity: 'Critical', description: 'No backup strategy found—data loss is imminent in an attack.' });
    }
    if (profile.bcpDocumented !== 'yes' && scores.risk < 50) {
        gaps.push({ category: 'Risk', severity: 'Medium', description: 'Undefined Business Continuity Plan.' });
    }

    // 3. Compliance
    if (scores.compliance < 50 && (profile.industry === 'fintech' || profile.industry === 'healthcare')) {
        gaps.push({ category: 'Compliance', severity: 'High', description: 'Compliance posture is weak for a regulated industry.' });
    }

    // 4. Technical
    if (profile.vulnerabilityScanning === 'never') {
        gaps.push({ category: 'Technical', severity: 'High', description: 'No visibility into system vulnerabilities.' });
    }

    // 5. Application (Auth/Encryption)
    if (profile.mfa === 'none') {
        gaps.push({ category: 'Application', severity: 'Critical', description: 'Multi-Factor Authentication (MFA) is not enabled.' });
    }
    if (profile.encryption === 'no') {
        gaps.push({ category: 'Application', severity: 'High', description: 'Sensitive data is not encrypted.' });
    }

    // 6. Operational
    if (profile.incidentResponsePlan !== 'yes') {
        gaps.push({ category: 'Operational', severity: 'High', description: 'No Incident Response Plan to handle breaches.' });
    }
    if (profile.securityTraining !== 'regular') {
        gaps.push({ category: 'Operational', severity: 'Medium', description: 'Employees are not trained on security risks.' });
    }

    return gaps;
}
