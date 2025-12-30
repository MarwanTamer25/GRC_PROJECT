import React, { useState, useEffect } from 'react';
import { generateReport } from '../logic/grcEngine';

// Loading spinner component
const LoadingSpinner = ({ message }) => (
    <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'rgba(52, 211, 153, 0.05)',
        borderRadius: '12px',
        border: '2px dashed rgba(52, 211, 153, 0.3)'
    }}>
        <div className="spinner" style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(52, 211, 153, 0.2)',
            borderTop: '4px solid var(--accent-primary)',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            animation: 'spin 1s linear infinite'
        }}></div>
        <h3 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            🤖 AI Analysis in Progress
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {message}
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Using Llama 3.3:70b for comprehensive analysis... (10-30 seconds)
        </p>
    </div>
);

// Recommendation Card Component
const RecommendationCard = ({ rec, index }) => {
    const priorityColors = {
        'Critical': '#ef4444',
        'High': '#f97316',
        'Medium': '#eab308',
        'Low': '#22c55e'
    };

    return (
        <div className="glass-card" style={{ marginBottom: '1.5rem', borderLeft: `4px solid ${priorityColors[rec.priority] || '#888'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span className="badge" style={{ background: priorityColors[rec.priority], color: '#fff' }}>
                            {rec.priority}
                        </span>
                        <span className="badge badge-outline">{rec.category}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                        #{index + 1}. {rec.title}
                    </h4>
                </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>Business Impact:</strong>
                <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>{rec.businessImpact}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <strong>Implementation Steps:</strong>
                <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                    {rec.steps?.map((step, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>{step}</li>
                    ))}
                </ol>
            </div>

            <div className="grid-2" style={{ gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                    <strong>💰 Cost:</strong> ${rec.estimatedCost?.min?.toLocaleString()} - ${rec.estimatedCost?.max?.toLocaleString()}
                </div>
                <div>
                    <strong>⏱️ Timeline:</strong> {rec.timeline}
                </div>
                <div>
                    <strong>👥 Resources:</strong> {rec.resources?.people}
                </div>
                <div>
                    <strong>🔧 Tools:</strong> {rec.resources?.tools}
                </div>
            </div>

            {rec.quickWins && rec.quickWins.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '6px' }}>
                    <strong style={{ color: 'var(--accent-primary)' }}>⚡ Quick Wins:</strong>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                        {rec.quickWins.map((win, i) => (
                            <li key={i} style={{ color: 'var(--text-secondary)' }}>{win}</li>
                        ))}
                    </ul>
                </div>
            )}

            {rec.successMetrics && rec.successMetrics.length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                    <strong>📊 Success Metrics:</strong>
                    <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {rec.successMetrics.map((metric, i) => (
                            <span key={i} className="badge badge-outline" style={{ fontSize: '0.85rem' }}>
                                ✓ {metric}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Risk Quantification Table
const RiskTable = ({ risks }) => {
    if (!risks || risks.length === 0) return null;

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '2px solid rgba(255, 255, 255, 0.1)' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Risk Scenario</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>SLE</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>ARO</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>ALE</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>Mitigation Cost</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right' }}>ROI</th>
                    </tr>
                </thead>
                <tbody>
                    {risks.map((risk, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '0.75rem' }}>{risk.risk}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                ${risk.sle?.toLocaleString() || 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                {risk.aro ? (risk.aro * 100).toFixed(1) + '%' : 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold', color: '#ef4444' }}>
                                ${risk.ale?.toLocaleString() || 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-secondary)' }}>
                                ${risk.mitigationCost?.toLocaleString() || 'N/A'}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', color: risk.roi > 0 ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                                {risk.roi ? risk.roi.toFixed(0) + '%' : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Benchmark Comparison Component
const BenchmarkComparison = ({ benchmarks }) => {
    if (!benchmarks) return null;

    const getStatusColor = (status) => {
        if (status?.includes('Adequate') || status?.includes('Better')) return 'var(--accent-primary)';
        if (status?.includes('Underfunded') || status?.includes('Understaffed') || status?.includes('Worse')) return '#f97316';
        if (status?.includes('Severely')) return '#ef4444';
        return 'var(--text-secondary)';
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>Industry Comparison</h3>

            <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
                        {benchmarks.yourScore}%
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-tertiary)' }}>
                        {benchmarks.industryAverage}%
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Industry Average</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: benchmarks.scoreDelta >= 0 ? 'var(--accent-primary)' : '#ef4444' }}>
                        {benchmarks.scoreDelta >= 0 ? '+' : ''}{benchmarks.scoreDelta}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Delta</div>
                </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <strong>Percentile Ranking:</strong> {benchmarks.percentileLabel}
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {benchmarks.comparison}
                </div>
            </div>

            <div className="grid-2" style={{ gap: '1.5rem' }}>
                <div>
                    <strong>💰 Security Budget</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <div>Your Budget: <strong>${benchmarks.yourBudget?.toLocaleString()}</strong></div>
                        <div>Expected: <strong>${benchmarks.expectedBudget?.toLocaleString()}</strong></div>
                        <div style={{ color: getStatusColor(benchmarks.budgetStatus), marginTop: '0.25rem' }}>
                            Status: <strong>{benchmarks.budgetStatus}</strong>
                        </div>
                    </div>
                </div>
                <div>
                    <strong>👥 Security Team Size</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <div>Your Team: <strong>{benchmarks.yourTeamSize} FTE</strong></div>
                        <div>Expected: <strong>{benchmarks.expectedTeamSize} FTE</strong></div>
                        <div style={{ color: getStatusColor(benchmarks.teamStatus), marginTop: '0.25rem' }}>
                            Status: <strong>{benchmarks.teamStatus}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {benchmarks.certificationGaps && benchmarks.certificationGaps.length > 0 && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                    <strong style={{ color: '#ef4444' }}>🎯 Certification Gaps:</strong>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                        {benchmarks.certificationGaps.map((gap, i) => (
                            <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                                {gap.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Metric Bar Component
const MetricBar = ({ label, score }) => {
    const color = score >= 80 ? 'var(--accent-primary)' : score >= 60 ? '#eab308' : '#ef4444';
    return (
        <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{label}</span>
                <span style={{ fontWeight: 'bold', color }}>{score}%</span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${score}%`, height: '100%', background: color, transition: 'width 0.5s ease' }}></div>
            </div>
        </div>
    );
};

// Methodology Section Component
const MethodologySection = ({ methodology }) => {
    if (!methodology) return null;
    return (
        <div className="box" style={{ marginBottom: '2rem' }}>
            <h2>📘 Methodology & Framework</h2>
            <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>

                {/* Executive Summary of Methodology */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'var(--accent-primary)', fontSize: '1.2rem' }}>Overview</h3>
                    <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                        {methodology.executiveSummary}
                    </p>
                </div>

                {/* PDCA and Principles Grid */}
                <div className="grid-2" style={{ gap: '2rem' }}>

                    {/* PDCA Model */}
                    <div className="glass-card">
                        <h4 style={{ marginTop: 0 }}>🔄 The {methodology.framework} Model</h4>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            <li><strong>Plan:</strong> Establish policy, objectives, processes and procedures relevant to managing risk and improving information security to deliver results in accordance with an organization’s overall policies and objectives.</li>
                            <li><strong>Do:</strong> Implement and operate the Information Security Management System (ISMS) policy, controls, processes, and procedures.</li>
                            <li><strong>Check:</strong> Assess and, where applicable, measure process performance against ISMS policy, objectives, and practical experience and report the results to management for review.</li>
                            <li><strong>Act:</strong> Take corrective and preventive actions, based on the results of the internal ISMS audit and management review or other relevant information, to continually improve the ISMS.</li>
                        </ul>
                    </div>

                    {/* Core Principles */}
                    <div className="glass-card">
                        <h4 style={{ marginTop: 0 }}>🛡️ Core Principles (C.I.A.)</h4>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {methodology.principles.map((p, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <div style={{
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        color: 'var(--accent-primary)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        minWidth: '100px',
                                        textAlign: 'center'
                                    }}>
                                        {p.term}
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{p.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Control Categories */}
                <div style={{ marginTop: '2rem' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Security Control Categories</h4>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {methodology.controls.map((c, i) => (
                            <span key={i} className="badge badge-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5x6 Risk Matrix Component
const RiskMatrix = ({ risks }) => {
    if (!risks) return null;

    // Grid Dimensions
    const likelihoods = [5, 4, 3, 2, 1]; // Rows (Rare at bottom usually, but standard matrix often has Rare at bottom. Let's do 5 at top)
    // Actually, standard ISO matrix: Likelihood Y-axis (Low to High), Consequence X-axis (Low to High).
    // Let's render Y-axis top-down: 5 (Almost Certain) -> 1 (Rare) 
    const consequences = [1, 2, 3, 4, 5, 6]; // Cols: Insignificant -> Doomsday

    // Map risks to cells
    const riskMap = {};
    risks.forEach(r => {
        const key = `${r.likelihoodScore}-${r.consequenceScore}`;
        if (!riskMap[key]) riskMap[key] = [];
        riskMap[key].push(r.id);
    });

    const getCellColor = (l, c) => {
        const score = l * c;
        if (score >= 25) return '#ef4444'; // Extreme
        if (score >= 15) return '#f97316'; // High
        if (score >= 6) return '#eab308'; // Medium
        return '#22c55e'; // Low
    };

    return (
        <div className="box" style={{ marginBottom: '2rem' }}>
            <h2>📊 Detailed Risk Assessment Matrix</h2>
            <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
                <div style={{ display: 'flex' }}>

                    {/* Y-Axis Label */}
                    <div style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        padding: '1rem',
                        borderRight: '1px solid rgba(255,255,255,0.1)',
                        marginRight: '1rem'
                    }}>
                        LIKELIHOOD
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '1rem' }}>
                            {/* Header Row */}
                            {['Insig.', 'Minor', 'Mod.', 'Major', 'Catast.', 'Doomsday'].map((label, i) => (
                                <div key={i} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', paddingBottom: '0.5rem' }}>
                                    {label} ({i + 1})
                                </div>
                            ))}

                            {/* Grid Cells */}
                            {likelihoods.map(l => (
                                <React.Fragment key={l}>
                                    {consequences.map(c => {
                                        const ids = riskMap[`${l}-${c}`] || [];
                                        return (
                                            <div key={`${l}-${c}`} style={{
                                                aspectRatio: '1',
                                                background: getCellColor(l, c),
                                                opacity: 0.8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '4px',
                                                position: 'relative',
                                                fontSize: '0.8rem',
                                                flexWrap: 'wrap',
                                                gap: '2px',
                                                padding: '4px'
                                            }} title={`Likelihood: ${l}, Consequence: ${c}`}>
                                                {ids.length > 0 ? (
                                                    ids.slice(0, 3).map(id => (
                                                        <span key={id} style={{
                                                            background: 'rgba(0,0,0,0.3)',
                                                            color: '#fff',
                                                            padding: '2px 6px',
                                                            borderRadius: '99px',
                                                            fontSize: '0.7rem'
                                                        }}>
                                                            R{id}
                                                        </span>
                                                    ))
                                                ) : <span style={{ opacity: 0.3 }}>.</span>}
                                                {ids.length > 3 && <span style={{ fontSize: '0.7rem' }}>+</span>}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                        {/* X-Axis Label */}
                        <div style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: '0.5rem' }}>CONSEQUENCE</div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#ef4444', marginRight: '5px' }}></span> Extreme (25-30) &nbsp;
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#f97316', marginRight: '5px' }}></span> High (15-24) &nbsp;
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#eab308', marginRight: '5px' }}></span> Medium (6-14) &nbsp;
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#22c55e', marginRight: '5px' }}></span> Low (1-5)
                </div>
            </div>
        </div>
    );
};

// Main Report Component
const Report = ({ profile, onReset }) => {
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Initializing analysis...');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReport = async () => {
            try {
                setLoading(true);
                setLoadingMessage('Calculating industry-weighted maturity scores...');

                // Simulate progress updates
                setTimeout(() => setLoadingMessage('Comparing against industry benchmarks...'), 2000);
                setTimeout(() => setLoadingMessage('Generating AI-powered executive summary...'), 4000);
                setTimeout(() => setLoadingMessage('Creating detailed recommendations...'), 8000);
                setTimeout(() => setLoadingMessage('Building compliance roadmap...'), 12000);
                setTimeout(() => setLoadingMessage('Finalizing report...'), 16000);

                const reportData = await generateReport(profile);
                setData(reportData);
                setLoading(false);
            } catch (err) {
                console.error('Report generation error:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadReport();
    }, [profile]);

    if (loading) {
        return (
            <div className="container" style={{ paddingTop: '4rem', maxWidth: '1000px' }}>
                <LoadingSpinner message={loadingMessage} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '4rem', maxWidth: '1000px' }}>
                <div className="glass-card" style={{ padding: '2rem', border: '2px solid #ef4444' }}>
                    <h2 style={{ color: '#ef4444' }}>⚠️ Report Generation Error</h2>
                    <p>{error}</p>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                        Make sure Ollama is running with Llama 3.3:70b installed.
                    </p>
                    <button className="btn" onClick={onReset} style={{ marginTop: '1rem' }}>
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="container" style={{ paddingBottom: '4rem', maxWidth: '1200px' }}>
            {/* Add spinning animation */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            {/* HEADER */}
            <div className="report-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ margin: 0, marginBottom: '0.5rem' }}>🛡️ AI-POWERED GRC ADVISORY REPORT</h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                        Generated for <strong>{profile.name}</strong> | {new Date().toLocaleDateString()} | Powered by Llama 3.3:70b
                    </p>
                </div>
                <div className="no-print" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => window.print()}>📄 Print / Export PDF</button>
                    <button className="btn btn-outline" onClick={onReset}>🔄 New Assessment</button>
                </div>
            </div>

            <div className="report-body">
                {/* EXECUTIVE SUMMARY (AI-GENERATED) */}
                <section className="box" style={{ marginBottom: '2rem' }}>
                    <h2>📘 Executive Summary (Strategic Analysis)</h2>
                    <div style={{
                        padding: '1.5rem',
                        background: 'rgba(52, 211, 153, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(52, 211, 153, 0.2)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7'
                    }}>
                        {data.executiveSummary || 'Executive summary not available.'}
                    </div>
                </section>

                {/* METHODOLOGY SECTION */}
                <MethodologySection methodology={data.methodology} />

                {/* RISK MATRIX */}
                <RiskMatrix risks={data.risks} />

                {/* MATURITY SCORE */}
                <section className="box" style={{ marginBottom: '2rem' }}>
                    <h2>📊 Security Maturity Score</h2>
                    <div className="grid-2">
                        <div>
                            <MetricBar label="Governance" score={data.maturity.governance} />
                            <MetricBar label="Access Control" score={data.maturity.access} />
                            <MetricBar label="Risk Management" score={data.maturity.risk} />
                            <MetricBar label="Compliance" score={data.maturity.compliance} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            <div style={{
                                width: '180px',
                                height: '180px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `conic-gradient(var(--accent-primary) ${data.maturity.overall * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                                fontSize: '3rem',
                                fontWeight: 'bold'
                            }}>
                                <div style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {data.maturity.overall}%
                                </div>
                            </div>
                            <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Overall Maturity</div>
                        </div>
                    </div>
                </section>

                {/* INDUSTRY BENCHMARKING */}
                {data.benchmarks && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>📈 Industry Benchmarking</h2>
                        <BenchmarkComparison benchmarks={data.benchmarks} />
                    </section>
                )}

                {/* RISK QUANTIFICATION */}
                {data.quantifiedRisks && data.quantifiedRisks.length > 0 && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>💰 Financial Risk Quantification</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Annual Loss Expectancy (ALE) calculated for identified risk scenarios.
                        </p>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
                            <strong>Definitions:</strong> SLE = Single Loss Expectancy | ARO = Annual Rate of Occurrence |
                            ALE = SLE × ARO (Annual Loss Expectancy) | ROI = Return on Investment for mitigation
                        </div>
                        <RiskTable risks={data.quantifiedRisks} />
                    </section>
                )}

                {/* AI-GENERATED RECOMMENDATIONS */}
                {data.recommendations && data.recommendations.length > 0 && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>🎯 Prioritized Recommendations ({data.recommendations.length} items)</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            AI-generated actionable recommendations classified by control type (Management, Operational, Technical).
                        </p>
                        {data.recommendations.map((rec, i) => (
                            <RecommendationCard key={i} rec={rec} index={i} />
                        ))}
                    </section>
                )}

                {/* COMPLIANCE ROADMAP (AI-GENERATED) */}
                {data.complianceRoadmap && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>📜 Compliance Roadmap</h2>
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '8px',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.7'
                        }}>
                            {data.complianceRoadmap}
                        </div>
                    </section>
                )}

                {/* SECURITY GAPS */}
                {data.gaps && data.gaps.length > 0 && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>🔍 Identified Security Gaps</h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {data.gaps.map((gap, i) => (
                                <div key={i} className="glass-card" style={{
                                    padding: '1rem',
                                    borderLeft: `4px solid ${gap.severity === 'Critical' ? '#ef4444' : '#f97316'}`
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <span className="badge" style={{
                                                background: gap.severity === 'Critical' ? '#ef4444' : '#f97316',
                                                color: '#fff',
                                                marginRight: '0.5rem'
                                            }}>
                                                {gap.severity}
                                            </span>
                                            <span className="badge badge-outline">{gap.category}</span>
                                        </div>
                                        {gap.score && (
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                Score: {gap.score}% / Threshold: {gap.threshold}%
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ margin: '0.75rem 0 0', color: 'var(--text-secondary)' }}>
                                        {gap.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* TRADITIONAL RISK REGISTER */}
                {data.risks && data.risks.length > 0 && (
                    <section className="box" style={{ marginBottom: '2rem' }}>
                        <h2>⚠️ Risk Register (Top {data.risks.length})</h2>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Risk</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Consequence</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Likelihood</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Level</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'left' }}>Mitigation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.risks.map(r => (
                                        <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                            <td style={{ padding: '0.75rem' }}>R{r.id}</td>
                                            <td style={{ padding: '0.75rem' }}>{r.risk}</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span className="badge" style={{ background: r.consequenceScore >= 5 ? '#ef4444' : r.consequenceScore >= 3 ? '#f97316' : '#eab308' }}>
                                                        {r.consequenceLabel}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span>{r.likelihoodLabel}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                                                <span className="badge" style={{
                                                    background: r.level === 'Extreme' ? '#ef4444' :
                                                        r.level === 'High' ? '#f97316' :
                                                            r.level === 'Medium' ? '#eab308' : '#22c55e'
                                                }}>
                                                    {r.level}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.mitigation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default Report;
