/**
 * Responsive design utility functions and constants
 */

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Screen size utilities for client-side use
 */
export const isScreenSize = {
  sm: () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoints.sm})`).matches,
  md: () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoints.md})`).matches,
  lg: () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoints.lg})`).matches,
  xl: () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoints.xl})`).matches,
  '2xl': () => typeof window !== 'undefined' && window.matchMedia(`(min-width: ${breakpoints['2xl']})`).matches,
};

/**
 * Layout size utilities
 */
export const containerSizes = {
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  '2xl': '1320px',
};

/**
 * Common spacing values (in pixels)
 * These match Tailwind's spacing scale
 */
export const spacing = {
  0: '0px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
};
