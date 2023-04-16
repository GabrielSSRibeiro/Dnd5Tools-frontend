import React, { useState } from "react";
// import * as lc from "../../../../../../../../constants/locationConstants";
import * as utils from "../../../../../../../../utils";

import Modal from "../../../../../../../../components/Modal";
import Button from "../../../../../../../../components/Button";
// import Select from "../../../../../../../../components/Select";

import "./styles.css";

function ModalManageCreature({ creature, onClose }) {
  const [tempCreature, setTempCreature] = useState(
    creature
      ? utils.clone(creature)
      : {
          creatureId: null,
          routines: [
            {
              schedule: null,
              precipitation: null,
              temperature: null,
              context: null,
              groupSize: null,
              encounterFrequency: null,
            },
          ],
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempCreature);
  }

  return (
    <Modal title="Criatura" className="ModalManageCreature-container" onClickToClose={onClose}>
      <div className="new-creature-wrapper">Selecionar do bestiario</div>
      <footer>
        <button className="button-simple" onClick={HandleCancel}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={HandleConfirm} />
      </footer>
    </Modal>
  );
}

export default ModalManageCreature;
