import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, RefreshCcw, Activity, Ghost, Zap, CloudRain, ShieldCheck, Sparkles } from 'lucide-react';
import { analyzePsychologicalState } from '../services/gemini';
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

const psychQuestions: Question[] = [
  {
    id: 'anxiety',
    text: 'Seberapa sering kamu merasa cemas, gelisah, atau khawatir berlebihan?',
    icon: <Activity className="text-orange-500" />,
    options: ['Hampir Tidak Pernah', 'Beberapa Hari', 'Lebih dari Separuh Waktu', 'Hampir Setiap Hari']
  },
  {
    id: 'interest',
    text: 'Apakah kamu merasa kehilangan minat atau kesenangan dalam melakukan sesuatu?',
    icon: <Ghost className="text-purple-500" />,
    options: ['Tidak Sama Sekali', 'Beberapa Hari', 'Sering Terasa', 'Sangat Sering/Setiap Hari']
  },
  {
    id: 'worth',
    text: 'Seberapa sering kamu merasa rendah diri atau merasa gagal?',
    icon: <CloudRain className="text-blue-500" />,
    options: ['Tidak Pernah', 'Kadang-kadang', 'Sering', 'Hampir Selalu']
  },
  {
    id: 'physical',
    text: 'Apakah kamu merasakan gejala fisik stres (pusing, otot tegang, jantung berdebar)?',
    icon: <Zap className="text-yellow-500" />,
    options: ['Tidak Ada', 'Ringan/Jarang', 'Cukup Terasa', 'Sangat Kuat/Sering']
  },
  {
    id: 'control',
    text: 'Apakah kamu merasa sulit mengendalikan pikiran-pikiran yang mengganggu?',
    icon: <ShieldCheck className="text-emerald-500" />,
    options: ['Mudah Dikendalikan', 'Sedikit Sulit', 'Sering Kewalahan', 'Sangat Sulit/Tak Terkendali']
  }
];

export const PsychologicalCheck: React.FC = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ 
    analysis: string, 
    coping_techniques: string[], 
    stress_level: string,
    recommendation: string 
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnswer = (answer: string) => {
    clickSound.play();
    const currentQuestion = psychQuestions[step];
    const newAnswers = { ...answers, [currentQuestion.text]: answer };
    setAnswers(newAnswers);

    if (step < psychQuestions.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish(newAnswers);
    }
  };

  const handleFinish = async (finalAnswers: Record<string, string>) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePsychologicalState(finalAnswers);
      setResult(analysis);
      finishSound.play();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#4d6a4d', '#82a382', '#ceddce', '#ffffff']
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-purple-100/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-600/60">
                Skrining Psikis • {step + 1}/{psychQuestions.length}
              </span>
              <div className="flex gap-1.5">
                {psychQuestions.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-all duration-500 ${i <= step ? 'bg-purple-500' : 'bg-purple-100'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <motion.div 
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center"
              >
                {psychQuestions[step].icon}
              </motion.div>
              <h2 className="font-serif text-3xl font-semibold leading-tight text-slate-800">
                {psychQuestions[step].text}
              </h2>
            </div>

            <div className="grid gap-3">
              {psychQuestions[step].options.map((option, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(250, 245, 255, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  className="group flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-purple-300 transition-all text-left shadow-sm"
                >
                  <span className="font-medium text-slate-700 group-hover:text-purple-800">{option}</span>
                  <ChevronRight className="text-slate-300 group-hover:text-purple-500 transition-colors" size={20} />
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
              <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin" />
              <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-semibold text-slate-800">Mendalami Psikis Anda...</h3>
              <p className="text-slate-500 italic">MindEase sedang menyusun profil psikologis dan teknik koping yang tepat.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-8 rounded-[2.5rem] space-y-8 border-purple-100/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Activity size={32} />
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-slate-800">Hasil Psikis</h2>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                    result.stress_level === 'Rendah' ? "bg-emerald-100 text-emerald-700" :
                    result.stress_level === 'Sedang' ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                  )}>
                    Tingkat Stres: {result.stress_level}
                  </span>
                </div>
              </div>
              <Sparkles className="text-purple-300 animate-pulse" />
            </div>

            <div className="p-6 bg-purple-50/50 rounded-2xl border border-purple-100/50">
              <p className="text-slate-800 leading-relaxed italic">
                "{result.analysis}"
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-widest text-purple-600/60">Teknik Koping Disarankan:</h3>
              <div className="grid gap-3">
                {result.coping_techniques.map((tech, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed">{tech}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
              <p className="text-xs text-rose-700 font-medium">
                <strong>Rekomendasi:</strong> {result.recommendation}
              </p>
            </div>

            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 p-5 rounded-2xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200"
            >
              <RefreshCcw size={20} />
              Ulangi Skrining
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
