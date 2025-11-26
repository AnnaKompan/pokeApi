const aiInput = document.getElementById('aiinput');
const aiResponse = document.querySelector('.openai-response');

if (aiInput) {
  aiInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const prompt = aiInput.value.trim();
        console.log('Prompt:', prompt); // Log the prompt value

      if (!prompt) return;
      if (aiResponse) aiResponse.textContent = 'Thinking...';

      try {
        const res = await fetch('http://localhost:3000/api/openai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const text = await res.text();
          if (aiResponse) aiResponse.textContent = `Error: ${text}`;
          return;
        }

        const data = await res.json();
        if (aiResponse) aiResponse.textContent = data.result || JSON.stringify(data.raw || data);
      } catch (err) {
        if (aiResponse) aiResponse.textContent = `Network error: ${err.message}`;
      } finally {
        aiInput.value = '';
      }
    }
  });
}
