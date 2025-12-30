import React from 'react';

const Home = ({ onStart, onPlans, onAbout }) => {
    return (
        <div style={{ paddingBottom: '4rem' }}>

            {/* --- Navigation Bar --- */}
            <nav className="navbar">
                <div className="nav-logo">GRC Advisor</div>
                <ul className="nav-links">
                    <li><button className="nav-link" onClick={() => window.scrollTo(0, 0)}>Home</button></li>
                    <li><button className="nav-link" onClick={onAbout}>Methodology</button></li>
                    <li><button className="nav-link" onClick={onPlans}>Plans</button></li>
                    <li><button className="nav-link nav-cta" onClick={onStart}>Start Assessment</button></li>
                </ul>
            </nav>

            {/* --- Hero Section --- */}
            <div className="hero-section" style={{ textAlign: 'center', paddingTop: '12rem' }}>
                <div className="container">
                    <h1 className="hero-title">
                        AI-Powered <br />
                        <span>Virtual CISO & GRC Advisor</span>
                    </h1>
                    <p className="hero-subtitle">
                        Automate your Governance, Risk, and Compliance strategy with our intelligent engine.
                        Identifies gaps, quantifies risks, and generates ISO/NIST aligned roadmaps in minutes.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="btn" onClick={onStart}>Start Free Assessment</button>
                        <button className="btn btn-outline" onClick={onPlans}>View Plans & Pricing</button>
                    </div>
                </div>
            </div>

            {/* --- About Project --- */}
            <section className="section" style={{ background: '#020617' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="section-title">Why GRC Advisor?</h2>

                    <div className="grid-2" style={{ alignItems: 'center', textAlign: 'left', gap: '4rem' }}>
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#38bdf8' }}>The Challenge</h3>
                            <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                                Modern enterprises face increasing regulatory pressure and cyber threats.
                                Hiring a full-time CISO is expensive (avg. $200k+), and manual risk assessments
                                are slow, error-prone, and static.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#a855f7' }}>Our Solution</h3>
                            <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                                An intelligent, automated advisory system that acts as your Virtual CISO.
                                We combine industry standards (ISO 27001, NIST) with advanced AI to deliver
                                instant, actionable security roadmaps tailored to your specific profile.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Premium AI Features --- */}
            <section className="section" style={{ background: '#0f172a' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <div className="ai-showcase">
                        <span className="ai-badge">Powered by Llama 3.3:70b & Gemini</span>
                        <h2 className="section-title">Next-Gen AI Intelligence</h2>

                        <div className="features-grid">
                            <div className="feature-card">
                                <span className="feature-icon">🔍</span>
                                <h3>Gap Analysis</h3>
                                <p>Instantly identifies missing controls across Governance, Access, and Operations.</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">📊</span>
                                <h3>Risk Quantification</h3>
                                <p>Calculates Annual Loss Expectancy (ALE) to justify security budgets.</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">🛡️</span>
                                <h3>Compliance Mapping</h3>
                                <p>Auto-maps your status to ISO 27001, SOC 2, and GDPR requirements.</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">📝</span>
                                <h3>Executive Reporting</h3>
                                <p>Generates board-ready PDF reports with summaries and actionable roadmaps.</p>
                            </div>
                        </div>

                        <button className="btn btn-outline" onClick={onAbout}>
                            Learn About Our Methodology &rarr;
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
