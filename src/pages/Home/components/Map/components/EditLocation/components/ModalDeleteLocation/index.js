import React, { useState } from "react";

import Modal from "../../../../../../../../components/Modal";
import CheckInput from "../../../../../../../../components/CheckInput";
import Button from "../../../../../../../../components/Button";

import "./styles.css";

function ModalDeleteLocation({ title = "", message = "", confirmText, onConfirm, cancelText, onCancel }) {
  const [deleteInteriorLocs, setDeleteInteriorLocs] = useState(false);

  function HandleCancel() {
    onCancel();
  }

  function HandleConfirm() {
    onConfirm(deleteInteriorLocs);
  }

  return (
    <Modal title={title} className="ModalDeleteLocation-container" onClickToClose={!confirmText ? onCancel : !cancelText ? onConfirm : () => {}}>
      <span className="warning-message">{message}</span>
      <CheckInput
        label="Também deletar localizações internas"
        onClick={() => setDeleteInteriorLocs(!deleteInteriorLocs)}
        isSelected={deleteInteriorLocs}
      />
      <footer className="warning-actions-wrapper">
        {cancelText && (
          <button className="button-simple" onClick={HandleCancel}>
            {cancelText}
          </button>
        )}
        {confirmText && <Button text={confirmText} onClick={HandleConfirm} />}
      </footer>
    </Modal>
  );
}

export default ModalDeleteLocation;
