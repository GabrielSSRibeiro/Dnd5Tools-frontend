import React from "react";

import Modal from "../../../../../../components/Modal";

import "./styles.css";

function ModalLocationDetails({ location, onClose, HandleEditLocation }) {
  return (
    <Modal title="Localização" className="ModalLocationDetails-container" onClickToClose={onClose}>
      <button onClick={HandleEditLocation}>
        <i class="fas fa-pen"></i>
      </button>
    </Modal>
  );
}

export default ModalLocationDetails;
