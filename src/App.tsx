import { useEffect } from "react";
import { useSessionStore } from "./state/sessionStore";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { CreateGameScreen } from "./components/screens/CreateGameScreen";
import { JoinGameScreen } from "./components/screens/JoinGameScreen";
import { WaitingRoomScreen } from "./components/screens/WaitingRoomScreen";
import { SessionSetupScreen } from "./components/screens/SessionSetupScreen";
import { MainGameScreen } from "./components/screens/MainGameScreen";
import { ClosingRitualScreen } from "./components/screens/ClosingRitualScreen";
import { SinglePlayerScreen } from "./components/screens/SinglePlayerScreen";
import { InstallPrompt } from "./components/ui/InstallPrompt";
import { resetVotes, resetGeneratedCards } from "./data/cards";

export default function App() {
  const screen = useSessionStore((s) => s.currentScreen);

  // Reset votes and generated cards on first load (one-time reset)
  useEffect(() => {
    // Always reset to start fresh
    resetVotes();
    resetGeneratedCards();
    console.log("Fresh start: All votes and generated cards cleared");
  }, []);

  if (screen === "WELCOME") return <WelcomeScreen />;
  if (screen === "CREATE_GAME") return <CreateGameScreen />;
  if (screen === "JOIN_GAME") return <JoinGameScreen />;
  if (screen === "WAITING_ROOM") return <WaitingRoomScreen />;
  if (screen === "SETUP_SESSION") return <SessionSetupScreen />;
  if (screen === "IN_ROUND" || screen === "ANSWER_PHASE")
    return <MainGameScreen />;
  if (screen === "CLOSING_GROUP" || screen === "CLOSING_PERSONAL")
    return <ClosingRitualScreen />;
  if (screen === "SINGLE_PLAYER") return <SinglePlayerScreen />;

  return (
    <>
      <WelcomeScreen />
      <InstallPrompt />
    </>
  );
}

