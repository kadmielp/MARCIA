// Main application initialization
(async () => {
  const React = window.React;
  
  // Check if running in Tauri
  const isTauri = window.__TAURI__ !== undefined;
  
  // Initialize translations as empty - will be loaded from JSON
  window.translations = {};
  
  // Load translations from JSON file
  const loadTranslations = async () => {
    try {
      const response = await fetch('data/translations.json');
      const data = await response.json();
      window.translations = data;
      console.log('✅ Translations loaded successfully!');
      return true;
    } catch (err) {
      console.error('❌ Failed to load translations:', err);
      // Fallback to minimal translations
      window.translations = {
        'pt-BR': { appName: 'M.A.R.C.I.A', title: 'Carregando...' }
      };
      return false;
    }
  };
  
  // Show loading screen
  const showLoadingScreen = () => {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; color: white;">
          <div style="width: 40px; height: 40px; border: 4px solid rgba(255, 255, 255, 0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px auto;"></div>
          <h1 style="font-size: 2em; margin-bottom: 10px; font-weight: bold;">M.A.R.C.I.A</h1>
          <p style="opacity: 0.8;">Loading pettiness meter...</p>
        </div>
      </div>
    `;
  };
  
  // Initialize the app
  const initializeApp = () => {
    try {
      // Check dependencies
      console.log('🔍 Dependencies check:');
      console.log('React:', typeof React !== 'undefined');
      console.log('ReactDOM:', typeof ReactDOM !== 'undefined');
      console.log('Lucide:', typeof window.lucide !== 'undefined');
      console.log('Tauri:', isTauri);
      console.log('LucideIcons:', typeof window.LucideIcons !== 'undefined');
      console.log('AIService:', typeof window.AIService !== 'undefined');
      console.log('MarciaComponents:', typeof window.MarciaComponents !== 'undefined');
      
      // Get the PettinessMeter component
      const PettinessMeter = window.MarciaComponents.PettinessMeter;
      
      // Render the app
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(PettinessMeter));
      console.log('✅ M.A.R.C.I.A initialized successfully!');
      
      // Initialize Lucide icons
      setTimeout(() => {
        if (window.lucide) {
          window.lucide.createIcons();
          console.log('✨ Lucide icons initialized!');
        }
      }, 100);
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
      document.getElementById('root').innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="text-align: center; color: white; padding: 20px;">
            <h1 style="font-size: 2em; margin-bottom: 10px; font-weight: bold;">M.A.R.C.I.A</h1>
            <p style="opacity: 0.8; color: #ff6b6b;">Failed to load application</p>
            <p style="opacity: 0.6; margin-top: 10px; font-size: 0.9em;">${error.message}</p>
          </div>
        </div>
      `;
    }
  };
  
  // Start loading sequence
  showLoadingScreen();
  await loadTranslations();
  
  // Wait for all other scripts to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
})();
