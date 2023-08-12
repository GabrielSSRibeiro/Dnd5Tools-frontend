import React, { useState } from "react";

import Modal from "../../../../../../../../components/Modal";
import CheckInput from "../../../../../../../../components/CheckInput";
import Button from "../../../../../../../../components/Button";

import "./styles.css";

function ModalDeleteLocation({ title = "", confirmText, onConfirm, cancelText, onCancel }) {
  const [deleteInteriorLocs, setDeleteInteriorLocs] = useState(true);

  function HandleCancel() {
    onCancel();
  }

  function HandleConfirm() {
    onConfirm(deleteInteriorLocs);
  }

  return (
    <Modal title={title} className="ModalDeleteLocation-container" onClickToClose={!confirmText ? onCancel : !cancelText ? onConfirm : () => {}}>
      <span>Tem certeza que deseja deletar essa localização?</span>
      <span className="warning-message">Isso fará o mapa ser reajustado, removendo qualquer marcação e posição de grupo</span>
      <CheckInput
        label="Também deletar localizações internas"
        onClick={() => setDeleteInteriorLocs(!deleteInteriorLocs)}
        isSelected={deleteInteriorLocs}
        isDisabled={true}
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
