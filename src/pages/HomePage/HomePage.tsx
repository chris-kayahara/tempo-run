import { useNavigate } from "react-router-dom";

export default function HomePage({ setToken, setIsUserLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
    setIsUserLoggedIn(false);
  };

  return (
    <div>
      <h1>DJ Run</h1>
      <p>
        App that lets you create running playlists based on your specified pace
        and your songs BPM
      </p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate("/create")}>
        Create New Running Playlist
      </button>
    </div>
  );
}
