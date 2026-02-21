import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("health.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT UNIQUE,
    answer TEXT
  );
`);

// Seed initial data if empty
const count = db.prepare("SELECT count(*) as count FROM knowledge_base").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO knowledge_base (keyword, answer) VALUES (?, ?)");
  const initialData = [
    ["stres", "Duh, lagi stres ya? Chill dulu, Bestie! Stres itu wajar kok. Coba deh teknik pernapasan: tarik napas 4 detik, tahan 7 detik, buang 4 detik. Biar makin zen! 🧘‍♂️"],
    ["gigi", "Mau senyum makin slay? Sikat gigi minimal 2 kali sehari ya! Jangan lupa flossing juga biar nggak ada sisa makanan yang 'ghosting' di sela gigi. Kurangi yang manis-manis juga, Kak! ✨"],
    ["tidur", "Begadang mulu ya? Inget, tidur 7-9 jam itu wajib biar nggak gampang 'lowbat'. Jauhin HP 1 jam sebelum tidur biar kualitas tidurmu makin mantap! 😴"],
    ["burnout", "Lagi ngerasa burnout? Valid banget! Ambil jeda dulu, jangan dipaksa. Set batasan kerja biar nggak gampang capek mental. Self-care itu investasi, bukan males-malesan! 🔋"],
    ["nutrisi", "Makan yang bener dong biar tetep glow up! Pastiin ada sayur, buah, sama protein. Dan yang paling penting: jangan lupa minum air putih minimal 8 gelas. Hidrasi itu kunci! 💧"],
    ["cemas", "Lagi overthinking ya? Tenang, tarik napas dulu. Coba teknik 5-4-3-2-1: cari 5 benda yang kelihatan, 4 yang bisa diraba, 3 suara, 2 bau, sama 1 rasa. You got this! 🌈"],
    ["olahraga", "Gerak dikit yuk biar nggak jompo! Jalan santai 30 menit aja udah cukup buat naikin mood. Olahraga itu biar badan tetep fit dan mental tetep oke! 🏃‍♂️"],
    ["depresi", "Kalau ngerasa sedih terus, jangan dipendem sendiri ya. Cerita ke orang yang kamu percaya atau cari bantuan pro. Kamu berharga banget, dan kita di sini buat kamu. ❤️"],
    ["mata", "Mata udah perih liatin layar mulu? Pake aturan 20-20-20: tiap 20 menit, liat benda sejauh 6 meter selama 20 detik. Biar mata nggak gampang lelah, Bestie! 👀"],
    ["halo", "Halo! HealthInAja di sini. Ada yang mau dicurhatin atau mau cek kesehatan hari ini? Spill aja, aku dengerin! 👋"]
  ];
  
  for (const [keyword, answer] of initialData) {
    insert.run(keyword, answer);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Chat (Local Database Search)
  app.post("/api/chat", (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const lowerMsg = message.toLowerCase();
    
    // Simple keyword matching in database
    const stmt = db.prepare("SELECT answer FROM knowledge_base WHERE ? LIKE '%' || keyword || '%'");
    const result = stmt.get(lowerMsg) as { answer: string } | undefined;

    if (result) {
      res.json({ answer: result.answer, source: "local_db" });
    } else {
      res.json({ answer: null, source: "none" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
