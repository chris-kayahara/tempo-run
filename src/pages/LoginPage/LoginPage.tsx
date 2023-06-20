import { useEffect, useState } from "react";
import "./LoginPage.scss";
import Button from "../../components/Button/Button";

export default function LoginPage({ setToken, setIsUserLoggedIn }) {
  const appName = "Spotify Running App";
  const CLIENT_ID = "a1974ecfcb7548a58a92b5b459147cdd";
  const REDIRECT_URI = "http://localhost:5173";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPES = [
    "user-library-read",
    "playlist-modify-private",
    "playlist-read-private",
  ];
  const SPACE_DELIMITER = "%20";
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
  const RESPONSE_TYPE = "token";
  const SHOW_DIALOG = true;

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=${RESPONSE_TYPE}&show_dialog=${SHOW_DIALOG}`;
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
    <div className="login-page">
      <h1 className="login-page__title">{appName}</h1>
      <p className="login-page__text">
        Welcome to the {appName}! The app that lets you create playlist for
        running from your saved Spotify tracks, based on their tempo and energy
        rating, so that you can run to the beat of your music.
      </p>
      <p className="login-page__text">
        Get started by signing into your spotify account!
      </p>
      <Button onClick={handleLogin} text="LOGIN"></Button>
    </div>
  );
}
