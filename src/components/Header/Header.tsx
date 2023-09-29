import "./Header.scss";
import Button from "../Button/Button";

type Props = {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ setToken, setIsUserLoggedIn }: Props) {
  // Function to handle logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("tokenType");
    setIsUserLoggedIn(false);
  };

  return (
    <div className="header">
      <div className="header__content">
        <h2 className="header__logo">TEMPO RUN</h2>
        <Button
          onClick={handleLogout}
          text={"Logout"}
          variant={"tertiary"}
          disabled={false}
          flashing={false}
        />
      </div>
    </div>
  );
}
