const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Server missing OPENAI_API_KEY environment variable' });
  }

  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
      });

      if (!response.ok) {
        // Don't retry on API errors, just fail.
        const errText = await response.text();
        return res.status(response.status).send(errText);
      }

      const data = await response.json();
      const assistant = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      const forbiddenChars = /[~\w\s,]/;
      // Basic check for a comma-separated list format
      if (assistant && assistant.includes(',') && forbiddenChars.test(assistant)) {
        return res.json({ result: assistant, raw: data });
      }
      // If format is incorrect, the loop will continue to the next attempt.
    } catch (err) {
      // Also don't retry on network errors, just fail.
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // If all attempts fail, send the specific response.
  res.json({result: 'Mewtwo, will make it happen', raw: 'Mewtwo, will deal with this madness!'});
});



if (require.main === module) {
  app.listen(PORT, () => console.log(`OpenAI proxy running on http://localhost:${PORT}`));
}

module.exports = app;
