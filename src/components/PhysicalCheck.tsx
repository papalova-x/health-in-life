import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Dumbbell, Footprints, Timer, HeartPulse, CheckCircle2, Sparkles } from 'lucide-react';
import { analyzePhysicalState } from '../services/gemini';
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

const physicalQuestions: Question[] = [
  {
    id: 'exercise',
    text: 'Berapa kali kamu berolahraga dalam seminggu?',
    icon: <Dumbbell className="text-orange-500" />,
    options: ['3-5 Kali', '1-2 Kali', 'Jarang', 'Tidak Pernah']
  },
  {
    id: 'steps',
    text: 'Berapa banyak langkah kaki yang kamu tempuh setiap hari?',
    icon: <Footprints className="text-emerald-500" />,
    options: ['> 10.000 Langkah', '5.000 - 10.000', '2.000 - 5.000', '< 2.000 Langkah']
  },
  {
    id: 'sitting',
    text: 'Berapa lama kamu duduk diam dalam sehari (bekerja/menonton)?',
    icon: <Timer className="text-blue-500" />,
    options: ['< 4 Jam', '4-8 Jam', '8-12 Jam', '> 12 Jam']
  },
  {
    id: 'intensity',
    text: 'Apakah kamu sering melakukan aktivitas yang membuat jantung berdebar kencang?',
    icon: <HeartPulse className="text-rose-500" />,
    options: ['Sering (Intensitas Tinggi)', 'Kadang (Moderat)', 'Jarang (Ringan)', 'Tidak Pernah']
  }
];

export const PhysicalCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    recommendations: string[], 
    fitness_level: string 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = physicalQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < physicalQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePhysicalState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ef4444', '#ffffff']
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
            className="glass p-8 rounded-[2.5rem] space-y-8 border-orange-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600/60">
                Aktivitas Fisik • {step + 1}/{physicalQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {physicalQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-orange-500' : 'bg-orange-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center">
                {physicalQuestions[step].icon}
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {physicalQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {physicalQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 5, backgroundColor: 'rgba(fff7ed, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-orange-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-orange-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" size={20} />
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
              <div className="w-24 h-24 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
              <Dumbbell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-400" size={32} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-800">Menghitung Tingkat Kebugaran...</h3>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-orange-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                  <Dumbbell size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Laporan Fisik</h2>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    result.fitness_level === 'Tinggi' ? "bg-emerald-100 text-emerald-700" :
                    result.fitness_level === 'Sedang' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                  )}>
                    Kebugaran: {result.fitness_level}
                  </span>
                </div>
              </div>
              <Sparkles className="text-orange-300 animate-pulse" />
            </div>

            <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100/50">
              <p className="text-slate-800 leading-relaxed text-sm italic">"{result.analysis}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-orange-600/60">Rekomendasi Latihan:</h3>
              <div className="grid gap-3">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 size={16} className="text-orange-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full p-4 rounded-2xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all shadow-lg"
            >
              Cek Ulang Fisik
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
