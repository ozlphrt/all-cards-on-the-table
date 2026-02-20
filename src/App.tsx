import { useEffect } from "react";
import { SinglePlayerScreen } from "./components/screens/SinglePlayerScreen";
import { InstallPrompt } from "./components/ui/InstallPrompt";
import { resetVotes, resetGeneratedCards } from "./data/cards";

export default function App() {
  // Reset votes and generated cards on first load (one-time reset)
  useEffect(() => {
    // Always reset to start fresh
    resetVotes();
    resetGeneratedCards();
    console.log("Fresh start: All votes and generated cards cleared");
  }, []);

  return (
    <>
      <SinglePlayerScreen />
      <InstallPrompt />
    </>
  );
}
