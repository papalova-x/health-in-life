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

  const navItems = [
    { id: 'check', label: 'Mood', icon: <Heart size={18} />, color: 'text-sage-500' },
    { id: 'psych', label: 'Psikis', icon: <Activity size={18} />, color: 'text-purple-500' },
    { id: 'wellness', label: 'Wellness', icon: <Battery size={18} />, color: 'text-amber-500' },
    { id: 'nutrition', label: 'Nutrisi', icon: <Utensils size={18} />, color: 'text-emerald-500' },
    { id: 'physical', label: 'Fisik', icon: <Dumbbell size={18} />, color: 'text-orange-500' },
    { id: 'digital', label: 'Digital', icon: <Smartphone size={18} />, color: 'text-blue-500' },
    { id: 'dental', label: 'Gigi', icon: <Sparkles size={18} />, color: 'text-cyan-500' },
    { id: 'chat', label: 'Curhat', icon: <MessageCircle size={18} />, color: 'text-sage-600' },
    { id: 'about', label: 'Info', icon: <Info size={18} />, color: 'text-sage-400' },
  ];

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col lg:flex-row">
      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sage-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-sage-200 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-sage-100 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white/80 backdrop-blur-md border-r border-sage-100 p-6 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
            <Leaf size={24} />
          </div>
          <h1 className="font-serif text-xl font-bold text-sage-800 tracking-tight">healthinaja</h1>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all group",
                activeTab === item.id 
                  ? "bg-sage-600 text-white shadow-md" 
                  : "text-sage-500 hover:bg-sage-50 hover:text-sage-700"
              )}
            >
              <span className={cn(
                "transition-colors",
                activeTab === item.id ? "text-white" : item.color
              )}>
                {item.icon}
              </span>
              {item.label}
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-sage-50">
          <p className="text-[10px] text-sage-400 uppercase tracking-widest font-bold text-center">
            © 2026 healthinaja
          </p>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden relative z-20 bg-white/80 backdrop-blur-md border-b border-sage-100 p-4 sticky top-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <Leaf size={18} />
          </div>
          <h1 className="font-serif text-lg font-bold text-sage-800 tracking-tight">healthinaja</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-sage-400 uppercase tracking-wider">Online</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-8 lg:p-12 pb-24 lg:pb-12">
          <AnimatePresence mode="wait">
            {activeTab === 'check' && (
              <motion.div
                key="check"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sage-900">Mood Hari Ini</h2>
                  <p className="text-sm sm:text-base text-sage-600 max-w-md mx-auto">Pantau suasana hatimu secara cepat dan dapatkan dukungan instan.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-purple-900">Skrining Psikis</h2>
                  <p className="text-sm sm:text-base text-purple-600 max-w-md mx-auto">Evaluasi kondisi psikologis yang lebih mendalam untuk kesehatan mental yang lebih baik.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-amber-900">Wellness & Burnout</h2>
                  <p className="text-sm sm:text-base text-amber-600 max-w-md mx-auto">Evaluasi kualitas tidur dan tingkat kelelahanmu untuk hidup yang lebih seimbang.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-emerald-900">Nutrisi & Hidrasi</h2>
                  <p className="text-sm sm:text-base text-emerald-600 max-w-md mx-auto">Pantau pola makan dan asupan cairanmu untuk energi yang optimal.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-orange-900">Aktivitas Fisik</h2>
                  <p className="text-sm sm:text-base text-orange-600 max-w-md mx-auto">Evaluasi tingkat kebugaran dan kebiasaan bergerakmu sehari-hari.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-blue-900">Digital Wellness</h2>
                  <p className="text-sm sm:text-base text-blue-600 max-w-md mx-auto">Kelola hubunganmu dengan teknologi untuk kesehatan mata dan mental.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">Senyum Sehatmu</h2>
                  <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">Cek kondisi kesehatan gigi dan mulutmu dengan analisis AI yang mendalam.</p>
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
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-4 sm:mb-8 space-y-1 sm:space-y-2">
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-sage-900">Ruang Amanmu</h2>
                  <p className="text-sm sm:text-base text-sage-600 max-w-md mx-auto">healthinaja AI siap mendengarkan segala keluh kesahmu tanpa menghakimi.</p>
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
                  <h2 className="font-serif text-4xl font-bold text-sage-900">Tentang healthinaja</h2>
                  <p className="text-lg text-sage-700 leading-relaxed">
                    healthinaja adalah asisten kesehatan mental berbasis AI yang dirancang untuk memberikan dukungan emosional instan. Kami percaya bahwa setiap orang berhak memiliki ruang aman untuk bercerita.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-sage-100 shadow-sm">
                    <h4 className="font-bold text-sage-800 mb-2">Cek Kesehatan</h4>
                    <p className="text-sm text-sage-600">Analisis berbagai aspek kesehatanmu dengan bantuan kecerdasan buatan.</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-sage-100 shadow-sm">
                    <h4 className="font-bold text-sage-800 mb-2">Teman Curhat</h4>
                    <p className="text-sm text-sage-600">Ngobrol kapan saja tentang apa saja. Kami di sini untuk mendengarkan.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-sage-100 text-center">
                  <p className="text-xs text-sage-400 uppercase tracking-widest font-bold mb-4">Peringatan Penting</p>
                  <p className="text-sm text-sage-500 italic">
                    healthinaja bukan pengganti bantuan profesional. Jika Anda merasa dalam bahaya atau membutuhkan bantuan medis segera, silakan hubungi layanan darurat atau psikolog terdekat.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/90 backdrop-blur-lg p-2 rounded-full border border-sage-100 shadow-2xl gap-1 max-w-[95vw] overflow-x-auto no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[56px] h-14 rounded-full transition-all relative",
                activeTab === item.id 
                  ? "bg-sage-600 text-white shadow-lg scale-110 z-10" 
                  : "text-sage-400 hover:text-sage-600"
              )}
            >
              <span className={cn(
                "transition-colors",
                activeTab === item.id ? "text-white" : item.color
              )}>
                {item.icon}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-tighter mt-1">
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="active-dot-mobile"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Footer */}
        <footer className="hidden lg:block p-8 text-center text-sage-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          © 2026 healthinaja • Dibuat dengan Cinta & Empati
        </footer>
      </div>
    </div>
  );
}
