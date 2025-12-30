import React from 'react';
import SlideDeck from '../components/SlideDeck';

const About = ({ onBack }) => {
    const slides = [
        {
            title: "Executive Summary",
            content: "Effective IT security management is a formal, iterative process designed to protect an organization's critical assets in a cost-effective manner. It revolves around a continuous cycle of planning, implementation, monitoring, and improvement.",
            bullets: [
                "Based on the Plan-Do-Check-Act (PDCA) model.",
                "Foundational security risk assessment.",
                "Aligns with cost-benefit analysis."
            ]
        },
        {
            title: "Core Principles",
            content: "According to ISO 13335, IT Security Management ensures appropriate levels of key security attributes.",
            bullets: [
                "Confidentiality & Integrity",
                "Availability & Reliability",
                "Accountability & Authenticity"
            ]
        },
        {
            title: "The PDCA Model",
            content: "The process is inherently iterative, described by ISO 27001's PDCA model:",
            bullets: [
                "Plan: Establish policy, objectives, and risk treatment.",
                "Do: Implement the risk treatment plan.",
                "Check: Monitor and maintain the plan.",
                "Act: Improve process based on incidents and reviews."
            ]
        },
        {
            title: "Organizational Context",
            content: "Understanding which organizational functions depend on IT systems and the consequences of failure is crucial.",
            bullets: [
                "Security Objectives: What should be achieved?",
                "Strategies: How will objectives be met?",
                "Policies: Mandatory rules and responsibilities."
            ]
        },
        {
            title: "Approaches to Risk Assessment",
            content: "Organizations identify and mitigate risk using one of four ISO 13335 approaches.",
            bullets: [
                "Baseline: Basic controls (Best Practices).",
                "Informal: Pragmatic analysis by experts.",
                "Detailed: Formal, structured process.",
                "Combined: Cost-effective mix of the above."
            ]
        },
        {
            title: "Detailed Risk Analysis: Process",
            content: "A rigorous approach providing a precise evaluation of security posture.",
            bullets: [
                "Stage 1: Context & System Characterization",
                "Stage 2: Threat & Vulnerability Identification",
                "Stage 3: Risk Analysis (Likelihood x Consequence)",
                "Stage 4: Evaluation & Documentation",
                "Stage 5: Risk Treatment"
            ]
        },
        {
            title: "Identifying Threats & Vulnerabilities",
            content: "We must define key terms to understand exposure (ISO 27002).",
            bullets: [
                "Asset: Anything of value to the organization.",
                "Threat: Potential cause of an unwanted incident.",
                "Vulnerability: Weakness that can be exploited.",
                "Risk: Potential for threats to exploit vulnerabilities."
            ]
        },
        {
            title: "Risk Analysis Scales",
            content: "Determining the level of risk by qualitative ratings.",
            bullets: [
                "Likelihood: Rare (1) to Almost Certain (5).",
                "Consequence: Insignificant (1) to Doomsday (6).",
                "Risk Level = Likelihood × Consequence."
            ]
        },
        {
            title: "Risk Treatment Strategies",
            content: "Once risks are identified, management chooses a strategy.",
            bullets: [
                "1. Acceptance: Taking the risk.",
                "2. Avoidance: Stopping the risky activity.",
                "3. Transfer: Insurance or 3rd party.",
                "4. Reduction (Consequence/Likelihood): Implementing controls."
            ]
        },
        {
            title: "Security Controls",
            content: "Controls (safeguards) manage risk and are classified into three categories.",
            bullets: [
                "Management: Policies, planning, standards.",
                "Operational: Implementation by people.",
                "Technical: Hardware/Software capabilities."
            ]
        },
        {
            title: "Physical Security",
            content: "Protecting hardware, facilities, and personnel from physical threats.",
            bullets: [
                "Threats: Natural disasters, fire, water, theft.",
                "Mitigation: Site selection, HVAC, Access Control.",
                "Integration: PIV cards for physical + logical access."
            ]
        },
        {
            title: "Human Resources Security",
            content: "The human element is often the most critical component.",
            bullets: [
                "Training: Awareness (What), Training (How), Education (Why).",
                "Lifecycle: Background checks, Separation of Duties.",
                "Termination: Revoking access, asset recovery."
            ]
        },
        {
            title: "Incident Response (CSIRT)",
            content: "Systematically handling security incidents to minimize loss.",
            bullets: [
                "Detect: Log analysis, IDS, user reports.",
                "Triage: Prioritizing incidents.",
                "Respond: Patching, filtering, rebuilding.",
                "Follow-up: Feeding back into the risk assessment."
            ]
        },
        {
            title: "Security Auditing",
            content: "Independent review to establish accountability and verification.",
            bullets: [
                "Audit Trails: System, Application, and User level logs.",
                "Analysis: Baselining, Anomaly Detection, Correlation.",
                "SIEM: Centralized logging and real-time alerting."
            ]
        },
        {
            title: "Conclusion",
            content: "Our GRC Advisor automates this entire methodology.",
            bullets: [
                "We Plan (Assess), Do (Recommend), Check (Audit).",
                "We cover Physical, HR, and Technical controls.",
                "We provide the detailed risk analysis you need."
            ]
        }
    ];

    return (
        <div style={{
            padding: '8rem 2rem',
            background: '#020617',
            minHeight: '100vh',
            color: '#fff'
        }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <h1 className="section-title" style={{ margin: 0, fontSize: '3rem' }}>About Our Methodology</h1>
                    <button onClick={onBack} className="btn btn-outline">
                        &larr; Back to Home
                    </button>
                </div>

                <SlideDeck slides={slides} />

                <div style={{ marginTop: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                    <p>Based on ISO 13335, ISO 27000 Series, and NIST Standards.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
