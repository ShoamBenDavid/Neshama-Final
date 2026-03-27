export const colors = {
  primary: '#5B8FB9',
  primaryLight: '#8BB8D6',
  primaryDark: '#3D6F94',

  secondary: '#7BC8A4',
  secondaryLight: '#A8DEC4',
  secondaryDark: '#5AA882',

  accent: '#9B8EC4',
  accentLight: '#BEB4D8',
  accentDark: '#7A6BA6',

  background: '#FBF8F3',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  text: {
    primary: '#2D3436',
    secondary: '#636E72',
    tertiary: '#B2BEC3',
    inverse: '#FFFFFF',
    link: '#5B8FB9',
  },

  status: {
    success: '#55EFC4',
    successDark: '#00B894',
    warning: '#FDCB6E',
    warningDark: '#E17055',
    error: '#FF7675',
    errorDark: '#D63031',
    info: '#74B9FF',
    infoDark: '#0984E3',
  },

  mood: {
    1: '#E17055',
    2: '#FDCB6E',
    3: '#74B9FF',
    4: '#55EFC4',
    5: '#A29BFE',
  } as Record<number, string>,

  moodLabel: {
    1: 'Struggling',
    2: 'Low',
    3: 'Okay',
    4: 'Good',
    5: 'Great',
  } as Record<number, string>,

  gradients: {
    primary: ['#5B8FB9', '#9B8EC4'],
    secondary: ['#7BC8A4', '#5B8FB9'],
    warm: ['#FDCB6E', '#E17055'],
    cool: ['#74B9FF', '#A29BFE'],
    calm: ['#DFE6E9', '#FBF8F3'],
    meditation: ['#667EEA', '#764BA2'],
    breathing: ['#43E97B', '#38F9D7'],
    yoga: ['#FA709A', '#FEE140'],
    article: ['#A18CD1', '#FBC2EB'],
    sunset: ['#FD746C', '#FF9068'],
  },

  border: '#E8E4DF',
  borderLight: '#F0EDE8',
  divider: '#F0EDE8',

  overlay: 'rgba(0, 0, 0, 0.4)',
  shadow: '#2D3436',

  tab: {
    active: '#5B8FB9',
    inactive: '#B2BEC3',
    background: '#FFFFFF',
  },

  category: {
    anxiety: '#FF7675',
    depression: '#A29BFE',
    relationships: '#FD79A8',
    'work-stress': '#FDCB6E',
    success: '#55EFC4',
    general: '#74B9FF',
  } as Record<string, string>,
} as const;

export type Colors = typeof colors;
export default colors;
