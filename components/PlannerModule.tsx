
import React from 'react';
import { StudyPlanDay } from '../types';

interface PlannerModuleProps {
  plan: StudyPlanDay[];
  onClose: () => void;
}

const PlannerModule: React.FC<PlannerModuleProps> = ({ plan, onClose }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">আপনার ব্যক্তিগত স্টাডি রুটিন 📅</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">বন্ধ করুন</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.map((dayPlan) => (
          <div key={dayPlan.day} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">দিন {dayPlan.day}</span>
              <span className="text-xs text-gray-400">⏱️ {dayPlan.duration}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{dayPlan.goal}</h3>
            <ul className="space-y-2">
              {dayPlan.topics.map((topic, tIdx) => (
                <li key={tIdx} className="text-sm text-gray-600 flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => window.print()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition flex items-center shadow-lg"
        >
          <span className="mr-2">🖨️</span> পিডিএফ সেভ / প্রিন্ট করুন
        </button>
      </div>
    </div>
  );
};

export default PlannerModule;
