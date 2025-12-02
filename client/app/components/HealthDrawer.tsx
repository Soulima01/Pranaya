'use client';

import { useEffect, useState } from 'react';
import { X, Droplets, Pill, Syringe, CalendarHeart, Plus, Trash2, CheckCircle2, Circle, User, MessageSquare, History, Activity } from 'lucide-react';
import { useUserStore } from '@/lib/store/userStore';

// Define Message Type locally for props
type Message = {
  role: 'user' | 'bot';
  content: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chatHistory: Message[]; 
}

export default function HealthDrawer({ isOpen, onClose, chatHistory }: Props) {
  const { profile, trackers, addWater, addMed, toggleMed, removeMed, addVaccine, removeVaccine, getWaterGoal, checkDailyReset } = useUserStore();
  
  const [newMed, setNewMed] = useState('');
  const [newVac, setNewVac] = useState('');
  const [activeTab, setActiveTab] = useState<'trackers' | 'history'>('trackers'); 

  // Check for new day reset whenever drawer opens
  useEffect(() => {
    if (isOpen) checkDailyReset();
  }, [isOpen, checkDailyReset]);

  if (!isOpen) return null;

  // Calculate Water Progress
  const dailyGoal = getWaterGoal(); 
  const percentage = Math.min((trackers.water / dailyGoal) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Activity size={20} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Health Hub</h2>
                <p className="text-xs text-gray-500">{profile.name} • {profile.age}y • {profile.weight}kg</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-white sticky top-0 z-10">
            <button 
                onClick={() => setActiveTab('trackers')}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'trackers' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Daily Trackers
            </button>
            <button 
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                History & Profile
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
          
          {/* === TAB 1: TRACKERS === */}
          {activeTab === 'trackers' && (
            <div className="space-y-6 animate-in fade-in">
                
                {/* 1. Water Tracker */}
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-blue-800 font-bold"><Droplets size={20} /> Hydration</div>
                    <div className="text-right">
                        <span className="text-3xl font-black text-blue-600">{trackers.water}</span>
                        <span className="text-sm text-blue-400 font-medium"> / {dailyGoal}ml</span>
                    </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-blue-200 h-2 rounded-full mb-4 overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    
                    <button onClick={() => addWater(250)} className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition shadow-blue-200 shadow-md">
                        <Plus size={18} /> Add Glass (250ml)
                    </button>
                </div>

                {/* 2. Medication Checklist */}
                <div className="bg-red-50 p-5 rounded-2xl border border-red-100 shadow-sm">
                    <div className="flex items-center justify-between text-red-800 font-bold mb-4">
                        <div className="flex items-center gap-2"><Pill size={20} /> Daily Meds</div>
                        <span className="text-xs font-normal bg-white px-2 py-1 rounded border border-red-100 text-red-400">Resets Daily</span>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                        {trackers.meds.length === 0 ? <li className="text-gray-400 italic text-sm text-center py-2">No meds added yet.</li> : 
                        trackers.meds.map((m) => {
                            // Safety Check for old data format
                            if (typeof m !== 'object' || !m) return null;
                            
                            return (
                            <li key={m.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${m.taken ? 'bg-green-50 border-green-200' : 'bg-white border-red-100 hover:border-red-200'}`}>
                                <button onClick={() => toggleMed(m.id)} className="flex items-center gap-3 flex-1 text-left">
                                    {m.taken ? <CheckCircle2 className="text-green-600" size={22} /> : <Circle className="text-gray-300" size={22} />}
                                    <span className={`text-sm font-medium ${m.taken ? 'text-green-800 line-through decoration-green-800/50' : 'text-gray-800'}`}>{m.name}</span>
                                </button>
                                <button onClick={() => removeMed(m.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                            </li>
                        )})}
                    </ul>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text" placeholder="Add medication..." className="flex-1 text-sm p-3 border border-red-100 rounded-xl outline-none focus:border-red-300" 
                            value={newMed} onChange={(e) => setNewMed(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && newMed && (addMed(newMed), setNewMed(''))} 
                        />
                        <button onClick={() => { if(newMed) { addMed(newMed); setNewMed(''); }}} className="bg-red-600 text-white p-3 rounded-xl hover:bg-red-700 transition shadow-red-200 shadow-md">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* 3. Vaccines */}
                <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                    <div className="flex items-center gap-2 text-green-800 font-bold mb-4"><Syringe size={20} /> Vaccines</div>
                    <ul className="space-y-2 mb-4">
                        {trackers.vaccines.length === 0 ? <li className="text-gray-400 italic text-sm text-center py-2">No records.</li> : 
                        trackers.vaccines.map((v) => (
                        <li key={v} className="flex justify-between items-center text-sm text-green-800 bg-white p-3 rounded-xl border border-green-100">
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> {v}</div>
                            <button onClick={() => removeVaccine(v)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={16} /></button>
                        </li>
                        ))}
                    </ul>
                    <div className="flex gap-2">
                        <input 
                            type="text" placeholder="Add vaccine..." className="flex-1 text-sm p-3 border border-green-100 rounded-xl outline-none focus:border-green-300" 
                            value={newVac} onChange={(e) => setNewVac(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && newVac && (addVaccine(newVac), setNewVac(''))} 
                        />
                        <button onClick={() => { if(newVac) { addVaccine(newVac); setNewVac(''); }}} className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition shadow-green-200 shadow-md">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* 4. Period (Conditional) */}
                {profile.gender === 'Female' && (
                    <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-pink-800 font-bold"><CalendarHeart size={20} /> Cycle Tracker</div>
                            <span className="text-xs font-medium text-pink-500 bg-white px-2 py-1 rounded-full border border-pink-100">Last Start Date</span>
                        </div>
                        <div className="text-3xl font-black text-pink-600">{trackers.periodDate || '--/--'}</div>
                    </div>
                )}
            </div>
          )}

          {/* === TAB 2: HISTORY === */}
          {activeTab === 'history' && (
            <div className="space-y-6 animate-in fade-in">
                
                {/* User Profile Card */}
                <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                    <h3 className="font-bold text-purple-900 mb-4 flex items-center gap-2 border-b border-purple-200 pb-3">
                        <User size={20} /> Medical Profile
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-purple-100 pb-2"><span className="text-purple-600">Patient Name:</span> <span className="font-bold text-purple-900">{profile.name}</span></div>
                        <div className="flex justify-between border-b border-purple-100 pb-2"><span className="text-purple-600">Weight:</span> <span className="font-bold text-purple-900">{profile.weight} kg</span></div>
                        <div className="flex justify-between border-b border-purple-100 pb-2"><span className="text-purple-600">Diabetes Status:</span> <span className="font-bold text-purple-900">{profile.isDiabetic}</span></div>
                        <div className="flex justify-between border-b border-purple-100 pb-2"><span className="text-purple-600">Hypertension:</span> <span className="font-bold text-purple-900">{profile.hasHypertension}</span></div>
                        <div className="mt-2">
                            <span className="text-purple-600 block mb-2 font-medium">Other Conditions:</span>
                            <div className="bg-white p-3 rounded-xl border border-purple-100 text-purple-800 text-xs leading-relaxed">
                                {profile.existingConditions || "No other conditions reported."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Logs */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <History size={20} /> Current Session Log
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {chatHistory.length <= 1 ? (
                            <p className="text-xs text-gray-400 italic text-center py-4">No conversation yet.</p>
                        ) : (
                            chatHistory.slice(1).map((m, i) => ( // Skip initial greeting
                                <div key={i} className={`text-xs p-3 rounded-xl border relative ${m.role === 'user' ? 'bg-white border-blue-200 ml-4' : 'bg-gray-100 border-gray-200 mr-4'}`}>
                                    <div className={`font-bold mb-1 uppercase text-[10px] tracking-wide ${m.role === 'user' ? 'text-blue-500 text-right' : 'text-gray-500'}`}>
                                        {m.role === 'user' ? 'You' : 'Pranaya'}
                                    </div>
                                    <div className="text-gray-700 leading-relaxed">
                                        {/* Strip HTML tags for clean log view */}
                                        {m.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}
                                        {m.content.length > 150 && '...'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}