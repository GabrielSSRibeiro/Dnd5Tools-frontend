import React from "react";

import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";

import "./styles.css";

function ModalTravelResults({ onClose }) {
  return (
    <Modal title={"Resultado"} className="ModalTravelResults-container df" onClickToClose={onClose}>
      <main className="df">Resultado</main>
      <div className="divider"></div>
      <Button text="Continuar" onClick={() => {}} />
    </Modal>
  );
}

export default ModalTravelResults;
