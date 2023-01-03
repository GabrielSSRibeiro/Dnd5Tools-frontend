import React, { useState } from "react";

import Button from "../../../../../../components/Button";
import Info from "../../../../../../components/Info";
import ModalExport from "./components/ModalExport";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function Summary({ creature, onSave, onDelete }) {
  const [isBusy, setIsBusy] = useState(false);
  const [modal, setModal] = useState(null);

  async function OpenModalExport() {
    setModal(<ModalExport creature={creature} onClose={setModal} />);
  }

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

  async function HandleSaveCreature() {
    setIsBusy(true);
    await onSave();
    setIsBusy(false);
  }

  return (
    <div className="Summary-container">
      {modal}
      <div className="summary-header">
        <div className="details">
          <h2>Detalhes</h2>
          <Info
            contents={[
              {
                text: "Escalas de Poder ofensiva(vermelha) e defensiva(verde) representam o quao intensa a criatura é, em realação ao máximo e mínimo possível",
              },
            ]}
          />
        </div>
        <div className="power-scale-wrapper">
          <i className="fas fa-khanda power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill offensive"></div>
          </aside>
          <i className="fas fa-shield-alt power-scale-icon"></i>
          <aside className="power-scale-bar">
            <div className="power-scale-fill defensive"></div>
          </aside>
        </div>
        <div className="actions">
          <button onClick={OpenModalExport} className="creature-export">
            <i className="fas fa-download"></i>
          </button>
          {onDelete && (
            <button className="button-simple" onClick={OpenDeleteConfirmation}>
              Deletar
            </button>
          )}
          <Button text={isBusy ? "Salvando" : "Salvar"} onClick={HandleSaveCreature} isDisabled={isBusy} />
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Summary;
