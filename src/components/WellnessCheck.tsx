import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Moon, Battery, Coffee, Briefcase, Sun, Sparkles, CheckCircle2 } from 'lucide-react';
import { analyzeWellnessState } from '../services/gemini';
import { cn } from '../lib/utils';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';

const clickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
  volume: 0.3
});

const finishSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3'],
  volume: 0.5
});

interface Question {
  id: string;
  text: string;
  icon: React.ReactNode;
  options: string[];
}

const wellnessQuestions: Question[] = [
  {
    id: 'sleep_hours',
    text: 'Berapa jam rata-rata kamu tidur dalam semalam?',
    icon: <Moon className="text-indigo-500" />,
    options: ['7-9 Jam', '5-6 Jam', 'Kurang dari 5 Jam', 'Tidak Menentu']
  },
  {
    id: 'morning_feel',
    text: 'Bagaimana perasaanmu saat bangun tidur di pagi hari?',
    icon: <Sun className="text-orange-400" />,
    options: ['Segar & Berenergi', 'Cukup Oke', 'Masih Mengantuk', 'Sangat Lelah/Sakit Kepala']
  },
  {
    id: 'work_stress',
    text: 'Seberapa sering kamu merasa kewalahan dengan beban pekerjaan atau tugas?',
    icon: <Briefcase className="text-amber-600" />,
    options: ['Jarang/Terkendali', 'Kadang-kadang', 'Sering Tertekan', 'Hampir Setiap Saat']
  },
  {
    id: 'caffeine',
    text: 'Berapa banyak konsumsi kafein (kopi/teh/energi) kamu dalam sehari?',
    icon: <Coffee className="text-stone-600" />,
    options: ['0-1 Gelas', '2-3 Gelas', 'Lebih dari 4 Gelas', 'Sangat Banyak']
  },
  {
    id: 'exhaustion',
    text: 'Apakah kamu merasa lelah secara emosional atau fisik meskipun sudah istirahat?',
    icon: <Battery className="text-rose-500" />,
    options: ['Tidak Pernah', 'Sesekali', 'Sering', 'Selalu']
  }
];

export const WellnessCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    sleep_tips: string[], 
    burnout_steps: string[],
    burnout_risk: string,
    sleep_quality: string 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = wellnessQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < wellnessQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeWellnessState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981']
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="max-w-xl mx-auto w-full p-4">
      <AnimatePresence mode="wait">
        {!result && !isAnalyzing ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-amber-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600/60">
                Wellness Check • {step + 1}/{wellnessQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {wellnessQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500' : 'bg-amber-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <motion.div 
                key={step}
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center"
              >
                {wellnessQuestions[step].icon}
              </motion.div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {wellnessQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {wellnessQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(fffbeb, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-amber-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-amber-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" size={20} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center space-y-6 text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
              <Battery className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-400" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-slate-800">Mengevaluasi Gaya Hidup...</h3>
              <p className="text-slate-500 italic">Menganalisis pola tidur dan risiko kelelahan Anda.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-amber-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Battery size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Laporan Wellness</h2>
                  <div className="flex gap-2 mt-1">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      result.burnout_risk === 'Rendah' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      Burnout: {result.burnout_risk}
                    </span>
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      result.sleep_quality === 'Baik' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                    )}>
                      Tidur: {result.sleep_quality}
                    </span>
                  </div>
                </div>
              </div>
              <Sparkles className="text-amber-300 animate-pulse" />
            </div>

            <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100/50">
              <p className="text-slate-800 leading-relaxed text-sm">
                {result.analysis}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                  <Moon size={14} /> Sleep Hygiene:
                </h3>
                <div className="space-y-2">
                  {result.sleep_tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="mt-0.5 text-indigo-400 shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-rose-600 flex items-center gap-2">
                  <Briefcase size={14} /> Anti-Burnout:
                </h3>
                <div className="space-y-2">
                  {result.burnout_steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="mt-0.5 text-rose-400 shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-all shadow-lg"
            >
              <RefreshCcw size={20} />
              Cek Ulang Wellness
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
