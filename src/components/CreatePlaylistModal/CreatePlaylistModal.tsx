export default function CreatePlaylistModal() {
  return (
    <form>
      <label htmlFor="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
          value={playlistInfo.name}
          onChange={handlePlaylistInfoChange}
        ></input>
      </label>
      <label htmlFor="description">
        Description
        <textarea
          id="description"
          name="description"
          value={playlistInfo.description}
          onChange={handlePlaylistInfoChange}
        ></textarea>
      </label>
      <label htmlFor="public">
        Public or private
        <input
          type="checkbox"
          id="public"
          name="public"
          value={playlistInfo.public}
          onChange={handlePlaylistInfoChange}
        ></input>
      </label>
      <button type="submit" onClick={handlePostPlaylist}>
        POST PLAYLIST TO SPOTIFY ACCOUNT
      </button>
    </form>
  );
}
