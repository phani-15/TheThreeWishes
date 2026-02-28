import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./Pages/WelcomePage";
import LoginPage from "./Pages/LoginPage";
import Round1Page from "./Pages/Round1Page";
import HomePage from "./Pages/HomePage";
import Quiz from "./Pages/Quiz";
import Round2Page from "./Pages/Round2Page";
import Round3Page from "./Pages/Round3Page";
import Thumbnail from "./Pages/Thumbnail";
import Level3Question from "./Pages/Level3Question";
import Level3WinPage from "./Pages/Level3WinPage";
import Round2 from "./Pages/Round2";
import Level1WinPage from "./Pages/Level1WinPage";
import Level2WinPage from "./Pages/Level2WinPage";
import GameWinning from "./Pages/GameWinningPage";
import UnqualifiedPage from "./Components/UnqualifiedPage";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/round1" element={<Round1Page />} />
          <Route path="/" element={<Thumbnail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/second" element={<Round2Page />} />
          <Route path="/round2" element={<Round2 />} />
          <Route path="/third" element={<Round3Page />} />
          <Route path="/question" element={<Level3Question />} />
          <Route path="/win" element={<Level3WinPage />} />
          <Route path="/win1" element={<Level1WinPage />} />
          <Route path="/win2" element={<Level2WinPage />} />
          <Route path="/gamewin" element={<GameWinning />} />
          <Route path="/unqualified" element={<UnqualifiedPage />} />
          <Route path="/board" element={<Dashboard />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
