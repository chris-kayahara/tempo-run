import "./Header.scss";
import Button from "../Button/Button";

export default function Header({ setToken, setIsUserLoggedIn }) {
  // Function to handle logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
    setIsUserLoggedIn(false);
  };

  return (
    <div className="header">
      <div className="header__content">
        <h2 className="header__logo">DJ Run</h2>
        <Button
          onClick={handleLogout}
          text={"Logout"}
          variant={"primary-small"}
        />
      </div>
    </div>
  );
}
