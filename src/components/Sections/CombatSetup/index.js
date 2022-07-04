import React, { useState, useEffect } from "react";
//  import api from "../../services/api";

import * as utils from "../../../utils";
import { COMBAT_DIFFICULTIES, MAX_CREATURES_ALLOWED } from "../../../helpers/combatHelper";

import Panel from "../../Panel";
import Button from "../../Button";
import Select from "../../Select";

import "./styles.css";

function CombatSetup({
  selectedCharacters,
  selectedCreatures,
  setSelectedCreatures,
  HandleSelectFromParty,
  HandleSelectFromBestiary,
  HandleGenerateCombat,
  resultText,
  level,
}) {
  const [combatDificulty, setCombatDificulty] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);

  function getPanelsScroll(count) {
    const scrollAfter = 7;
    let panelScroll = {};

    if (count > scrollAfter) {
      panelScroll = { overflowY: "auto" };

      const defaultCompHeight = 342;
      const defaultWindowHeight = 700;
      const currentHeight = windowHeight ?? window.innerHeight;
      const extraHeightPerElement = 39;
      const extraElements = count - scrollAfter;

      const extraHeight = Math.max(Math.ceil((currentHeight - defaultWindowHeight - extraHeightPerElement) / extraElements), 0);

      panelScroll.maxHeight = defaultCompHeight + extraHeight * extraHeightPerElement;
    }

    return panelScroll;
  }

  function SelectFromParty() {
    HandleSelectFromParty();
    setCombatDificulty(null);
  }

  function SelectFromBestiary() {
    HandleSelectFromBestiary();
    setCombatDificulty(null);
  }

  function HandleAddExtraOne(index) {
    let creature = { ...selectedCreatures[index] };

    //get creature base name
    let creatureNameArray = creature.name.split(" ");
    if (parseInt(creatureNameArray[creatureNameArray.length - 1])) {
      creatureNameArray.pop();
    }
    const baseName = creatureNameArray.join(" ");

    //get latest creature number
    let latestCreatureNameArray = selectedCreatures
      .filter((sc) => sc.name.includes(baseName))
      .pop()
      .name.split(" ");
    const creatureNumber = parseInt(latestCreatureNameArray[latestCreatureNameArray.length - 1]);

    if (creatureNumber) {
      latestCreatureNameArray.pop();
      latestCreatureNameArray.push(creatureNumber + 1);
    } else {
      latestCreatureNameArray.push("2");
    }
    creature.name = latestCreatureNameArray.join(" ");

    let creatures = [...selectedCreatures, creature];
    utils.SortArrayOfObjByProperty(creatures, "name");

    setSelectedCreatures(creatures);
    setCombatDificulty(null);
  }

  function HandleDelete(creature) {
    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);

    setSelectedCreatures(creatures);
    setCombatDificulty(null);
  }

  function HandleNPC(creature) {
    if (!creature.isNPC) {
      creature.isNPC = true;
    } else {
      creature.isNPC = !creature.isNPC;
    }

    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);
    creatures.push(creature);
    utils.SortArrayOfObjByProperty(creatures, "name");

    setSelectedCreatures(creatures);
    setCombatDificulty(null);
  }

  function GetCombatDifficultyNames() {
    return COMBAT_DIFFICULTIES.map((cd) => `Dificuldade ${cd}`);
  }

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  useEffect(() => {
    function handleResize() {
      setWindowHeight(window.innerHeight);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="CombatSetup-container">
      <div>
        <section className="characters-container">
          <Panel title="Personagens">
            <div className="panel-content" style={getPanelsScroll(selectedCharacters.length)}>
              {selectedCharacters &&
                selectedCharacters.map((character) => (
                  <div key={character} className="character-details">
                    <div className="character-name">
                      <h4>{character}</h4>
                    </div>
                  </div>
                ))}
              <footer style={{ marginTop: selectedCharacters.length > 0 ? 25 : 0 }}>
                <Button text="Selecionar" onClick={SelectFromParty} />
              </footer>
            </div>
          </Panel>
        </section>
        <section className="creatures-container">
          <Panel title="Criaturas">
            <div className="panel-content" style={getPanelsScroll(selectedCreatures.length)}>
              {selectedCreatures &&
                selectedCreatures.map((creature, index) => (
                  <div key={index} className="creature-details">
                    <button
                      onClick={() => HandleAddExtraOne(index)}
                      className={selectedCreatures.length === MAX_CREATURES_ALLOWED ? "element-disabled" : ""}
                    >
                      +1
                    </button>
                    <button className={creature.isNPC ? "toggle-npc" : "toggle-creature"} onClick={() => HandleNPC(creature)}>
                      {creature.isNPC ? <i class="fas fa-heart"></i> : <i class="fas fa-skull"></i>}
                    </button>
                    <div className="creature-name">
                      <h4>{creature.name}</h4>
                    </div>
                    <div className="creature-stats">
                      <h4>86 PV</h4>
                    </div>
                    <button onClick={() => HandleDelete(creature)}>
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              <footer style={{ marginTop: selectedCreatures.length > 0 ? 25 : 0 }}>
                <Button text="Selecionar" onClick={SelectFromBestiary} isDisabled={selectedCharacters.length === 0} />
              </footer>
            </div>
          </Panel>
        </section>
      </div>
      <footer>
        <Select
          isLarge={true}
          extraWidth={315}
          value={combatDificulty ?? "DIficuldade do Combate"}
          onSelect={setCombatDificulty}
          dropUp={true}
          options={GetCombatDifficultyNames()}
          isDisabled={selectedCharacters.length === 0 || selectedCreatures.length === 0 || selectedCreatures.every((sl) => sl.isNPC)}
        />

        <Button
          text={`Rodar ${resultText}`}
          onClick={HandleGenerateCombat}
          isDisabled={selectedCharacters.length === 0 || selectedCreatures.length === 0 || !combatDificulty}
        />
      </footer>
    </div>
  );
}

export default CombatSetup;
