import type { Exercise } from './types';

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s).split(' ').filter(Boolean);
}

// Below this length, loose substring containment produces false positives
// (e.g. query "rdl" contains alias "dl"), so those checks require both
// sides to meet this length; exact-equality checks are unaffected.
const MIN_SUBSTRING_LEN = 4;

export interface MatchResult {
  exercise: Exercise;
  score: number;
}

export function matchExercises(query: string, exercises: Exercise[]): MatchResult[] {
  const q = normalize(query);
  if (!q) return [];
  const qTokens = tokenize(query);

  const results = exercises.map((exercise) => {
    const nameStr = normalize(exercise.name);
    const aliasStrs = (exercise.aliases ?? []).map(normalize);
    const corpusTokens = new Set(
      tokenize([exercise.name, exercise.category, ...(exercise.aliases ?? []), ...exercise.builds].join(' ')),
    );

    let score = 0;

    const longEnough = q.length >= MIN_SUBSTRING_LEN;

    if (nameStr === q || aliasStrs.includes(q)) {
      score = 1;
    } else if (longEnough && nameStr.length >= MIN_SUBSTRING_LEN && (nameStr.includes(q) || q.includes(nameStr))) {
      score = Math.max(score, 0.85);
    } else if (
      longEnough &&
      aliasStrs.some((a) => a.length >= MIN_SUBSTRING_LEN && (a.includes(q) || q.includes(a)))
    ) {
      score = Math.max(score, 0.8);
    }

    const corpusList = [...corpusTokens];
    const matchedTokens = qTokens.filter(
      (t) => corpusTokens.has(t) || corpusList.some((c) => (c.length > 2 && t.length > 2) && (c.startsWith(t) || t.startsWith(c))),
    );
    const overlapScore = qTokens.length ? matchedTokens.length / qTokens.length : 0;
    score = Math.max(score, overlapScore * 0.75);

    return { exercise, score };
  });

  return results
    .filter((r) => r.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function confidenceLabel(score: number): string {
  if (score >= 0.75) return 'Strong match';
  if (score >= 0.5) return 'Possible match';
  return 'Loose match';
}
