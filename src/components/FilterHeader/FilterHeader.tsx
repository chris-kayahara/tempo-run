import helpIcon from "../../assets/help.svg";
import "./FilterHeader.scss";

type Props = {
  text: string;
  setShowHelpModal: Function;
  setHelpModalContent: Function;
};

export default function FilterHeader({
  text,
  setShowHelpModal,
  setHelpModalContent,
}: Props) {
  return (
    <div className="filter-header">
      <h3 className="filter-header__text">{text}</h3>
      <img
        className="filter-header__help-icon"
        src={helpIcon}
        onClick={() => {
          setShowHelpModal(true);
          setHelpModalContent();
        }}
      />
    </div>
  );
}
