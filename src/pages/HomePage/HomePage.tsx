import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage({ token, setToken, setIsUserLoggedIn }) {
  const [accessToken, setAccessToken] = useState("");
  const [userSavedTracks, setUserSavedTracks] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAccessToken(localStorage.getItem("token"));
    }
  }, []);

  // useEffect(() => {
  //   console.log(token);
  //   handleGetSavedTracks();
  // }, []);

  const navigate = useNavigate();

  const handleGetSavedTracks = () => {
    axios
      .get("https://api.spotify.com/v1/me/tracks", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit: 50,
          offset: 0,
        },
      })
      .then((response) => {
        setUserSavedTracks(response.data.items);
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
    setIsUserLoggedIn(false);
  };
  console.log(userSavedTracks);

  return (
    <div>
      <h1>DJ Run</h1>
      <p>
        App that lets you create running playlists based on your specified pace
        and your songs BPM
      </p>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleGetSavedTracks}>Load Your Saved Tracks</button>
      <button onClick={() => navigate("/create")}>
        Create New Running Playlist
      </button>
      {userSavedTracks.map((item) => {
        return <p key={item.track.id}>{item.track.name}</p>;
      })}
    </div>
  );
}
