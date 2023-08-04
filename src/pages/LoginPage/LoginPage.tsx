import { useEffect } from "react";
import "./LoginPage.scss";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.svg";

export default function LoginPage({
  setToken,
  setIsUserLoggedIn,
  showExpiredMessage,
}) {
  const appName = "Tempo Run";
  const CLIENT_ID = "a1974ecfcb7548a58a92b5b459147cdd";
  const REDIRECT_URI = "http://localhost:5173";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPES = [
    "user-library-read",
    "playlist-modify-private",
    "playlist-modify-public",
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
    return paramsSplitUp;
  };

  useEffect(() => {
    if (!window.localStorage.getItem("token") && window.location.hash) {
      const { access_token, expires_in, token_type } = getToken(
        window.location.hash
      );
      const currentDate = new Date().getTime();
      const expiresAt = currentDate + expires_in * 1000;
      // TEST VALUE FOR TOKEN EXPIRATION
      // const expiresAt = currentDate + 30000;
      localStorage.clear();
      localStorage.setItem("token", access_token);
      localStorage.setItem("expiresAt", expiresAt.toString());
      localStorage.setItem("tokenType", token_type);
      window.location.hash = "";
      setToken(access_token);
      setIsUserLoggedIn(true);
    }
  }, []);

  return (
    <div className="login-page">
      <img className="login-page__logo" src={logo} />
      <h1 className="login-page__title">{appName}</h1>
      <p className="login-page__text">
        Create jogging playlists from the saved songs in your Spotify library
        and run to the beat of your music, while also tracking your total
        jogging time and total steps taken.
      </p>
      <p className="login-page__text">
        Get started by signing into your spotify account.
      </p>
      {showExpiredMessage && (
        <p className="login-page__expired-message">
          Session expired.<br></br>Please log back in to continue using this
          application.
        </p>
      )}
      <Button onClick={handleLogin} text="LOGIN" variant={"primary"}></Button>
      <a
        className="login-page__register-link"
        href="https://www.spotify.com/signup"
      >
        SIGN UP
      </a>
    </div>
  );
}
