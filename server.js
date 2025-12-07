const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/api/openai', async (req, res) => {
  const { prompt } = req.body;
  
  // Default fallback response
  const defaultResponse = { result: 'Mewtwo, will make it happen', raw: 'Mewtwo, will deal with this madness!' };

  if (!prompt || !process.env.OPENAI_API_KEY) {
    console.warn('[VALIDATION ERROR] Missing prompt or OPENAI_API_KEY');
    return res.json(defaultResponse);
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
        console.error(`[API ERROR] OpenAI API returned status ${response.status} - Attempt ${i + 1}/3`);
        continue;
      }

      const data = await response.json();
      let assistant = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      
      // Remove trailing dot if present
      if (assistant && assistant.endsWith('.')) {
        assistant = assistant.slice(0, -1);
      }
      
      console.log('[OpenAI Response] Raw data:', JSON.stringify(data, null, 2));
      console.log('[OpenAI Response] Extracted content:', assistant);
      
      // Validate response format: each line should be "PokemonName: description"
      const lines = assistant.split('\n').filter(line => line.trim().length > 0);
      
      // Check that we have at least one valid pokemon entry
      const validPokemonFormat = lines.every(line => line.includes(':'));
      if (!validPokemonFormat || lines.length === 0) {
        console.warn(`[FORMAT ERROR] Response doesn't match expected format (pokemon: reason) - Attempt ${i + 1}/3`);
        continue;
      }
      
      // Validate that pokemon names are valid (should be alphabetic)
      const pokemonNames = lines.map(line => line.split(':')[0].trim());
      const validNames = pokemonNames.every(name => /^[a-zA-Z\s]+$/.test(name));
      if (!validNames) {
        console.warn(`[FORMAT ERROR] Pokemon names contain invalid characters - Attempt ${i + 1}/3`);
        continue;
      }
      
      console.log('[SUCCESS] Valid response received from OpenAI');
      console.log('[POKEMON ENTRIES] Found:', pokemonNames.join(', '));
      return res.json({ result: assistant, raw: data });
    } catch (err) {
      // Log different types of network/fetch errors
      if (err.code === 'ENOTFOUND') {
        console.error('[NETWORK ERROR] DNS resolution failed - Cannot reach OpenAI API');
      } else if (err.code === 'ECONNREFUSED') {
        console.error('[NETWORK ERROR] Connection refused - OpenAI API server unreachable');
      } else if (err.code === 'ETIMEDOUT') {
        console.error('[TIMEOUT ERROR] Request timeout - Attempt ${i + 1}/3');
      } else if (err instanceof TypeError) {
        console.error('[TYPE ERROR] Invalid request - ' + err.message);
      } else {
        console.error(`[FETCH ERROR] Attempt ${i + 1}/3 - ${err.message}`);
      }
      continue;
    }
  }

  // If all attempts fail, send the default response.
  console.error('[FINAL ERROR] All 3 attempts failed, returning default response');
  res.json(defaultResponse);
});



if (require.main === module) {
  app.listen(PORT, () => console.log(`OpenAI proxy running on http://localhost:${PORT}`));
}

module.exports = app;
