import React, { useState, useEffect, useMemo } from "react";

import * as utils from "../../../../utils";
import { MAX_CREATURES_ALLOWED, MAX_DIFFICULTY_LEVEL_VARIANCE, combatDifficulties } from "../../../../constants/combatConstants";
import { CREATURE_RARITIES, creatureRarities } from "../../../../constants/creatureConstants";
import { GetCreatureAdjustedDifficultyRatio, GetCombatDifficulty } from "../../../../helpers/combatHelper";

import Panel from "../../../../components/Panel";
import Button from "../../../../components/Button";

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
  const [windowHeight, setWindowHeight] = useState(null);
  const combatDifficultyOptions = useMemo(() => {
    function GetAdjustedCombatDifficulty(factor) {
      let combatDifficultyRatio = 0;

      const creaturesToUpdate = selectedCreatures.map((c) => {
        let adjustedLevel = c.isNPC ? c.level : Math.max(1, c.level + factor);
        const adjustedDifficultyRatio = GetCreatureAdjustedDifficultyRatio(c.difficultyRatio, adjustedLevel, level);
        combatDifficultyRatio += c.isNPC ? adjustedDifficultyRatio * -1 : adjustedDifficultyRatio;

        return { name: c.name, level: adjustedLevel };
      });

      return { value: GetCombatDifficulty(Math.max(0, combatDifficultyRatio), selectedCharacters.length), creaturesToUpdate };
    }

    let options = [];

    if (selectedCharacters.length === 0 || selectedCreatures.length === 0 || selectedCreatures.every((c) => c.isNPC)) {
      return options;
    }

    utils.createArrayFromInt(MAX_DIFFICULTY_LEVEL_VARIANCE).forEach((item) => {
      const factor = item + 1;

      options.push(GetAdjustedCombatDifficulty(factor * -1));
      options.push(GetAdjustedCombatDifficulty(factor));
    });

    return options;
  }, [selectedCreatures, level, selectedCharacters]);

  function GenerateCombat(foundDifficulty) {
    foundDifficulty.creaturesToUpdate.forEach((c) => {
      let creature = selectedCreatures.find((sc) => sc.name === c.name);
      creature.level = c.level;
    });

    // HandleGenerateCombat();
  }

  function AdjustLevel(creature, factor) {
    selectedCreatures = selectedCreatures.filter((sc) => sc.name !== creature.name);
    creature.level += factor;

    selectedCreatures.push(creature);
    setSelectedCreatures(selectedCreatures);
  }

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
  }

  function SelectFromBestiary() {
    HandleSelectFromBestiary();
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
    utils.SortArrayOfObjByStringProperty(creatures, "_id");

    setSelectedCreatures(creatures);
  }

  function HandleDelete(creature) {
    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);

    setSelectedCreatures(creatures);
  }

  function HandleNPC(creature) {
    if (!creature.isNPC) {
      creature.isNPC = true;
    } else {
      creature.isNPC = !creature.isNPC;
    }

    const creatures = selectedCreatures.filter((selectedCreature) => selectedCreature.name !== creature.name);
    creatures.push(creature);
    utils.SortArrayOfObjByStringProperty(creatures, "name");

    setSelectedCreatures(creatures);
  }

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
                      className={`details-button${selectedCreatures.length === MAX_CREATURES_ALLOWED ? " element-disabled" : ""}`}
                    >
                      +1
                    </button>
                    <button className={`details-button ${creature.isNPC ? "toggle-npc" : "toggle-creature"}`} onClick={() => HandleNPC(creature)}>
                      {creature.isNPC ? <i className="fas fa-heart"></i> : <i className="fas fa-skull"></i>}
                    </button>
                    <div className={`creature-name${creature.rarity === CREATURE_RARITIES.LEGENDARY ? " shorter-name" : ""}`}>
                      <h4>{creature.name}</h4>
                    </div>
                    {creature.rarity === CREATURE_RARITIES.LEGENDARY && (
                      <div className="creature-stats">
                        <h6>Nível</h6>
                        <h4>{creature.level}</h4>
                        <div className="level-adjuster-wrapper">
                          <button
                            onClick={() => AdjustLevel(creature, 1)}
                            className="level-adjuster"
                            disabled={creature.level === creatureRarities.find((r) => r.value === CREATURE_RARITIES.LEGENDARY).baseOutputMax}
                          >
                            <i className="fas fa-caret-up"></i>
                          </button>
                          <button
                            onClick={() => AdjustLevel(creature, -1)}
                            className="level-adjuster"
                            disabled={creature.level === creatureRarities.find((r) => r.value === CREATURE_RARITIES.LEGENDARY).baseOutputMin}
                          >
                            <i className="fas fa-caret-down"></i>
                          </button>
                        </div>
                      </div>
                    )}
                    <button className="details-button" onClick={() => HandleDelete(creature)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
              <footer style={{ marginTop: selectedCreatures.length > 0 ? 25 : 0 }}>
                <Button text="Selecionar" onClick={SelectFromBestiary} isDisabled={false && selectedCharacters.length === 0} />
              </footer>
            </div>
          </Panel>
        </section>
      </div>
      {selectedCharacters.length > 0 && selectedCreatures.length > 0 && (
        <footer>
          {combatDifficulties.map((d) => {
            const foundDifficulty = combatDifficultyOptions.find((o) => o.value === d.value);
            return (
              <Button key={d.value} text={`Combate ${d.display}`} onClick={() => GenerateCombat(foundDifficulty)} isDisabled={!foundDifficulty} />
            );
          })}
        </footer>
      )}
    </div>
  );
}

export default CombatSetup;
