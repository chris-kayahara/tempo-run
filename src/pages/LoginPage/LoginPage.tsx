import { useEffect } from "react";
import "./LoginPage.scss";
import Button from "../../components/Button/Button";
import logo from "../../assets/logo.svg";
import Footer from "../../components/Footer/Footer";

type Props = {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  showExpiredMessage: boolean;
};

type Token = {
  [key: string]: any;
  access_token: string;
  expires_in: number;
  token_type: string;
};

export default function LoginPage({
  setToken,
  setIsUserLoggedIn,
  showExpiredMessage,
}: Props) {
  const appName = "TEMPO RUN";
  const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPES = ["user-library-read", "playlist-modify-public"];
  const SPACE_DELIMITER = "%20";
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);
  const RESPONSE_TYPE = "token";
  const SHOW_DIALOG = true;

  const handleLogin = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL_PARAM}&response_type=${RESPONSE_TYPE}&show_dialog=${SHOW_DIALOG}`;
  };

  const getToken = (hash: string) => {
    const urlHash = hash.substring(1);
    const paramsInUrl = urlHash.split("&");

    let paramsSplitUp: Token = {
      access_token: "",
      expires_in: 0,
      token_type: "",
    };
    paramsInUrl.forEach((param) => {
      const key: string = param.split("=")[0];
      const value: string = param.split("=")[1];
      paramsSplitUp[key as keyof typeof paramsSplitUp] = value;
    });

    return paramsSplitUp;
  };

  useEffect(() => {
    if (!window.localStorage.getItem("token") && window.location.hash) {
      const { access_token, expires_in, token_type }: Token = getToken(
        window.location.hash
      );
      const currentDate = new Date().getTime();
      const expiresAt = currentDate + expires_in * 1000;
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
      <div className="login-page__content">
        <div className="login-page__logo-container">
          <img className="login-page__logo--light-grey" src={logo} />
          <img className="login-page__logo--grey" src={logo} />
          <img className="login-page__logo--black" src={logo} />
        </div>
        <div className="login-page__text-container">
          <h1 className="login-page__title">{appName}</h1>
          <p className="login-page__text">
            Create jogging playlists from the saved songs in your Spotify
            library and run to the beat of your music!
          </p>
          <p className="login-page__text">
            Get started by signing into your Spotify account.
          </p>
          {showExpiredMessage && (
            <p className="login-page__expired-message">
              Session expired.<br></br>Please log in again to continue using
              this application.
            </p>
          )}
          <div className="login-page__button-container">
            <Button
              onClick={handleLogin}
              text="LOGIN"
              variant={"primary"}
            ></Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
