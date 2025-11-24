// src/components/Onboarding.js
import React from 'react';

export default function Onboarding({ onFinish }) {
  return (
    <div className="onboard">
      <h1>Personal Health Tracker</h1>
      <p>
        Track your daily water, steps and sleep. Quick logging and a simple history
        help you build healthy habits. All data is stored locally in your browser.
      </p>

      <div style={{ marginTop: 18 }}>
        <button className="qbtn" onClick={onFinish} style={{ fontSize: 16, padding: '12px 22px' }}>
          Start tracking
        </button>
      </div>
    </div>
  );
}
