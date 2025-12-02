import { Newspaper, ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const news = [
    { title: "Dengue Cases Spike in Mumbai: BMC Issues Alert", source: "Health India", date: "2 hours ago", category: "Outbreak" },
    { title: "New AI Tech Detects Diabetes from Voice Patterns", source: "TechCrunch", date: "5 hours ago", category: "Innovation" },
    { title: "Air Quality Index (AQI) worsens in Metro Cities", source: "Daily News", date: "1 day ago", category: "Environment" },
    { title: "Vitamin D Deficiency Linked to Chronic Fatigue", source: "Medical Today", date: "2 days ago", category: "Wellness" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Newspaper className="text-blue-600" /> Health News
            </h1>
            <Link href="/"><button className="text-sm text-gray-500 hover:text-blue-600">Back to Home</button></Link>
        </div>
        
        <div className="grid gap-6">
          {news.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">{item.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {item.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h2>
                <p className="text-sm text-gray-500">Source: {item.source}</p>
              </div>
              <button className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition">
                  <ArrowUpRight size={20}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}