import type { HistoryEntry } from "../engine/state";
import { Tile } from "./Tile";

interface Props {
  entries: HistoryEntry[];
}

export function History({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="text-slate-500 text-sm text-center">
        No hands played yet.
      </p>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40"
        >
          <div className="flex gap-1">
            {entry.tiles.map((t) => (
              <Tile key={t.id} tile={t} size="sm" />
            ))}
          </div>
          <div className="flex-1 flex items-center justify-between text-sm">
            <span className="font-mono text-slate-300">
              total {entry.total}
            </span>
            <span className="text-slate-400 capitalize">
              bet {entry.bet}
            </span>
            <span
              className={`font-semibold ${
                entry.won ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {entry.won ? "won" : "lost"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}