import { usePreferencesContext } from '../../context/PreferencesContext';

const SpendWiseLogo = ({ className = "h-8", showText = true, onClick }) => {
  const { theme } = usePreferencesContext();
  const isDark = theme === 'dark';

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <svg 
        width={showText ? "200" : "44"} 
        height="44" 
        viewBox={showText ? "0 0 200 44" : "0 0 44 44"} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id={`g-${isDark ? 'd' : 'l'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
            <stop offset="100%" style={{ stopColor: '#6366f1' }} />
          </linearGradient>
        </defs>
        
        <rect width="40" height="40" rx="11" fill={`url(#g-${isDark ? 'd' : 'l'})`} y="2" className="transition-all duration-300" />
        <path d="M20 29 L20 15 M20 15 L14.5 20 M20 15 L25.5 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="29" r="2.8" fill="white" />
        <circle cx="31" cy="11" r="7" fill="#10b981" />
        <polyline points="27.5,11 29.5,13 34.5,9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        
        {showText && (
          <text 
            x="52" 
            y="28" 
            fontSize="22" 
            fontWeight="800" 
            fill={isDark ? 'white' : `url(#g-${isDark ? 'd' : 'l'})`}
            fontFamily="system-ui, -apple-system, sans-serif"
            className="transition-fill duration-300"
          >
            SpendWise
          </text>
        )}
      </svg>
    </div>
  );
};

export default SpendWiseLogo;