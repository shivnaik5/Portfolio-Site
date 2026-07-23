import { Color } from 'three';

/**
 * The 3D scenes read their colours from the same CSS custom properties Tailwind
 * emits for the rest of the site, rather than duplicating hex values. Change a
 * colour in global.css and every scene follows.
 */
export interface ScenePalette {
  background: Color;
  surface: Color;
  foreground: Color;
  muted: Color;
  accent: Color;
  accentWarm: Color;
}

const FALLBACKS: Record<keyof ScenePalette, string> = {
  background: '#FBF7F1',
  surface: '#F1E7DA',
  foreground: '#2B2420',
  muted: '#7A6C5D',
  accent: '#3F6C63',
  accentWarm: '#C97B2E',
};

const CSS_VARS: Record<keyof ScenePalette, string> = {
  background: '--color-background',
  surface: '--color-surface',
  foreground: '--color-foreground',
  muted: '--color-muted',
  accent: '--color-accent',
  accentWarm: '--color-accent-warm',
};

export const readPalette = (): ScenePalette => {
  const styles = getComputedStyle(document.documentElement);

  const read = (key: keyof ScenePalette): Color => {
    const value = styles.getPropertyValue(CSS_VARS[key]).trim();
    return new Color(value || FALLBACKS[key]);
  };

  return {
    background: read('background'),
    surface: read('surface'),
    foreground: read('foreground'),
    muted: read('muted'),
    accent: read('accent'),
    accentWarm: read('accentWarm'),
  };
};
