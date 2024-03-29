import "./Loading.scss";

type Props = {
  rowCount: number;
};

export default function Loading({ rowCount }: Props) {
  return (
    <>
      {[...Array(rowCount)].map((_e, i) => {
        return (
          <div className="loading" key={i}>
            <div className="loading__container-info">
              <div className="loading__container-title-artist">
                <div className="loading__data-title"></div>
                <div className="loading__data-artist"></div>
              </div>
              <div className="loading__container-album">
                <div className="loading__data-album"></div>
              </div>
            </div>
            <div className="loading__container-data">
              <div className="loading__data-length"></div>
              <div className="loading__data-tempo"></div>
              <div className="loading__data-energy"></div>
            </div>
          </div>
        );
      })}
      <div className="loading__bottom-padding"></div>
    </>
  );
}
