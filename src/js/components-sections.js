// Additional React Components for M.A.R.C.I.A sections
window.MarciaSections = (() => {
  const { AlertCircle } = window.LucideIcons;

  // Gauge Section Component
  const GaugeSection = ({ result, displayScore, getGaugeFillDasharray }) => {
    return React.createElement('div', {
      className: "p-8 md:p-12 gauge-gradient"
    }, 
      React.createElement('div', {
        className: "flex flex-col items-center"
      }, 
        React.createElement('div', {
          className: "relative w-80 h-48 mb-6"
        }, [
          // SVG Gauge
          React.createElement('svg', {
            key: 'gauge-svg',
            viewBox: "0 0 200 130",
            className: "w-full h-full drop-shadow-lg"
          }, [
            React.createElement('defs', { key: 'defs' }, [
              React.createElement('filter', { key: 'filter', id: "glow" }, [
                React.createElement('feGaussianBlur', {
                  key: 'blur',
                  stdDeviation: "3",
                  result: "coloredBlur"
                }),
                React.createElement('feMerge', { key: 'merge' }, [
                  React.createElement('feMergeNode', {
                    key: 'node1',
                    in: "coloredBlur"
                  }),
                  React.createElement('feMergeNode', {
                    key: 'node2',
                    in: "SourceGraphic"
                  })
                ])
              ]),
              React.createElement('linearGradient', {
                key: 'gradient',
                id: "gaugeGradient",
                x1: "0%",
                y1: "0%",
                x2: "100%",
                y2: "0%"
              }, [
                React.createElement('stop', {
                  key: 'stop1',
                  offset: "0%",
                  stopColor: "#10b981"
                }),
                React.createElement('stop', {
                  key: 'stop2',
                  offset: "25%",
                  stopColor: "#f59e0b"
                }),
                React.createElement('stop', {
                  key: 'stop3',
                  offset: "50%",
                  stopColor: "#f97316"
                }),
                React.createElement('stop', {
                  key: 'stop4',
                  offset: "75%",
                  stopColor: "#ef4444"
                }),
                React.createElement('stop', {
                  key: 'stop5',
                  offset: "100%",
                  stopColor: "#dc2626"
                })
              ])
            ]),
            // Background arc
            React.createElement('path', {
              key: 'bg-arc',
              d: "M 30 100 A 70 70 0 0 1 170 100",
              fill: "none",
              stroke: "rgba(255,255,255,0.2)",
              strokeWidth: "18",
              strokeLinecap: "round"
            }),
            // Progress arc
            React.createElement('path', {
              key: 'progress-arc',
              d: "M 30 100 A 70 70 0 0 1 170 100",
              fill: "none",
              stroke: "url(#gaugeGradient)",
              strokeWidth: "18",
              strokeLinecap: "round",
              strokeDasharray: getGaugeFillDasharray(displayScore),
              className: "transition-all duration-1500 ease-out",
              filter: "url(#glow)"
            }),
            // Labels
            React.createElement('text', {
              key: 'label-0',
              x: "30",
              y: "120",
              textAnchor: "middle",
              className: "text-xs font-bold",
              fill: "white",
              opacity: "0.8"
            }, "0"),
            React.createElement('text', {
              key: 'label-50',
              x: "100",
              y: "20",
              textAnchor: "middle",
              className: "text-xs font-bold",
              fill: "white",
              opacity: "0.8"
            }, "50"),
            React.createElement('text', {
              key: 'label-100',
              x: "170",
              y: "120",
              textAnchor: "middle",
              className: "text-xs font-bold",
              fill: "white",
              opacity: "0.8"
            }, "100")
          ]),

          // Score display
          React.createElement('div', {
            key: 'score-display',
            className: "absolute inset-0 flex items-center justify-center"
          },
            React.createElement('div', {
              className: "text-center mt-12"
            }, [
              React.createElement('div', {
                key: 'score-number',
                className: "relative"
              }, [
                React.createElement('span', {
                  key: 'score',
                  className: "text-7xl font-black text-white drop-shadow-lg"
                }, result ? displayScore : 0),
                React.createElement('span', {
                  key: 'percent',
                  className: "text-3xl font-bold text-white/80 ml-1"
                }, "%")
              ]),
              result && React.createElement('span', {
                key: 'category',
                className: "text-sm font-semibold mt-2 block text-yellow-300 uppercase tracking-wide"
              }, result.category)
            ])
          )
        ])
      )
    );
  };

  // Input Section Component
  const InputSection = ({ grievance, setGrievance, exampleGrievances, error, loading, analyzeGrievance, tLang }) => {
    return React.createElement('div', {
      className: "space-y-6"
    }, [
      // Input field
      React.createElement('div', { key: 'input-field' }, [
        React.createElement('label', {
          key: 'input-label',
          className: "block text-lg font-bold mb-4 text-white"
        }, tLang('inputLabel')),
        React.createElement('textarea', {
          key: 'textarea',
          value: grievance,
          onChange: (e) => setGrievance(e.target.value),
          placeholder: tLang('inputPlaceholder'),
          className: "w-full p-5 rounded-2xl resize-none text-gray-800 placeholder-gray-400 backdrop-blur-sm bg-white/90 border-2 border-white/30 focus:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/30 transition-all shadow-lg",
          rows: 4
        })
      ]),

      // Example buttons
      React.createElement('div', {
        key: 'examples',
        className: "flex flex-wrap gap-2"
      }, exampleGrievances.map((example, index) =>
        React.createElement('button', {
          key: index,
          onClick: () => setGrievance(example.text),
          className: "px-4 py-2 text-sm font-semibold rounded-full backdrop-blur-sm bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-200 shadow-md"
        }, example.label)
      )),

      // Error message
      error && React.createElement('div', {
        key: 'error',
        className: "flex items-center gap-2 text-red-300 bg-red-500/20 p-4 rounded-xl backdrop-blur-sm border border-red-300/30"
      }, [
        React.createElement(AlertCircle, {
          key: 'error-icon',
          className: "w-5 h-5 flex-shrink-0"
        }),
        React.createElement('span', {
          key: 'error-text',
          className: "font-medium"
        }, error)
      ]),

      // Analyze button
      React.createElement('button', {
        key: 'analyze-btn',
        onClick: analyzeGrievance,
        disabled: loading,
        className: "w-full py-5 rounded-2xl font-bold text-lg text-purple-900 bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 disabled:from-gray-400 disabled:to-gray-500 transition-all transform hover:scale-105 hover:shadow-2xl disabled:scale-100 shadow-xl"
      }, loading ? React.createElement('span', {
        className: "flex items-center justify-center gap-2"
      }, [
        React.createElement('svg', {
          key: 'spinner',
          className: "animate-spin h-5 w-5",
          viewBox: "0 0 24 24"
        }, [
          React.createElement('circle', {
            key: 'circle',
            className: "opacity-25",
            cx: "12",
            cy: "12",
            r: "10",
            stroke: "currentColor",
            strokeWidth: "4",
            fill: "none"
          }),
          React.createElement('path', {
            key: 'path',
            className: "opacity-75",
            fill: "currentColor",
            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          })
        ]),
        tLang('analyzingButton')
      ]) : tLang('analyzeButton'))
    ]);
  };

  // Results Section Component
  const ResultsSection = ({ grievance, result, resetApp, tLang }) => {
    return React.createElement('div', {
      className: "space-y-6 animate-fadeIn"
    }, [
      // User's grievance
      React.createElement('div', {
        key: 'grievance-display',
        className: "backdrop-blur-sm bg-white/10 rounded-2xl p-5 border border-white/20"
      },
        React.createElement('p', {
          className: "italic text-white font-medium"
        }, `"${grievance}"`)
      ),

      // Analysis and advice
      React.createElement('div', {
        key: 'results',
        className: "space-y-4"
      }, [
        // Analysis
        React.createElement('div', { key: 'analysis' }, [
          React.createElement('p', {
            key: 'analysis-title',
            className: "text-lg font-bold mb-3 text-yellow-300 uppercase tracking-wide"
          }, tLang('analysisTitle')),
          React.createElement('div', {
            key: 'analysis-content',
            className: "backdrop-blur-sm bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-300/30 shadow-lg"
          },
            React.createElement('p', {
              className: "text-white text-lg leading-relaxed"
            }, result.judgment)
          )
        ]),

        // Advice
        React.createElement('div', { key: 'advice' }, [
          React.createElement('p', {
            key: 'advice-title',
            className: "text-lg font-bold mb-3 text-green-300 uppercase tracking-wide"
          }, tLang('adviceTitle')),
          React.createElement('div', {
            key: 'advice-content',
            className: "backdrop-blur-sm bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-300/30 shadow-lg"
          },
            React.createElement('p', {
              className: "text-white text-lg leading-relaxed"
            }, result.advice)
          )
        ])
      ]),

      // Try another button
      React.createElement('button', {
        key: 'try-another',
        onClick: resetApp,
        className: "w-full py-4 rounded-2xl font-bold text-white backdrop-blur-sm bg-white/10 border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all shadow-lg"
      }, tLang('tryAnotherButton'))
    ]);
  };

  return {
    GaugeSection,
    InputSection,
    ResultsSection
  };
})();
