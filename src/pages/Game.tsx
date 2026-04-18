import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { sumHand } from "../engine/game";
import { Tile } from "../components/Tile";
import { History } from "../components/History";

export function Game() {
  const game = useGameStore((s) => s.game);
  const bet = useGameStore((s) => s.bet);
  const exitToLanding = useGameStore((s) => s.exitToLanding);

  const [scorePulse, setScorePulse] = useState(false);
  const prevScoreRef = useRef(0);

  useEffect(() => {
    if (!game) return;
    if (game.score > prevScoreRef.current) {
      setScorePulse(true);
      const t = setTimeout(() => setScorePulse(false), 500);
      prevScoreRef.current = game.score;
      return () => clearTimeout(t);
    }
    prevScoreRef.current = game.score;
  }, [game?.score]);

  if (!game) return null;

  const currentTotal = sumHand(game.currentHand, game.tileValues);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 page-fade">
      <div className="w-full max-w-2xl">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-8 text-sm">
          <div className="flex gap-6 text-slate-300">
            <span>
              Score{" "}
              <span
                className={`font-bold text-emerald-400 ml-1 inline-block ${scorePulse ? "score-pulse" : ""}`}
              >
                {game.score}
              </span>
            </span>
            <span>
              Draw <span className="font-mono text-slate-100 ml-1">{game.drawPile.length}</span>
            </span>
            <span>
              Discard <span className="font-mono text-slate-100 ml-1">{game.discardPile.length}</span>
            </span>
          </div>
          <button
            onClick={exitToLanding}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            Exit
          </button>
        </header>

        {/* Current hand */}
        <section className="mb-8">
          <p className="text-center text-slate-400 text-sm uppercase tracking-wider mb-4">
            Current Hand
          </p>
          <div className="flex justify-center gap-3 mb-4 perspective-1000">
            {game.currentHand.map((t, i) => (
              <Tile key={t.id} tile={t} size="lg" index={i} />
            ))}
          </div>
          <p className="text-center text-4xl font-bold font-mono">
            {currentTotal}
          </p>
        </section>

        {/* Bet buttons */}
        <section className="flex gap-3 mb-10">
          <button
            onClick={() => bet("lower")}
            className="flex-1 py-4 rounded-xl bg-rose-500 hover:bg-rose-400 active:scale-[0.98] text-white font-semibold text-lg transition-all"
          >
            Bet Lower
          </button>
          <button
            onClick={() => bet("higher")}
            className="flex-1 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-semibold text-lg transition-all"
          >
            Bet Higher
          </button>
        </section>

        {/* History */}
        <section>
          <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-3">
            History
          </h2>
          <History entries={game.history} />
        </section>
      </div>
    </div>
  );
}