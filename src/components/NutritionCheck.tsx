import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Utensils, Droplets, Apple, Pizza, CheckCircle2, Sparkles } from 'lucide-react';
import { analyzeNutritionState } from '../services/gemini';
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

const nutritionQuestions: Question[] = [
  {
    id: 'veggies',
    text: 'Seberapa sering kamu makan sayur dan buah dalam sehari?',
    icon: <Apple className="text-emerald-500" />,
    options: ['Setiap Makan', '1-2 Kali Sehari', 'Jarang', 'Hampir Tidak Pernah']
  },
  {
    id: 'water',
    text: 'Berapa gelas air putih yang kamu minum dalam sehari?',
    icon: <Droplets className="text-blue-500" />,
    options: ['> 8 Gelas', '5-7 Gelas', '3-4 Gelas', '< 3 Gelas']
  },
  {
    id: 'junkfood',
    text: 'Seberapa sering kamu makan makanan olahan atau cepat saji?',
    icon: <Pizza className="text-orange-500" />,
    options: ['Jarang Sekali', '1-2 Kali Seminggu', 'Hampir Setiap Hari', 'Setiap Hari']
  },
  {
    id: 'meals',
    text: 'Apakah kamu memiliki jadwal makan yang teratur?',
    icon: <Utensils className="text-sage-600" />,
    options: ['Sangat Teratur', 'Cukup Teratur', 'Sering Melewatkan Makan', 'Tidak Teratur Sama Sekali']
  }
];

export const NutritionCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    nutrition_tips: string[], 
    hydration_tip: string,
    health_score: number 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = nutritionQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < nutritionQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeNutritionState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#ffffff']
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-emerald-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600/60">
                Nutrisi & Hidrasi • {step + 1}/{nutritionQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {nutritionQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-emerald-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                {nutritionQuestions[step].icon}
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {nutritionQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {nutritionQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(236, 253, 245, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-emerald-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
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
              <div className="w-24 h-24 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
              <Utensils className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400" size={32} />
            </div>
            <h3 className="font-serif text-2xl font-semibold text-slate-800">Menganalisis Pola Makan...</h3>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-emerald-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Apple size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Laporan Nutrisi</h2>
                  <p className="text-xs text-slate-400">Skor: {result.health_score}/10</p>
                </div>
              </div>
              <Sparkles className="text-emerald-300 animate-pulse" />
            </div>

            <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <p className="text-slate-800 leading-relaxed text-sm italic">"{result.analysis}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-emerald-600/60">Saran Nutrisi:</h3>
              <div className="grid gap-2">
                {result.nutrition_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700">{tip}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-xs font-bold text-blue-700 uppercase mb-1">Tips Hidrasi:</h4>
                <p className="text-sm text-blue-800">{result.hydration_tip}</p>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full p-4 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg"
            >
              Cek Ulang Nutrisi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
