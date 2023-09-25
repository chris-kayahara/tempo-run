import { useEffect, useState } from "react";
import { msToTime } from "../../utils/utils";
import ReactPaginate from "react-paginate";
import "./Tracklist.scss";
import durationIcon from "../../assets/duration.svg";
import energyIcon from "../../assets/energy.svg";
import energyFilledIcon from "../../assets/energy-filled.svg";
import tempoIcon from "../../assets/tempo.svg";
import Loading from "../Loading/Loading";

export default function Tracklist({
  listIsFiltered,
  tracksToDisplay,
  userSavedTracks,
}) {
  const [tracksPerPage, setTracksPerPage] = useState(10);
  const [trackOffset, setTrackOffset] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  const endOffset = trackOffset + tracksPerPage;
  const currentPage = tracksToDisplay.slice(trackOffset, endOffset);
  const pageCount = Math.ceil(tracksToDisplay.length / tracksPerPage);

  const handlePageClick = ({ selected }: { selected: number }) => {
    const newOffset = (selected * tracksPerPage) % tracksToDisplay.length;
    setCurrentPageNumber(selected);
    setTrackOffset(newOffset);
  };

  useEffect(() => {
    setTrackOffset(0);
    setCurrentPageNumber(0);
  }, [tracksToDisplay]);

  return (
    <div className="tracklist">
      {!listIsFiltered && userSavedTracks.length !== 0 && (
        <div className="tracklist__mask"></div>
      )}
      <div className="tracklist__heading-container">
        <h4 className="tracklist__heading-title">Title</h4>
        <h4 className="tracklist__heading-album">Album</h4>
        <div className="tracklist__heading-icon-container">
          <img
            className="tracklist__heading-length-icon"
            src={durationIcon}
            alt="length"
          />
          <img
            className="tracklist__heading-bpm-icon"
            src={tempoIcon}
            alt="tempo"
          />
          <img
            className="tracklist__heading-energy-icon"
            src={energyIcon}
            alt="duration"
          />
        </div>
      </div>
      <div className="tracklist__list">
        {userSavedTracks.length === 0 ? (
          <Loading rowCount={5} />
        ) : (
          currentPage.map((track) => {
            let artists = track.track.artists.map((artist) => artist.name);
            return (
              <div className="tracklist__row" key={track.track.id}>
                <div className="tracklist__info-container">
                  <div className="tracklist__title-artist-container">
                    <div className="tracklist__data-title">
                      {track.track.name}
                    </div>
                    <div className="tracklist__data-artist">
                      {artists.join(", ")}
                    </div>
                  </div>
                  <div className="tracklist__data-album">
                    {track.track.album.name}
                  </div>
                </div>
                <div className="tracklist__data-container">
                  <div className="tracklist__data-length">
                    {msToTime(track.track.duration_ms)}
                  </div>
                  <div className="tracklist__data-bpm">
                    {!track.tempo ? "N/A" : Math.round(track.tempo) + " bpm"}
                  </div>
                  <div className="tracklist__data-energy">
                    {!track.energy
                      ? "N/A"
                      : [...Array(Math.ceil(track.energy * 5))].map((e, i) => {
                          return (
                            <img
                              className="tracklist__data-energy-icon"
                              src={energyFilledIcon}
                              key={i}
                            ></img>
                          );
                        })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        {!tracksToDisplay.length && listIsFiltered && (
          <div className="tracklist__filter-error">
            No tracks in your library that match the selected filter values.{" "}
            <br></br>Please adjust the sliders above to include a wider or
            different range for each setting.
          </div>
        )}
        {userSavedTracks.length !== 0 && (
          <div className="tracklist__pagination-count">
            <b>{Math.floor(trackOffset / tracksPerPage + 1)}</b> of {pageCount}
          </div>
        )}
      </div>
      <ReactPaginate
        breakLabel=""
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={0}
        marginPagesDisplayed={0}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        forcePage={currentPageNumber}
        containerClassName="tracklist__pagination"
        pageClassName="tracklist__pagination-item"
        pageLinkClassName="tracklist__pagination-link"
        activeLinkClassName="tracklist__pagination-link--active"
        previousClassName="tracklist__pagination-prev-next"
        nextClassName="tracklist__pagination-prev-next"
        previousLinkClassName="tracklist__pagination-prev-next-link"
        nextLinkClassName="tracklist__pagination-prev-next-link"
        disabledClassName="tracklist__pagination-prev-next--disabled"
        disabledLinkClassName="tracklist__pagination-prev-next-link--disabled"
        breakLinkClassName="tracklist__pagination-break-link"
      />
    </div>
  );
}
