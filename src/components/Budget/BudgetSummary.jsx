import React from 'react';
import { useTripStore } from '../../store/tripStore';
import jsPDF from 'jspdf';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DollarSign, Download, Globe, AlertCircle, FileText } from 'lucide-react';

export default function BudgetSummary() {
  const { itinerary, budgetLimit, currency, setCurrency, exchangeRates, currentDay } = useTripStore();

  const currentRate = exchangeRates[currency] || 1;
  const totalSpentUSD = itinerary.reduce((sum, item) => sum + item.cost, 0);
  
  const convertedSpent = (totalSpentUSD * currentRate).toFixed(2);
  const convertedLimit = (budgetLimit * currentRate).toFixed(2);
  const isOverBudget = parseFloat(convertedSpent) > parseFloat(convertedLimit);
  const progressPercent = Math.min((totalSpentUSD / budgetLimit) * 100, 100);

  const categoryTotals = itinerary.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.cost * currentRate);
    return acc;
  }, {});

  const chartData = Object.keys(categoryTotals).map((key) => ({
    name: key,
    value: parseFloat(categoryTotals[key].toFixed(2)),
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  const handleExportCurrentDayPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const activeItems = itinerary.filter(item => item.day === currentDay);
      
      pdf.setFillColor(15, 23, 42); 
      pdf.rect(0, 0, 210, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ROAMIFY TRAVEL REPORT', 14, 18);
      pdf.setFontSize(10);
      pdf.setTextColor(129, 140, 248);
      pdf.text(`Single Day Financial Ledger • View Context: Day 0${currentDay}`, 14, 26);

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total Spending Context: ${currency} ${convertedSpent} / ${currency} ${convertedLimit}`, 14, 52);
      pdf.line(14, 56, 196, 56);

      let currentY = 68;
      pdf.setFontSize(10);
      pdf.setFillColor(241, 245, 249);
      pdf.rect(14, currentY - 5, 182, 8, 'F');
      pdf.text('Time', 16, currentY);
      pdf.text('Location / Stop Title', 45, currentY);
      pdf.text('Category', 120, currentY);
      pdf.text(`Cost (${currency})`, 170, currentY);
      
      pdf.setFont('helvetica', 'normal');
      if (activeItems.length === 0) {
        currentY += 12;
        pdf.text('No planned events tracked on this chronological timeline block.', 16, currentY);
      } else {
        activeItems.forEach((item) => {
          currentY += 10;
          const convertedCost = (item.cost * currentRate).toFixed(2);
          pdf.text(item.time, 16, currentY);
          pdf.text(item.title, 45, currentY);
          pdf.text(item.category, 120, currentY);
          pdf.text(`${convertedCost}`, 170, currentY);
        });
      }
      pdf.save(`Roamify_Itinerary_Day_0${currentDay}.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportAllDaysPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const totalDays = [...new Set(itinerary.map(item => item.day))].sort((a,b) => a-b);
      
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, 210, 50, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ROAMIFY MASTER TRIP LEDGER', 14, 22);
      pdf.setFontSize(11);
      pdf.setTextColor(129, 140, 248);
      pdf.text(`Unified Expense Portfolio Across Multi-Day Operations`, 14, 32);

      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Financial Portfolio Balance Summary', 14, 68);
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Base Budget Target: ${currency} ${convertedLimit}`, 14, 80);
      pdf.text(`Aggregated Portfolio Spending: ${currency} ${convertedSpent}`, 14, 88);
      
      const daysToRender = totalDays.length > 0 ? totalDays : [1, 2, 3];
      
      daysToRender.forEach((dayNum) => {
        pdf.addPage();
        let dayY = 25;
        pdf.setFillColor(248, 250, 252);
        pdf.rect(14, dayY - 6, 182, 10, 'F');
        pdf.setTextColor(79, 70, 229);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`CHRONOLOGICAL ITINERARY: DAY 0${dayNum}`, 16, dayY);
        
        const dayItems = itinerary.filter(item => item.day === dayNum);
        dayY += 15;
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139);
        pdf.text('Time', 16, dayY);
        pdf.text('Destination Stop', 45, dayY);
        pdf.text('Tag', 130, dayY);
        pdf.text(`Expense (${currency})`, 170, dayY);
        
        pdf.setTextColor(15, 23, 42);
        pdf.setFont('helvetica', 'normal');
        
        if (dayItems.length === 0) {
          dayY += 12;
          pdf.text('No scheduled transactions mapped on this day.', 16, dayY);
        } else {
          dayItems.forEach(item => {
            dayY += 10;
            const itemCost = (item.cost * currentRate).toFixed(2);
            pdf.text(item.time, 16, dayY);
            pdf.text(item.title, 45, dayY);
            pdf.text(item.category, 130, dayY);
            pdf.text(`${itemCost}`, 170, dayY);
          });
        }
      });
      pdf.save(`Roamify_Master_FullTrip_Report.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-400" /> Financial Dashboard
        </h3>
        
        {/* FIX: Styled drop-down layer container to enforce background visibility configurations natively */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <Globe className="w-3 h-3 text-indigo-400" />
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-950 text-[10px] text-white outline-none border-none font-bold cursor-pointer focus:ring-0"
          >
            {Object.keys(exchangeRates).map(cur => (
              <option key={cur} value={cur} className="bg-slate-950 text-white font-medium py-1">
                {cur}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 items-center">
        <div className="space-y-2">
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Total Expenses</p>
            <p className={`text-lg font-black ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
              {currency} {convertedSpent}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Threshold Limit</p>
            <p className="text-xs font-bold text-slate-200">{currency} {convertedLimit}</p>
          </div>
        </div>

        <div className="w-full h-24 flex justify-center items-center">
          {chartData.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">No cost ledger tracked</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={18} outerRadius={32} paddingAngle={3} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', fontSize: '10px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${progressPercent}%` }} />
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-1.5 text-[9px] text-rose-400 bg-rose-500/10 p-2 rounded-lg mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Warning: Budget limit exceeded.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <button 
          onClick={handleExportCurrentDayPDF} 
          className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-indigo-600/10 text-slate-300 hover:text-white flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" /> Download Day 0{currentDay} Sheet
        </button>
        <button 
          onClick={handleExportAllDaysPDF} 
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <FileText className="w-3.5 h-3.5" /> Export Full Trip Ledger (All Days)
        </button>
      </div>
    </div>
  );
}