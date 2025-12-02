'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { Check, ChevronRight, User, Users, Activity } from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { setProfile, completeAssessment } = useUserStore();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    forWho: '', // 'self' or 'other'
    name: '',
    age: '',
    gender: '',
    height: '', // cm
    weight: '', // kg
    isDiabetic: 'No',
    hasHypertension: 'No',
    existingConditions: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinish = () => {
    // 1. Save to Global Store
    setProfile(formData);
    completeAssessment();
    
    // 2. Redirect to the Dashboard (Trackers)
    router.push('/dashboard/chat');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-white p-6 border-b flex items-center gap-3">
           <div className="bg-blue-600 text-white p-2 rounded-lg">
             <Activity size={24} />
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-900">Pranaya Setup</h1>
             <p className="text-sm text-gray-500">Let's build your medical profile.</p>
           </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
            {/* STEP 1: Who is this for? */}
            {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Who are we checking today?</h2>
                <p className="text-gray-500 mb-8">This helps us personalize the diagnosis.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => { handleChange('forWho', 'self'); setStep(2); }}
                    className="p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition flex flex-col items-center gap-4 group"
                >
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <User size={32} />
                    </div>
                    <span className="font-bold text-lg text-gray-700">Myself</span>
                </button>
                
                <button 
                    onClick={() => { handleChange('forWho', 'other'); setStep(2); }}
                    className="p-6 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition flex flex-col items-center gap-4 group"
                >
                    <div className="bg-purple-100 p-4 rounded-full text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                    <Users size={32} />
                    </div>
                    <span className="font-bold text-lg text-gray-700">Someone Else</span>
                </button>
                </div>
            </div>
            )}

            {/* STEP 2: Basic Vitals */}
            {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
                
                <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" placeholder="Name" className="p-3 border rounded-lg w-full col-span-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                />
                <input 
                    type="number" placeholder="Age" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.age}
                    onChange={e => handleChange('age', e.target.value)}
                />
                <select 
                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.gender}
                    onChange={e => handleChange('gender', e.target.value)}
                >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input 
                    type="number" placeholder="Height (cm)" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.height}
                    onChange={e => handleChange('height', e.target.value)}
                />
                <input 
                    type="number" placeholder="Weight (kg)" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.weight}
                    onChange={e => handleChange('weight', e.target.value)}
                />
                </div>

                <button 
                onClick={() => setStep(3)}
                disabled={!formData.name || !formData.age}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                Next <ChevronRight />
                </button>
            </div>
            )}

            {/* STEP 3: Medical Background */}
            {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Medical History</h2>
                <p className="text-sm text-gray-500">Does {formData.name || 'the patient'} have any existing conditions?</p>

                <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Diabetes?</label>
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.isDiabetic} onChange={e => handleChange('isDiabetic', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Type 1">Yes (Type 1)</option>
                    <option value="Type 2">Yes (Type 2)</option>
                    <option value="Prediabetes">Prediabetes</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">High Blood Pressure?</label>
                    <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={formData.hasHypertension} onChange={e => handleChange('hasHypertension', e.target.value)}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Other Conditions (Asthma, PCOS...)</label>
                    <textarea 
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    placeholder="List any other conditions..."
                    rows={3}
                    value={formData.existingConditions}
                    onChange={e => handleChange('existingConditions', e.target.value)}
                    />
                </div>
                </div>

                <button 
                onClick={handleFinish}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2"
                >
                Finish Setup <Check />
                </button>
            </div>
            )}
        </div>

      </div>
    </div>
  );
}