import React, { useState } from 'react';
import { useTripStore } from '../../store/tripStore';
import TimelineItem from './TimelineItem';
import { Plus, MapPin, Search } from 'lucide-react';

export default function Timeline() {
  const { itinerary, currentDay, addItineraryItem } = useTripStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [category, setCategory] = useState('Activities');
  
  // Free Map Autosuggest Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 21.1458, lng: 79.0882 });

  const activeItems = itinerary.filter((item) => item.day === currentDay);

  // Free OpenStreetMap Geocoding Handshake API
  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=3`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Location lookup failure:", err);
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = (result) => {
    setTitle(result.display_name.split(',')[0] + ', ' + (result.display_name.split(',')[1] || ''));
    setSelectedCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !cost) return;

    addItineraryItem({
      day: currentDay,
      time,
      title,
      cost: parseFloat(cost) || 0,
      category,
      lat: selectedCoords.lat,
      lng: selectedCoords.lng
    });

    setTitle('');
    setCost('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-sky-500" /> Daily Schedule
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm shadow-blue-300/40"
        >
          <Plus className="w-3.5 h-3.5" /> {isOpen ? "Close" : "Add Stop"}
        </button>
      </div>

      {isOpen && (
        <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-xl space-y-3 animate-fadeIn shadow-sm">
          {/* Step A: Free Location Smart Connector */}
          <div className="space-y-1 relative">
            <label className="text-[10px] text-sky-600 font-mono font-semibold uppercase">1. Pin Location on Map</label>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder="Search location (e.g. London, Nagpur Cafe)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border border-sky-200 rounded-lg p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 placeholder:text-slate-400"
              />
              <button 
                type="button"
                onClick={handleLocationSearch}
                className="bg-sky-500 hover:bg-sky-600 p-2 rounded-lg text-white text-xs flex items-center justify-center cursor-pointer shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {searching && <div className="text-[9px] text-sky-500 italic mt-1">Querying coordinates matrix...</div>}
            
            {/* Pop-up Overlay Results Grid */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-sky-200 rounded-lg shadow-xl mt-1 overflow-hidden z-[5000]">
                {searchResults.map((res, index) => (
                  <div
                    key={index}
                    onClick={() => selectLocation(res)}
                    className="p-2 text-[10px] hover:bg-sky-50 text-slate-700 hover:text-sky-700 cursor-pointer border-b border-sky-100 last:border-0 truncate transition-colors"
                  >
                    📍 {res.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step B: Meta Inputs Submission */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 font-medium">Selected Destination Target Name</label>
              <input
                type="text"
                placeholder="Destination Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 placeholder:text-slate-400"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-medium">Est. Budget Cost (₹)</label>
                <input
                  type="number"
                  placeholder="Cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-medium">Arrival Timestamp</label>
                <input
                  type="text"
                  placeholder="Time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs text-slate-700 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
              <label className="text-[10px] text-slate-500 font-medium">Category Classification</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-sky-200 rounded-lg p-2 text-xs text-slate-700 outline-none focus:border-sky-500"
              >
                <option value="Activities">Activities</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-gradient-to-br from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-sm shadow-blue-300/40">
              Confirm and Sync to Map Engine
            </button>
          </form>
        </div>
      )}

      <div className="relative border-l-2 border-sky-200 pl-4 ml-2 space-y-4">
        {activeItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No stops mapped out on this day yet.</p>
        ) : (
          activeItems.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}