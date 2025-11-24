// src/components/History.js
import React, { useEffect, useState } from 'react';
import { getLast7DaysItems, readItems } from '../utils/storage';

function groupByDate(items) {
  const groups = {};
  items.forEach(it => {
    const d = new Date(it.time);
    const key = d.toISOString().slice(0,10);
    if (!groups[key]) groups[key] = [];
    groups[key].push(it);
  });
  // sort keys descending
  const sortedKeys = Object.keys(groups).sort((a,b) => b.localeCompare(a));
  return sortedKeys.map(k => ({ date: k, items: groups[k].sort((x,y)=> new Date(y.time)-new Date(x.time)) }));
}

export default function History({ onClose }) {
  const [data, setData] = useState([]);

  function load(){
    const items = getLast7DaysItems();
    setData(groupByDate(items));
  }

  useEffect(()=> {
    load();
    function handler(){ load(); }
    window.addEventListener('pht:updated', handler);
    return ()=> window.removeEventListener('pht:updated', handler);
  }, []);

  return (
    <div className="screen">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>History (last 7 days)</h2>
        <div>
          <button className="btn" onClick={load}>Refresh</button>
          <button className="btn" onClick={onClose} style={{ marginLeft:8 }}>Close</button>
        </div>
      </div>

      {data.length === 0 && <div className="small" style={{ marginTop:14 }}>No activities logged in the last 7 days.</div>}

      {data.map(group => (
        <div className="group" key={group.date}>
          <h4>{new Date(group.date).toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' })}</h4>
          {group.items.map(it => (
            <div className="item" key={it.id}>
              <div>
                <div style={{ fontWeight:700 }}>{it.type.toUpperCase()}</div>
                <div className="meta">{it.notes || <span style={{ color:'#888' }}>—</span>}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontWeight:800 }}>{it.type==='steps' ? `${it.value}` : `${it.value}` + (it.type==='sleep'? ' hr' : ' glass')}</div>
                <div className="meta">{new Date(it.time).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
