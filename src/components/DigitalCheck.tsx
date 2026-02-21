import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Smartphone, Eye, Monitor, UserCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { analyzeDigitalState } from '../services/gemini';
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

const digitalQuestions: Question[] = [
  {
    id: 'screentime',
    text: 'Berapa jam rata-rata waktu layar (screen time) kamu dalam sehari?',
    icon: <Smartphone className="text-blue-500" />,
    options: ['< 3 Jam', '3-6 Jam', '6-10 Jam', '> 10 Jam']
  },
  {
    id: 'eye_strain',
    text: 'Apakah kamu sering merasakan mata lelah, kering, atau penglihatan kabur?',
    icon: <Eye className="text-rose-500" />,
    options: ['Jarang Sekali', 'Kadang-kadang', 'Sering', 'Hampir Setiap Hari']
  },
  {
    id: 'posture',
    text: 'Apakah kamu sering merasakan nyeri leher atau punggung saat menggunakan gadget?',
    icon: <UserCheck className="text-amber-500" />,
    options: ['Tidak Pernah', 'Sesekali', 'Sering', 'Sangat Sering']
  },
  {
    id: 'social_media',
    text: 'Seberapa sering kamu merasa cemas atau rendah diri setelah melihat media sosial?',
    icon: <Monitor className="text-purple-500" />,
    options: ['Tidak Pernah', 'Jarang', 'Sering', 'Sangat Sering']
  }
];

export const DigitalCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    detox_steps: string[], 
    digital_health_score: number 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = digitalQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < digitalQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDigitalState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ffffff']
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
            className="glass p-8 rounded-[2.5rem] space-y-8 border-blue-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600/60">
                Digital Wellness • {step + 1}/{digitalQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {digitalQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-blue-500' : 'bg-blue-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                {digitalQuestions[step].icon}
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {digitalQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {digitalQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(eff6ff, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-blue-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-blue-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
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
              <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
              <Smartphone className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" size={32} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-800">Menganalisis Kebiasaan Digital...</h3>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-blue-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Laporan Digital</h2>
                  <p className="text-xs text-slate-400">Skor Kesehatan: {result.digital_health_score}/10</p>
                </div>
              </div>
              <Sparkles className="text-blue-300 animate-pulse" />
            </div>

            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <p className="text-slate-800 leading-relaxed text-sm italic">"{result.analysis}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-blue-600/60">Langkah Digital Detox:</h3>
              <div className="grid gap-3">
                {result.detox_steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full p-4 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg"
            >
              Cek Ulang Digital
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
