import type { Tile as TileType } from "../engine/tiles";
import { getTileValue } from "../engine/game";
import { useGameStore } from "../store/gameStore";

interface Props {
  tile: TileType;
  size?: "sm" | "lg";
}

const CATEGORY_COLORS: Record<string, string> = {
  number: "bg-slate-100 text-slate-900",
  dragon: "bg-rose-100 text-rose-900",
  wind: "bg-sky-100 text-sky-900",
};

const CATEGORY_LABELS: Record<string, string> = {
  number: "",
  dragon: "🐉",
  wind: "🌬",
};

export function Tile({ tile, size = "lg" }: Props) {
  const tileValues = useGameStore((s) => s.game?.tileValues ?? {});
  const value = getTileValue(tile, tileValues);

  const sizeClasses =
    size === "lg"
      ? "w-24 h-32 text-base"
      : "w-12 h-16 text-xs";

  return (
    <div
      className={`
        ${sizeClasses}
        ${CATEGORY_COLORS[tile.category]}
        rounded-lg shadow-md flex flex-col items-center justify-between
        py-2 px-1 border border-slate-300
        transition-transform hover:-translate-y-1
      `}
    >
      <span className="text-xl leading-none">
        {CATEGORY_LABELS[tile.category] || ""}
      </span>
      <span className={`font-bold ${size === "lg" ? "text-3xl" : "text-lg"}`}>
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-wider opacity-70 leading-tight text-center">
        {size === "lg" ? tile.label : ""}
      </span>
    </div>
  );
}