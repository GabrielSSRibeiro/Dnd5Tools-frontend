import React, { useState } from "react";
// import * as ch from "../../../../../../helpers/creatureHelper";

import Button from "../../../../../../components/Button";
import Info from "../../../../../../components/Info";
import ModalExport from "./components/ModalExport";
import ModalWarning from "../../../../../../components/ModalWarning";

import "./styles.css";

function Summary({ creature, onSave, onDelete, isBasicPack }) {
  const [isBusy, setIsBusy] = useState(false);
  const [modal, setModal] = useState(null);

  async function OpenModalExport() {
    setModal(<ModalExport creature={creature} onClose={setModal} />);
  }

  async function OpenDeleteConfirmation() {
    if (!isBasicPack) {
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
  }
  function HandleDeleteCreature() {
    onDelete();
    setModal();
  }

  async function HandleSaveCreature() {
    if (!isBasicPack) {
      setIsBusy(true);
      await onSave();
      setIsBusy(false);
    }
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
            <button className="button-simple" onClick={OpenDeleteConfirmation} disabled={isBasicPack}>
              Deletar
            </button>
          )}
          <Button text={isBusy ? "Salvando" : "Salvar"} onClick={HandleSaveCreature} isDisabled={isBusy || isBasicPack} className="creature-save" />
        </div>
      </div>
      <div className="summary-fields">
        {/* <div className="summary-row single">
          <div className="summary-item">
            <header>
              <h5>Definição</h5>
            </header>
            <main>
              <span className="title">Raridade</span>
              <span>{ch.GetRarityDisplay(creature.rarity)}</span>
            </main>
            <footer></footer>
          </div>
        </div>
        <div className="summary-row double">
          <div className="summary-item">
            <header></header>
            <main></main>
            <footer></footer>
          </div>
          <div className="summary-item">
            <header></header>
            <main></main>
            <footer></footer>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Summary;
