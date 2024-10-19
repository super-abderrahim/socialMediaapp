import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./scenes/homepage/Homepage.jsx";
import Loginpage from "./scenes/loginpage/loginpage.jsx";
import Profilepage from "./scenes/profilepage/profilepage.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme.js";

function App() {
  const mode = useSelector((state) => state.mode); 
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Loginpage />} />
            <Route path="/Home" element={isAuth ? <Homepage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <Profilepage /> : <Navigate to="/" />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
