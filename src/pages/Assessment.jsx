import React, { useState } from 'react';
import {
    INDUSTRIES, REGIONS, COMPANY_SIZES,
    YES_NO_OPTIONS
} from '../logic/constants';

// Simplified Constants for the new assessment
const FREQUENCY_OPTIONS = [
    { id: 'daily', label: 'Daily / Real-time' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'annual', label: 'Annually' },
    { id: 'never', label: 'Never / Ad-hoc' }
];

const COMPLIANCE_LIST = [
    { id: 'iso27001', label: 'ISO 27001' },
    { id: 'soc2', label: 'SOC 2 Type II' },
    { id: 'pci_dss', label: 'PCI-DSS' },
    { id: 'hipaa', label: 'HIPAA' },
    { id: 'gdpr', label: 'GDPR / CCPA' },
    { id: 'nist', label: 'NIST CSF' }
];

const Assessment = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 6; // Reduced to 6 critical dimensions

    const [formData, setFormData] = useState({
        // 0. Profile
        name: '', region: 'us', industry: 'saas', size: '11-50',

        // 1. Governance
        policiesDocumented: 'none', // complete, partial, none
        cisoPresent: 'no',
        securityTeamSize: 0,
        managementReview: 'never',

        // 2. Risk
        riskAssessmentFreq: 'never',
        bcpDocumented: 'no',
        backupFrequency: 'none',
        cyberInsurance: 'no',

        // 3. Compliance
        complianceFrameworks: [],
        privacyProgram: 'no',
        lastAuditDate: '',

        // 4. Technical
        firewallEnabled: 'yes',
        networkSegmentation: 'no',
        antivirus: 'yes',
        edr: 'no',
        vulnerabilityScanning: 'never', // regular, never
        patchingAutomated: 'no',

        // 5. Application
        mfa: 'none', // mandatory, optional, none
        sso: 'no',
        encryption: 'no', // combined
        codeReview: 'no',

        // 6. Operational
        incidentResponsePlan: 'no',
        securityTraining: 'none', // regular, none
        vendorRiskProgram: 'no',

        // Extras needed for risk generation logic logic
        remote: 'yes', // assume default for modern
        hosting: 'cloud',
        criticalVendorCount: 5
    });

    const update = (field, value) => setFormData(p => ({ ...p, [field]: value }));
    const toggle = (field, value) => {
        setFormData(p => {
            const arr = p[field];
            return { ...p, [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
        });
    };

    const next = () => step < totalSteps ? setStep(step + 1) : onComplete(formData);
    const back = () => setStep(Math.max(1, step - 1));

    return (
        <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem' }}>
            <div className="glass-card">
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Security Assessment</h2>
                    <span className="badge badge-warning">Step {step} / {totalSteps}</span>
                </div>

                {/* STEP 1: GOVERNANCE */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <h3>1. Governance & Strategy</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Tell us about your organization and how security is managed.</p>

                        <div className="grid-2">
                            <div className="input-group">
                                <label>Company Name</label>
                                <input type="text" className="form-control" value={formData.name} onChange={e => update('name', e.target.value)} placeholder="Acme Corp" />
                            </div>
                            <Select label="Industry" value={formData.industry} onChange={e => update('industry', e.target.value)} options={INDUSTRIES} />
                        </div>

                        <div className="grid-2">
                            <Select label="Policies Documented?" value={formData.policiesDocumented} onChange={e => update('policiesDocumented', e.target.value)}
                                options={[{ id: 'complete', label: 'Complete Set' }, { id: 'partial', label: 'Partial / Ad-hoc' }, { id: 'none', label: 'None' }]} />
                            <RadioGroup label="Designated Security Lead (CISO)?" value={formData.cisoPresent} onChange={v => update('cisoPresent', v)} options={YES_NO_OPTIONS} />
                        </div>

                        <div className="grid-2" style={{ marginTop: '1rem' }}>
                            <div className="input-group">
                                <label>Security Team Size (People)</label>
                                <input type="number" className="form-control" value={formData.securityTeamSize} onChange={e => update('securityTeamSize', parseInt(e.target.value))} />
                            </div>
                            <Select label="Management Review Frequency" value={formData.managementReview} onChange={e => update('managementReview', e.target.value)} options={FREQUENCY_OPTIONS} />
                        </div>
                    </div>
                )}

                {/* STEP 2: RISK */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <h3>2. Risk & Continuity</h3>
                        <div className="grid-2">
                            <Select label="Risk Assessment Frequency" value={formData.riskAssessmentFreq} onChange={e => update('riskAssessmentFreq', e.target.value)} options={FREQUENCY_OPTIONS} />
                            <RadioGroup label="Business Continuity Plan (BCP)?" value={formData.bcpDocumented} onChange={v => update('bcpDocumented', v)} options={YES_NO_OPTIONS} />
                        </div>
                        <div className="grid-2" style={{ marginTop: '1rem' }}>
                            <Select label="Data Backup Frequency" value={formData.backupFrequency} onChange={e => update('backupFrequency', e.target.value)}
                                options={[{ id: 'real_time', label: 'Real-time / Hourly' }, { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }, { id: 'none', label: 'None' }]} />
                            <RadioGroup label="Cyber Insurance Policy?" value={formData.cyberInsurance} onChange={v => update('cyberInsurance', v)} options={YES_NO_OPTIONS} />
                        </div>
                    </div>
                )}

                {/* STEP 3: COMPLIANCE */}
                {step === 3 && (
                    <div className="animate-fade-in">
                        <h3>3. Compliance & Privacy</h3>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Current or Target Certifications</label>
                        <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem' }}>
                            {COMPLIANCE_LIST.map(f => (
                                <label key={f.id} style={checkStyle(formData.complianceFrameworks.includes(f.id))}>
                                    <input type="checkbox" checked={formData.complianceFrameworks.includes(f.id)} onChange={() => toggle('complianceFrameworks', f.id)} style={{ marginRight: '0.5rem' }} />
                                    {f.label}
                                </label>
                            ))}
                        </div>

                        <div className="grid-2">
                            <RadioGroup label="Formal Privacy Program?" value={formData.privacyProgram} onChange={v => update('privacyProgram', v)} options={YES_NO_OPTIONS} />
                            <div className="input-group">
                                <label>Last External Audit Date</label>
                                <input type="date" className="form-control" value={formData.lastAuditDate} onChange={e => update('lastAuditDate', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: TECHNICAL */}
                {step === 4 && (
                    <div className="animate-fade-in">
                        <h3>4. Technical Security</h3>
                        <div className="grid-2">
                            <RadioGroup label="Firewall / Perimeter Security?" value={formData.firewallEnabled} onChange={v => update('firewallEnabled', v)} options={YES_NO_OPTIONS} />
                            <RadioGroup label="Network Segmentation?" value={formData.networkSegmentation} onChange={v => update('networkSegmentation', v)} options={YES_NO_OPTIONS} />
                        </div>
                        <h4 style={{ marginTop: '1.5rem' }}>Endpoint & Patching</h4>
                        <div className="grid-2">
                            <RadioGroup label="Antivirus / EDR Installed?" value={formData.antivirus} onChange={v => update('antivirus', v)} options={YES_NO_OPTIONS} />
                            <RadioGroup label="Automated Patching?" value={formData.patchingAutomated} onChange={v => update('patchingAutomated', v)} options={YES_NO_OPTIONS} />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Select label="Vulnerability Scanning" value={formData.vulnerabilityScanning} onChange={e => update('vulnerabilityScanning', e.target.value)}
                                options={[{ id: 'regular', label: 'Regular (Weekly/Monthly)' }, { id: 'ad_hoc', label: 'Ad-hoc' }, { id: 'never', label: 'Never' }]} />
                        </div>
                    </div>
                )}

                {/* STEP 5: APPLICATION */}
                {step === 5 && (
                    <div className="animate-fade-in">
                        <h3>5. Application & Data Security</h3>
                        <div className="grid-2">
                            <Select label="Multi-Factor Auth (MFA)" value={formData.mfa} onChange={e => update('mfa', e.target.value)}
                                options={[{ id: 'mandatory', label: 'Mandatory (All Users)' }, { id: 'optional', label: 'Optional / Admin Only' }, { id: 'none', label: 'Not Enabled' }]} />
                            <RadioGroup label="Single Sign-On (SSO)?" value={formData.sso} onChange={v => update('sso', v)} options={YES_NO_OPTIONS} />
                        </div>
                        <div className="grid-2" style={{ marginTop: '1rem' }}>
                            <RadioGroup label="Encryption (Rest & Transit)?" value={formData.encryption} onChange={v => update('encryption', v)} options={YES_NO_OPTIONS} />
                            <RadioGroup label="Regular Code Reviews?" value={formData.codeReview} onChange={v => update('codeReview', v)} options={YES_NO_OPTIONS} />
                        </div>
                    </div>
                )}

                {/* STEP 6: OPERATIONAL */}
                {step === 6 && (
                    <div className="animate-fade-in">
                        <h3>6. Operational Security</h3>
                        <div className="grid-2">
                            <RadioGroup label="Incident Response Plan?" value={formData.incidentResponsePlan} onChange={v => update('incidentResponsePlan', v)} options={YES_NO_OPTIONS} />
                            <RadioGroup label="Vendor Risk Program?" value={formData.vendorRiskProgram} onChange={v => update('vendorRiskProgram', v)} options={YES_NO_OPTIONS} />
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <Select label="Security Awareness Training" value={formData.securityTraining} onChange={e => update('securityTraining', e.target.value)}
                                options={[{ id: 'regular', label: 'Regular / On-hire' }, { id: 'none', label: 'None' }]} />
                        </div>

                        <div className="glass-card" style={{ marginTop: '2rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                            <h4 style={{ marginTop: 0 }}>Ready to Generate Report!</h4>
                            <p>We will analyze your inputs using Llama 3.3:70b to generate a comprehensive 6-section GRC report.</p>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                    <button className="btn btn-outline" onClick={back} disabled={step === 1}>Back</button>
                    <button className="btn" onClick={next}>{step === totalSteps ? 'Generate Report' : 'Next Section'}</button>
                </div>
            </div>
        </div>
    );
};

// Components
const Select = ({ label, value, onChange, options }) => (
    <div className="input-group">
        <label>{label}</label>
        <select className="form-control" value={value} onChange={onChange}>
            {options.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
    </div>
);

const RadioGroup = ({ label, value, onChange, options }) => (
    <div className="input-group">
        <label>{label}</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            {options.map(o => (
                <button key={o} className={`btn ${value === o ? '' : 'btn-outline'}`} onClick={() => onChange(o)} style={{ textTransform: 'capitalize', padding: '0.5rem 1rem' }}>{o}</button>
            ))}
        </div>
    </div>
);

const checkStyle = (active) => ({
    display: 'flex', alignItems: 'center', padding: '0.8rem', borderRadius: '4px',
    background: active ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.05)',
    cursor: 'pointer', border: active ? '1px solid var(--accent-primary)' : '1px solid transparent'
});

export default Assessment;
