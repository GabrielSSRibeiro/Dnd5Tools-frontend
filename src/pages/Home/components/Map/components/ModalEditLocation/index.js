import React, { useState } from "react";

import * as utils from "../../../../../../utils";

import Button from "../../../../../../components/Button";
import Modal from "../../../../../../components/Modal";

import "./styles.css";

function ModalEditLocation({ location, onClose }) {
  const [tempLocation, setTempLocation] = useState(
    location
      ? utils.clone(location)
      : {
          name: null,
          description: null,
        }
  );

  function HandleCancel() {
    onClose();
  }

  function HandleConfirm() {
    onClose(tempLocation);
  }

  function CheckFinalButtonValid() {
    // if (!location.name) {
    //   return false;
    // }

    return true;
  }

  return (
    <div className="ModalEditLocation-container">
      <Modal title="Localização" className="modal-location">
        <footer>
          <button className="button-simple" onClick={HandleCancel}>
            Cancelar
          </button>
          <Button text="Salvar" onClick={HandleConfirm} isDisabled={!CheckFinalButtonValid()} />
        </footer>
      </Modal>
    </div>
  );
}

export default ModalEditLocation;
