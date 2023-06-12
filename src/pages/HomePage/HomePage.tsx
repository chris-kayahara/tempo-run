import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const AUDIO_FEATURES_ENDPOINT = "https://api.spotify.com/v1/audio-features";
const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

export default function HomePage({ token, setToken, setIsUserLoggedIn }) {
  const [accessToken, setAccessToken] = useState("");
  const [userSavedTracks, setUserSavedTracks] = useState([]);
  const navigate = useNavigate();

  // Store access token as state variable if it exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAccessToken(localStorage.getItem("token"));
    }
  }, []);

  // Function to get total saved track count
  const getTotalTracks = async () => {
    const totalTracks = await axios
      .get(TRACKS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        return response.data.total;
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
    return totalTracks;
  };

  // Function to get all saved tracks
  const getAllSavedTracks = async () => {
    const totalTracks = await getTotalTracks();

    // Create a list of endpoints based on total track count
    const urls = [];
    for (let i = 0; i < totalTracks; i = i + 50) {
      urls.push(`${TRACKS_ENDPOINT}?offset=${i}&limit=50`);
    }

    // Create list of promises for each endpoint
    const requests = urls.map((url) =>
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    // Process each promise and set usersSavedTracks
    axios
      .all(requests)
      .then((responses) => {
        let data: object[] = [];

        responses.forEach((resp) => {
          data.push(...resp.data.items);
        });
        setUserSavedTracks(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to get audio features of all tracks
  const getAudioFeatures = async (tracks) => {
    const savedTracksChunks = [];

    while (userSavedTracks.length) {
      savedTracksChunks.push(userSavedTracks.splice(0, 100));
    }
    console.log(savedTracksChunks);

    // list of tracks arrays
    // Map through list to get id of each track
    // Put Ids of each track into another list of track arrays
    const urls = [];

    for (let i = 0; i < savedTracksChunks.length; i++) {
      const ids = [];
      for (let j = 0; j < savedTracksChunks[i].length; j++) {
        const id = savedTracksChunks[i][j].track.id;
        ids.push(id);
      }
      console.log(ids);
    }

    return savedTracksChunks;
  };

  // Function to handle logout
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
      <button onClick={getAllSavedTracks}>Load Your Saved Tracks</button>
      <button onClick={getAudioFeatures}>Get Audio Features</button>
      <button onClick={() => navigate("/create")}>
        Create New Running Playlist
      </button>
      {userSavedTracks.map((item) => {
        return <div key={item.track.id}>{item.track.name}</div>;
      })}
    </div>
  );
}
