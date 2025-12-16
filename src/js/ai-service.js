// AI Service for handling different providers
window.AIService = (() => {

  const AI_PROVIDERS = {
    'openai': {
      name: 'OpenAI (GPT)',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o'
    },
    'gemini': {
      name: 'Google Gemini',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-2.5-flash'
    },
    'claude': {
      name: 'Claude (Anthropic)',
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3-5-sonnet-20241022'
    },
    'maritaca': {
      name: 'Maritaca AI',
      baseUrl: 'https://chat.maritaca.ai/api',
      model: 'sabia-3.1'
    },
    'ollama': {
      name: 'Ollama (Local)',
      baseUrl: 'http://localhost:11434/v1',
      model: 'gemma3:1b'
    }
  };

  const analyzeWithAI = async (grievance, provider, apiKey, ollamaUrl, ollamaModel) => {
    const prompt = `Você é uma psicóloga direta, realista e sem papas na língua que avalia mesquinhez. Sua personalidade é baseada em frases, mas não limitadas a:
    - "Nem todo mundo vai te agradar!"
    - "Enfia a língua no céu da boca e conte até dez..."
    - "Responsabilização pessoal acima de vitimismo: pare de culpar inveja e assuma o próprio rumo."
    - "Pensa se vale gastar energia com isso!"
    - "Pare de ser uma pessoa preguiçosa e assuma o controle da sua vida!"
    - "Seja uma pessoa melhor, não uma pessoa melhorzinha!"
    - "Não seja uma pessoa que se preocupa com o que os outros pensam!"
    - "⁠Quanta gente você já falou que é culpada pelo teu fracasso? O seu fracasso é você mesmo. Carrega nas costas. Para de falar que é inveja"

    Analise a seguinte queixa e atribua uma nota de 0 a 100, em que:
    - 0-20: Preocupação legítima (Isso é realmente sério!)
    - 21-40: Queixa razoável (Justo, isso é chato mesmo)
    - 41-60: Começando a ficar mesquinho (Ok, mas talvez seja bom respirar e seguir)
    - 61-80: Bem mesquinho (Vale a pena desapegar dessa)
    - 81-100: Pico da mesquinhês (Sério? Melhor deixar pra lá!)

    Queixa: "${grievance}"

    Responda APENAS com um objeto JSON válido:
    {
      "score": [número 0-100],
      "category": "[categoria]",
      "judgment": "[julgamento direto e realista da queixa sem conselhos]",
      "advice": "[conselho humoroso com a personalidade da psicóloga, prático e útil, não se limite às frases citadas]"
    }
    
    Responda em português brasileiro`;

    const providerConfig = AI_PROVIDERS[provider];
    let baseUrl = provider === 'ollama' ? ollamaUrl : providerConfig.baseUrl;

    // Remove trailing slash if present to avoid double slashes
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    // Ensure Ollama URL ends with /v1 for OpenAI compatibility
    if (provider === 'ollama' && !baseUrl.endsWith('/v1')) {
      baseUrl = `${baseUrl}/v1`;
    }

    const model = provider === 'ollama' ? ollamaModel : providerConfig.model;

    let response;
    let responseText;

    if (provider === 'openai' || provider === 'maritaca' || provider === 'ollama') {
      // OpenAI-compatible API
      const headers = {
        'Content-Type': 'application/json'
      };

      // Only add Authorization for providers that need it
      if (provider !== 'ollama') {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const requestUrl = `${baseUrl}/chat/completions`;
      const requestBody = {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 1
      };

      console.log(`🤖 ${provider} request:`, { url: requestUrl, model: model });

      const apiResponse = await universalFetch(requestUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error(`❌ ${provider} API Error:`, apiResponse.status, errorText);
        throw new Error(`${provider} API Error: ${apiResponse.status} - ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      console.log(`✅ ${provider} response received:`, data);
      responseText = data.choices?.[0]?.message?.content;
    } else if (provider === 'gemini') {
      const apiResponse = await universalFetch(`${baseUrl}/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status} - ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    } else if (provider === 'claude') {
      const apiResponse = await universalFetch(`${baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!apiResponse.ok) {
        throw new Error(`API Error: ${apiResponse.status} - ${apiResponse.statusText}`);
      }

      const data = await apiResponse.json();
      responseText = data.content?.[0]?.text;
    }

    if (!responseText) {
      throw new Error('No response from AI provider');
    }

    // Clean and parse JSON response
    let cleanResponse = responseText.trim();
    if (cleanResponse.includes('```json')) {
      cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (cleanResponse.includes('```')) {
      cleanResponse = cleanResponse.replace(/```\n?/g, '');
    }

    return JSON.parse(cleanResponse.trim());
  };

  // Helper for CORS-safe fetching via Tauri
  const universalFetch = async (url, options = {}) => {
    if (window.__TAURI__ && window.__TAURI__.http) {
      try {
        const { fetch, Body } = window.__TAURI__.http;
        const tauriOptions = {
          method: options.method || 'GET',
          headers: options.headers || {}
        };

        if (options.body) {
          try {
            // Attempt to parse JSON body
            const bodyObj = JSON.parse(options.body);
            tauriOptions.body = Body.json(bodyObj);
          } catch (e) {
            // Fallback to text
            tauriOptions.body = Body.text(options.body);
          }
        }

        const response = await fetch(url, tauriOptions);

        // Normalize Tauri response to match standard Fetch API interface
        return {
          ok: response.ok,
          status: response.status,
          statusText: 'Tauri Request',
          json: async () => response.data,
          text: async () => typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
        };
      } catch (e) {
        console.error('Tauri fetch failed:', e);
        throw e;
      }
    } else {
      return window.fetch(url, options);
    }
  };

  const getOllamaModels = async (inputUrl) => {
    let baseUrl = inputUrl.trim();
    // Remove trailing slash
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    // Attempt to clean /v1 to find the root endpoint for api/tags
    let rootUrl = baseUrl;
    if (rootUrl.endsWith('/v1')) {
      rootUrl = rootUrl.slice(0, -3);
    }

    try {
      // Try fetching from /api/tags (Ollama native)
      const response = await universalFetch(`${rootUrl}/api/tags`);
      if (response.ok) {
        const data = await response.json();
        if (data.models && Array.isArray(data.models)) {
          return data.models.map(m => m.name);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from /api/tags, trying /v1/models', e);
    }

    // Fallback: Try /v1/models (OpenAI compatible)
    try {
      let v1Url = baseUrl;
      if (!v1Url.endsWith('/v1')) v1Url = `${v1Url}/v1`;

      const response = await universalFetch(`${v1Url}/models`);
      if (response.ok) {
        const data = await response.json();
        // OpenAI format: { data: [ { id: ... }, ... ] }
        if (data.data && Array.isArray(data.data)) {
          return data.data.map(m => m.id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch Ollama models', e);
    }

    return [];
  };

  return {
    AI_PROVIDERS,
    analyzeWithAI,
    getOllamaModels
  };
})();
