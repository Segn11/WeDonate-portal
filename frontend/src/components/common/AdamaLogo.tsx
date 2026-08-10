import React from 'react';

interface AdamaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lightText?: boolean;
  onClick?: () => void;
  title?: string;
}

export const AdamaLogo: React.FC<AdamaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = false,
  onClick,
  title,
}) => {
  const sizePixels = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 96,
  }[size];

  const logoContent = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Adama City Seal Emblem SVG */}
      <div 
        style={{ width: sizePixels, height: sizePixels }}
        className={`relative shrink-0 rounded-full shadow-sm transition-transform duration-200 ${
          onClick ? 'group-hover:scale-105 group-active:scale-95' : ''
        }`}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full rounded-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dark Navy Outer Circle */}
          <circle cx="250" cy="250" r="245" fill="#092265" stroke="#FFFFFF" strokeWidth="6" />
          
          {/* Inner Decorative Rings */}
          <circle cx="250" cy="250" r="225" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="250" cy="250" r="215" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Curved Text along Outer Circle Top (Oromo) */}
          <path id="topArc" d="M 60,250 A 190,190 0 0,1 440,250" fill="none" />
          <text fill="#FFFFFF" fontSize="23" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.5">
            <textPath href="#topArc" startOffset="50%" textAnchor="middle">
              BULCHIINSA MAGAALAA ADAAMAA
            </textPath>
          </text>

          {/* Curved Text Bottom (English) */}
          <path id="bottomArc" d="M 440,250 A 190,190 0 0,1 60,250" fill="none" />
          <text fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1.2">
            <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
              ADAMA CITY ADMINISTRATION
            </textPath>
          </text>

          {/* Inner Blue Shield Area */}
          <circle cx="250" cy="250" r="160" fill="#0a2540" stroke="#FFFFFF" strokeWidth="2" />

          {/* Background Acacia Tree Shadow Silhouette */}
          <path
            d="M 170 200 C 170 140, 330 140, 330 200 C 370 210, 370 250, 330 270 C 310 280, 190 280, 170 270 C 130 250, 130 210, 170 200 Z"
            fill="#3b5998"
            opacity="0.35"
          />

          {/* Adama Wind Turbines (Adama I & II Wind Farm) */}
          <g stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            {/* Turbine 1 Left */}
            <line x1="160" y1="260" x2="160" y2="180" />
            <circle cx="160" cy="180" r="3" fill="#FFFFFF" />
            <line x1="160" y1="180" x2="140" y2="165" />
            <line x1="160" y1="180" x2="180" y2="170" />
            <line x1="160" y1="180" x2="160" y2="205" />

            {/* Turbine 2 Center-Left */}
            <line x1="205" y1="260" x2="205" y2="155" />
            <circle cx="205" cy="155" r="3" fill="#FFFFFF" />
            <line x1="205" y1="155" x2="180" y2="135" />
            <line x1="205" y1="155" x2="225" y2="142" />
            <line x1="205" y1="155" x2="210" y2="180" />

            {/* Turbine 3 Center-Right */}
            <line x1="295" y1="260" x2="295" y2="155" />
            <circle cx="295" cy="155" r="3" fill="#FFFFFF" />
            <line x1="295" y1="155" x2="275" y2="142" />
            <line x1="295" y1="155" x2="320" y2="135" />
            <line x1="295" y1="155" x2="290" y2="180" />

            {/* Turbine 4 Right */}
            <line x1="340" y1="260" x2="340" y2="180" />
            <circle cx="340" cy="180" r="3" fill="#FFFFFF" />
            <line x1="340" y1="180" x2="320" y2="170" />
            <line x1="340" y1="180" x2="360" y2="165" />
            <line x1="340" y1="180" x2="340" y2="205" />
          </g>

          {/* Central Adama City Monument Pillar */}
          <path
            d="M 232 280 L 235 200 C 235 180, 245 170, 250 170 C 255 170, 265 180, 265 200 L 268 280 Z"
            fill="#FFFFFF"
            stroke="#0a2540"
            strokeWidth="2"
          />
          <circle cx="250" cy="170" r="6" fill="#f59e0b" />

          {/* Skyline City Buildings Silhouette */}
          <path
            d="M 120 280 L 120 250 L 135 250 L 135 235 L 150 235 L 150 280 M 155 280 L 155 240 L 175 240 L 175 280 M 325 280 L 325 240 L 345 240 L 345 280 M 350 280 L 350 235 L 365 235 L 365 250 L 380 250 L 380 280"
            fill="#FFFFFF"
          />

          {/* Line Chart overlay representing economic growth & charity transparency */}
          <polyline
            points="110,270 170,260 210,285 290,285 330,260 390,270"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="210" cy="285" r="5" fill="#f59e0b" />
          <circle cx="290" cy="285" r="5" fill="#f59e0b" />

          {/* Divider Line in Middle Ring */}
          <line x1="110" y1="325" x2="390" y2="325" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="110" cy="325" r="4" fill="#FFFFFF" />
          <circle cx="390" cy="325" r="4" fill="#FFFFFF" />

          {/* Amharic Subtitle in Middle */}
          <text
            x="250"
            y="315"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="26"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            አዳማ ከተማ አስተዳደር
          </text>
        </svg>
      </div>

      {/* Brand Text Header */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-lg leading-tight transition-colors ${
              onClick ? (lightText ? 'group-hover:text-emerald-400' : 'group-hover:text-emerald-600') : ''
            } ${lightText ? 'text-white' : 'text-slate-900'}`}>
              WE DONATE
            </span>
            <span className={`font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase transition-colors ${
              onClick
                ? 'bg-amber-500 text-slate-950 group-hover:bg-emerald-600 group-hover:text-white'
                : 'bg-amber-500 text-slate-950'
            }`}>
              ADAMA
            </span>
          </div>
          <span className={`text-xs font-medium transition-colors ${
            onClick ? (lightText ? 'group-hover:text-slate-200' : 'group-hover:text-slate-700') : ''
          } ${lightText ? 'text-slate-300' : 'text-slate-500'}`}>
            Bulchiinsa Magaalaa Adaamaa • አዳማ ከተማ
          </span>
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title || 'Navigate to Public Landing Page'}
        aria-label={title || 'Navigate to Public Landing Page'}
        className={`group p-1.5 -m-1.5 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/80 focus:ring-offset-2 rounded-2xl transition-all cursor-pointer text-left inline-flex items-center ${
          lightText ? 'hover:bg-white/10' : 'hover:bg-slate-100/80 active:bg-slate-200/80'
        }`}
      >
        {logoContent}
      </button>
    );
  }

  return logoContent;
};
