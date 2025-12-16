// React Components for M.A.R.C.I.A
window.MarciaComponents = (() => {
  const { useState, useRef, useEffect } = React;
  const { AlertCircle, Sparkles, Settings, Github } = window.LucideIcons;
  const { AI_PROVIDERS, analyzeWithAI, getOllamaModels } = window.AIService;
  const { GaugeSection, InputSection, ResultsSection } = window.MarciaSections;

  // Check if running in Tauri
  const isTauri = window.__TAURI__ !== undefined;

  // Main Pettiness Meter Component
  const PettinessMeter = () => {
    const [grievance, setGrievance] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [displayScore, setDisplayScore] = useState(0);
    const selectedLocale = 'pt-BR';
    const [showSettings, setShowSettings] = useState(false);
    const [aiProvider, setAiProvider] = useState('claude');
    const [apiKeys, setApiKeys] = useState({
      openai: '',
      gemini: '',
      claude: '',
      maritaca: ''
    });
    const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434/v1');
    const [ollamaModel, setOllamaModel] = useState('gemma3:1b');
    const [ollamaModels, setOllamaModels] = useState([]);
    const [loadingModels, setLoadingModels] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Load settings on mount
    useEffect(() => {
      if (isTauri) {
        window.__TAURI__.invoke('load_settings').then(settings => {
          console.log('Loaded settings:', settings);
          setAiProvider(settings.ai_provider || 'claude');

          // Load API keys per provider
          if (settings.api_keys) {
            setApiKeys(settings.api_keys);
          }

          setOllamaUrl(settings.ollama_url || 'http://localhost:11434/v1');
          setOllamaModel(settings.ollama_model || 'gemma3:1b');
        }).catch(err => {
          console.error('Failed to load settings:', err);
        });
      } else {
        // Browser fallback - load from localStorage
        const saved = localStorage.getItem('marcia_settings');
        if (saved) {
          try {
            const settings = JSON.parse(saved);
            setAiProvider(settings.ai_provider || 'claude');
            if (settings.api_keys) {
              setApiKeys(settings.api_keys);
            }
            setOllamaUrl(settings.ollama_url || 'http://localhost:11434/v1');
            setOllamaModel(settings.ollama_model || 'gemma3:1b');
          } catch (e) {
            console.error('Failed to parse saved settings:', e);
          }
        }
      }
    }, []);

    // Fetch Models Effect
    useEffect(() => {
      if (aiProvider === 'ollama' && ollamaUrl) {
        const fetchModels = async () => {
          setLoadingModels(true);
          try {
            const models = await getOllamaModels(ollamaUrl);
            if (models && models.length > 0) {
              setOllamaModels(models);
              // Optional: auto-select first model if current is invalid
              // if (!models.includes(ollamaModel)) setOllamaModel(models[0]);
            }
          } catch (e) {
            console.error("Failed to fetch models", e);
          } finally {
            setLoadingModels(false);
          }
        };

        // Debounce or just call it
        const timer = setTimeout(fetchModels, 500);
        return () => clearTimeout(timer);
      }
    }, [aiProvider, ollamaUrl]);


    const tLang = (key) => window.translations['pt-BR']?.[key] || key;

    const exampleGrievances = [
      { label: tLang('exampleLoudBreathing'), text: tLang('grievanceLoudBreathing') },
      { label: tLang('exampleDoorHolding'), text: tLang('grievanceDoorHolding') },
      { label: tLang('exampleFishMicrowaver'), text: tLang('grievanceFishMicrowaver') },
      { label: tLang('exampleWrongTP'), text: tLang('grievanceWrongTP') }
    ];

    const saveSettings = async () => {
      if (isTauri) {
        try {
          await window.__TAURI__.invoke('save_settings', {
            settings: {
              ai_provider: aiProvider,
              api_keys: apiKeys,
              ollama_url: ollamaUrl,
              ollama_model: ollamaModel,
              selected_locale: 'pt-BR'
            }
          });
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          console.log('Settings saved successfully!');
        } catch (err) {
          console.error('Failed to save settings:', err);
          setError('Failed to save settings: ' + err);
        }
      } else {
        // Browser fallback - use localStorage
        localStorage.setItem('marcia_settings', JSON.stringify({
          ai_provider: aiProvider,
          api_keys: apiKeys,
          ollama_url: ollamaUrl,
          ollama_model: ollamaModel,
          selected_locale: 'pt-BR'
        }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    };

    const analyzeGrievance = async () => {
      if (!grievance.trim()) {
        setError(tLang('errorMessage'));
        return;
      }

      // Get the API key for the current provider
      const currentApiKey = apiKeys[aiProvider] || '';

      if (!currentApiKey && aiProvider !== 'ollama') {
        setError(tLang('apiKeyRequired'));
        setShowSettings(true);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const data = await analyzeWithAI(
          grievance, aiProvider, currentApiKey, ollamaUrl, ollamaModel
        );
        setResult(data);
        animateScore(data.score);
      } catch (err) {
        console.error('Error analyzing grievance:', err);
        setError(tLang('failedAnalysis') + ': ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const animateScore = (targetScore) => {
      const duration = 1500;
      const startTime = Date.now();

      const updateScore = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentScore = Math.round(targetScore * easeOut);

        setDisplayScore(currentScore);

        if (progress < 1) {
          requestAnimationFrame(updateScore);
        }
      };

      requestAnimationFrame(updateScore);
    };

    const getGaugeFillDasharray = (score) => {
      const arcLength = 220;
      const fillLength = (score / 100) * arcLength;
      return `${fillLength} ${arcLength}`;
    };

    return React.createElement('div', {
      className: "min-h-screen relative overflow-hidden",
      style: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
    }, [
      // Background blobs
      React.createElement('div', {
        key: 'bg',
        className: "absolute inset-0 overflow-hidden pointer-events-none"
      }, [
        React.createElement('div', {
          key: 'blob1',
          className: "absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-blob",
          style: { background: '#F4BE72', top: '-10%', left: '-10%', animationDelay: '0s' }
        }),
        React.createElement('div', {
          key: 'blob2',
          className: "absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-blob",
          style: { background: '#E68600', top: '40%', right: '-10%', animationDelay: '2s' }
        }),
        React.createElement('div', {
          key: 'blob3',
          className: "absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-blob",
          style: { background: '#45260C', bottom: '-10%', left: '40%', animationDelay: '4s' }
        })
      ]),

      showSettings && React.createElement('div', {
        key: 'settings-modal',
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn",
        onClick: (e) => { if (e.target === e.currentTarget) setShowSettings(false); }
      }, [
        React.createElement('div', {
          className: "w-full max-w-lg backdrop-blur-xl bg-slate-900/90 rounded-2xl border border-white/20 p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        }, [
          React.createElement('div', { className: "flex justify-between items-center mb-6" }, [
            React.createElement('h3', { className: "text-2xl font-bold text-white flex items-center gap-2" }, [
              React.createElement(Settings, { className: "w-6 h-6" }),
              tLang('settings')
            ]),
            React.createElement('button', {
              onClick: () => setShowSettings(false),
              className: "p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            }, "✕")
          ]),

          React.createElement('div', {
            key: 'form',
            className: "space-y-4"
          }, [
            // AI Provider
            React.createElement('div', { key: 'provider' }, [
              React.createElement('label', {
                key: 'label',
                className: "block text-white font-semibold mb-2"
              }, tLang('aiProvider')),
              React.createElement('select', {
                key: 'select',
                value: aiProvider,
                onChange: (e) => setAiProvider(e.target.value),
                className: "w-full p-3 rounded-xl bg-white/90 text-gray-800 border-2 border-white/30 focus:border-yellow-300 focus:outline-none font-medium"
              }, Object.entries(AI_PROVIDERS).map(([value, config]) =>
                React.createElement('option', {
                  key: value,
                  value: value
                }, config.name)
              ))
            ]),

            // API Key (for non-Ollama)
            aiProvider !== 'ollama' && React.createElement('div', { key: 'apikey' }, [
              React.createElement('label', {
                key: 'label',
                className: "block text-white font-semibold mb-2"
              }, tLang('apiKey') + ' (' + AI_PROVIDERS[aiProvider].name + ')'),
              React.createElement('input', {
                key: 'input',
                type: "password",
                value: apiKeys[aiProvider] || '',
                onChange: (e) => setApiKeys({ ...apiKeys, [aiProvider]: e.target.value }),
                placeholder: tLang('apiKeyPlaceholder'),
                className: "w-full p-3 rounded-xl bg-white/90 text-gray-800 border-2 border-white/30 focus:border-yellow-300 focus:outline-none"
              })
            ]),

            // Ollama settings
            aiProvider === 'ollama' && React.createElement('div', {
              key: 'ollama',
              className: "space-y-4"
            }, [
              React.createElement('div', { key: 'url' }, [
                React.createElement('label', {
                  key: 'label',
                  className: "block text-white font-semibold mb-2"
                }, tLang('ollamaUrl')),
                React.createElement('input', {
                  key: 'input',
                  type: "text",
                  value: ollamaUrl,
                  onChange: (e) => setOllamaUrl(e.target.value),
                  placeholder: tLang('ollamaUrlPlaceholder'),
                  className: "w-full p-3 rounded-xl bg-white/90 text-gray-800 border-2 border-white/30 focus:border-yellow-300 focus:outline-none"
                })
              ]),
              React.createElement('div', { key: 'model' }, [
                React.createElement('div', { className: "flex justify-between mb-2" }, [
                  React.createElement('label', {
                    key: 'label',
                    className: "block text-white font-semibold"
                  }, tLang('ollamaModel')),
                  loadingModels && React.createElement('span', { className: "text-xs text-yellow-300 animate-pulse" }, "Carregando modelos...")
                ]),

                ollamaModels.length > 0 ? React.createElement('select', {
                  key: 'select-model',
                  value: ollamaModel,
                  onChange: (e) => setOllamaModel(e.target.value),
                  className: "w-full p-3 rounded-xl bg-white/90 text-gray-800 border-2 border-white/30 focus:border-yellow-300 focus:outline-none font-medium"
                }, ollamaModels.map(model =>
                  React.createElement('option', { key: model, value: model }, model)
                )) : React.createElement('input', {
                  key: 'input',
                  type: "text",
                  value: ollamaModel,
                  onChange: (e) => setOllamaModel(e.target.value),
                  placeholder: tLang('ollamaModelPlaceholder'),
                  className: "w-full p-3 rounded-xl bg-white/90 text-gray-800 border-2 border-white/30 focus:border-yellow-300 focus:outline-none"
                })
              ])
            ]),

            // Success message
            saveSuccess && React.createElement('div', {
              key: 'success',
              className: "p-4 rounded-xl bg-green-500/20 border border-green-300/30 text-green-300 font-semibold text-center"
            }, tLang('settingsSaved')),

            // Save button
            React.createElement('button', {
              key: 'save',
              onClick: () => {
                saveSettings();
                setShowSettings(false);
              },
              className: "w-full py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-all shadow-lg mt-4"
            }, tLang('saveSettings'))
          ])
        ])
      ]),

      // Main content
      React.createElement('div', {
        key: 'content',
        className: "relative z-10 min-h-screen p-6 md:p-12 flex items-center justify-center"
      },
        React.createElement('div', {
          className: "max-w-6xl w-full transition-all duration-500 ease-in-out relative" // Added relative
        }, [
          // Top Navigation (Moved here for alignment)
          React.createElement('div', {
            key: 'top-nav',
            className: "absolute top-0 right-0 z-50 flex items-center gap-3 -mt-2" // Positioned relative to container
          }, [
            React.createElement('button', {
              key: 'github',
              onClick: async () => {
                const url = "https://github.com/kadmielp/MARCIA";
                if (isTauri && window.__TAURI__?.shell) {
                  try {
                    await window.__TAURI__.shell.open(url);
                  } catch (e) {
                    console.error(e);
                    window.open(url, '_blank');
                  }
                } else {
                  window.open(url, '_blank');
                }
              },
              className: "p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 backdrop-blur-md",
              title: "GitHub"
            }, React.createElement(Github, { className: "w-6 h-6" })),
            React.createElement('button', {
              key: 'settings-toggle',
              onClick: () => setShowSettings(true),
              className: "p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 backdrop-blur-md",
              title: tLang('settings')
            }, React.createElement(Settings, { className: "w-6 h-6" }))
          ]),

          // Header
          React.createElement('div', {
            key: 'header',
            className: "text-center mb-4 md:mb-6 mt-12" // Added margin-top to clear nav
          }, [
            React.createElement('div', {
              key: 'title',
              className: "inline-flex items-center gap-2 mb-4"
            }, [
              React.createElement(Sparkles, {
                key: 's1',
                className: "w-8 h-8 text-yellow-300 animate-pulse"
              }),
              React.createElement('h1', {
                key: 'h1',
                className: "text-4xl md:text-5xl font-black text-white tracking-tight"
              }, tLang('appName')),
              React.createElement(Sparkles, {
                key: 's2',
                className: "w-8 h-8 text-yellow-300 animate-pulse"
              })
            ]),
            React.createElement('p', {
              key: 'subtitle1',
              className: "text-2xl text-yellow-300 font-bold mb-2 tracking-wide"
            }, tLang('title')),
            React.createElement('p', {
              key: 'subtitle2',
              className: "text-lg text-purple-100 font-light"
            }, tLang('subtitle'))
          ]),

          // Main card with gauge and input
          React.createElement('div', {
            key: 'card',
            className: "backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500"
          }, [
            // Gauge section
            React.createElement('div', {
              className: "w-full border-b border-white/10"
            }, React.createElement(GaugeSection, {
              key: 'gauge',
              result,
              displayScore,
              getGaugeFillDasharray
            })),

            // Input section
            React.createElement('div', {
              key: 'input',
              className: "p-6 md:p-8 bg-white/5 w-full"
            }, !result ? React.createElement(InputSection, {
              grievance,
              setGrievance,
              exampleGrievances,
              error,
              loading,
              analyzeGrievance,
              tLang
            }) : React.createElement(ResultsSection, {
              grievance,
              result,
              resetApp: () => {
                setGrievance('');
                setResult(null);
                setDisplayScore(0);
                setError('');
              },
              tLang
            }))
          ]),

        ])
      )
    ]);
  };

  return {
    PettinessMeter
  };
})();
