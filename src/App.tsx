import { useState } from "react";

import LoginPage from "./pages/LoginPage/LoginPage";
import HomePage from "./pages/HomePage/HomePage";

import "./App.scss";

function App() {
  const [showExpiredMessage, setShowExpiredMessage] = useState(false);
  const [token, setToken] = useState<string>("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  return (
    <>
      {!isUserLoggedIn ? (
        <LoginPage
          setToken={setToken}
          setIsUserLoggedIn={setIsUserLoggedIn}
          showExpiredMessage={showExpiredMessage}
        />
      ) : (
        <HomePage
          token={token}
          setToken={setToken}
          setIsUserLoggedIn={setIsUserLoggedIn}
          setShowExpiredMessage={setShowExpiredMessage}
        />
      )}
    </>
  );
}

export default App;
