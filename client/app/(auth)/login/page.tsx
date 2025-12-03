'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { Activity, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (!name.trim()) return;
    
    // Simulate Login: Save name to store
    setProfile({ name: name, isAssessmentDone: false }); 
    
    router.push('/assessment');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        
        {/* Logo */}
        <div className="flex justify-center mb-6 text-blue-600">
          <div className="bg-blue-50 p-4 rounded-full">
            <Activity size={40} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Welcome</h1>
        <p className="text-center text-gray-500 mb-8">Sign in to access your health dashboard.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            Continue <ArrowRight size={20} />
          </button>

          {/* DELETED: The "Don't have an account? Sign Up" link was here. */}
        </div>
      </div>
    </div>
  );
}
