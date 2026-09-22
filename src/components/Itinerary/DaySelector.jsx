import React from 'react';
import { useTripStore } from '../../store/tripStore';

export default function DaySelector() {
  const { days, currentDay, setCurrentDay } = useTripStore();

  return (
    <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => setCurrentDay(day)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            currentDay === day
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Day 0{day}
        </button>
      ))}
    </div>
  );
}