import React, { useState } from "react";

import TextInput from "../TextInput";
import Button from "../Button";
import Modal from "../Modal";

import "./styles.css";

function ModalTextArea({ title, text, info = null, placeholder = null, onClose }) {
  const [tempText, SetTempText] = useState(text);

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempText);
  }

  return (
    <Modal className="ModalTextArea-container" title={title} info={info}>
      <TextInput value={tempText} onChange={SetTempText} isMultiLine={true} placeholder={placeholder} className="description" />
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} />
      </footer>
    </Modal>
  );
}

export default ModalTextArea;
