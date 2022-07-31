import React from "react";

import "./styles.css";

function Actions({ creature, setCreature }) {
  return (
    <div className="Actions-container">
      <div className="current-actions">
        <div className="actions">
          <h2>Ações</h2>
          {creature.actions.length > 0 ? <div className="actions-wrapper"></div> : <h4>Nenhuma ação</h4>}
        </div>
        <div className="reactions">
          <h2>Reações</h2>
          {creature.reactions.length > 0 ? <div className="reactions-wrapper"></div> : <h4>Nenhuma reação</h4>}
        </div>
      </div>
    </div>
  );
}

export default Actions;
