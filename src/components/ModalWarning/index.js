import React from "react";

import Modal from "../Modal";
import Button from "../Button";

import "./styles.css";

function ModalWarning({ title = "", message = "", confirmText, onConfirm, cancelText, onCancel }) {
  function HandleCancel() {
    onCancel();
  }

  function HandleConfirm() {
    onConfirm();
  }

  return (
    <Modal title={title} className="ModalWarning-container" onClickToClose={confirmText ? (cancelText ? () => {} : onConfirm) : onCancel}>
      <span className="warning-message">{message}</span>
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

export default ModalWarning;
