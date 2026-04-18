import type { Tile as TileType } from "../engine/tiles";
import { getTileValue } from "../engine/game";
import { useGameStore } from "../store/gameStore";

interface Props {
  tile: TileType;
  size?: "sm" | "lg";
  index?: number;
}

const CATEGORY_STYLES: Record<string, string> = {
  number: "bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900",
  dragon: "bg-gradient-to-br from-rose-50 to-rose-200 text-rose-900",
  wind: "bg-gradient-to-br from-sky-50 to-sky-200 text-sky-900",
};

const CATEGORY_ICONS: Record<string, string> = {
  number: "",
  dragon: "🐉",
  wind: "🌬",
};

export function Tile({ tile, size = "lg", index = 0 }: Props) {
  const tileValues = useGameStore((s) => s.game?.tileValues ?? {});
  const value = getTileValue(tile, tileValues);

  const sizeClasses =
    size === "lg"
      ? "w-24 h-32"
      : "w-12 h-16";

  return (
    <div
      key={tile.id}
      className={`
        ${sizeClasses}
        ${CATEGORY_STYLES[tile.category]}
        rounded-lg shadow-lg flex flex-col items-center justify-between
        py-2 px-1 border border-slate-300/50
        transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl
        ${size === "lg" ? "tile-enter" : ""}
      `}
      style={size === "lg" ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <span className={size === "lg" ? "text-xl leading-none" : "text-xs leading-none"}>
        {CATEGORY_ICONS[tile.category] || ""}
      </span>
      <span className={`font-bold ${size === "lg" ? "text-3xl" : "text-lg"}`}>
        {value}
      </span>
      <span className={`uppercase tracking-wider opacity-70 leading-tight text-center ${size === "lg" ? "text-[10px]" : "text-[8px]"}`}>
        {size === "lg" ? tile.label : ""}
      </span>
    </div>
  );
}