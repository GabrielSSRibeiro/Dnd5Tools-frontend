import React from "react";

import Button from "../../../../../../components/Button";

import "./styles.css";

function Summary({ creature, setCreature }) {
  return (
    <div className="Summary-container">
      <div className="save-creature">
        <Button text="Salvar" onClick={() => {}} />
      </div>
    </div>
  );
}

export default Summary;
