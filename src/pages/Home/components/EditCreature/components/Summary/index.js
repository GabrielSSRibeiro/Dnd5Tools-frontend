import React, { useState } from "react";

import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function Summary({ onSave, onDelete }) {
  const [modal, setModal] = useState(null);

  async function OpenModalExport() {
    setModal(
      <Modal title="Exportar Criatura" onClickToClose={setModal} className="modal-export">
        <Button text="Foundry VTT" onClick={HandleFoundryExport} />
      </Modal>
    );
  }

  function HandleFoundryExport() {}

  async function OpenDeleteConfirmation() {
    setModal(
      <ModalWarning
        title="Deletar Criatura"
        message="Tem certeza que deseja deletar essa criatura?"
        cancelText="Cancelar"
        onCancel={setModal}
        confirmText="Deletar"
        onConfirm={HandleDeleteCreature}
      />
    );
  }
  function HandleDeleteCreature() {
    onDelete();
    setModal();
  }

  return (
    <div className="Summary-container">
      {modal}
      <div className="summary-header">
        <h2>Detalhes</h2>
        <div className="power-scale-wrapper">
          <i class="fas fa-khanda power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill offensive"></div>
          </aside>
          <i class="fas fa-shield-alt power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill defensive"></div>
          </aside>
        </div>
        <div className="actions">
          <button onClick={OpenModalExport} className="creature-export">
            <i class="fas fa-download"></i>
          </button>
          {onDelete && (
            <button className="button-simple" onClick={OpenDeleteConfirmation}>
              Deletar
            </button>
          )}
          <Button text="Salvar" onClick={onSave} className />
        </div>
      </div>
    </div>
  );
}

export default Summary;
