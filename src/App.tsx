import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";

import "./App.scss";

function App() {
  const [token, setToken] = useState<string>("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              !isUserLoggedIn ? (
                <LoginPage
                  setToken={setToken}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                />
              ) : (
                <HomePage
                  token={token}
                  setToken={setToken}
                  setIsUserLoggedIn={setIsUserLoggedIn}
                />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
