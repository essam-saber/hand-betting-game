import { useGameStore } from "./store/gameStore";
import { Landing } from "./pages/Landing";
import { Game } from "./pages/Game";

function App() {
  const game = useGameStore((s) => s.game);

  if (!game) return <Landing />;
  if (game.isGameOver) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">End screen coming next…</p>
      </div>
    );
  }
  return <Game />;
}

export default App;