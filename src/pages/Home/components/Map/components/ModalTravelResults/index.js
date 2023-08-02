import React from "react";

import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";

import "./styles.css";

function ModalTravelResults({ onClose, HandleSetCurrentNode, HandleAddTravelNode, HandleSaveCombatConfig }) {
  function HandleContinue() {
    HandleSetCurrentNode();
    HandleSaveCombatConfig();
    onClose();
  }

  function HandleSave() {
    HandleAddTravelNode();
    HandleSetCurrentNode();
    HandleSaveCombatConfig();
    onClose();
  }

  return (
    <Modal title={"Resultado"} className="ModalTravelResults-container df ">
      <main className="content df df-ai-fs df-jc-sb df-f1">
        <h2>Resultado</h2>
      </main>
      <div className="divider"></div>
      <footer>
        <aside className="footer-actions">
          {/* {1 == 1 && (
            <button className="button-simple" onClick={() => {}}>
              <i className="fas fa-trash"></i>
            </button>
          )} */}
          <button className="button-simple" onClick={() => onClose()}>
            Cancelar
          </button>
        </aside>
        <aside className="footer-actions">
          <Button text="Continuar sem Marcar" onClick={HandleContinue} />
          <Button text="Marcar no Mapa" onClick={HandleSave} isDisabled={false} />
        </aside>
      </footer>
    </Modal>
  );
}

export default ModalTravelResults;
