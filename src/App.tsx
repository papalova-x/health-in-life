import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Sparkles, Leaf, Info, Activity, Battery, Utensils, Dumbbell, Smartphone } from 'lucide-react';
import { MentalHealthCheck } from './components/MentalHealthCheck';
import { ChatBot } from './components/ChatBot';
import { DentalHealthCheck } from './components/DentalHealthCheck';
import { PsychologicalCheck } from './components/PsychologicalCheck';
import { WellnessCheck } from './components/WellnessCheck';
import { NutritionCheck } from './components/NutritionCheck';
import { PhysicalCheck } from './components/PhysicalCheck';
import { DigitalCheck } from './components/DigitalCheck';
import { cn } from './lib/utils';

type Tab = 'check' | 'psych' | 'wellness' | 'dental' | 'nutrition' | 'physical' | 'digital' | 'chat' | 'about';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('check');

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sage-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-sage-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-sage-100 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Leaf size={24} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-sage-800 tracking-tight">MindEase</h1>
        </div>
        
        <nav className="flex flex-wrap justify-center bg-white/50 backdrop-blur-sm p-1.5 rounded-3xl border border-white/20 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab('check')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'check' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Heart size={14} />
            <span>Mood</span>
          </button>
          <button
            onClick={() => setActiveTab('psych')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'psych' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Activity size={14} className="text-purple-500" />
            <span>Psikis</span>
          </button>
          <button
            onClick={() => setActiveTab('wellness')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'wellness' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Battery size={14} className="text-amber-500" />
            <span>Wellness</span>
          </button>
          <button
            onClick={() => setActiveTab('nutrition')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'nutrition' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Utensils size={14} className="text-emerald-500" />
            <span>Nutrisi</span>
          </button>
          <button
            onClick={() => setActiveTab('physical')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'physical' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Dumbbell size={14} className="text-orange-500" />
            <span>Fisik</span>
          </button>
          <button
            onClick={() => setActiveTab('digital')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'digital' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Smartphone size={14} className="text-blue-500" />
            <span>Digital</span>
          </button>
          <button
            onClick={() => setActiveTab('dental')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'dental' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Sparkles size={14} className="text-cyan-500" />
            <span>Gigi</span>
          </button>
          <div className="w-px h-6 bg-sage-200 mx-1 self-center hidden sm:block" />
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'chat' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <MessageCircle size={14} />
            <span>Curhat</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={cn(
              "px-3 py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all flex items-center gap-1.5",
              activeTab === 'about' ? "bg-white text-sage-800 shadow-sm" : "text-sage-500 hover:text-sage-700"
            )}
          >
            <Info size={14} />
            <span>Info</span>
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'check' && (
            <motion.div
              key="check"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900">Mood Hari Ini</h2>
                <p className="text-sage-600 max-w-md mx-auto">Pantau suasana hatimu secara cepat dan dapatkan dukungan instan.</p>
              </div>
              <MentalHealthCheck />
            </motion.div>
          )}

          {activeTab === 'psych' && (
            <motion.div
              key="psych"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-purple-900">Skrining Psikis</h2>
                <p className="text-purple-600 max-w-md mx-auto">Evaluasi kondisi psikologis yang lebih mendalam untuk kesehatan mental yang lebih baik.</p>
              </div>
              <PsychologicalCheck />
            </motion.div>
          )}

          {activeTab === 'wellness' && (
            <motion.div
              key="wellness"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-amber-900">Wellness & Burnout</h2>
                <p className="text-amber-600 max-w-md mx-auto">Evaluasi kualitas tidur dan tingkat kelelahanmu untuk hidup yang lebih seimbang.</p>
              </div>
              <WellnessCheck />
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-emerald-900">Nutrisi & Hidrasi</h2>
                <p className="text-emerald-600 max-w-md mx-auto">Pantau pola makan dan asupan cairanmu untuk energi yang optimal.</p>
              </div>
              <NutritionCheck />
            </motion.div>
          )}

          {activeTab === 'physical' && (
            <motion.div
              key="physical"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-orange-900">Aktivitas Fisik</h2>
                <p className="text-orange-600 max-w-md mx-auto">Evaluasi tingkat kebugaran dan kebiasaan bergerakmu sehari-hari.</p>
              </div>
              <PhysicalCheck />
            </motion.div>
          )}

          {activeTab === 'digital' && (
            <motion.div
              key="digital"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-blue-900">Digital Wellness</h2>
                <p className="text-blue-600 max-w-md mx-auto">Kelola hubunganmu dengan teknologi untuk kesehatan mata dan mental.</p>
              </div>
              <DigitalCheck />
            </motion.div>
          )}

          {activeTab === 'dental' && (
            <motion.div
              key="dental"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900">Senyum Sehatmu</h2>
                <p className="text-slate-600 max-w-md mx-auto">Cek kondisi kesehatan gigi dan mulutmu dengan analisis AI yang mendalam.</p>
              </div>
              <DentalHealthCheck />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-8 space-y-2">
                <h2 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900">Ruang Amanmu</h2>
                <p className="text-sage-600 max-w-md mx-auto">MindEase AI siap mendengarkan segala keluh kesahmu tanpa menghakimi.</p>
              </div>
              <ChatBot />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full glass p-8 sm:p-12 rounded-[3rem] space-y-8"
            >
              <div className="space-y-4 text-center">
                <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center text-sage-600 mx-auto">
                  <Sparkles size={40} />
                </div>
                <h2 className="font-serif text-4xl font-bold text-sage-900">Tentang MindEase</h2>
                <p className="text-lg text-sage-700 leading-relaxed">
                  MindEase adalah asisten kesehatan mental berbasis AI yang dirancang untuk memberikan dukungan emosional instan. Kami percaya bahwa setiap orang berhak memiliki ruang aman untuk bercerita.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-sage-100 shadow-sm">
                  <h4 className="font-bold text-sage-800 mb-2">Cek Kesehatan</h4>
                  <p className="text-sm text-sage-600">Analisis kondisi mental harianmu dengan bantuan kecerdasan buatan.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-sage-100 shadow-sm">
                  <h4 className="font-bold text-sage-800 mb-2">Teman Curhat</h4>
                  <p className="text-sm text-sage-600">Ngobrol kapan saja tentang apa saja. Kami di sini untuk mendengarkan.</p>
                </div>
              </div>

              <div className="pt-8 border-t border-sage-100 text-center">
                <p className="text-xs text-sage-400 uppercase tracking-widest font-bold mb-4">Peringatan Penting</p>
                <p className="text-sm text-sage-500 italic">
                  MindEase bukan pengganti bantuan profesional. Jika Anda merasa dalam bahaya atau membutuhkan bantuan medis segera, silakan hubungi layanan darurat atau psikolog terdekat.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-sage-400 text-xs font-medium tracking-widest uppercase">
        © 2026 MindEase • Dibuat dengan Cinta & Empati
      </footer>
    </div>
  );
}
