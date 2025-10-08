// Lucide Icons Setup for React
window.LucideIcons = (() => {
  const { useRef, useEffect } = React;

  // Simple Lucide Icons using data attributes
  const LucideIcon = ({ name, className, ...props }) => {
    const ref = useRef(null);
    
    useEffect(() => {
      if (ref.current && window.lucide) {
        window.lucide.createIcons();
      }
    });
    
    return React.createElement('i', {
      ref: ref,
      'data-lucide': name,
      className: className,
      ...props
    });
  };

  // Icon Components
  const AlertCircle = (props) => React.createElement(LucideIcon, { name: 'alert-circle', ...props });
  const Sparkles = (props) => React.createElement(LucideIcon, { name: 'sparkles', ...props });
  const Settings = (props) => React.createElement(LucideIcon, { name: 'settings', ...props });

  return {
    LucideIcon,
    AlertCircle,
    Sparkles,
    Settings
  };
})();
