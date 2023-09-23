import { useState } from "react";
import axios from "axios";

import "./CreatePlaylistModal.scss";
import Button from "../Button/Button";
import closeIcon from "../../assets/close.svg";

const USER_ID_ENDPOINT = "https://api.spotify.com/v1/me";

export default function CreatePlaylistModal({
  accessToken,
  closeModal,
  tracksToDisplay,
  playlistInfo,
  setPlaylistInfo,
  toast,
  setToast,
}) {
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
  const handlePlaylistInfoChange = (event) => {
    let value = event.target.value;
    if (event.target.name === "public") {
      if (event.target.value === "private") {
        value = false;
      } else {
        value = true;
      }
    }
    setPlaylistInfo({
      ...playlistInfo,
      [event.target.name]: value,
    });
  };

  // Function to POST new filtered playlist
  const handlePostPlaylist = async (event) => {
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

  return (
    <div className="create-playlist-modal">
      <form className="create-playlist-modal__form">
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
        <Button variant="primary" text="CREATE" onClick={handlePostPlaylist} />
      </form>
    </div>
  );
}
