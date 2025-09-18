export function sanitizeTheme(theme: Record<string, string>): Record<string, string> {
  const sanitizedTheme: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    if (isValidCssColor(value)) {
      sanitizedTheme[key] = value;
    }
  }
  return sanitizedTheme;
}

function isValidCssColor(color: string): boolean {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
}