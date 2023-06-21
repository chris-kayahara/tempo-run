import "./CreatePlaylistModal.scss";
import Button from "../Button/Button";
import closeIcon from "../../assets/close.svg";

export default function CreatePlaylistModal({
  playlistInfo,
  handlePlaylistInfoChange,
  closeModal,
}) {
  return (
    <div className="create-playlist-modal">
      <form className="create-playlist-modal__form">
        <h2 className="create-playlist-modal__heading">Create Playlist</h2>
        <img
          className="create-playlist-modal__close"
          src={closeIcon}
          onClick={closeModal}
        ></img>
        <h3 className="create-playlist-modal__label">Name</h3>
        <input
          className="create-playlist-modal__input-name"
          type="text"
          id="name"
          name="name"
          placeholder="Enter Playlist Name"
          value={playlistInfo.name}
          onChange={handlePlaylistInfoChange}
        ></input>
        <h3 className="create-playlist-modal__label">Description</h3>
        <textarea
          className="create-playlist-modal__input-description"
          id="description"
          name="description"
          placeholder="Enter Playlist Description"
          value={playlistInfo.description}
          onChange={handlePlaylistInfoChange}
        ></textarea>
        <h3 className="create-playlist-modal__label">Visibility</h3>
        <div className="create-playlist-modal__public-container">
          <div className="create-playlist-modal__radio-container">
            <input
              className="create-playlist-modal__radio"
              type="radio"
              name="public"
              id="private"
              value="private"
            />
            <label
              className="create-playlist-modal__label-radio"
              htmlFor="private"
            >
              Private
            </label>
          </div>

          <div className="create-playlist-modal__radio-container">
            <input
              className="create-playlist-modal__radio"
              type="radio"
              name="public"
              id="public"
              value="public"
            />
            <label
              className="create-playlist-modal__label-radio"
              htmlFor="public"
            >
              Public
            </label>
          </div>
        </div>
        <Button variant="primary" text="CREATE" />
      </form>
    </div>
  );
}
