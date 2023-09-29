import { useState } from "react";
import axios from "axios";

import "./CreatePlaylistModal.scss";
import Button from "../Button/Button";
import closeIcon from "../../assets/close.svg";
import { ToastData, Track, PlaylistData } from "../../common/types";

const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";

type Props = {
  accessToken: string | null;
  tracksToDisplay: Track[];
  toast: { show: boolean; message: string; type: string };
  setToast: React.Dispatch<React.SetStateAction<ToastData>>;
  tempoRange: number[];
  playlistData: PlaylistData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreatePlaylistModal({
  accessToken,
  tracksToDisplay,
  toast,
  setToast,
  tempoRange,
  playlistData,
  setShowModal,
}: Props) {
  const [playlistInfo, setPlaylistInfo] = useState({
    name: "",
    description:
      tempoRange[0] +
      " - " +
      tempoRange[1] +
      "bpm | " +
      playlistData.steps.toLocaleString("en-US") +
      " steps",
    public: true,
  });
  const [error, setError] = useState(false);

  // Function to get userId
  const getUserId = async () => {
    const userId = await axios
      .get(USER_ID_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        return response.data.id;
      })
      .catch((error) => {
        console.log(error.response.data.error);
      });
    return userId;
  };

  // Function to handle Playlist creating info form changes
  const handlePlaylistInfoChange = (event: React.SyntheticEvent) => {
    let value = (event.target as HTMLInputElement).value;
    setPlaylistInfo({
      ...playlistInfo,
      [(event.target as HTMLInputElement).name]: value,
    });
  };

  // Function to POST new filtered playlist
  const handlePostPlaylist = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const userId = await getUserId();
    !playlistInfo.name || !playlistInfo.description
      ? setError(true)
      : axios
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
            const playlistId = response.data.id;
            const trackIds = tracksToDisplay.map((track: Track) => {
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
              .then(() => {
                setToast({
                  show: true,
                  message:
                    "Playlist successfully added to your Spotify Account! Open Spotify to listen.",
                  type: "success",
                });
                setTimeout(() => {
                  setToast({ ...toast, show: false });
                }, 4900);
                closeModal();
              })
              .catch((error) => {
                console.log(error);
                setToast({
                  show: true,
                  message: "Error creating playlist. Try refreshing the page.",
                  type: "error",
                });
                setTimeout(() => {
                  setToast({ ...toast, show: false });
                }, 4900);
                closeModal();
              });
          })
          .catch((error) => {
            console.log(error);
            setToast({
              show: true,
              message: "Error creating playlist. Try refreshing the page.",
              type: "error",
            });
            setTimeout(() => {
              setToast({ ...toast, show: false });
            }, 4900);
            closeModal();
          });
  };

  // Function to handle closing the CreatePlaylistModal
  const closeModal = () => {
    setPlaylistInfo({
      name: "",
      description: "",
      public: true,
    });
    setShowModal(false);
  };

  return (
    <div className="create-playlist-modal">
      <form
        className="create-playlist-modal__form"
        onSubmit={handlePostPlaylist}
      >
        <h2 className="create-playlist-modal__heading">Create Playlist</h2>
        <img
          className="create-playlist-modal__close"
          src={closeIcon}
          onClick={closeModal}
        ></img>
        <h3 className="create-playlist-modal__label">
          Name<span className="create-playlist-modal__required"> *</span>
        </h3>
        <input
          className={
            error && !playlistInfo.name
              ? "create-playlist-modal__input-name--error"
              : "create-playlist-modal__input-name"
          }
          type="text"
          id="name"
          name="name"
          placeholder="Enter Playlist Name"
          value={playlistInfo.name}
          onChange={handlePlaylistInfoChange}
        ></input>
        <h3 className="create-playlist-modal__label">
          Description<span className="create-playlist-modal__required"> *</span>
        </h3>
        <textarea
          className={
            error && !playlistInfo.description
              ? "create-playlist-modal__input-description--error"
              : "create-playlist-modal__input-description"
          }
          id="description"
          name="description"
          placeholder="Enter Playlist Description"
          value={playlistInfo.description}
          onChange={handlePlaylistInfoChange}
        ></textarea>
        <Button type="submit" variant="primary" text="CREATE" />
      </form>
    </div>
  );
}
