import { useGameStore } from "../store/gameStore";

export function Landing() {
  const startNewGame = useGameStore((s) => s.startNewGame);
  const leaderboard = useGameStore((s) => s.leaderboard);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-bold text-center mb-2 tracking-tight">
          Hand Betting
        </h1>
        <p className="text-center text-slate-400 mb-10">
          Bet higher or lower on the next hand of mahjong tiles.
        </p>

        <button
          onClick={startNewGame}
          className="w-full py-4 mb-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-lg transition-colors"
        >
          New Game
        </button>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
          <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
            Leaderboard
          </h2>

          {leaderboard.length === 0 ? (
            <p className="text-slate-500 text-sm">No scores yet. Be the first.</p>
          ) : (
            <ol className="space-y-2">
              {leaderboard.map((entry, i) => (
                <li
                  key={`${entry.date}-${i}`}
                  className="flex items-center justify-between text-slate-200"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-slate-500 text-sm">{i + 1}.</span>
                    <span className="font-mono text-lg">{entry.score}</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}