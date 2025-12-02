import { AlertTriangle, Phone } from 'lucide-react';

interface Props {
  active: boolean;
  onClose: () => void;
}

export default function EmergencyOverlay({ active, onClose }: Props) {
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 bg-red-600 animate-pulse flex flex-col items-center justify-center text-white p-8">
      
      {/* Blinking Icon */}
      <div className="bg-white text-red-600 rounded-full p-6 mb-6 animate-bounce">
        <AlertTriangle size={64} strokeWidth={3} />
      </div>

      <h1 className="text-5xl font-black mb-4 text-center uppercase tracking-widest">
        Medical Emergency Detected
      </h1>
      
      <p className="text-2xl mb-8 text-center max-w-2xl font-semibold">
        Your symptoms indicate a critical condition. Please seek immediate professional help.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-6 flex-col md:flex-row w-full max-w-lg">
        <button 
          onClick={() => window.open('tel:112')} 
          className="flex-1 bg-white text-red-700 py-6 rounded-xl text-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition shadow-xl"
        >
          <Phone size={32} />
          Call Ambulance
        </button>
        
        <button 
          onClick={() => window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank')}
          className="flex-1 bg-red-800 border-2 border-white text-white py-6 rounded-xl text-2xl font-bold flex items-center justify-center hover:bg-red-900 transition shadow-xl"
        >
          Find Hospital
        </button>
      </div>

      <button 
        onClick={onClose}
        className="mt-12 text-white/70 hover:text-white underline"
      >
        I am safe, dismiss alert
      </button>
    </div>
  );
}