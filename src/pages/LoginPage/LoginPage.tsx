import { useEffect, useState } from "react";

export default function LoginPage({ setToken, setIsUserLoggedIn }) {
  const CLIENT_ID = "a1974ecfcb7548a58a92b5b459147cdd";
  const REDIRECT_URI = "http://localhost:5173";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPES = ["user-library-read", "playlist-modify-private", "streaming"];
  const SPACE_DELIMITER = "%20";
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
  const RESPONSE_TYPE = "token";
  const SHOW_DIALOG = true;

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scopes=${SCOPES_URL_PARAM}&response_type=${RESPONSE_TYPE}&show_dialog=${SHOW_DIALOG}`;
  };

  const getToken = (hash) => {
    const urlHash = hash.substring(1);
    const paramsInUrl = urlHash.split("&");
    const paramsSplitUp = paramsInUrl.reduce(
      (accumulator: object, currentValue: string) => {
        const [key, value] = currentValue.split("=");
        accumulator[key] = value;
        return accumulator;
      },
      {}
    );
    console.log(paramsSplitUp);
    return paramsSplitUp;
  };

  useEffect(() => {
    if (!window.localStorage.getItem("token") && window.location.hash) {
      const { access_token, expires_in, token_type } = getToken(
        window.location.hash
      );
      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("expiresIn", expires_in);
      localStorage.setItem("tokenType", token_type);
      window.location.hash = "";
      setToken(access_token);
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <button onClick={handleLogin}>Login to Spotify</button>
    </div>
  );
}
