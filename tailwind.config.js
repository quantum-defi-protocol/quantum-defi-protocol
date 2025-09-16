/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Quantum DeFi brand colors
        quantum: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Purple quantum theme
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Blue quantum theme
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Cyan quantum theme
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Green quantum theme
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Yellow quantum theme
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        // Orange quantum theme
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        // Pink quantum theme
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        // Gray quantum theme
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
      },
      fontFamily: {
        // Quantum DeFi fonts
        'quantum': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'display': ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        // Custom spacing
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        // Quantum animations
        'quantum-pulse': 'quantum-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'quantum-bounce': 'quantum-bounce 1s infinite',
        'quantum-spin': 'quantum-spin 1s linear infinite',
        'quantum-ping': 'quantum-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'quantum-fade-in': 'quantum-fade-in 0.5s ease-in-out',
        'quantum-fade-out': 'quantum-fade-out 0.5s ease-in-out',
        'quantum-slide-up': 'quantum-slide-up 0.5s ease-out',
        'quantum-slide-down': 'quantum-slide-down 0.5s ease-out',
        'quantum-scale-in': 'quantum-scale-in 0.3s ease-out',
        'quantum-scale-out': 'quantum-scale-out 0.3s ease-out',
        'quantum-rotate': 'quantum-rotate 3s linear infinite',
        'quantum-float': 'quantum-float 6s ease-in-out infinite',
        'quantum-glow': 'quantum-glow 2s ease-in-out infinite alternate',
        'quantum-shimmer': 'quantum-shimmer 2.5s linear infinite',
        'quantum-wave': 'quantum-wave 1.5s ease-in-out infinite',
        'quantum-morph': 'quantum-morph 4s ease-in-out infinite',
      },
      keyframes: {
        // Quantum keyframes
        'quantum-pulse': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.5',
          },
        },
        'quantum-bounce': {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        'quantum-spin': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },
        'quantum-ping': {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        'quantum-fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'quantum-fade-out': {
          '0%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        'quantum-slide-up': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'quantum-slide-down': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'quantum-scale-in': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'quantum-scale-out': {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(0)',
            opacity: '0',
          },
        },
        'quantum-rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        'quantum-float': {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'quantum-glow': {
          '0%': {
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
          },
          '100%': {
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)',
          },
        },
        'quantum-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'quantum-wave': {
          '0%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(90deg)',
          },
          '50%': {
            transform: 'rotate(180deg)',
          },
          '75%': {
            transform: 'rotate(270deg)',
          },
        },
        'quantum-morph': {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          },
          '50%': {
            borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          },
        },
      },
      backdropBlur: {
        // Custom backdrop blur values
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      },
      boxShadow: {
        // Quantum shadows
        'quantum': '0 0 20px rgba(139, 92, 246, 0.3)',
        'quantum-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
        'quantum-xl': '0 0 60px rgba(139, 92, 246, 0.5)',
        'quantum-2xl': '0 0 80px rgba(139, 92, 246, 0.6)',
        'inner-quantum': 'inset 0 2px 4px 0 rgba(139, 92, 246, 0.1)',
      },
      gradientColorStops: {
        // Quantum gradients
        'quantum-start': '#8b5cf6',
        'quantum-end': '#3b82f6',
        'quantum-mid': '#06b6d4',
      },
      backgroundImage: {
        // Quantum backgrounds
        'quantum-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
        'quantum-radial': 'radial-gradient(ellipse at center, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
        'quantum-conic': 'conic-gradient(from 0deg, #8b5cf6, #3b82f6, #06b6d4, #8b5cf6)',
        'quantum-mesh': 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%238b5cf6" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      transitionProperty: {
        // Custom transition properties
        'height': 'height',
        'spacing': 'margin, padding',
        'quantum': 'all',
      },
      transitionDuration: {
        // Custom transition durations
        '0': '0ms',
        '2000': '2000ms',
        '3000': '3000ms',
      },
      transitionTimingFunction: {
        // Custom timing functions
        'quantum': 'cubic-bezier(0.4, 0, 0.6, 1)',
        'quantum-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'quantum-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'quantum-in-out': 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      zIndex: {
        // Custom z-index values
        'quantum': '1000',
        'quantum-modal': '1050',
        'quantum-tooltip': '1100',
        'quantum-popover': '1150',
        'quantum-dropdown': '1200',
      },
    },
  },
  plugins: [
    // Custom plugins
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Custom plugin for quantum utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.quantum-text-gradient': {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.quantum-border-gradient': {
          border: '2px solid transparent',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #06b6d4 100%) border-box',
          '-webkit-mask': 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          '-webkit-mask-composite': 'destination-out',
          'mask-composite': 'exclude',
        },
        '.quantum-glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.quantum-neon': {
          'box-shadow': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
