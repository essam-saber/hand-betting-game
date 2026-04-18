import { useGameStore } from "./store/gameStore";
import { Landing } from "./pages/Landing";

function App() {
  const game = useGameStore((s) => s.game);

  if (!game) return <Landing />;

  // Game and End pages come in next steps
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400">Game in progress (UI coming next)…</p>
    </div>
  );
}

export default App;