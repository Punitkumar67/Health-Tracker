// src/App.js
import React, { useEffect, useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LogActivity from './components/LogActivity';
import History from './components/History';
import { readItems } from './utils/storage';

export default function App(){
  const [showOnboard, setShowOnboard] = useState(() => {
    // check local flag
    try { return !localStorage.getItem('pht_seen_onboard'); } catch { return true; }
  });
  const [screen, setScreen] = useState('dashboard'); // 'dashboard' | 'log' | 'history'
  const [initialType, setInitialType] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(()=>{
    function h(){ setRefreshFlag(f=>f+1); }
    window.addEventListener('pht:updated', h);
    return ()=> window.removeEventListener('pht:updated', h);
  },[]);

  function finishOnboard(){
    try { localStorage.setItem('pht_seen_onboard', '1'); } catch {}
    setShowOnboard(false);
  }

  function openLog(type){
    setInitialType(type || null);
    setScreen('log');
  }

  function openHistory(){
    setScreen('history');
  }

  function goHome(){
    setScreen('dashboard');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Health Tracker</div>
        <div className="nav">
          <button className="btn" onClick={()=>{ setShowOnboard(true); }}>Onboarding</button>
          <button className="btn" onClick={()=> setScreen('dashboard')}>Dashboard</button>
          <button className="btn" onClick={()=> openHistory()}>History</button>
        </div>
      </header>

      { showOnboard ? (
        <Onboarding onFinish={finishOnboard} />
      ) : (
        <>
          { screen === 'dashboard' && <Dashboard onOpenLog={(t)=>openLog(t)} onOpenHistory={openHistory} /> }
          { screen === 'log' && <LogActivity initialType={initialType} onDone={()=>goHome()} /> }
          { screen === 'history' && <History onClose={()=>goHome()} /> }
        </>
      )}
    </div>
  );
}
