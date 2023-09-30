import { useState, useEffect } from "react";
import { msToHourMin } from "../../common/utils";
import axios from "axios";

import "./HomePage.scss";

import DualSlider from "../../components/DualSlider/DualSlider";
import Tracklist from "../../components/Tracklist/Tracklist";
import Button from "../../components/Button/Button";
import CreatePlaylistModal from "../../components/CreatePlaylistModal/CreatePlaylistModal";
import Toast from "../../components/Toast/Toast";
import FilterHeader from "../../components/FilterHeader/FilterHeader";
import HelpModal from "../../components/HelpModal/HelpModal";
import {
  HelpModalProps,
  ToastData,
  Track,
  PlaylistData,
} from "../../common/types";

const AUDIO_FEATURES_ENDPOINT = "https://api.spotify.com/v1/audio-features";
const TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/tracks";

type Props = {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setShowExpiredMessage: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HomePage({
  setToken,
  setIsUserLoggedIn,
  setShowExpiredMessage,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpModalContent, setHelpModalContent] = useState<HelpModalProps>({
    heading: "",
    image: "",
    text: "",
    recommendation: "",
  });
  const [toast, setToast] = useState<ToastData>({
    show: false,
    message: "",
    type: "success",
  });
  const [accessToken, setAccessToken] = useState<string | null>("");
  const [userSavedTracks, setUserSavedTracks] = useState<Track[]>([]);
  const [tracksToDisplay, setTracksToDisplay] = useState<Track[]>([]);
  const [tempoRange, setTempoRange] = useState([160, 170]);
  const [energyRange, setEnergyRange] = useState([4, 5]);
  const [minTempo, setMinTempo] = useState(60);
  const [maxTempo, setMaxTempo] = useState(200);

  const [listIsFiltered, setListIsFiltered] = useState(false);
  const [playlistData, setPlaylistData] = useState<PlaylistData>({
    length: 0,
    count: 0,
    steps: 0,
  });

  const helpInfo = {
    tempo: {
      heading: "CADENCE (TEMPO)",
      image: "tempo.svg",
      text: "Tempo refers to the speed or pace of a piece of music, measured in beats per minute (bpm). In this case, the tempo will represent your running cadence, which refers to the number of steps per minute (spm) you take as you run.",
      recommendation:
        "The recommended running cadence range is 160-180spm. If you are unsure of your ideal running cadence, start slow and work your way up to reduce your risk of injury.",
    },
    energy: {
      heading: "ENERGY",
      image: "energy.svg",
      text: 'Spotify defines a song\'s energy as a "perceptual measure of intensity and activity." For example, a heavy metal song will have high energy, while a lullaby has low energy. Here we have sorted each track into energy levels from 1 to 5.',
      recommendation:
        "We recommend starting with level 5 energy to ensure your playlist has the high intensity you need to run that extra mile!",
    },
  };

  // Store access token as state variable if it exists and check if token has expired
  useEffect(() => {
    const currentDate = new Date().getTime();
    const token: string | null = localStorage.getItem("token");
    const expiresAt: any = localStorage.getItem("expiresAt");

    if (token) {
      setAccessToken(token);
    }
    if (expiresAt && expiresAt * 1 < currentDate) {
      setToken("");
      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("tokenType");
      setIsUserLoggedIn(false);
      setShowExpiredMessage(true);
    }
  }, []);

  // useEffect to set all data once the accessToken is set
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
    const tracks = (await axios
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
      })) as Track[];

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
    const trackAudioData = (await axios
      .all(dataRequests)
      .then((responses) => {
        let data: object[] = [];

        responses.forEach((resp) => {
          data.push(...resp.data.audio_features);
        });
        return data as Track[];
      })
      .catch((error) => {
        console.log(error);
      })) as Track[];

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

  // Function to gather all API data and set state
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
    console.log(trackData);
  };

  // Function to set filtered playlist data
  const setFilteredPlaylistData = (trackData: Track[]) => {
    let playlistLength = 0;
    let totalSteps = 0;
    for (let i = 0; i < trackData.length; i++) {
      playlistLength = playlistLength + trackData[i].duration_ms;
      totalSteps =
        totalSteps + (trackData[i].duration_ms / 60000) * trackData[i].tempo;
    }

    const playlistCount = trackData.length;

    setPlaylistData({
      ...playlistData,
      steps: Math.floor(totalSteps),
      length: playlistLength,
      count: playlistCount,
    });
  };

  // Function to handle filter button click. Filter songs by selected BPM and energy range
  const handleFilter = () => {
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
    setFilteredPlaylistData(filteredTracks);
  };

  // Function to handle logout
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    localStorage.removeItem("tokenType");
    setIsUserLoggedIn(false);
  };

  return (
    <>
      <div className="home-page">
        <div className="home-page__container">
          <div className="home-page__header">
            <h1 className="home-page__header-heading">TEMPO RUN</h1>
            <div className="home-page__header-button-container">
              <Button
                onClick={handleLogout}
                text={"Logout"}
                variant={"tertiary"}
                disabled={false}
                flashing={false}
              />
            </div>
          </div>
          <div className="home-page__content">
            <div className="home-page__hero-container">
              <div className="home-page__filter-container">
                <div className="home-page__filter-input-container">
                  <div className="home-page__tempo-container">
                    <FilterHeader
                      text={helpInfo.tempo.heading}
                      setShowHelpModal={setShowHelpModal}
                      setHelpModalContent={() => {
                        setHelpModalContent(helpInfo.tempo);
                      }}
                    />
                    <DualSlider
                      dataIsLoaded={userSavedTracks.length != 0}
                      min={minTempo}
                      max={maxTempo}
                      range={tempoRange}
                      minDistance={10}
                      setRange={setTempoRange}
                      showMarks={false}
                      showThumbLabel={true}
                      showOffsetSliderMarks={false}
                    />
                  </div>
                  <div className="home-page__energy-container">
                    <FilterHeader
                      text={helpInfo.energy.heading}
                      setShowHelpModal={setShowHelpModal}
                      setHelpModalContent={() => {
                        setHelpModalContent(helpInfo.energy);
                      }}
                    />
                    <DualSlider
                      dataIsLoaded={userSavedTracks.length != 0}
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
                <Button
                  flashing={!listIsFiltered}
                  disabled={userSavedTracks.length === 0}
                  text={"FILTER"}
                  onClick={handleFilter}
                  variant={"secondary"}
                />
              </div>
              <div className="home-page__playlist-data-button-container">
                <div className="home-page__playlist-data-content">
                  <div className="home-page__playlist-data-container">
                    <div
                      className={
                        !playlistData.length
                          ? "home-page__playlist-data-box--unloaded"
                          : "home-page__playlist-data-box"
                      }
                    >
                      <h4 className="home-page__playlist-data-title">
                        Total Length
                      </h4>
                      <h4 className="home-page__playlist-data">
                        {!playlistData.length
                          ? "0min"
                          : msToHourMin(playlistData.length)}
                      </h4>
                    </div>
                    <div
                      className={
                        !playlistData.count || playlistData.count == 0
                          ? "home-page__playlist-data-box--unloaded"
                          : "home-page__playlist-data-box"
                      }
                    >
                      <h4 className="home-page__playlist-data-title">
                        No. of Tracks
                      </h4>
                      <h4 className="home-page__playlist-data">
                        {!playlistData.count || playlistData.count == 0
                          ? "0"
                          : playlistData.count >= 10000
                          ? Math.floor(
                              playlistData.count / 1000
                            ).toLocaleString("en-US") + "K"
                          : playlistData.count.toLocaleString("en-US")}
                      </h4>
                    </div>
                    <div
                      className={
                        !playlistData.steps || playlistData.steps == 0
                          ? "home-page__playlist-data-box--unloaded"
                          : "home-page__playlist-data-box"
                      }
                    >
                      <h4 className="home-page__playlist-data-title">
                        Total Steps
                      </h4>
                      <h4 className="home-page__playlist-data">
                        {!playlistData.steps || playlistData.steps == 0
                          ? "0"
                          : playlistData.steps >= 10000
                          ? Math.floor(
                              playlistData.steps / 1000
                            ).toLocaleString("en-US") + "K"
                          : playlistData.steps.toLocaleString("en-US")}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="home-page__button-container">
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
        </div>
      </div>
      {showModal && (
        <CreatePlaylistModal
          accessToken={accessToken}
          tracksToDisplay={tracksToDisplay}
          toast={toast}
          setToast={setToast}
          tempoRange={tempoRange}
          playlistData={playlistData}
          setShowModal={setShowModal}
        />
      )}
      {showHelpModal && (
        <HelpModal
          setShowHelpModal={setShowHelpModal}
          helpModalContent={helpModalContent}
        />
      )}
      <Toast toast={toast} />
    </>
  );
}
