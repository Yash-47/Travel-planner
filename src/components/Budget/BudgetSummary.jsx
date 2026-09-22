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

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

  const handleExportCurrentDayPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const activeItems = itinerary.filter(item => item.day === currentDay);
      
      pdf.setFillColor(15, 23, 42); 
      pdf.rect(0, 0, 210, 40, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VOYAGER TRAVEL REPORT', 14, 18);
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
      pdf.save(`Voyager_Itinerary_Day_0${currentDay}.pdf`);
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
      pdf.text('VOYAGER MASTER TRIP LEDGER', 14, 22);
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
      pdf.save(`Voyager_Master_FullTrip_Report.pdf`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-4 text-left shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-emerald-500" /> Financial Dashboard
        </h3>
        
        <div className="flex items-center gap-1.5 bg-sky-50 px-2 py-1 rounded-lg border border-sky-200">
          <Globe className="w-3 h-3 text-sky-500" />
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-sky-50 text-[10px] text-slate-700 outline-none border-none font-bold cursor-pointer focus:ring-0"
          >
            {Object.keys(exchangeRates).map(cur => (
              <option key={cur} value={cur} className="bg-white text-slate-700 font-medium py-1">
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
            <p className={`text-lg font-black ${isOverBudget ? 'text-rose-500' : 'text-emerald-600'}`}>
              {currency} {convertedSpent}
            </p>
          </div>
          <div>
            <p className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Threshold Limit</p>
            <p className="text-xs font-bold text-slate-700">{currency} {convertedLimit}</p>
          </div>
        </div>

        <div className="w-full h-24 flex justify-center items-center">
          {chartData.length === 0 ? (
            <p className="text-[10px] text-slate-400 italic">No cost ledger tracked</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={18} outerRadius={32} paddingAngle={3} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', fontSize: '10px', color: '#334155', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
          <div className={`h-full transition-all duration-500 rounded-full ${isOverBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-sky-400 to-emerald-500'}`} style={{ width: `${progressPercent}%` }} />
        </div>
        {isOverBudget && (
          <div className="flex items-center gap-1.5 text-[9px] text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg mt-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Warning: Budget limit exceeded.</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <button 
          onClick={handleExportCurrentDayPDF} 
          className="w-full bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-600 hover:text-sky-700 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-sky-500" /> Download Day 0{currentDay} Sheet
        </button>
        <button 
          onClick={handleExportAllDaysPDF} 
          className="w-full bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md shadow-blue-300/30"
        >
          <FileText className="w-3.5 h-3.5" /> Export Full Trip Ledger (All Days)
        </button>
      </div>
    </div>
  );
}