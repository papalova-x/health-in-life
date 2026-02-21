import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiResponse = async (prompt: string, history: { role: "user" | "model", parts: { text: string }[] }[] = []) => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: "user", parts: [{ text: prompt }] }],
    config: {
      systemInstruction: `Kamu adalah HealthInAja, asisten kesehatan yang asik, empati, dan menggunakan bahasa gaul anak muda Indonesia (Gen Z). 
      Gunakan istilah seperti 'Bestie', 'Slay', 'Glow up', 'Overthinking', 'Valid', 'Chill', 'Jompo', dll. 
      Tugas Anda adalah mendengarkan keluh kesah (curhat) pengguna, memberikan dukungan emosional, dan saran yang menenangkan dengan gaya yang santai dan mendukung. 
      Jangan kaku! Tetap berikan saran kesehatan yang akurat.
      Jika pengguna menunjukkan tanda-tanda bahaya serius (ingin menyakiti diri sendiri), berikan nomor darurat kesehatan mental di Indonesia (seperti Halo Kemenkes 1500-567).`,
    },
  });

  const response = await model;
  return response.text;
};

export const analyzeMentalState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna dari kuesioner kesehatan mental singkat:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis singkat tentang kondisi mental mereka saat ini dan berikan 3 saran praktis untuk meningkatkan suasana hati mereka. 
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "suggestions": ["string", "string", "string"], "mood_score": number (1-10) }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzeNutritionState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna mengenai pola makan dan hidrasi:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis mengenai kecukupan nutrisi dan hidrasi mereka. 
    Berikan 3 saran praktis untuk pola makan lebih sehat dan 1 tips hidrasi.
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "nutrition_tips": ["string", "string", "string"], "hydration_tip": "string", "health_score": number (1-10) }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzePhysicalState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna mengenai aktivitas fisik:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis mengenai tingkat kebugaran fisik dan risiko gaya hidup sedenter mereka. 
    Berikan 3 rekomendasi aktivitas fisik yang sesuai.
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "recommendations": ["string", "string", "string"], "fitness_level": "Rendah" | "Sedang" | "Tinggi" }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzeDigitalState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna mengenai penggunaan perangkat digital:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis mengenai dampak penggunaan gadget terhadap kesehatan mental dan fisik mereka (mata, postur). 
    Berikan 3 langkah "Digital Detox" atau kebiasaan sehat digital.
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "detox_steps": ["string", "string", "string"], "digital_health_score": number (1-10) }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzeWellnessState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna dari skrining gaya hidup, tidur, dan burnout:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis mengenai kualitas tidur dan risiko burnout (kelelahan kerja/belajar) pengguna. 
    Berikan 3 saran praktis untuk memperbaiki "Sleep Hygiene" dan 2 langkah untuk mencegah atau mengatasi burnout.
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "sleep_tips": ["string", "string", "string"], "burnout_steps": ["string", "string"], "burnout_risk": "Rendah" | "Sedang" | "Tinggi", "sleep_quality": "Baik" | "Cukup" | "Buruk" }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzePsychologicalState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna dari skrining psikologis mendalam:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis psikologis yang empati namun mendalam mengenai indikasi tingkat stres, kecemasan, atau depresi ringan. 
    Berikan 3 teknik koping psikologis yang spesifik (seperti CBT sederhana, mindfulness, atau reframing kognitif).
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "coping_techniques": ["string", "string", "string"], "stress_level": "Rendah" | "Sedang" | "Tinggi", "recommendation": "string" }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};

export const analyzeDentalState = async (answers: Record<string, string>) => {
    if (!apiKey) {
        throw new Error("Gemini API Key is missing");
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Berikut adalah jawaban pengguna dari kuesioner kesehatan gigi dan mulut:
    ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
    
    Berikan analisis mendalam tentang potensi kondisi kesehatan gigi mereka (seperti risiko karies, radang gusi, atau kebersihan mulut). 
    Berikan 4 saran praktis untuk perawatan gigi harian mereka.
    Format jawaban dalam JSON dengan struktur: { "analysis": "string", "recommendations": ["string", "string", "string", "string"], "health_score": number (1-10), "risk_level": "Rendah" | "Sedang" | "Tinggi" }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    return JSON.parse(response.text || "{}");
};
