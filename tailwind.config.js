theme: {
  extend: {
    keyframes: {
      slideFadeIn: {
        '0%': { opacity: 0, transform: 'translateX(40px)' },
        '20%': { opacity: 1, transform: 'translateX(0)' },
        '40%': { opacity: 1, transform: 'translateX(0)' },
        '60%': { opacity: 0, transform: 'translateX(-40px)' },
        '100%': { opacity: 0, transform: 'translateX(-40px)' },
      },
    },
    animation: {
      logoOne: 'slideFadeIn 4s infinite',
      logoTwo: 'slideFadeIn 4s infinite 2s',
    },
  },
},
