import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Heart, Brain, Moon, Sun, Wind, Sparkles } from 'lucide-react';
import { analyzeMentalState } from '../services/gemini';
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

const questions: Question[] = [
  {
    id: 'mood',
    text: 'Bagaimana perasaanmu secara keseluruhan hari ini?',
    icon: <Sun className="text-yellow-500" />,
    options: ['Sangat Senang', 'Biasa Saja', 'Sedikit Sedih', 'Sangat Lelah/Stres']
  },
  {
    id: 'sleep',
    text: 'Bagaimana kualitas tidurmu semalam?',
    icon: <Moon className="text-indigo-400" />,
    options: ['Nyenyak Sekali', 'Cukup Baik', 'Sering Terjaga', 'Sulit Tidur']
  },
  {
    id: 'energy',
    text: 'Seberapa besar tingkat energimu untuk menjalani aktivitas?',
    icon: <Wind className="text-blue-400" />,
    options: ['Penuh Semangat', 'Cukup Stabil', 'Cepat Lelah', 'Sangat Lemas']
  },
  {
    id: 'focus',
    text: 'Apakah kamu merasa sulit untuk berkonsentrasi belakangan ini?',
    icon: <Brain className="text-purple-400" />,
    options: ['Sangat Fokus', 'Kadang Terganggu', 'Sering Melamun', 'Sangat Sulit Fokus']
  }
];

export const MentalHealthCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ analysis: string, suggestions: string[], mood_score: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = questions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMentalState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#82a382', '#abc4ab', '#ceddce']
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
            className="glass p-8 rounded-[2rem] space-y-8"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-sage-400">
                Langkah {step + 1} dari {questions.length}
              </span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-sage-500' : 'bg-sage-200'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-sage-100 flex items-center justify-center">
                {questions[step].icon}
              </div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-sage-800">
                {questions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {questions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-sage-100 hover:border-sage-400 hover:bg-sage-50 transition-all text-left"
                >
                  <span className="font-medium text-sage-700 group-hover:text-sage-900">{option}</span>
                  <ChevronRight className="text-sage-300 group-hover:text-sage-500 transition-colors" size={20} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : isAnalyzing ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass p-12 rounded-[2rem] flex flex-col items-center justify-center space-y-6 text-center"
          >
            <div className="relative">
              <div className="w-20 h-20 border-4 border-sage-200 border-t-sage-500 rounded-full animate-spin" />
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sage-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-sage-800">Menganalisis Jawabanmu...</h3>
              <p className="text-sage-500 italic">MindEase sedang merangkai saran terbaik untukmu.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2rem] space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
                <Heart size={32} fill="currentColor" className="text-rose-400" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-semibold text-sage-800">Hasil Analisis</h2>
                <p className="text-sage-500">Skor Kesejahteraan: {result.mood_score}/10</p>
              </div>
            </div>

            <div className="p-6 bg-sage-50 rounded-2xl border border-sage-100">
              <p className="text-sage-800 leading-relaxed italic">"{result.analysis}"</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-sage-400">Saran Untukmu:</h3>
              <div className="grid gap-3">
                {result.suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sage-100 shadow-sm"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-sage-200 flex items-center justify-center text-[10px] font-bold text-sage-600 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-sage-700">{s}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors shadow-lg"
            >
              <RefreshCcw size={20} />
              Cek Ulang
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
