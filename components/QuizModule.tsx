
import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizModuleProps {
  onFinish: () => void;
  systemInstruction: string;
  userName: string;
}

const STORAGE_QUIZ_HISTORY = 'shikkha_ai_quiz_history';

const QuizModule: React.FC<QuizModuleProps> = ({ onFinish, systemInstruction, userName }) => {
  const [step, setStep] = useState<'history' | 'selection' | 'generating' | 'active' | 'finished'>('history');
  const [history, setHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_QUIZ_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_QUIZ_HISTORY, JSON.stringify(history));
  }, [history]);

  const handleStartNewQuiz = async () => {
    if (!selectedClass || !selectedSubject || !topic.trim()) return;
    setStep('generating');
    try {
      const q = await generateQuiz(topic, selectedClass, selectedSubject, systemInstruction);
      if (q.length > 0) {
        setQuestions(q);
        setStep('active');
        setCurrentIdx(0);
        setScore(0);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        alert("দুঃখিত, কুইজ তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
        setStep('selection');
      }
    } catch (e) {
      setStep('selection');
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    if (selectedOption === questions[currentIdx].correctIndex) {
      setScore(s => s + 1);
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const result: QuizResult = {
        id: Math.random().toString(36).substr(2, 9),
        topic,
        subject: selectedSubject,
        className: selectedClass,
        score,
        total: questions.length,
        date: new Date().toLocaleDateString('bn-BD')
      };
      setHistory(prev => [result, ...prev]);
      setStep('finished');
    }
  };

  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['পদার্থবিজ্ঞান', 'রসায়ন', 'গণিত', 'জীববিজ্ঞান', 'ইংরেজি', 'বাংলা', 'ইতিহাস'];

  if (step === 'history') {
    return (
      <div className="space-y-6 animate-in fade-in">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black tracking-tighter">আপনার প্রগ্রেস রিপোর্ট 📈</h2>
            <button 
              onClick={() => setStep('selection')}
              className="bg-rose-600 text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition active:scale-95"
            >
              নতুন পরীক্ষা শুরু করো
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 opacity-20">📝</div>
              <p className="text-gray-400 font-bold">এখনো কোনো পরীক্ষা দেওয়া হয়নি।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.slice(0, 5).map(res => (
                <div key={res.id} className="bg-slate-50 p-5 rounded-3xl flex items-center justify-between border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-rose-600 shadow-sm">
                      {Math.round((res.score / res.total) * 100)}%
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800">{res.topic}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{res.className} • {res.subject} • {res.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-slate-900">{res.score}/{res.total}</span>
                  </div>
                </div>
              ))}
              {history.length > 5 && <p className="text-center text-[10px] font-bold text-gray-400 uppercase pt-2">আগের আরও ফলাফল ড্যাশবোর্ডে দেখা যাবে</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'selection') {
    return (
      <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl border border-gray-100 space-y-8 animate-in zoom-in">
        <h2 className="text-3xl font-black text-center tracking-tighter">পরীক্ষার বিষয় নির্বাচন 📝</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">আপনার শ্রেণী</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {classes.map(c => (
                <button 
                  key={c} 
                  onClick={() => setSelectedClass(c)}
                  className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all border-2 ${selectedClass === c ? 'bg-rose-600 border-rose-600 text-white' : 'bg-slate-50 border-transparent hover:border-rose-200'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">বিষয়</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSelectedSubject(s)}
                  className={`py-3 px-5 rounded-2xl font-bold text-sm transition-all border-2 ${selectedSubject === s ? 'bg-rose-600 border-rose-600 text-white' : 'bg-slate-50 border-transparent hover:border-rose-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">টপিক বা অধ্যায়</label>
            <input 
              type="text" 
              placeholder="উদা: গতি বা পর্যায়বৃত্ত গতি" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-5 bg-slate-50 border-2 border-transparent focus:border-rose-500 rounded-2xl font-bold outline-none"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={() => setStep('history')} className="flex-1 py-5 rounded-3xl bg-slate-100 font-black hover:bg-slate-200 transition">পিছনে যাও</button>
          <button 
            onClick={handleStartNewQuiz}
            disabled={!selectedClass || !selectedSubject || !topic.trim()}
            className="flex-[2] py-5 rounded-3xl bg-rose-600 text-white font-black shadow-xl disabled:opacity-50 hover:brightness-110 transition active:scale-95"
          >
            প্রশ্নপত্র তৈরি করো 🚀
          </button>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="bg-white p-20 rounded-[40px] shadow-2xl border border-gray-100 text-center space-y-6">
        <div className="w-16 h-16 border-4 border-slate-100 rounded-full animate-spin mx-auto" style={{ borderTopColor: '#E11D48' }}></div>
        <div>
          <h3 className="text-xl font-black">প্রশ্নপত্র তৈরি হচ্ছে...</h3>
          <p className="text-gray-400 font-bold text-sm">আমাদের এআই আপনার শ্রেণীর জন্য সেরা প্রশ্নগুলো খুঁজে বের করছে।</p>
        </div>
      </div>
    );
  }

  if (step === 'active') {
    const currentQuestion = questions[currentIdx];
    return (
      <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 animate-in fade-in">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-black text-rose-500 uppercase tracking-widest">প্রশ্ন {currentIdx + 1}/{questions.length}</span>
          <div className="h-2 flex-1 mx-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <h3 className="text-xl font-black mb-8 text-gray-800 leading-snug">{currentQuestion.question}</h3>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            let optionClasses = "w-full p-5 text-left border-2 rounded-2xl transition-all flex items-center active:scale-[0.98] ";
            if (showFeedback) {
              if (idx === currentQuestion.correctIndex) optionClasses += "border-green-500 bg-green-50 text-green-700 ";
              else if (idx === selectedOption) optionClasses += "border-rose-500 bg-rose-50 text-rose-700 ";
              else optionClasses += "border-gray-50 text-gray-300 ";
            } else {
              optionClasses += selectedOption === idx ? "border-rose-600 bg-rose-50 text-rose-700 " : "border-slate-50 hover:border-rose-100 text-gray-700 ";
            }

            return (
              <button key={idx} onClick={() => handleOptionSelect(idx)} className={optionClasses}>
                <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-black shrink-0 ${selectedOption === idx ? 'border-rose-600 bg-rose-600 text-white' : 'border-gray-200'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-bold">{option}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-8 p-6 bg-rose-50 rounded-3xl border-l-8 border-rose-500 animate-in slide-in-from-bottom-2">
            <p className="text-rose-900 font-bold text-sm leading-relaxed">
              💡 {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="mt-10">
          {!showFeedback ? (
            <button 
              disabled={selectedOption === null}
              onClick={handleSubmitAnswer}
              className="w-full py-5 rounded-3xl bg-slate-900 text-white font-black shadow-xl disabled:opacity-50 hover:brightness-110 transition active:scale-95"
            >
              উত্তর চেক করো
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full py-5 rounded-3xl bg-rose-600 text-white font-black shadow-xl hover:brightness-110 transition active:scale-95"
            >
              {currentIdx === questions.length - 1 ? 'ফলাফল দেখো' : 'পরবর্তী প্রশ্ন →'}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'finished') {
    return (
      <div className="bg-white p-16 rounded-[40px] shadow-2xl border border-gray-100 text-center animate-in zoom-in">
        <div className="text-7xl mb-6">🏁</div>
        <h2 className="text-3xl font-black mb-2">পরীক্ষা শেষ!</h2>
        <p className="text-gray-400 font-bold mb-10">{userName}, আপনার চূড়ান্ত স্কোর:</p>
        
        <div className="inline-block p-10 bg-slate-50 rounded-[48px] border-4 border-rose-100 mb-10">
          <span className="text-6xl font-black text-rose-600">{score}</span>
          <span className="text-3xl text-gray-300 font-black"> / {questions.length}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button onClick={() => setStep('history')} className="px-10 py-5 rounded-3xl bg-slate-900 text-white font-black shadow-xl">ড্যাশবোর্ডে ফিরে যাও</button>
          <button onClick={() => setStep('selection')} className="px-10 py-5 rounded-3xl border-2 border-slate-900 font-black">আবার পরীক্ষা দাও</button>
        </div>
      </div>
    );
  }

  return null;
};

export default QuizModule;
