import { supabase } from "../config/supabase.js";

export const badWordFilter = async (req, res, next) => {
  const { message } = req.body;
  if (!message) return next();

  const { data: badWords } = await supabase.from("bad_words").select("word");
  const badWordList = badWords.map((w) => w.word.toLowerCase());

  const containsBad = badWordList.some((w) =>
    message.toLowerCase().includes(w)
  );

  if (containsBad) {
    // track strikes, mute, or ban logic
    return res.status(400).json({
      message: "⚠️ Inappropriate language detected. Strike recorded.",
    });
  }

  next();
};
