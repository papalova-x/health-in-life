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

const localFallbacks = {
  mental: {
    analysis: "Berdasarkan jawabanmu, sepertinya kamu lagi ngerasa agak berat ya, Bestie. Inget, perasaanmu itu valid banget. Jangan lupa buat ambil jeda sejenak dan napas dalam-dalam. You're doing great!",
    suggestions: ["Coba teknik pernapasan 4-7-8", "Dengerin playlist lofi yang chill", "Tulis jurnal tentang apa yang kamu rasain"],
    mood_score: 7
  },
  nutrition: {
    analysis: "Pola makanmu udah lumayan oke, tapi masih bisa di-glow up lagi nih! Pastiin asupan air putih tetep terjaga biar nggak gampang lemes.",
    nutrition_tips: ["Tambah porsi sayur di tiap makan", "Kurangi minuman boba/manis berlebih", "Coba ganti camilan ke buah segar"],
    hydration_tip: "Bawa tumbler kemana-mana biar nggak lupa minum!",
    health_score: 8
  },
  physical: {
    analysis: "Aktivitas fisikmu perlu sedikit dorongan nih biar nggak gampang jompo. Gerak dikit aja udah ngebantu banget buat naikin mood dan energi!",
    recommendations: ["Jalan santai sore 15-30 menit", "Peregangan ringan tiap 2 jam duduk", "Coba workout 10 menit dari YouTube"],
    fitness_level: "Sedang"
  },
  digital: {
    analysis: "Screen time kamu lumayan tinggi nih. Hati-hati mata lelah dan postur 'tech neck'. Yuk, mulai kebiasaan digital yang lebih sehat!",
    detox_steps: ["Aktifkan mode malam/blue light filter", "Jauhin HP 30 menit sebelum tidur", "Pake aturan 20-20-20 buat mata"],
    digital_health_score: 6
  },
  wellness: {
    analysis: "Kualitas istirahatmu perlu diperhatiin lagi biar nggak burnout. Inget, istirahat itu bukan males, tapi investasi buat kesehatanmu.",
    sleep_tips: ["Tidurlah di jam yang sama tiap malam", "Bikin suasana kamar jadi redup dan sejuk", "Hindari kafein di sore/malam hari"],
    burnout_steps: ["Berani bilang 'tidak' buat beban berlebih", "Cari hobi yang bener-benar bikin rileks"],
    burnout_risk: "Sedang",
    sleep_quality: "Cukup"
  },
  psych: {
    analysis: "Sepertinya ada beberapa pikiran yang lagi bikin kamu overthinking. Inget, kamu nggak sendirian dan nggak apa-apa buat ngerasa nggak oke kadang-kadang.",
    coping_techniques: ["Teknik grounding 5-4-3-2-1", "Reframing pikiran negatif ke netral", "Meditasi singkat 5 menit"],
    stress_level: "Sedang",
    recommendation: "Kalau ngerasa makin berat, coba spill ke temen deket atau cari bantuan pro ya."
  },
  dental: {
    analysis: "Kesehatan gigimu udah cukup baik, tapi jangan sampe kendor ya perawatannya. Senyum slay butuh usaha yang konsisten!",
    recommendations: ["Sikat gigi minimal 2x sehari (pagi & malam)", "Ganti sikat gigi tiap 3 bulan sekali", "Gunakan pasta gigi berfluoride", "Jangan lupa bersihin lidah juga"],
    health_score: 8,
    risk_level: "Rendah"
  }
};

export const analyzeMentalState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna dari kuesioner kesehatan mental singkat:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis singkat tentang kondisi mental mereka saat ini dan berikan 3 saran praktis untuk meningkatkan suasana hati mereka. 
        Gunakan bahasa Gen Z yang asik dan santai.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "suggestions": ["string", "string", "string"], "mood_score": number (1-10) }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for mental health check");
        return localFallbacks.mental;
    }
};

export const analyzeNutritionState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna mengenai pola makan dan hidrasi:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis mengenai kecukupan nutrisi dan hidrasi mereka. 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 3 saran praktis untuk pola makan lebih sehat dan 1 tips hidrasi.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "nutrition_tips": ["string", "string", "string"], "hydration_tip": "string", "health_score": number (1-10) }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for nutrition check");
        return localFallbacks.nutrition;
    }
};

export const analyzePhysicalState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna mengenai aktivitas fisik:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis mengenai tingkat kebugaran fisik dan risiko gaya hidup sedenter mereka. 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 3 rekomendasi aktivitas fisik yang sesuai.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "recommendations": ["string", "string", "string"], "fitness_level": "Rendah" | "Sedang" | "Tinggi" }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for physical check");
        return localFallbacks.physical;
    }
};

export const analyzeDigitalState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna mengenai penggunaan perangkat digital:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis mengenai dampak penggunaan gadget terhadap kesehatan mental dan fisik mereka (mata, postur). 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 3 langkah "Digital Detox" atau kebiasaan sehat digital.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "detox_steps": ["string", "string", "string"], "digital_health_score": number (1-10) }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for digital check");
        return localFallbacks.digital;
    }
};

export const analyzeWellnessState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna dari skrining gaya hidup, tidur, dan burnout:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis mengenai kualitas tidur dan risiko burnout (kelelahan kerja/belajar) pengguna. 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 3 saran praktis untuk memperbaiki "Sleep Hygiene" dan 2 langkah untuk mencegah atau mengatasi burnout.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "sleep_tips": ["string", "string", "string"], "burnout_steps": ["string", "string"], "burnout_risk": "Rendah" | "Sedang" | "Tinggi", "sleep_quality": "Baik" | "Cukup" | "Buruk" }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for wellness check");
        return localFallbacks.wellness;
    }
};

export const analyzePsychologicalState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna dari skrining psikologis mendalam:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis psikologis yang empati namun mendalam mengenai indikasi tingkat stres, kecemasan, atau depresi ringan. 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 3 teknik koping psikologis yang spesifik (seperti CBT sederhana, mindfulness, atau reframing kognitif).
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "coping_techniques": ["string", "string", "string"], "stress_level": "Rendah" | "Sedang" | "Tinggi", "recommendation": "string" }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for psychological check");
        return localFallbacks.psych;
    }
};

export const analyzeDentalState = async (answers: Record<string, string>) => {
    try {
        if (!apiKey) throw new Error("Offline");
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Berikut adalah jawaban pengguna dari kuesioner kesehatan gigi dan mulut:
        ${Object.entries(answers).map(([q, a]) => `- Pertanyaan: ${q}\n  Jawaban: ${a}`).join('\n')}
        
        Berikan analisis mendalam tentang potensi kondisi kesehatan gigi mereka (seperti risiko karies, radang gusi, atau kebersihan mulut). 
        Gunakan bahasa Gen Z yang asik dan santai.
        Berikan 4 saran praktis untuk perawatan gigi harian mereka.
        Format jawaban dalam JSON dengan struktur: { "analysis": "string", "recommendations": ["string", "string", "string", "string"], "health_score": number (1-10), "risk_level": "Rendah" | "Sedang" | "Tinggi" }`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(response.text || "{}");
    } catch (error) {
        console.log("Using local fallback for dental check");
        return localFallbacks.dental;
    }
};
