import React, { useState } from "react";

import Button from "../../../../../../components/Button";

import "./styles.css";

function EditLocation({ locationToEdit, HandleSave, HandleDelete, FinishEditing }) {
  const [location, setLocation] = useState(locationToEdit);

  function IsLocationValid() {
    let isLocationValid = true;

    return isLocationValid;
  }

  return (
    <div className="EditLocation-container">
      <footer>
        {HandleDelete && <Button text="Deletar" onClick={() => HandleDelete(location)} />}
        <button className="button-simple" onClick={FinishEditing}>
          Cancelar
        </button>
        <Button text="Salvar" onClick={() => HandleSave(location)} isDisabled={!IsLocationValid()} />
      </footer>
    </div>
  );
}

export default EditLocation;
