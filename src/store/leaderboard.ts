const STORAGE_KEY = "hbg.leaderboard";
const MAX_ENTRIES = 5;

export interface LeaderboardEntry {
  score: number;
  date: string;
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(score: number): LeaderboardEntry[] {
  const current = loadLeaderboard();
  const updated = [...current, { score, date: new Date().toISOString() }]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage can fail in private mode — fail silently
  }

  return updated;
}