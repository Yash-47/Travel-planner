import React from 'react';
import { useTripStore } from '../../store/tripStore';

export default function MarkerPopup({ item }) {
  const { currency } = useTripStore();
  return (
    <div className="bg-white border border-sky-200 text-slate-700 p-3 rounded-xl shadow-xl backdrop-blur-md w-48 animate-fadeIn">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-medium border border-sky-200">
          {item.time}
        </span>
        <span className="text-xs font-semibold text-emerald-600">{currency} {item.cost}</span>
      </div>
      <h4 className="text-xs font-bold truncate text-slate-800">{item.title}</h4>
      <p className="text-[10px] text-slate-400 mt-1">Tag: {item.category}</p>
    </div>
  );
}