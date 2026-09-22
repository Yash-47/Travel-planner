import { create } from 'zustand';

export const useTripStore = create((set, get) => ({
  user: null,
  currentDay: 1,
  days: [1, 2, 3],
  budgetLimit: 125000,
  currency: 'INR',
  
  exchangeRates: { 
    USD: 1, 
    INR: 83.5, 
    EUR: 0.92, 
    GBP: 0.78, 
    JPY: 158.2, 
    CAD: 1.37, 
    AUD: 1.49 
  },

  itinerary: [
    { id: '1', day: 1, time: '09:00 AM', title: 'Central Station, Nagpur', cost: 500, category: 'Transport', lat: 21.1523, lng: 79.0882 },
    { id: '2', day: 1, time: '11:30 AM', title: 'Futala Lake, Nagpur', cost: 1200, category: 'Activities', lat: 21.1458, lng: 79.0511 },
    { id: '3', day: 1, time: '03:00 PM', title: 'Haldirams, Nagpur', cost: 800, category: 'Food', lat: 21.1605, lng: 79.0795 },
  ],

  chatHistory: [{ role: 'model', parts: [{ text: "Hello! I am your AI Travel Assistant powered by Gemini. Ask me to analyze your budget health, suggest activities, or breakdown your expenses!" }] }],

  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  setApiKey: (key) => set({ apiKey: key }),

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  setCurrentDay: (day) => set({ currentDay: day }),
  setCurrency: (currency) => set({ currency }),
  
  addItineraryItem: (item) => set((state) => ({ 
    itinerary: [...state.itinerary, { 
      ...item, 
      id: Date.now().toString(),
      cost: Number(item.cost),
      lat: Number(item.lat),
      lng: Number(item.lng)
    }] 
  })),
  
  deleteItineraryItem: (id) => set((state) => ({ 
    itinerary: state.itinerary.filter(item => item.id !== id) 
  })),

  addChatMessage: (msg) => set((state) => ({
    chatHistory: [...state.chatHistory, msg]
  })),

  getConvertedAmount: (amountInUSD) => {
    const rate = get().exchangeRates[get().currency] || 1;
    return (amountInUSD * rate).toFixed(2);
  }
}));