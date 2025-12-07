import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const FAKE_RESPONSE =
  'Pikachu: great electric support\nCharizard: strong ranged attacks';

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || !process.env.OPENAI_API_KEY) {
    console.warn(
      '[WARNING] Missing prompt or API key — returning fake response'
    );
    return res.json({ result: FAKE_RESPONSE });
  }

  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
          }),
        }
      );

      if (!response.ok) {
        console.error(`[API ERROR] ${response.status} — attempt ${i + 1}/3`);
        continue;
      }

      const data = await response.json();
      let text = data.choices?.[0]?.message?.content ?? '';

      if (text.endsWith('.')) text = text.slice(0, -1);

      const lines = text.split('\n').filter(l => l.trim());
      if (!lines.every(l => l.includes(':'))) {
        console.warn(`[FORMAT ERROR] Invalid format — attempt ${i + 1}/3`);
        continue;
      }

      return res.json({ result: text, raw: data });
    } catch (err) {
      console.error(`[FETCH ERROR] attempt ${i + 1}/3 — ${err.message}`);
      continue;
    }
  }

  res.json({ result: FAKE_RESPONSE });
});

app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);

export default app;
