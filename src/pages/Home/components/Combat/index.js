import React from "react";

import "./styles.css";

function Combat({ combat }) {
  return (
    <div className="Combat-container">
      <h1>Em Desenvolvimento</h1>
      <h2>Combate: {combat.selectedCreatures.length}</h2>
    </div>
  );
}

export default Combat;
