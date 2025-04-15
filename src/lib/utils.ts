// src/lib/utils.ts
/**
 * Combines class names, handling conditional expressions properly
 */
export function cn(...inputs: (string | boolean | undefined)[]) {
    return inputs.filter(cls => typeof cls === 'string' && cls).join(' ');
  }