import React from 'react';

export default function MarkerPopup({ item }) {
  return (
    <div className="bg-slate-950/90 border border-slate-700 text-white p-3 rounded-xl shadow-xl backdrop-blur-md w-48 animate-fadeIn">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-medium">
          {item.time}
        </span>
        <span className="text-xs font-semibold text-emerald-400">${item.cost}</span>
      </div>
      <h4 className="text-xs font-bold truncate text-slate-100">{item.title}</h4>
      <p className="text-[10px] text-slate-400 mt-1">Tag: {item.category}</p>
    </div>
  );
}