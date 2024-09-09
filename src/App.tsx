import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layouts from "./Components/Layout/layout";
import MainPage from "./Components/Pages/MainPage/MainPage";
import LandingPage from "./Components/Pages/LandingPage/LandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/Dashboard"
          element={
            <Layouts>
              <MainPage />
            </Layouts>
          }
        />
        <Route path="/*" element={<Navigate to="/Dashboard" />} />
        <Route
          path="/landingpage"
          element={
            <Layouts>
              <LandingPage />
            </Layouts>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
