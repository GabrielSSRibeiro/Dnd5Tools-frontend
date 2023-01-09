import React, { useState } from "react";

import TextInput from "../../../../../components/TextInput";
import Button from "../../../../../components/Button";
import Modal from "../../../../../components/Modal";

import "./styles.css";

function ModalDescription({ description, onClose }) {
  const [tempDescription, setTempDescription] = useState(description);

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempDescription);
  }

  return (
    <Modal className="ModalDescription-container" title="Descrição" onClickToClose={onClose}>
      <TextInput value={tempDescription} onChange={setTempDescription} isMultiLine={true} className="description" />
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} />
      </footer>
    </Modal>
  );
}

export default ModalDescription;
