// React Components for M.A.R.C.I.A
window.MarciaComponents = (() => {
  const { useState, useRef, useEffect } = React;
  const { AlertCircle, Sparkles, Settings } = window.LucideIcons;
  const { AI_PROVIDERS, analyzeWithAI } = window.AIService;
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

      // Main content
      React.createElement('div', {
        key: 'content',
        className: "relative z-10 min-h-screen p-6 md:p-12 flex items-center justify-center"
      },
        React.createElement('div', {
          className: "max-w-4xl w-full"
        }, [
          // Header
          React.createElement('div', {
            key: 'header',
            className: "text-center mb-12"
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
                className: "text-5xl md:text-6xl font-black text-white tracking-tight"
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
            className: "backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          }, [
            // Gauge section
            React.createElement(GaugeSection, {
              key: 'gauge',
              result,
              displayScore,
              getGaugeFillDasharray
            }),

            // Input section
            React.createElement('div', {
              key: 'input',
              className: "p-8 md:p-12 bg-white/5"
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

          // Settings section at the bottom
          React.createElement('div', {
            key: 'bottom-settings',
            className: "mt-8"
          }, [
            // Settings Panel (shown when settings button is clicked)
            showSettings ? React.createElement('div', {
              key: 'settings-panel',
              className: "backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-4 animate-fadeIn shadow-2xl"
            }, [
              React.createElement('h3', {
                key: 'title',
                className: "text-2xl font-bold text-white mb-4 flex items-center gap-2"
              }, [
                React.createElement(Settings, { key: 'icon', className: "w-6 h-6" }),
                tLang('settings')
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

                // API Key (for non-Ollama) - specific to current provider
                aiProvider !== 'ollama' && React.createElement('div', { key: 'apikey' }, [
                  React.createElement('label', {
                    key: 'label',
                    className: "block text-white font-semibold mb-2"
                  }, tLang('apiKey') + ' (' + AI_PROVIDERS[aiProvider].name + ')'),
                  React.createElement('input', {
                    key: 'input',
                    type: "password",
                    value: apiKeys[aiProvider] || '',
                    onChange: (e) => setApiKeys({...apiKeys, [aiProvider]: e.target.value}),
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
                    React.createElement('label', {
                      key: 'label',
                      className: "block text-white font-semibold mb-2"
                    }, tLang('ollamaModel')),
                    React.createElement('input', {
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
                  className: "w-full py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-all shadow-lg"
                }, tLang('saveSettings'))
              ])
            ]) : null,
            
            // Settings button (shown when panel is closed)
            React.createElement('div', {
              key: 'settings-btn-container',
              className: "flex justify-center"
            }, 
              React.createElement('button', {
                onClick: () => setShowSettings(!showSettings),
                className: "backdrop-blur-xl bg-white/10 rounded-2xl border-2 border-white/30 p-4 hover:bg-white/20 transition-all shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-3 text-white font-semibold",
                title: tLang('settings')
              }, [
                React.createElement(Settings, { key: 'icon', className: "w-6 h-6" }),
                React.createElement('span', { key: 'text' }, showSettings ? 'Fechar' : tLang('settings'))
              ])
            )
          ])
        ])
      )
    ]);
  };

  return {
    PettinessMeter
  };
})();
