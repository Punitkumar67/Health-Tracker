// src/components/LogActivity.js
import React, { useState } from 'react';
import { addItem } from '../utils/storage';

export default function LogActivity({ initialType, onDone }) {
  const [type, setType] = useState(initialType || 'water');
  const [value, setValue] = useState('');
  const [time, setTime] = useState(new Date().toISOString().slice(0,16));
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function validate() {
    setError('');
    if (!type) return 'Select activity type';
    if (value === '' || isNaN(Number(value))) return 'Enter a valid numeric value';
    if (Number(value) < 0) return 'Value must be >= 0';
    if (!time) return 'Time is required';
    return null;
  }

  function submit(e){
    e && e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      type,
      value: Number(value),
      notes: notes || '',
      time: new Date(time).toISOString()
    };
    addItem(item);
    window.dispatchEvent(new CustomEvent('pht:updated'));
    onDone && onDone();
  }

  return (
    <div className="screen">
      <h2>Log activity</h2>
      <form className="form" onSubmit={submit}>
        <label>Activity type</label>
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="water">Water (glasses)</option>
          <option value="steps">Steps</option>
          <option value="sleep">Sleep (hours)</option>
        </select>

        <label>Value / amount</label>
        <input className="input" value={value} onChange={e=>setValue(e.target.value)} placeholder={type==='sleep'? 'Hours (e.g., 7.5)': (type==='steps' ? 'Steps (e.g., 1000)' : 'Glasses (e.g., 1)')} />

        <label>Time of logging</label>
        <input type="datetime-local" className="input" value={time} onChange={e=>setTime(e.target.value)} />

        <label>Notes (optional)</label>
        <textarea className="input" rows="3" value={notes} onChange={e=>setNotes(e.target.value)} />

        {error && <div style={{ color:'#ffb3b3', marginTop:8 }}>{error}</div>}

        <div style={{ marginTop:12, display:'flex', gap:8 }}>
          <button className="qbtn" type="submit">Save</button>
          <button className="btn" type="button" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
