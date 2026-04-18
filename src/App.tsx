import { useGameStore } from "./store/gameStore";
import { Landing } from "./pages/Landing";
import { Game } from "./pages/Game";
import { End } from "./pages/End";

function App() {
  const game = useGameStore((s) => s.game);

  if (!game) return <Landing />;
  if (game.isGameOver) return <End />;
  return <Game />;
}

export default App;