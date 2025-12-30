import React from 'react';

const FreeTrial = ({ onBack }) => {
    return (
        <div className="container" style={{ paddingTop: '10vh', textAlign: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                    Free 14-Day Trial
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Access the full power of our Gemini-powered Virtual CISO.
                </p>

                <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', marginBottom: '2rem' }}>
                    <p>Trial registration coming soon...</p>
                </div>

                <button className="btn btn-outline" onClick={onBack}>
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default FreeTrial;
