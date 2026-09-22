import React from 'react';
import DaySelector from './components/Itinerary/DaySelector';
import Timeline from './components/Itinerary/Timeline';
import BudgetSummary from './components/Budget/BudgetSummary';
import ExpenseList from './components/Budget/ExpenseList';
import TravelAssistant from './components/AI/TravelAssistant';
import LoginModal from './components/Auth/LoginModal';
import { Compass, Plane } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen text-slate-800 flex flex-col p-4 md:p-6 antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Navigation Bar */}
      <header className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl px-5 py-3 shadow-lg shadow-blue-100/60">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-400/30 flex items-center justify-center">
            <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent m-0">VOYAGER</h1>
            <p className="text-[11px] text-sky-500 font-semibold tracking-wide flex items-center gap-1">
              <Plane className="w-3 h-3" /> Smart Travel Orchestration Dashboard
            </p>
          </div>
        </div>
        
        {/* Auth Controls */}
        <LoginModal />
      </header>

      {/* Main Dashboard Grid */}
      <div id="dashboard-workspace-grid" className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full mx-auto items-stretch">
        
        {/* Left Column — Itinerary & Budget */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4 bg-white/70 backdrop-blur-xl border border-white/90 p-5 rounded-2xl shadow-xl shadow-blue-100/50 h-[500px]">
            <DaySelector />
            <div className="flex-1 overflow-y-auto">
              <Timeline />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 p-5 rounded-2xl shadow-xl shadow-blue-100/50">
            <BudgetSummary />
          </div>
        </div>

        {/* Right Column — AI Assistant & Expenses */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex-1 flex flex-col bg-white/70 backdrop-blur-xl border border-white/90 p-5 rounded-2xl shadow-xl shadow-blue-100/50 min-h-[500px]">
            <TravelAssistant />
          </div>
          <div className="bg-white/70 backdrop-blur-xl border border-white/90 p-5 rounded-2xl shadow-xl shadow-blue-100/50">
            <ExpenseList />
          </div>
        </div>

      </div>
    </div>
  );
}