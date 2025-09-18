/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy support
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        
        // Happy Paisa Design System
        hp: {
          // Base backgrounds
          bg1: '#0f0b15', // Deep dark purple
          bg2: '#1a1625', // Slightly lighter dark purple
          bg3: '#2a1f3d', // Medium dark purple
          
          // Primary colors
          purple: {
            50: '#f5f3ff',
            100: '#ede9fe',
            200: '#ddd6fe',
            300: '#c4b5fd',
            400: '#a78bfa',
            500: '#8b5cf6',
            600: '#7c3aed',
            700: '#6d28d9',
            800: '#5b21b6',
            900: '#4c1d95',
          },
          
          // Accent colors
          fuchsia: {
            50: '#fdf4ff',
            100: '#fae8ff',
            200: '#f5d0fe',
            300: '#f0abfc',
            400: '#e879f9',
            500: '#d946ef',
            600: '#c026d3',
            700: '#a21caf',
            800: '#86198f',
            900: '#701a75',
          },
          
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
          },
          
          // UI accents
          accent: '#8b5cf6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
          
          // Neutral glass colors
          glass: {
            50: 'rgba(255, 255, 255, 0.05)',
            100: 'rgba(255, 255, 255, 0.1)',
            200: 'rgba(255, 255, 255, 0.15)',
            300: 'rgba(255, 255, 255, 0.2)',
            border: 'rgba(255, 255, 255, 0.1)',
          },
        },
        
        // Legacy brand colors (keeping for compatibility)
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      
      backgroundImage: {
        // Main gradients
        'hp-gradient': 'linear-gradient(135deg, #0f0b15 0%, #1a1625 50%, #2a1f3d 100%)',
        'hp-gradient-alt': 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c026d3 100%)',
        'hp-radial': 'radial-gradient(1200px 800px at 50% -20%, rgba(124,58,237,0.15), transparent)',
        'hp-radial-accent': 'radial-gradient(800px 600px at 100% 0%, rgba(236,72,153,0.1), transparent)',
        
        // Card gradients
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'card-gradient-hover': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
        
        // AI Assistant gradients
        'ai-gradient': 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(236,72,153,0.2) 100%)',
        
        // Success/Status gradients
        'success-gradient': 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)',
        'warning-gradient': 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.1) 100%)',
        'error-gradient': 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, rgba(220,38,38,0.1) 100%)',
      },
      
      boxShadow: {
        // Glass morphism shadows
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'glass-xl': '0 35px 60px -15px rgba(0, 0, 0, 0.6)',
        
        // Colored shadows
        'purple-glow': '0 0 30px rgba(124, 58, 237, 0.3)',
        'pink-glow': '0 0 30px rgba(236, 72, 153, 0.3)',
        'ai-glow': '0 0 40px rgba(139, 92, 246, 0.4)',
        
        // Interactive shadows
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'xl-2': '1.5rem',
        '2xl-plus': '2rem',
      },
      
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        '3xl-plus': ['2rem', { lineHeight: '2.25rem' }],
      },
      
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

