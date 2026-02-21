import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, ShieldAlert, Smile, Droplets, Coffee, Calendar, Sparkles } from 'lucide-react';
import { analyzeDentalState } from '../services/gemini';
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

const dentalQuestions: Question[] = [
  {
    id: 'pain',
    text: 'Apakah kamu merasakan nyeri atau sensitivitas pada gigi saat ini?',
    icon: <ShieldAlert className="text-rose-500" />,
    options: ['Tidak Ada', 'Kadang Saat Dingin/Panas', 'Sering Terasa Ngilu', 'Nyeri Hebat/Berdenyut']
  },
  {
    id: 'bleeding',
    text: 'Apakah gusimu sering berdarah saat menyikat gigi?',
    icon: <Droplets className="text-red-400" />,
    options: ['Tidak Pernah', 'Sangat Jarang', 'Sering Berdarah', 'Selalu Berdarah']
  },
  {
    id: 'brushing',
    text: 'Berapa kali kamu menyikat gigi dalam sehari?',
    icon: <Smile className="text-cyan-400" />,
    options: ['2 Kali (Pagi & Malam)', '1 Kali Sehari', 'Lebih dari 2 Kali', 'Kadang Lupa']
  },
  {
    id: 'sugar',
    text: 'Seberapa sering kamu mengonsumsi makanan/minuman manis?',
    icon: <Coffee className="text-amber-500" />,
    options: ['Jarang Sekali', '1-2 Kali Sehari', 'Sering Sepanjang Hari', 'Hampir Setiap Saat']
  },
  {
    id: 'visit',
    text: 'Kapan terakhir kali kamu pergi ke dokter gigi untuk kontrol?',
    icon: <Calendar className="text-emerald-400" />,
    options: ['Kurang dari 6 Bulan', '6-12 Bulan Lalu', 'Lebih dari 1 Tahun', 'Sudah Sangat Lama/Lupa']
  }
];

export const DentalHealthCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    recommendations: string[], 
    health_score: number,
    risk_level: string 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = dentalQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < dentalQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDentalState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#628462', '#82a382', '#ffffff']
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
            className="glass p-8 rounded-[2.5rem] space-y-8 border-cyan-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600/60">
                Pemeriksaan Gigi • {step + 1}/{dentalQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {dentalQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-cyan-500' : 'bg-cyan-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <motion.div 
                key={step}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center"
              >
                {dentalQuestions[step].icon}
              </motion.div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {dentalQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {dentalQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 5, backgroundColor: 'rgba(236, 254, 255, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-cyan-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-cyan-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-cyan-500 transition-colors" size={20} />
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
              <div className="w-24 h-24 border-4 border-cyan-100 border-t-cyan-500 rounded-full animate-spin" />
              <Smile className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-slate-800">Mengevaluasi Kesehatan Mulut...</h3>
              <p className="text-slate-500 italic">Gemini AI sedang menganalisis risiko dan memberikan rekomendasi terbaik.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-cyan-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Smile size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Laporan Gigi</h2>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                      result.risk_level === 'Rendah' ? "bg-emerald-100 text-emerald-700" :
                      result.risk_level === 'Sedang' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    )}>
                      Risiko {result.risk_level}
                    </span>
                    <span className="text-xs text-slate-400">Skor: {result.health_score}/10</span>
                  </div>
                </div>
              </div>
              <Sparkles className="text-cyan-300 animate-pulse" />
            </div>

            <div className="p-6 bg-cyan-50/50 rounded-2xl border border-cyan-100/50">
              <p className="text-slate-800 leading-relaxed">
                {result.analysis}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-cyan-600/60">Rencana Perawatan:</h3>
              <div className="grid gap-3">
                {result.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className="mt-1 w-6 h-6 rounded-lg bg-cyan-50 flex items-center justify-center text-xs font-bold text-cyan-600 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-slate-700 leading-snug">{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-all shadow-lg hover:shadow-cyan-200"
            >
              <RefreshCcw size={20} />
              Mulai Ulang Pemeriksaan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
