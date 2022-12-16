import React, { useState } from "react";

import { treasureTypes } from "../../../../../../constants/treasureConstants";

import Button from "../../../../../../components/Button";
import Info from "../../../../../../components/Info";
import ModalManageTreasure from "./components/ModalManageTreasure";

import "./styles.css";
import { CREATURE_ACTION_FREQUENCIES } from "../../../../../../constants/creatureConstants";

function TreasureReward({ creature, setCreature }) {
  const [modal, setModal] = useState(null);

  const maxNumberOfTreasures = 3;

  function OpenModalManageTreasure(treasure) {
    let invalidNames = creature.treasures.filter((t) => t.name !== treasure?.name).map((t) => t.name);

    setModal(
      <ModalManageTreasure
        treasure={treasure}
        creatureRarity={creature.rarity}
        creatureActions={creature.actions.filter((a) => a.frequency !== CREATURE_ACTION_FREQUENCIES.COMMON)}
        invalidNames={invalidNames}
        onClose={(tempTreasure) => HandleCloseModalManageTreasure(treasure, tempTreasure)}
      />
    );
  }
  function HandleCloseModalManageTreasure(treasure, tempTreasure) {
    if (tempTreasure) {
      if (treasure) {
        let treasureIndex = creature.treasures.findIndex((a) => a.name === treasure.name);
        creature.treasures.splice(treasureIndex, 1, tempTreasure);
      } else {
        creature.treasures.push(tempTreasure);
      }
    }

    setModal(null);
  }
  function DeleteTreasure(treasure) {
    creature.treasures = creature.treasures.filter((a) => a.name !== treasure.name);
    setCreature({ ...creature });
  }

  return (
    <div className="TreasureReward-container">
      {modal}
      <div className="treasures-row">
        <div className="treasures">
          <div className="section-label">
            <h2>Tesouros</h2>
            <Info contents={[{ text: "Opcional" }]} />
          </div>
          <Button text="Adicionar" onClick={() => OpenModalManageTreasure()} isDisabled={creature.treasures.length >= maxNumberOfTreasures} />
          <div className="treasure-wrapper">
            {creature.treasures.map((treasure) => (
              <div className="creature-treasure" key={treasure.name}>
                <span>{treasure.name}</span>
                <div>
                  <span>{treasureTypes.find((tr) => tr.value === treasure.type).display}</span>
                  <button onClick={() => OpenModalManageTreasure(treasure)} className="edit-row">
                    <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button onClick={() => DeleteTreasure(treasure)} className="delete-row">
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TreasureReward;
