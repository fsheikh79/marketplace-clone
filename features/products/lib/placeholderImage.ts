/**
 * Generates a deterministic gradient placeholder as a data URI so product
 * cards never depend on external image hosting or risk a broken <img>.
 * Replace with real product photography (S3/CloudFront) in Phase 2.
 */
export function placeholderProductImage(hex: string, seed: number): string {
  const angle = (seed * 47) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${hex}" stop-opacity="0.9" />
        <stop offset="100%" stop-color="${hex}" stop-opacity="0.55" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="${hex}" fill-opacity="0.12" />
    <circle cx="${120 + ((seed * 37) % 360)}" cy="${150 + ((seed * 61) % 300)}" r="140" fill="url(#g)" />
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
