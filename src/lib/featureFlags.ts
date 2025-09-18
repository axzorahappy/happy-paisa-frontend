// src/lib/featureFlags.ts

export const featureFlags = {
  new_dashboard_enabled: getFlagState('new_dashboard_enabled', false),
  theme_v2_enabled: getFlagState('theme_v2_enabled', false),
};

function getFlagState(flagName: string, defaultValue: boolean): boolean {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const paramValue = urlParams.get(`ff_${flagName}`);
    if (paramValue) {
      return paramValue === 'true';
    }
  }
  return defaultValue;
}

export function isFeatureEnabled(flagName: keyof typeof featureFlags): boolean {
    return featureFlags[flagName];
}
