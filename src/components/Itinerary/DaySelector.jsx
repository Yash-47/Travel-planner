import React from 'react';
import { useTripStore } from '../../store/tripStore';

export default function DaySelector() {
  const { days, currentDay, setCurrentDay } = useTripStore();

  return (
    <div className="flex items-center gap-2 bg-sky-50 p-1.5 rounded-xl border border-sky-200/80 shadow-inner">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => setCurrentDay(day)}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
            currentDay === day
              ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-400/30'
              : 'text-slate-500 hover:text-sky-700 hover:bg-sky-100'
          }`}
        >
          Day 0{day}
        </button>
      ))}
    </div>
  );
}