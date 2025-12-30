import React, { useState, useEffect } from 'react';
import { generateReport } from '../logic/grcEngine';

// --- Components ---

const LoadingSpinner = ({ message }) => (
    <div style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        background: 'rgba(52, 211, 153, 0.03)',
        borderRadius: '16px',
        border: '1px dashed rgba(52, 211, 153, 0.3)',
        maxWidth: '600px',
        margin: '2rem auto'
    }}>
        <div className="spinner" style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(52, 211, 153, 0.1)',
            borderTop: '3px solid var(--accent-primary)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            animation: 'spin 0.8s linear infinite'
        }}></div>
        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
            🤖 AI Analyst Working
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {message}
        </p>
    </div>
);

const ScoreHeader = ({ title, score, description }) => (
    <div className="glass-card score-header-card" style={{
        borderLeftColor: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'
    }}>
        <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{title}</h2>
            {description && <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{description}</p>}
        </div>
        <div className="score-display">
            <div className="score-value" style={{
                color: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444'
            }}>
                {score}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '5px' }}>Maturity</div>
        </div>
    </div>
);

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button className="btn btn-outline" onClick={handleCopy} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            {copied ? '✅ Copied' : '📋 Copy'}
        </button>
    );
};

const RecommendationBlock = ({ recs }) => {
    if (!recs || recs.length === 0) return <p style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No specific recommendations generated for this section.</p>;

    return (
        <div className="recommendation-grid">
            {recs.map((rec, i) => (
                <div key={i} className="glass-card recommendation-card" style={{
                    borderTopColor: rec.priority === 'Critical' ? '#ef4444' : rec.priority === 'High' ? '#f97316' : '#38bdf8'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.4' }}>{rec.title}</h4>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span className="badge" style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.6rem',
                            marginRight: '0.5rem',
                            background: rec.priority === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                            color: rec.priority === 'Critical' ? '#fca5a5' : 'var(--text-primary)'
                        }}>
                            {rec.priority}
                        </span>
                        {rec.difficulty && (
                            <span className="badge badge-outline" style={{ fontSize: '0.75rem' }}>
                                🔧 {rec.difficulty} Effort
                            </span>
                        )}
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>
                        {rec.businessImpact}
                    </p>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '6px' }}>
                        <strong style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', display: 'block', marginBottom: '0.5rem' }}>ACTION PLAN</strong>
                        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {rec.steps?.slice(0, 3).map((s, idx) => <li key={idx} style={{ marginBottom: '4px' }}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};


const Report = ({ profile, onReset }) => {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Initializing analysis...');
    const [data, setData] = useState(null);

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                // Sequence of "thoughts" to show user
                setLoadingMessage('Initializing detailed risk analysis...');
                setTimeout(() => setLoadingMessage('Consulting Virtual CISO logic...'), 2000);
                setTimeout(() => setLoadingMessage('Quantifying financial exposure...'), 5000);
                setTimeout(() => setLoadingMessage('Drafting compliance roadmap...'), 9000);
                setTimeout(() => setLoadingMessage('Finalizing strategic report...'), 12000);

                const reportData = await generateReport(profile);
                setData(reportData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        loadReport();
    }, [profile]);

    if (loading) return <div className="container" style={{ paddingTop: '2rem' }}><LoadingSpinner message={loadingMessage} /></div>;
    if (!data) return null;

    const getRecs = (catStr) => data.recommendations.filter(r => r.category && r.category.toLowerCase().includes(catStr.toLowerCase())).slice(0, 3);

    return (
        <div className="container" style={{ paddingBottom: '6rem', maxWidth: '1200px' }}>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* HERD */}
            <div className="report-header-container report-header"> {/* Added class for print style hook */}
                <div>
                    <h1 className="report-title">
                        Security Strategy Report
                    </h1>
                    <p style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                        Strategic Advisory for <strong>{profile.name}</strong> • {new Date().toLocaleDateString()}
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="score-value" style={{
                        color: data.maturity.overall >= 70 ? 'var(--accent-primary)' : data.maturity.overall >= 50 ? '#fbbf24' : '#f87171'
                    }}>
                        {data.maturity.overall}%
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px' }}>Security Score</div>
                </div>
            </div>

            <div className="no-print" style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={onReset}>← Start New Assessment</button>
                <button className="btn btn-outline" onClick={() => window.print()}>🖨️ Print Report</button>
            </div>

            {/* SECTION 1: EXECUTIVE SUMMARY */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0, color: 'var(--accent-primary)' }}>1. Executive Summary</h2>
                    <CopyButton text={data.executiveSummary} />
                </div>
                <div className="glass-card" style={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.8',
                    fontSize: '1.05rem',
                }}>
                    {data.executiveSummary}
                </div>
            </section>

            {/* SECTION 2: GOVERNANCE */}
            <section style={{ marginBottom: '4rem' }}>
                <ScoreHeader
                    title="2. Governance & Leadership"
                    score={data.sections.governance.score}
                    description="Strategy, Policies, and Organizational Structure"
                />
                <RecommendationBlock recs={getRecs('Governance')} />
            </section>

            {/* SECTION 3: RISK */}
            <section style={{ marginBottom: '4rem' }}>
                <ScoreHeader
                    title="3. Risk & Impact Analysis"
                    score={data.sections.risk.score}
                    description="Quantified financial exposure and business continuity"
                />

                {/* Risk Register Table */}
                <h3 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '1rem' }}>Top Identified Risks & Financial Impact</h3>
                <div className="glass-card risk-table-container">
                    <table className="risk-table">
                        <thead>
                            <tr>
                                <th>Risk Scenario</th>
                                <th style={{ textAlign: 'center' }}>Severity</th>
                                <th>Mitigation Strategy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.risks.slice(0, 5).map(r => (
                                <tr key={r.id}>
                                    <td style={{ fontWeight: '500' }}>{r.risk}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span className="badge" style={{
                                            background: r.level === 'Extreme' ? '#ef4444' : r.level === 'High' ? '#f97316' : '#eab308',
                                            color: '#fff',
                                            fontSize: '0.75rem'
                                        }}>{r.level}</span>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{r.mitigation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* SECTION 4: COMPLIANCE */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <ScoreHeader
                        title="4. Compliance Roadmap"
                        score={data.sections.compliance.score}
                        description="Regulatory adherence and certification path"
                    />
                    <CopyButton text={data.complianceRoadmap} />
                </div>

                <div className="glass-card" style={{
                    padding: '2rem',
                    marginBottom: '2rem',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.7'
                }}>
                    {data.complianceRoadmap}
                </div>
                <RecommendationBlock recs={getRecs('Compliance')} />
            </section>

            {/* SECTION 5: TECHNICAL */}
            <section style={{ marginBottom: '4rem' }}>
                <ScoreHeader
                    title="5. Technical Architecture"
                    score={data.sections.technical.score}
                    description="Infrastructure, Network, and Endpoint Security"
                />
                <RecommendationBlock recs={getRecs('Technical')} />
            </section>

            {/* SECTION 6: APP & OPS */}
            <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* AppSec */}
                    <div>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Application Security</h3>
                        <RecommendationBlock recs={getRecs('Application')} />
                        {getRecs('Application').length === 0 && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>No specific AppSec findings. Check Authentication/Encryption inputs.</p>}
                    </div>

                    {/* Operational */}
                    <div>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Operational Security</h3>
                        <RecommendationBlock recs={getRecs('Operational')} />
                        {getRecs('Operational').length === 0 && <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>No specific OpSec findings. Check Incident Response inputs.</p>}
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Report;
