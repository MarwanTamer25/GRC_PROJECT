import React, { useState } from 'react';

const Plans = ({ onStart, onTrial, onBack }) => {
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');

    const handleTrialClick = () => {
        setShowModal(true);
    };

    const handleModalSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            console.log('Capturing lead:', email);
            onTrial();
        }
    };

    return (
        <div style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
            <div className="container">
                <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '2rem' }}>
                    ← Back to Home
                </button>

                <h1 className="section-title" style={{ marginTop: 0 }}>Select Your Security Plan</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--text-secondary)' }}>
                    Choose the level of protection that fits your organization's needs.
                </p>

                <div className="pricing-grid">
                    {/* Free Plan */}
                    <div className="pricing-card">
                        <h3>Starter Assessment</h3>
                        <div className="price">$0<span>/mo</span></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Perfect for early-stage startups.</p>

                        <ul className="plan-features">
                            <li><span className="check">✔</span> Basic GRC Report</li>
                            <li><span className="check">✔</span> Top 10 Risks Analysis</li>
                            <li><span className="check">✔</span> <strong>Llama AI</strong> High-Level Summary</li>
                            <li><span className="check">✔</span> Manual PDF Export</li>
                            <li><span className="cross">✘</span> Detailed Compliance Roadmap</li>
                            <li><span className="cross">✘</span> Financial Risk Quantification</li>
                        </ul>

                        <button className="btn btn-outline btn-block" onClick={onStart}>
                            Start Free Assessment
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="pricing-card premium">
                        <h3>Virtual CISO Premium</h3>
                        <div className="price">$499<span>/mo</span></div>
                        <p style={{ color: 'var(--text-secondary)' }}>Full enterprise security program.</p>

                        <ul className="plan-features">
                            <li><span className="check">✔</span> Everything in Starter</li>
                            <li><span className="check">✔</span> <strong>Gemini AI</strong> Deep Analysis</li>
                            <li><span className="check">✔</span> Unlimited Policy Generation</li>
                            <li><span className="check">✔</span> 50+ Risk Scenarios</li>
                            <li><span className="check">✔</span> ISO/SOC2 Readiness Score</li>
                            <li><span className="check">✔</span> Live Consultant Chat Support</li>
                            <li><span className="check">✔</span> Automated Vendor Assessments</li>
                        </ul>

                        <button className="btn btn-block" onClick={handleTrialClick}>
                            Start 14-Day Free Trial
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Email Modal --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Start Your 14-Day Trial</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Enter your email to unlock the full power of Gemini-driven GRC analysis.
                        </p>
                        <form onSubmit={handleModalSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="work@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ textAlign: 'center' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-block">
                                Continue to Trial
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Plans;
