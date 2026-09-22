import React from 'react';
import { useTripStore } from '../../store/tripStore';
import { Trash2, Clock } from 'lucide-react';

export default function TimelineItem({ item }) {
  const { setHoveredItem, deleteItineraryItem, hoveredItemId, selectedItemId, currency } = useTripStore();

  const isHighlighted = hoveredItemId === item.id || selectedItemId === item.id;

  return (
    <div
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className={`relative p-3 rounded-xl border transition-all duration-300 group ${
        isHighlighted
          ? 'bg-sky-50 border-sky-400 shadow-md shadow-sky-200/50'
          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-sm'
      }`}
    >
      {/* Timeline Visual Indicator Ring */}
      <div className={`absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full border-2 transition-transform duration-300 ${
        isHighlighted ? 'bg-sky-500 border-sky-500 scale-125' : 'bg-white border-sky-300'
      }`} />

      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {item.time}
            <span className="mx-1">•</span>
            <span className="text-sky-500 font-semibold">{item.category}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-700">{item.title}</h4>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-600">{currency} {item.cost}</span>
          <button
            onClick={() => deleteItineraryItem(item.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}