import { useState, useEffect } from "react";
import axios from "axios";

import "./HomePage.scss";

import DualSlider from "../../components/DualSlider/DualSlider";
import Tracklist from "../../components/Tracklist/Tracklist";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import CreatePlaylistModal from "../../components/CreatePlaylistModal/CreatePlaylistModal";

const AUDIO_FEATURES_ENDPOINT = "https://api.spotify.com/v1/audio-features";
const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks";
const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";

export default function HomePage({ token, setToken, setIsUserLoggedIn }) {
  const [showModal, setShowModal] = useState(true);
  const [accessToken, setAccessToken] = useState<string>("");
  const [userSavedTracks, setUserSavedTracks] = useState([]);
  const [tracksToDisplay, setTracksToDisplay] = useState([]);
  const [tempoRange, setTempoRange] = useState([90, 100, 110]);
  const [energyRange, setEnergyRange] = useState([79, 89, 99]);
  const [minTempo, setMinTempo] = useState(60);
  const [maxTempo, setMaxTempo] = useState(200);
  const [minEnergy, setMinEnergy] = useState(40);
  const [maxEnergy, setMaxEnergy] = useState(90);
  const [playlistInfo, setPlaylistInfo] = useState({
    name: "",
    description: "",
    public: false,
  });

  // Store access token as state variable if it exists
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAccessToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setAllData();
    }
  }, [accessToken]);

  // Function to get total number of saved track
  const getTotalTracks = () => {
    const totalTracks = axios
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
    const trackPageUrls = [];
    for (let i = 0; i < totalTracks; i = i + 50) {
      trackPageUrls.push(`${TRACKS_ENDPOINT}?offset=${i}&limit=50`);
    }

    // Create list of promises for each endpoint
    const trackRequests = trackPageUrls.map((url) =>
      axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    // Process each promise and set usersSavedTracks
    const tracks = await axios
      .all(trackRequests)
      .then((responses) => {
        let data: object[] = [];

        responses.forEach((resp) => {
          data.push(...resp.data.items);
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });

    // Split track list into smaller chunks for API calls
    const savedTracksChunks = [];
    for (let i = 0; i < tracks.length; i += 100) {
      savedTracksChunks.push(tracks.slice(i, i + 100));
    }

    // Create list of endpoints
    const dataUrls = [];
    for (let i = 0; i < savedTracksChunks.length; i++) {
      const ids = [];
      for (let j = 0; j < savedTracksChunks[i].length; j++) {
        const id = savedTracksChunks[i][j].track.id;
        ids.push(id);
      }
      const joinedIds = ids.join("%2C");
      const url = AUDIO_FEATURES_ENDPOINT + "?ids=" + joinedIds;
      dataUrls.push(url);
    }

    // Create list of promises for each endpoint
    const dataRequests = dataUrls.map(
      async (url) =>
        await axios.get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
    );

    // Process each promise and set usersSavedTracks
    const trackAudioData = await axios
      .all(dataRequests)
      .then((responses) => {
        let data: object[] = [];

        responses.forEach((resp) => {
          data.push(...resp.data.audio_features);
        });
        return data;
      })
      .catch((error) => {
        console.log(error);
      });

    // Merge data from API calls
    let mergedTrackData = [];
    for (let i = 0; i < trackAudioData.length; i++) {
      mergedTrackData.push({
        ...trackAudioData[i],
        ...tracks.find(
          (itmInner) => itmInner.track.id === trackAudioData[i].id
        ),
      });
    }
    return mergedTrackData;
  };

  // FUnction to gather all API data and set state
  const setAllData = async () => {
    const trackData = await getAllSavedTracks();
    const minTempoValue = Math.min.apply(
      null,
      trackData.map((item) => {
        if (item.tempo !== 0) {
          return item.tempo;
        } else {
          return 300;
        }
      })
    );
    const maxTempoValue = Math.max.apply(
      null,
      trackData.map((item) => {
        return item.tempo;
      })
    );
    const minEnergyValue = Math.min.apply(
      null,
      trackData.map((item) => {
        if (item.energy !== 0) {
          return item.energy;
        } else {
          return 300;
        }
      })
    );
    const maxEnergyValue = Math.max.apply(
      null,
      trackData.map((item) => {
        return item.energy;
      })
    );
    setMinTempo(minTempoValue);
    setMaxTempo(maxTempoValue);
    setMinEnergy(minEnergyValue * 100);
    setMaxEnergy(maxEnergyValue * 100);
    setUserSavedTracks(trackData);
    setTracksToDisplay(trackData);
    console.log(trackData);
  };

  // Function to handle filter button click. Filter songs by selected BPM and energy range
  const handleFilter = (event) => {
    event.preventDefault();
    const filteredTracks = userSavedTracks.filter((track) => {
      return (
        track.tempo >= tempoRange[0] &&
        track.tempo <= tempoRange[2] &&
        track.energy * 100 >= energyRange[0] &&
        track.energy * 100 <= energyRange[2]
      );
    });
    setTracksToDisplay(filteredTracks);
  };

  // Function to get userId
  const getUserId = async () => {
    const userId = await axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data.id);
        return response.data.id;
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
    return userId;
  };

  // Function to handle Playlist creating info form changes
  const handlePlaylistInfoChange = (event) => {
    const value = event.target.value;
    setPlaylistInfo({
      ...playlistInfo,
      [event.target.name]: value,
    });
    console.log(playlistInfo);
  };

  const closeModal = () => {
    setPlaylistInfo({
      name: "",
      description: "",
      public: false,
    });
    setShowModal(false);
  };

  // Function to POST new filtered playlist
  const handlePostPlaylist = async (event) => {
    event.preventDefault();
    const userId = await getUserId();
    axios
      .post(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        playlistInfo,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const playlistId = response.data.id;
        const trackIds = tracksToDisplay.map((track) => {
          return track.uri;
        });
        axios
          .post(
            `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            {
              uris: trackIds,
              position: 0,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then((response) => {
            console.log(response);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header setToken={setToken} setIsUserLoggedIn={setIsUserLoggedIn} />
      <div className="home-page">
        <div className="home-page__info-container">
          <p className="home-page__text">
            App that lets you create running playlists based on your specified
            pace and your songs BPM
          </p>
        </div>
        <div className="home-page__filter-container">
          <h3 className="home-page__filter-header">Tempo Selector</h3>
          <DualSlider
            min={minTempo}
            max={maxTempo}
            range={tempoRange}
            setRange={setTempoRange}
          />
          <h3 className="home-page__filter-header">Energy Selector</h3>
          <DualSlider
            min={minEnergy}
            max={maxEnergy}
            range={energyRange}
            setRange={setEnergyRange}
          />
          <div className="home-page__button-container">
            <Button
              text={"FILTER"}
              onClick={handleFilter}
              variant={"secondary"}
            />
            <Button
              text={"CREATE PLAYLIST"}
              onClick={() => {
                setShowModal(true);
              }}
              variant={"primary"}
            />
          </div>
        </div>
        <Tracklist tracksToDisplay={tracksToDisplay} />
      </div>
      {showModal && (
        <CreatePlaylistModal
          closeModal={closeModal}
          playlistInfo={playlistInfo}
          handlePlaylistInfoChange={handlePlaylistInfoChange}
        />
      )}
    </>
  );
}
