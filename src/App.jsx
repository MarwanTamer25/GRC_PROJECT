import React, { useState } from 'react';
import Home from './pages/Home';
import Assessment from './pages/Assessment';
import Report from './pages/Report';
import FreeTrial from './pages/FreeTrial';
import Plans from './pages/Plans';
import About from './pages/About';

function App() {
  const [view, setView] = useState('home'); // home, assessment, report, trial, plans, about
  const [profile, setProfile] = useState(null);

  const startAssessment = () => setView('assessment');
  const startTrial = () => setView('trial');
  const showPlans = () => setView('plans');
  const showAbout = () => setView('about');

  const completeAssessment = (data) => {
    setProfile(data);
    setView('report');
  };

  const reset = () => setView('home');

  return (
    <div className="App">
      {view === 'home' && (
        <Home
          onStart={startAssessment}
          onPlans={showPlans}
          onAbout={showAbout}
        />
      )}
      {view === 'plans' && (
        <Plans
          onStart={startAssessment}
          onTrial={startTrial}
          onBack={reset}
        />
      )}
      {view === 'trial' && <FreeTrial onBack={reset} />}
      {view === 'assessment' && <Assessment onComplete={completeAssessment} />}
      {view === 'report' && <Report profile={profile} onBack={reset} />}
      {view === 'about' && <About onBack={reset} />}
    </div>
  );
}

export default App;
