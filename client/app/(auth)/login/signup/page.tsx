'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/store/userStore';
import { Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { setProfile } = useUserStore();
  const [name, setName] = useState('');

  const handleSignup = () => {
    if (!name.trim()) return;
    setProfile({ name, isAssessmentDone: false }); 
    router.push('/assessment');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100">
        <div className="flex justify-center mb-6 text-blue-600"><Activity size={40} /></div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Join Pranaya</h1>
        <p className="text-center text-gray-500 mb-8">Create your health profile.</p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your name" />
          </div>
          <button onClick={handleSignup} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg">
            Get Started <ArrowRight size={20} />
          </button>
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}