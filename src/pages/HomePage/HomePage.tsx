import { useState, useEffect } from "react";
import axios from "axios";

import "./HomePage.scss";

import DualSlider from "../../components/DualSlider/DualSlider";
import Tracklist from "../../components/Tracklist/Tracklist";
import Header from "../../components/Header/Header";
import Button from "../../components/Button/Button";
import CreatePlaylistModal from "../../components/CreatePlaylistModal/CreatePlaylistModal";
import Toast from "../../components/Toast/Toast";

const AUDIO_FEATURES_ENDPOINT = "https://api.spotify.com/v1/audio-features";
const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

export default function HomePage({
  token,
  setToken,
  setIsUserLoggedIn,
  setShowExpiredMessage,
}) {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [accessToken, setAccessToken] = useState<string>("");
  const [userSavedTracks, setUserSavedTracks] = useState([]);
  const [tracksToDisplay, setTracksToDisplay] = useState([]);
  const [tempoRange, setTempoRange] = useState([170, 180]);
  const [energyRange, setEnergyRange] = useState([4, 5]);
  const [minTempo, setMinTempo] = useState(60);
  const [maxTempo, setMaxTempo] = useState(200);
  const [playlistInfo, setPlaylistInfo] = useState({
    name: "",
    description: "",
    public: true,
  });
  const [listIsFiltered, setListIsFiltered] = useState(false);

  // Store access token as state variable if it exists and check if token has expired
  useEffect(() => {
    const currentDate = new Date().getTime();

    if (localStorage.getItem("token")) {
      setAccessToken(localStorage.getItem("token"));
    }
    if (localStorage.getItem("expiresAt") * 1 < currentDate) {
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("tokenType");
      setIsUserLoggedIn(false);
      setShowExpiredMessage(true);
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
          return Math.round(item.tempo);
        } else {
          return 300;
        }
      })
    );
    const maxTempoValue = Math.max.apply(
      null,
      trackData.map((item) => {
        return Math.round(item.tempo);
      })
    );
    setMinTempo(minTempoValue);
    setMaxTempo(maxTempoValue);
    setUserSavedTracks(trackData);
    setTracksToDisplay(trackData);
  };

  // Function to handle filter button click. Filter songs by selected BPM and energy range
  const handleFilter = (event) => {
    event.preventDefault();
    const filteredTracks = userSavedTracks.filter((track) => {
      return (
        Math.round(track.tempo) >= tempoRange[0] &&
        Math.round(track.tempo) <= tempoRange[1] &&
        Math.ceil(track.energy * 5) >= energyRange[0] + 1 &&
        Math.ceil(track.energy * 5) <= energyRange[1]
      );
    });
    setListIsFiltered(true);
    setTracksToDisplay(filteredTracks);
  };

  const closeModal = () => {
    setPlaylistInfo({
      name: "",
      description: "",
      public: true,
    });
    setShowModal(false);
  };

  return (
    <>
      <Header setToken={setToken} setIsUserLoggedIn={setIsUserLoggedIn} />
      <div className="home-page">
        <div className="home-page__hero-container">
          <div className="home-page__info-container">
            <p className="home-page__text">
              Use the filters to select tracks from your Spotify saved library.
            </p>
          </div>
          <div className="home-page__filter-container">
            <div className="home-page__slider-container">
              <div>
                <h3 className="home-page__filter-header">Tempo Selector</h3>
                <DualSlider
                  min={minTempo}
                  max={maxTempo}
                  range={tempoRange}
                  minDistance={10}
                  setRange={setTempoRange}
                  showMarks={true}
                  showThumbLabel={true}
                  showOffsetSliderMarks={false}
                />
              </div>
              <div>
                <h3 className="home-page__filter-header">Energy Selector</h3>
                <DualSlider
                  min={0}
                  max={5}
                  range={energyRange}
                  minDistance={1}
                  setRange={setEnergyRange}
                  showMarks={false}
                  showThumbLabel={false}
                  showOffsetSliderMarks={true}
                />
              </div>
            </div>
            <div className="home-page__button-container">
              <Button
                flashing={!listIsFiltered}
                disabled={false}
                text={"FILTER"}
                onClick={handleFilter}
                variant={"secondary"}
              />
              <Button
                disabled={!listIsFiltered}
                text={"CREATE PLAYLIST"}
                onClick={() => {
                  setShowModal(true);
                }}
                variant={"primary"}
              />
            </div>
          </div>
        </div>
        <Tracklist
          userSavedTracks={userSavedTracks}
          tracksToDisplay={tracksToDisplay}
          listIsFiltered={listIsFiltered}
        />
      </div>
      {showModal && (
        <CreatePlaylistModal
          closeModal={closeModal}
          accessToken={accessToken}
          tracksToDisplay={tracksToDisplay}
          playlistInfo={playlistInfo}
          setPlaylistInfo={setPlaylistInfo}
          toast={toast}
          setToast={setToast}
        />
      )}
      <Toast toast={toast} />
    </>
  );
}
