import React from 'react';
import { useTripStore } from '../../store/tripStore';
import { CreditCard, Trash2 } from 'lucide-react';

export default function ExpenseList() {
  const { itinerary, deleteItineraryItem, currency } = useTripStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-sky-500" /> Itemized Expense Ledger
      </h3>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden max-h-52 overflow-y-auto shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-sky-50 text-slate-500 font-semibold border-b border-sky-100">
              <th className="p-2.5">Item</th>
              <th className="p-2.5">Tag</th>
              <th className="p-2.5 text-right">Cost</th>
              <th className="p-2.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {itinerary.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-slate-400 italic">No tracked transactions found.</td>
              </tr>
            ) : (
              itinerary.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/60 text-slate-700 transition-colors group">
                  <td className="p-2.5 font-medium max-w-[100px] truncate">{item.title}</td>
                  <td className="p-2.5 text-[10px] text-sky-500 font-mono">D{item.day} • {item.category}</td>
                  <td className="p-2.5 text-right font-bold text-emerald-600">{currency} {item.cost}</td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => deleteItineraryItem(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}