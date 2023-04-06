import React from "react";

import Modal from "../../../../../../components/Modal";

import "./styles.css";

function ModalLocationDetails({ location, onClose, HandleEditLocation }) {
  return (
    <div className="ModalLocationDetails-container">
      <Modal title="Localização" className="modal-location" onClickToClose={onClose}>
        <button onClick={HandleEditLocation}>
          <i class="fas fa-pen"></i>
        </button>
      </Modal>
    </div>
  );
}

export default ModalLocationDetails;
