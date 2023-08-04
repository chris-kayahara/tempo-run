import "./HelpModal.scss";
import closeIcon from "../../assets/close.svg";
import tempoIcon from "../../assets/tempo.svg";
import energyIcon from "../../assets/energy.svg";

export default function HelpModal({ setShowHelpModal, helpModalContent }) {
  return (
    <div className="help-modal">
      <div className="help-modal__container">
        <h2 className="help-modal__heading">{helpModalContent.heading}</h2>
        <img
          className="create-playlist-modal__close"
          src={closeIcon}
          onClick={() => {
            setShowHelpModal(false);
          }}
        ></img>
        <img
          className="help-modal__icon"
          src={helpModalContent.image == "tempo.svg" ? tempoIcon : energyIcon}
        />
        <div className="help-modal__text-container">
          <p className="help-modal__text">{helpModalContent.text}</p>
          <p className="help-modal__text">{helpModalContent.recommendation}</p>
        </div>
      </div>
    </div>
  );
}
