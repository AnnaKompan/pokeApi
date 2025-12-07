import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;

  try {
    const fakeResponse =
      'Pikachu: great electric support\nCharizard: strong ranged attacks';

    res.json({ result: fakeResponse });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
