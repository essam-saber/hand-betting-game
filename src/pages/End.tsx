import { useState } from "react";
import { useGameStore } from "../store/gameStore";

export function End() {
  const game = useGameStore((s) => s.game);
  const saveCurrentScore = useGameStore((s) => s.saveCurrentScore);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const exitToLanding = useGameStore((s) => s.exitToLanding);

  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);

  if (!game) return null;

  const handleSave = () => {
    saveCurrentScore(name);
    setSaved(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-2">Game Over</h1>
        <p className="text-slate-400 mb-8 text-sm">{game.gameOverReason}</p>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-8 mb-8">
          <p className="text-sm uppercase tracking-wider text-slate-400 mb-2">
            Final Score
          </p>
          <p className="text-7xl font-bold font-mono text-emerald-400">
            {game.score}
          </p>
        </div>

        {!saved ? (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="Your name (optional)"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-lg transition-colors"
            >
              Save Score
            </button>
            <button
              onClick={exitToLanding}
              className="w-full py-3 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              Skip & exit
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-emerald-400 mb-4">Score saved.</p>
            <button
              onClick={startNewGame}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={exitToLanding}
              className="w-full py-3 text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}