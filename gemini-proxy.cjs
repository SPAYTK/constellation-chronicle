const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = process.env.GEMINI_API_KEY;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;

  console.log('Recibido prompt:', prompt);
  console.log('Usando API Key:', apiKey ? '***' + apiKey.slice(-4) : 'NO API KEY');
  console.log('URL:', url);

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    console.log('Gemini status:', response.status);
    const text = await response.text();
    console.log('Gemini response:', text);
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error('Error parsing response:', parseErr);
      return res.status(500).json({ error: 'Error parsing Gemini response', raw: text });
    }
    res.json(data);
  } catch (err) {
    console.error('Error en proxy Gemini:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Gemini proxy running on port ${PORT}`));

// Cambiar a CommonJS para compatibilidad con require
