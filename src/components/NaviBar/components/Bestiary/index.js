import React, { useState, useEffect, useMemo } from "react";
//  import api from "../../services/api";
import * as utils from "../../../../utils";
import { creatureRarities, creatureEnvironments, creatureSizes, creatureTypes } from "../../../../data/creatureConstants";
import { MAX_CREATURES_ALLOWED } from "../../../../data/combatConstants";

import Button from "../../../Button";
import CheckInput from "../../../CheckInput";
import Select from "../../../Select";

import "./styles.css";

function Bestiary({
  selectedCreatures,
  selectedCharacters,
  level,
  setSelectedCreatures,
  isSelecting,
  setIsSelecting,
  isBestiaryOpen,
  setIsBestiaryOpen,
  setIsEditCreatureOpen,
  setCreatureToEdit,
  creatures,
}) {
  const [nameFilter, setNameFilter] = useState(null);
  const [selectedRarity, setSelectedRarity] = useState(null);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [tempSelectedCreatures, setTempSelectedCreatures] = useState(selectedCreatures);

  let filteredCreatures = [];

  //   useEffect(() => {
  //   api.get("items").then((response) => {
  //     setItems(response.data);
  //   });
  // }, []);

  function HandleEditNewCreature() {
    setCreatureToEdit(null);
    setIsEditCreatureOpen(true);
  }

  function HandleEditCreature(creature) {
    setCreatureToEdit(creature);
    setIsEditCreatureOpen(true);
  }

  function HandleSelectCreature(creature) {
    const isAlreadySelected = tempSelectedCreatures.some((selectedCreature) => selectedCreature.name.includes(creature.name));
    let newSelection = tempSelectedCreatures.filter((selectedCreature) => !selectedCreature.name.includes(creature.name));

    if (!isAlreadySelected && tempSelectedCreatures.length + 1 <= MAX_CREATURES_ALLOWED) {
      newSelection.push(creature);
    }
    setTempSelectedCreatures(newSelection);
  }

  function HandleSelectedFromBestiary() {
    utils.SortArrayOfObjByProperty(tempSelectedCreatures, "name");

    HandleClose();
    setSelectedCreatures(tempSelectedCreatures);
  }

  function HandleClose() {
    setTempSelectedCreatures(selectedCreatures);
    setIsSelecting(false);
    setIsBestiaryOpen(false);
  }

  function handleFilter(setValue, value) {
    setValue(value);
  }

  filteredCreatures = useMemo(() => {
    function filterCreatures() {
      let temp = creatures;

      if (nameFilter) {
        temp = creatures.filter((creature) => creature.name.toLowerCase().includes(nameFilter.toLowerCase()));
      }

      if (selectedRarity) {
        temp = temp.filter((creature) => creature.rarity === selectedRarity);
      }

      if (selectedEnv) {
        temp = temp.filter((creature) => creature.environment === selectedEnv);
      }

      if (selectedType) {
        temp = temp.filter((creature) => creature.type === selectedType);
      }

      if (selectedSize) {
        temp = temp.filter((creature) => creature.size === selectedSize);
      }

      return temp;
    }

    return filterCreatures();
  }, [creatures, nameFilter, selectedRarity, selectedEnv, selectedType, selectedSize]);

  useEffect(() => {
    setTempSelectedCreatures(selectedCreatures);
  }, [selectedCreatures]);

  return (
    <div className="Bestiary-container">
      {isSelecting && <div className="screen-block" onClick={HandleClose}></div>}
      <div
        className="sharp-button"
        onClick={() => {
          setIsBestiaryOpen(true);
        }}
      >
        {/* border 2 */}
        <div>
          <aside />
          <main />
        </div>
        {/* border 1 */}
        <div>
          <aside />
          <main />
        </div>
        {/* button body */}
        <div>
          <aside />
          <main>
            <h5>BESTI??RIO</h5>
            <h6>{creatures.length} Criaturas</h6>
          </main>
        </div>
      </div>
      {isBestiaryOpen && (
        <div className="bestiary-tab">
          <header className={isSelecting ? "selecting-header" : ""}>
            <div>
              <div className="sharp-button" onClick={HandleClose}>
                {/* border 2 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* border 1 */}
                <div>
                  <main />
                  <aside />
                </div>
                {/* button body */}
                <div>
                  <main />
                  <aside />
                </div>
              </div>
              {!isSelecting ? (
                <h5>{creatures.length} Criaturas</h5>
              ) : (
                <h5>
                  {tempSelectedCreatures.length} de at?? {MAX_CREATURES_ALLOWED} criaturas selecionadas
                </h5>
              )}
            </div>
            {!isSelecting && <h5>BESTI??RIO</h5>}
          </header>
          <main>
            {!isSelecting && (
              <aside>
                <Button text="Adicionar Criatura" onClick={HandleEditNewCreature} />
              </aside>
            )}{" "}
            <div className="bestiary-filters">
              <h5>Filtrar Por</h5>
              <div className="filter-text">
                <input onChange={(e) => handleFilter(setNameFilter, e.target.value)} placeholder="Nome" value={nameFilter}></input>
                <button onClick={() => setNameFilter("")}>LIMPAR</button>
              </div>
              <main>
                <Select
                  extraWidth={20}
                  value={selectedRarity}
                  onSelect={(value) => handleFilter(setSelectedRarity, value)}
                  nothingSelected="N??vel"
                  options={creatureRarities}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={60}
                  value={selectedEnv}
                  onSelect={(value) => handleFilter(setSelectedEnv, value)}
                  nothingSelected="Ambiente"
                  options={creatureEnvironments}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={60}
                  value={selectedType}
                  onSelect={(value) => handleFilter(setSelectedType, value)}
                  nothingSelected="Tipo"
                  options={creatureTypes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
                <Select
                  extraWidth={20}
                  value={selectedSize}
                  onSelect={(value) => handleFilter(setSelectedSize, value)}
                  nothingSelected="Tamanho"
                  options={creatureSizes}
                  optionDisplay={(o) => o.display}
                  optionValue={(o) => o.value}
                />
              </main>
            </div>
            <div className="bestiary-list">
              {filteredCreatures.map((creature) => (
                <div
                  className={`list-creature ${
                    isSelecting && tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)
                      ? "selected-creature"
                      : ""
                  }`}
                  key={creature.name}
                  onClick={() => (isSelecting ? HandleSelectCreature(creature) : HandleEditCreature(creature))}
                >
                  {!isSelecting ? (
                    <div className="edit-creature">
                      <i class="fas fa-pencil-alt fa-xs"></i>
                    </div>
                  ) : (
                    <div className="select-creature">
                      <CheckInput isSelected={tempSelectedCreatures.some((selectedCreature) => selectedCreature.name === creature.name)} />
                    </div>
                  )}
                  <h6>{creature.name}</h6>
                  <img src={creature.image} alt="creature-avatar" />
                  <div className="creature-details">
                    <h6>{creature.rarity}, &nbsp;</h6>
                    <h6>{creature.environment}, &nbsp;</h6>
                    <h6>{creature.type}, &nbsp;</h6>
                    <h6>{creature.size}</h6>
                  </div>
                </div>
              ))}
            </div>
          </main>
          {isSelecting && (
            <div className={`selecting-footer ${filteredCreatures.length <= 3 ? "filtered" : ""}`}>
              <h5>
                Dificuldade <strong>X</strong> para {selectedCharacters.length} personagens de n??vel {level}
              </h5>
              <Button text="Confirmar" onClick={HandleSelectedFromBestiary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Bestiary;
