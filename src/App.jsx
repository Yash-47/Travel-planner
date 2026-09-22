import React from 'react';
import MapCanvas from './components/Map/MapCanvas';
import DaySelector from './components/Itinerary/DaySelector';
import Timeline from './components/Itinerary/Timeline';
import BudgetSummary from './components/Budget/BudgetSummary';
import ExpenseList from './components/Budget/ExpenseList';
import TravelAssistant from './components/AI/TravelAssistant';
import LoginModal from './components/Auth/LoginModal';
import { Compass } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col p-4 md:p-6 antialiased">
      
      {/* Navigation Bar Header Grid Container */}
      <header className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg flex items-center justify-center">
            <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white m-0">ROAMIFY</h1>
            <p className="text-xs text-indigo-400 font-medium tracking-wide">Smart Travel Orchestration Dashboard</p>
          </div>
        </div>
        
        {/* Top-Right Authenticated Navigation Control Container */}
        <LoginModal />
      </header>

      {/* Main Unified Blueprint Content Workspace Area Grid */}
      <div id="dashboard-workspace-grid" className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full mx-auto items-stretch">
        
        {/* Left Control Column Stack */}
        <div className="lg:col-span-4 flex flex-col gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <DaySelector />
          <div className="flex-1 overflow-y-auto">
            <Timeline />
          </div>
        </div>

        {/* Center Map Visual Column Wrapper */}
        <div className="lg:col-span-5 flex flex-col h-[450px] lg:h-auto min-h-[400px]">
          <MapCanvas />
        </div>

        {/* Right Financial & Artificial Intelligence Column Stack */}
        <div className="lg:col-span-3 flex flex-col gap-4 bg-slate-900/40 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <BudgetSummary />
          <ExpenseList />
          <TravelAssistant />
        </div>

      </div>
    </div>
  );
}