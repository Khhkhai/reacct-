import type { Language } from "../data";

export const detectLanguage = (code: string): Language => {
  if (/^\s*def\s+|^\s*import\s+|elif|print\(|:\s*$/m.test(code)) {
    return 'python';
  }

  if (/#include|int\s+main|printf|scanf|\bvoid\b.*\(|->/.test(code)) {
    return 'c';
  }

  if (/console\.log|=>|function|\bconst\b|\blet\b/.test(code)) {
    return 'javascript';
  }

  return 'unknown';
};