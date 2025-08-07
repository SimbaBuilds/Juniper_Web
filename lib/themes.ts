export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  mutedBlue: string;
}

export interface Theme {
  name: string;
  displayName: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const themes: Record<string, Theme> = {
  default: {
    name: 'default',
    displayName: 'Default',
    light: {
      background: 'oklch(1 0 0)', // Pure white
      foreground: 'oklch(0.145 0 0)', // Near black text
      card: 'oklch(1 0 0)', // Pure white cards
      cardForeground: 'oklch(0.145 0 0)', // Near black card text
      popover: 'oklch(1 0 0)', // Pure white popovers
      popoverForeground: 'oklch(0.145 0 0)', // Near black popover text
      primary: 'oklch(0.35 0.12 160)', // Dark green primary
      primaryForeground: 'oklch(0.985 0 0)', // White text on primary
      secondary: 'oklch(0.45 0.08 220)', // Medium blue secondary
      secondaryForeground: 'oklch(0.985 0 0)', // White text on secondary
      muted: 'oklch(0.94 0.03 150)', // Very light green background
      mutedForeground: 'oklch(0.5 0.06 180)', // Medium blue-green text
      accent: 'oklch(0.88 0.05 140)', // Light green accent
      accentForeground: 'oklch(0.2 0.06 160)', // Dark green accent text
      destructive: 'oklch(0.577 0.245 27.325)', // Red for errors
      border: 'oklch(0.922 0 0)', // Light gray borders
      input: 'oklch(0.922 0 0)', // Light gray input backgrounds
      ring: 'oklch(0.708 0 0)', // Medium gray focus rings
      sidebar: 'oklch(0.985 0 0)', // Off-white sidebar
      sidebarForeground: 'oklch(0.145 0 0)', // Near black sidebar text
      sidebarPrimary: 'oklch(0.205 0 0)', // Dark gray sidebar primary
      sidebarPrimaryForeground: 'oklch(0.985 0 0)', // White sidebar primary text
      sidebarAccent: 'oklch(0.97 0 0)', // Very light gray sidebar accent
      sidebarAccentForeground: 'oklch(0.205 0 0)', // Dark gray sidebar accent text
      sidebarBorder: 'oklch(0.922 0 0)', // Light gray sidebar borders
      sidebarRing: 'oklch(0.708 0 0)', // Medium gray sidebar focus rings
      chart1: 'oklch(0.6 0.15 160)', // Vibrant green chart color
      chart2: 'oklch(0.55 0.12 220)', // Medium blue chart color
      chart3: 'oklch(0.65 0.14 140)', // Yellow-green chart color
      chart4: 'oklch(0.7 0.1 200)', // Light blue chart color
      chart5: 'oklch(0.6 0.13 180)', // Teal chart color
      mutedBlue: 'oklch(0.25 0.08 200)', // Dark blue utility color
    },
    dark: {
      background: 'oklch(0.145 0 0)', // Very dark gray background
      foreground: 'oklch(0.985 0 0)', // Near white text
      card: 'oklch(0.205 0 0)', // Dark gray cards
      cardForeground: 'oklch(0.985 0 0)', // Near white card text
      popover: 'oklch(0.205 0 0)', // Dark gray popovers
      popoverForeground: 'oklch(0.985 0 0)', // Near white popover text
      primary: 'oklch(0.65 0.12 160)', // Bright green primary
      primaryForeground: 'oklch(0.1 0.02 160)', // Dark green text on primary
      secondary: 'oklch(0.55 0.1 220)', // Bright blue secondary
      secondaryForeground: 'oklch(0.1 0.02 220)', // Dark blue text on secondary
      muted: 'oklch(0.25 0.05 180)', // Dark blue-green background
      mutedForeground: 'oklch(0.7 0.06 160)', // Light green text
      accent: 'oklch(0.4 0.08 140)', // Medium green accent
      accentForeground: 'oklch(0.9 0.03 140)', // Light green accent text
      destructive: 'oklch(0.704 0.191 22.216)', // Bright red for errors
      border: 'oklch(1 0 0 / 10%)', // Semi-transparent white borders
      input: 'oklch(1 0 0 / 15%)', // Semi-transparent white input backgrounds
      ring: 'oklch(0.556 0 0)', // Medium gray focus rings
      sidebar: 'oklch(0.205 0 0)', // Dark gray sidebar
      sidebarForeground: 'oklch(0.985 0 0)', // Near white sidebar text
      sidebarPrimary: 'oklch(0.488 0.243 264.376)', // Purple sidebar primary
      sidebarPrimaryForeground: 'oklch(0.985 0 0)', // White sidebar primary text
      sidebarAccent: 'oklch(0.269 0 0)', // Darker gray sidebar accent
      sidebarAccentForeground: 'oklch(0.985 0 0)', // White sidebar accent text
      sidebarBorder: 'oklch(1 0 0 / 10%)', // Semi-transparent white sidebar borders
      sidebarRing: 'oklch(0.556 0 0)', // Medium gray sidebar focus rings
      chart1: 'oklch(0.65 0.15 160)', // Bright green chart color
      chart2: 'oklch(0.6 0.12 220)', // Bright blue chart color
      chart3: 'oklch(0.7 0.14 140)', // Bright yellow-green chart color
      chart4: 'oklch(0.75 0.1 200)', // Light blue chart color
      chart5: 'oklch(0.65 0.13 180)', // Bright teal chart color
      mutedBlue: 'oklch(0.6 0.08 160)', // Muted green utility color
    },
  },
  vintage: {
    name: 'vintage',
    displayName: 'Vintage Beige',
    light: {
      background: 'oklch(0.95 0.02 85)',
      foreground: 'oklch(0.25 0.03 75)',
      card: 'oklch(0.97 0.015 85)',
      cardForeground: 'oklch(0.25 0.03 75)',
      popover: 'oklch(0.97 0.015 85)',
      popoverForeground: 'oklch(0.25 0.03 75)',
      primary: 'oklch(0.4 0.08 75)',
      primaryForeground: 'oklch(0.95 0.02 85)',
      secondary: 'oklch(0.9 0.025 80)',
      secondaryForeground: 'oklch(0.35 0.04 75)',
      muted: 'oklch(0.88 0.025 80)',
      mutedForeground: 'oklch(0.5 0.04 75)',
      accent: 'oklch(0.85 0.03 80)',
      accentForeground: 'oklch(0.3 0.04 75)',
      destructive: 'oklch(0.55 0.15 25)',
      border: 'oklch(0.82 0.03 80)',
      input: 'oklch(0.82 0.03 80)',
      ring: 'oklch(0.6 0.06 75)',
      sidebar: 'oklch(0.92 0.02 85)',
      sidebarForeground: 'oklch(0.25 0.03 75)',
      sidebarPrimary: 'oklch(0.4 0.08 75)',
      sidebarPrimaryForeground: 'oklch(0.95 0.02 85)',
      sidebarAccent: 'oklch(0.85 0.03 80)',
      sidebarAccentForeground: 'oklch(0.3 0.04 75)',
      sidebarBorder: 'oklch(0.82 0.03 80)',
      sidebarRing: 'oklch(0.6 0.06 75)',
      chart1: 'oklch(0.6 0.08 70)',
      chart2: 'oklch(0.55 0.1 85)',
      chart3: 'oklch(0.5 0.08 30)',
      chart4: 'oklch(0.65 0.06 90)',
      chart5: 'oklch(0.7 0.05 60)',
      mutedBlue: 'oklch(0.35 0.08 75)',
    },
    dark: {
      background: 'oklch(0.15 0.02 75)',
      foreground: 'oklch(0.9 0.02 85)',
      card: 'oklch(0.2 0.025 75)',
      cardForeground: 'oklch(0.9 0.02 85)',
      popover: 'oklch(0.2 0.025 75)',
      popoverForeground: 'oklch(0.9 0.02 85)',
      primary: 'oklch(0.75 0.05 85)',
      primaryForeground: 'oklch(0.2 0.025 75)',
      secondary: 'oklch(0.25 0.03 75)',
      secondaryForeground: 'oklch(0.85 0.02 85)',
      muted: 'oklch(0.28 0.03 75)',
      mutedForeground: 'oklch(0.65 0.03 80)',
      accent: 'oklch(0.35 0.04 75)',
      accentForeground: 'oklch(0.85 0.02 85)',
      destructive: 'oklch(0.65 0.12 25)',
      border: 'oklch(0.9 0.02 85 / 15%)',
      input: 'oklch(0.9 0.02 85 / 20%)',
      ring: 'oklch(0.55 0.04 80)',
      sidebar: 'oklch(0.18 0.025 75)',
      sidebarForeground: 'oklch(0.9 0.02 85)',
      sidebarPrimary: 'oklch(0.6 0.05 85)',
      sidebarPrimaryForeground: 'oklch(0.9 0.02 85)',
      sidebarAccent: 'oklch(0.25 0.03 75)',
      sidebarAccentForeground: 'oklch(0.85 0.02 85)',
      sidebarBorder: 'oklch(0.9 0.02 85 / 15%)',
      sidebarRing: 'oklch(0.55 0.04 80)',
      chart1: 'oklch(0.65 0.08 70)',
      chart2: 'oklch(0.6 0.1 85)',
      chart3: 'oklch(0.7 0.05 60)',
      chart4: 'oklch(0.55 0.06 90)',
      chart5: 'oklch(0.75 0.08 30)',
      mutedBlue: 'oklch(0.65 0.05 85)',
    },
  },
};

export type ThemeName = keyof typeof themes;

export function getThemeColors(themeName: ThemeName, mode: 'light' | 'dark'): ThemeColors {
  return themes[themeName]?.[mode] || themes.default[mode];
}

export function getCSSVariables(themeName: ThemeName, mode: 'light' | 'dark'): Record<string, string> {
  const colors = getThemeColors(themeName, mode);
  return {
    '--background': colors.background,
    '--foreground': colors.foreground,
    '--card': colors.card,
    '--card-foreground': colors.cardForeground,
    '--popover': colors.popover,
    '--popover-foreground': colors.popoverForeground,
    '--primary': colors.primary,
    '--primary-foreground': colors.primaryForeground,
    '--secondary': colors.secondary,
    '--secondary-foreground': colors.secondaryForeground,
    '--muted': colors.muted,
    '--muted-foreground': colors.mutedForeground,
    '--accent': colors.accent,
    '--accent-foreground': colors.accentForeground,
    '--destructive': colors.destructive,
    '--border': colors.border,
    '--input': colors.input,
    '--ring': colors.ring,
    '--sidebar': colors.sidebar,
    '--sidebar-foreground': colors.sidebarForeground,
    '--sidebar-primary': colors.sidebarPrimary,
    '--sidebar-primary-foreground': colors.sidebarPrimaryForeground,
    '--sidebar-accent': colors.sidebarAccent,
    '--sidebar-accent-foreground': colors.sidebarAccentForeground,
    '--sidebar-border': colors.sidebarBorder,
    '--sidebar-ring': colors.sidebarRing,
    '--chart-1': colors.chart1,
    '--chart-2': colors.chart2,
    '--chart-3': colors.chart3,
    '--chart-4': colors.chart4,
    '--chart-5': colors.chart5,
    '--muted-blue': colors.mutedBlue,
  };
}