// Tailwind class name utilities for NativeWind
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common class name presets
export const classNames = {
  // Containers
  container: 'flex-1 bg-white',
  card: 'bg-white rounded-2xl p-4 shadow-sm',
  section: 'px-5 mb-6',
  
  // Text
  textPrimary: 'text-gray-900 text-base',
  textSecondary: 'text-gray-600 text-sm',
  textLight: 'text-gray-400 text-xs',
  heading: 'text-2xl font-bold text-gray-900',
  subheading: 'text-lg font-semibold text-gray-800',
  
  // Buttons
  buttonBase: 'px-5 py-3 rounded-xl items-center justify-center',
  buttonPrimary: 'bg-purple-600',
  buttonSecondary: 'bg-purple-100',
  
  // Layout
  row: 'flex-row',
  rowCenter: 'flex-row items-center',
  rowBetween: 'flex-row items-center justify-between',
  center: 'items-center justify-center',
} as const;

export default classNames;

